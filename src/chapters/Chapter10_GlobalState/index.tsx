import { createContext, useContext, useState, type ReactNode } from "react";
import ChapterHeader from "../../components/ChapterHeader";

/**
 * Chapter 10: 전역 상태 관리 (Context API)
 *
 * [백엔드 비유]
 * Context = 의존성 주입(DI) 컨테이너
 *
 * C#에서 services.AddSingleton<IService>()로 등록하고
 * 생성자에서 주입받는 것처럼, React에서는:
 *   1. createContext()로 "컨테이너" 생성
 *   2. Provider로 값을 "등록"
 *   3. useContext()로 어디서든 "주입받기"
 *
 * Props drilling(부모→자식→손자→... 계속 전달)을 피하고,
 * 여러 컴포넌트가 같은 데이터를 공유할 수 있습니다.
 */

// =============================================
// ✅ 1. Context 정의
// =============================================

// 진행 단계 타입 정의
type Step = "접수" | "분석" | "처리" | "완료";

const STEPS: Step[] = ["접수", "분석", "처리", "완료"];

// Context에 들어갈 값의 타입 (C#의 interface와 같음)
interface StepContextType {
  currentStep: Step;
  setCurrentStep: (step: Step) => void;
  goNext: () => void;
  goPrev: () => void;
  progress: number; // 0~100 퍼센트
}

// createContext: 전역 상태 "컨테이너" 생성
// C#의 services.AddSingleton() 선언부와 비슷
const StepContext = createContext<StepContextType | null>(null);

// 커스텀 훅: Context를 편하게 쓰기 위한 도우미
function useStepContext() {
  const context = useContext(StepContext);
  if (!context) {
    throw new Error("useStepContext는 StepProvider 안에서만 사용 가능합니다");
  }
  return context;
}

// =============================================
// ✅ 2. Provider 컴포넌트
// =============================================

// Provider: 자식 컴포넌트들에게 값을 "제공"하는 컴포넌트
// C#의 DI 컨테이너에 서비스를 등록하는 것과 같음
function StepProvider({ children }: { children: ReactNode }) {
  const [currentStep, setCurrentStep] = useState<Step>("접수");

  const currentIndex = STEPS.indexOf(currentStep);
  const progress = Math.round((currentIndex / (STEPS.length - 1)) * 100);

  const goNext = () => {
    if (currentIndex < STEPS.length - 1) {
      setCurrentStep(STEPS[currentIndex + 1]);
    }
  };

  const goPrev = () => {
    if (currentIndex > 0) {
      setCurrentStep(STEPS[currentIndex - 1]);
    }
  };

  return (
    // value에 넣은 값이 모든 자식에서 useContext()로 접근 가능
    <StepContext.Provider value={{ currentStep, setCurrentStep, goNext, goPrev, progress }}>
      {children}
    </StepContext.Provider>
  );
}

// =============================================
// ✅ 3. Context를 사용하는 3개의 독립 컴포넌트
// =============================================

// 컴포넌트 A: 사이드바 - 단계 목록 표시
function StepSidebar() {
  // useStepContext()로 전역 상태에 접근 - props 전달 없이!
  const { currentStep, setCurrentStep } = useStepContext();

  return (
    <div
      style={{
        width: 160,
        background: "#1e293b",
        color: "#e2e8f0",
        borderRadius: 8,
        padding: 12,
      }}
    >
      <h3 style={{ fontSize: 14, marginBottom: 12, color: "#94a3b8" }}>
        진행 단계
      </h3>
      {STEPS.map((step) => (
        <div
          key={step}
          onClick={() => setCurrentStep(step)}
          style={{
            padding: "8px 12px",
            marginBottom: 4,
            borderRadius: 6,
            cursor: "pointer",
            background: step === currentStep ? "#3b82f6" : "transparent",
            color: step === currentStep ? "#fff" : "#94a3b8",
            fontSize: 14,
            transition: "all 0.2s",
          }}
        >
          {step === currentStep ? "▶ " : "  "}
          {step}
        </div>
      ))}
    </div>
  );
}

// 컴포넌트 B: 메인 영역 - 현재 단계 상세 + 네비게이션
function StepMainArea() {
  const { currentStep, goNext, goPrev, progress } = useStepContext();

  // 단계별 설명 데이터
  const stepDetails: Record<Step, { desc: string; emoji: string }> = {
    접수: { desc: "요청이 접수되었습니다. 담당자를 배정 중입니다.", emoji: "📥" },
    분석: { desc: "요청 내용을 분석하고 있습니다. 잠시만 기다려주세요.", emoji: "🔍" },
    처리: { desc: "요청을 처리 중입니다. 거의 완료되었습니다.", emoji: "⚙️" },
    완료: { desc: "모든 처리가 완료되었습니다!", emoji: "✅" },
  };

  const detail = stepDetails[currentStep];

  return (
    <div style={{ flex: 1, padding: "0 20px" }}>
      {/* 프로그레스 바 */}
      <div
        style={{
          background: "#e2e8f0",
          borderRadius: 8,
          height: 8,
          marginBottom: 20,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            background: "#3b82f6",
            height: "100%",
            width: `${progress}%`,
            transition: "width 0.3s ease",
            borderRadius: 8,
          }}
        />
      </div>

      {/* 현재 단계 표시 */}
      <div
        style={{
          background: "#eff6ff",
          padding: 20,
          borderRadius: 12,
          textAlign: "center",
          marginBottom: 16,
        }}
      >
        <div style={{ fontSize: 48, marginBottom: 8 }}>{detail.emoji}</div>
        <h3 style={{ fontSize: 20, marginBottom: 8 }}>현재 단계: {currentStep}</h3>
        <p style={{ color: "#475569" }}>{detail.desc}</p>
      </div>

      {/* 이전/다음 버튼 */}
      <div className="flex-gap" style={{ justifyContent: "center" }}>
        <button className="secondary" onClick={goPrev}>
          ← 이전 단계
        </button>
        <button onClick={goNext}>다음 단계 →</button>
      </div>
    </div>
  );
}

// 컴포넌트 C: 상태 패널 - 요약 정보
function StepStatusPanel() {
  const { currentStep, progress } = useStepContext();
  const currentIndex = STEPS.indexOf(currentStep);

  return (
    <div
      style={{
        width: 180,
        background: "#f8fafc",
        border: "1px solid #e2e8f0",
        borderRadius: 8,
        padding: 16,
      }}
    >
      <h3 style={{ fontSize: 14, marginBottom: 12, color: "#475569" }}>
        상태 요약
      </h3>
      <div style={{ fontSize: 13, display: "flex", flexDirection: "column", gap: 8 }}>
        <div>
          <span style={{ color: "#64748b" }}>현재 단계</span>
          <div style={{ fontWeight: 600 }}>{currentStep}</div>
        </div>
        <div>
          <span style={{ color: "#64748b" }}>진행률</span>
          <div style={{ fontWeight: 600 }}>{progress}%</div>
        </div>
        <div>
          <span style={{ color: "#64748b" }}>남은 단계</span>
          <div style={{ fontWeight: 600 }}>{STEPS.length - 1 - currentIndex}개</div>
        </div>
        <div>
          <span style={{ color: "#64748b" }}>상태</span>
          <div
            style={{
              fontWeight: 600,
              color: currentStep === "완료" ? "#16a34a" : "#f59e0b",
            }}
          >
            {currentStep === "완료" ? "✅ 완료" : "🔄 진행 중"}
          </div>
        </div>
      </div>
    </div>
  );
}

// =============================================
// ✅ 메인 챕터 컴포넌트
// =============================================

function Chapter10() {
  return (
    <div>
      <ChapterHeader
        title="10. 전역 상태 관리 (Context API)"
        learningPoints={[
          "createContext + Provider로 전역 상태 만들기",
          "useContext로 어디서든 상태에 접근하기",
          "Props drilling 없이 여러 컴포넌트가 같은 데이터 공유하기",
        ]}
      />

      <div className="section">
        <h2>Context 없이 vs Context로</h2>
        <div className="code-comment">
          💡 Context 없이: App → Layout → Sidebar → StepItem 으로 props를 계속 내려보내야 함
          (Props drilling)
          <br />
          Context 사용: Provider 안의 어떤 컴포넌트든 useContext()로 바로 접근
          <br />
          <br />
          C#의 DI처럼: services.AddSingleton&lt;StepService&gt;() → 생성자에서 주입
          <br />
          React처럼: &lt;StepProvider&gt; → useStepContext()로 주입
        </div>
      </div>

      <div className="section">
        <h2>실습: 3곳에서 동시에 상태 공유</h2>
        <div className="code-comment">
          💡 아래 3개 컴포넌트(사이드바, 메인, 상태 패널)는 서로 부모-자식 관계가 아닙니다.
          <br />
          그런데 하나의 단계를 바꾸면 3곳이 모두 동시에 업데이트됩니다!
          <br />
          이것이 Context의 핵심: props 전달 없이 전역 상태를 공유합니다.
        </div>

        {/* StepProvider가 3개 컴포넌트를 감싸서 상태를 공유 */}
        <StepProvider>
          <div style={{ display: "flex", gap: 16 }}>
            <StepSidebar />
            <StepMainArea />
            <StepStatusPanel />
          </div>
        </StepProvider>
      </div>

      <div className="section">
        <h2>🔧 직접 해보기</h2>
        <ul style={{ marginLeft: 20 }}>
          <li>새로운 단계(예: "검증")를 STEPS 배열에 추가해보세요</li>
          <li>StepStatusPanel에 "완료 예상 시간" 표시를 추가해보세요</li>
          <li>테마(다크/라이트) Context를 새로 만들어서 배경색을 바꿔보세요</li>
        </ul>
      </div>
    </div>
  );
}

export default Chapter10;
