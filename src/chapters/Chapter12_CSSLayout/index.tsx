import { useState } from "react";
import ChapterHeader from "../../components/ChapterHeader";

/**
 * Chapter 12: CSS 레이아웃 실전
 *
 * [백엔드 비유]
 * Flexbox = SQL의 ORDER BY + GROUP BY를 시각적으로 하는 것
 *
 * 축(axis) 개념:
 *   - main axis (주축): flex-direction 방향 (기본 = 가로 →)
 *   - cross axis (교차축): 주축의 수직 방향 (기본 = 세로 ↓)
 *
 * justify-content: 주축 정렬 (가로 방향 배치)
 * align-items: 교차축 정렬 (세로 방향 배치)
 * flex: 남은 공간을 얼마나 차지할지 비율
 */

// =============================================
// ✅ 1. 3단 레이아웃 (좌 사이드바 + 중앙 + 우 패널)
// =============================================

function ThreeColumnLayout() {
  const [leftOpen, setLeftOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<"개요" | "상세" | "로그">("개요");

  const tabs: ("개요" | "상세" | "로그")[] = ["개요", "상세", "로그"];

  return (
    <div
      style={{
        display: "flex",
        height: 400,
        border: "1px solid #e2e8f0",
        borderRadius: 8,
        overflow: "hidden",
        background: "#fff",
      }}
    >
      {/* ===== 좌측 사이드바 (접힘/펼침) ===== */}
      <div
        style={{
          width: leftOpen ? 180 : 40,
          background: "#f8fafc",
          borderRight: "1px solid #e2e8f0",
          transition: "width 0.3s ease",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* 토글 버튼 */}
        <div
          onClick={() => setLeftOpen(!leftOpen)}
          style={{
            padding: 10,
            cursor: "pointer",
            textAlign: leftOpen ? "right" : "center",
            borderBottom: "1px solid #e2e8f0",
            fontSize: 16,
            userSelect: "none",
          }}
        >
          {leftOpen ? "◀" : "▶"}
        </div>

        {/* 메뉴 목록 - 접혀있으면 아이콘만 표시 */}
        {leftOpen && (
          <div style={{ padding: 8 }}>
            {["📁 프로젝트", "📋 작업", "👥 팀원", "⚙️ 설정", "📊 통계"].map(
              (item) => (
                <div
                  key={item}
                  style={{
                    padding: "8px 10px",
                    fontSize: 13,
                    borderRadius: 4,
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                  }}
                >
                  {item}
                </div>
              )
            )}
          </div>
        )}

        {!leftOpen && (
          <div style={{ padding: "8px 0", textAlign: "center" }}>
            {["📁", "📋", "👥", "⚙️", "📊"].map((icon) => (
              <div
                key={icon}
                style={{ padding: 8, cursor: "pointer", fontSize: 16 }}
              >
                {icon}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ===== 중앙 콘텐츠 ===== */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* 탭 UI */}
        <div
          style={{
            display: "flex",
            borderBottom: "1px solid #e2e8f0",
            background: "#f8fafc",
          }}
        >
          {tabs.map((tab) => (
            <div
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: "10px 20px",
                cursor: "pointer",
                fontSize: 14,
                fontWeight: activeTab === tab ? 600 : 400,
                color: activeTab === tab ? "#3b82f6" : "#64748b",
                borderBottom: activeTab === tab ? "2px solid #3b82f6" : "2px solid transparent",
                transition: "all 0.2s",
              }}
            >
              {tab}
            </div>
          ))}
        </div>

        {/* 탭 내용 */}
        <div style={{ flex: 1, padding: 16, overflowY: "auto" }}>
          {activeTab === "개요" && (
            <div>
              <h3 style={{ fontSize: 16, marginBottom: 12 }}>프로젝트 개요</h3>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 12,
                }}
              >
                {[
                  { label: "총 작업", value: "24개", color: "#3b82f6" },
                  { label: "완료", value: "18개", color: "#16a34a" },
                  { label: "진행 중", value: "4개", color: "#f59e0b" },
                  { label: "대기", value: "2개", color: "#64748b" },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    style={{
                      padding: 12,
                      background: "#f8fafc",
                      borderRadius: 8,
                      borderLeft: `3px solid ${stat.color}`,
                    }}
                  >
                    <div style={{ fontSize: 12, color: "#64748b" }}>{stat.label}</div>
                    <div style={{ fontSize: 20, fontWeight: 600, color: stat.color }}>
                      {stat.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {activeTab === "상세" && (
            <div>
              <h3 style={{ fontSize: 16, marginBottom: 12 }}>작업 상세</h3>
              {["API 연동 구현", "로그인 UI 수정", "테스트 코드 작성", "배포 설정"].map(
                (task, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "8px 0",
                      borderBottom: "1px solid #f1f5f9",
                      fontSize: 14,
                    }}
                  >
                    <span>{task}</span>
                    <span
                      style={{
                        fontSize: 12,
                        padding: "2px 8px",
                        borderRadius: 12,
                        background: i < 2 ? "#dcfce7" : "#fef9c3",
                        color: i < 2 ? "#16a34a" : "#a16207",
                      }}
                    >
                      {i < 2 ? "완료" : "진행 중"}
                    </span>
                  </div>
                )
              )}
            </div>
          )}
          {activeTab === "로그" && (
            <div style={{ fontFamily: "monospace", fontSize: 12, color: "#475569" }}>
              {[
                "[14:32] 배포 완료 - v1.2.3",
                "[14:28] 빌드 성공",
                "[14:25] 테스트 통과 (24/24)",
                "[14:20] PR #42 머지됨",
                "[13:55] 코드 리뷰 완료",
                "[13:30] PR #42 생성",
              ].map((log, i) => (
                <div key={i} style={{ padding: "4px 0", borderBottom: "1px solid #f1f5f9" }}>
                  {log}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ===== 우측 패널 ===== */}
      <div
        style={{
          width: 180,
          background: "#f8fafc",
          borderLeft: "1px solid #e2e8f0",
          padding: 12,
          fontSize: 13,
        }}
      >
        <h4 style={{ fontSize: 13, color: "#64748b", marginBottom: 12 }}>
          팀원 현황
        </h4>
        {[
          { name: "김개발", status: "🟢 온라인" },
          { name: "이프론트", status: "🟡 자리비움" },
          { name: "박풀스택", status: "🟢 온라인" },
          { name: "최디자인", status: "🔴 오프라인" },
        ].map((member) => (
          <div key={member.name} style={{ padding: "6px 0" }}>
            <div style={{ fontWeight: 500 }}>{member.name}</div>
            <div style={{ fontSize: 11, color: "#94a3b8" }}>{member.status}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// =============================================
// ✅ 2. Flexbox 속성 인터랙티브 플레이그라운드
// =============================================

function FlexPlayground() {
  const [direction, setDirection] = useState<"row" | "column">("row");
  const [justify, setJustify] = useState("flex-start");
  const [alignItems, setAlignItems] = useState("stretch");
  const [gap, setGap] = useState(8);

  return (
    <div>
      {/* 컨트롤 패널 */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr 1fr",
          gap: 12,
          marginBottom: 16,
        }}
      >
        <div>
          <label style={{ fontSize: 12, color: "#64748b", display: "block", marginBottom: 4 }}>
            flex-direction
          </label>
          <select
            value={direction}
            onChange={(e) => setDirection(e.target.value as "row" | "column")}
            style={{ width: "100%" }}
          >
            <option value="row">row (가로)</option>
            <option value="column">column (세로)</option>
          </select>
        </div>
        <div>
          <label style={{ fontSize: 12, color: "#64748b", display: "block", marginBottom: 4 }}>
            justify-content
          </label>
          <select
            value={justify}
            onChange={(e) => setJustify(e.target.value)}
            style={{ width: "100%" }}
          >
            <option value="flex-start">flex-start</option>
            <option value="center">center</option>
            <option value="flex-end">flex-end</option>
            <option value="space-between">space-between</option>
            <option value="space-around">space-around</option>
            <option value="space-evenly">space-evenly</option>
          </select>
        </div>
        <div>
          <label style={{ fontSize: 12, color: "#64748b", display: "block", marginBottom: 4 }}>
            align-items
          </label>
          <select
            value={alignItems}
            onChange={(e) => setAlignItems(e.target.value)}
            style={{ width: "100%" }}
          >
            <option value="stretch">stretch</option>
            <option value="flex-start">flex-start</option>
            <option value="center">center</option>
            <option value="flex-end">flex-end</option>
          </select>
        </div>
        <div>
          <label style={{ fontSize: 12, color: "#64748b", display: "block", marginBottom: 4 }}>
            gap: {gap}px
          </label>
          <input
            type="range"
            min={0}
            max={32}
            value={gap}
            onChange={(e) => setGap(Number(e.target.value))}
            style={{ width: "100%" }}
          />
        </div>
      </div>

      {/* 미리보기 영역 */}
      <div
        style={{
          display: "flex",
          flexDirection: direction,
          justifyContent: justify,
          alignItems: alignItems,
          gap: gap,
          minHeight: 200,
          padding: 16,
          background: "#f1f5f9",
          borderRadius: 8,
          border: "2px dashed #cbd5e1",
        }}
      >
        {[
          { label: "A", w: 80, h: 60, color: "#3b82f6" },
          { label: "B", w: 100, h: 80, color: "#10b981" },
          { label: "C", w: 60, h: 40, color: "#f59e0b" },
          { label: "D", w: 90, h: 70, color: "#ef4444" },
        ].map((item) => (
          <div
            key={item.label}
            style={{
              width: item.w,
              minHeight: item.h,
              background: item.color,
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 6,
              fontWeight: 600,
              fontSize: 18,
            }}
          >
            {item.label}
          </div>
        ))}
      </div>

      {/* 현재 CSS 코드 표시 */}
      <div
        style={{
          marginTop: 12,
          padding: 12,
          background: "#1e293b",
          color: "#e2e8f0",
          borderRadius: 8,
          fontFamily: "monospace",
          fontSize: 13,
        }}
      >
        <div style={{ color: "#94a3b8" }}>/* 현재 적용된 CSS */</div>
        <div>display: flex;</div>
        <div>flex-direction: {direction};</div>
        <div>justify-content: {justify};</div>
        <div>align-items: {alignItems};</div>
        <div>gap: {gap}px;</div>
      </div>
    </div>
  );
}

function Chapter12() {
  return (
    <div>
      <ChapterHeader
        title="12. CSS 레이아웃 실전"
        learningPoints={[
          "Flexbox로 3단 레이아웃 구성하기",
          "좌측 패널 접힘/펼침 토글 구현",
          "탭 UI 만들기",
          "Flexbox 속성을 인터랙티브하게 체험하기",
        ]}
      />

      <div className="section">
        <h2>3단 레이아웃 + 접힘 패널 + 탭</h2>
        <div className="code-comment">
          💡 실무에서 가장 많이 쓰이는 대시보드 레이아웃 패턴입니다.
          <br />
          좌측: 접힘/펼침 가능한 사이드바 (width + transition)
          <br />
          중앙: 탭으로 콘텐츠 전환 (activeTab state)
          <br />
          우측: 고정 정보 패널. flex: 1은 남은 공간을 모두 차지합니다.
        </div>
        <ThreeColumnLayout />
      </div>

      <div className="section">
        <h2>Flexbox 플레이그라운드</h2>
        <div className="code-comment">
          💡 드롭다운과 슬라이더를 조작하면서 flex 속성이 어떻게 동작하는지 직접 확인하세요.
          <br />
          justify-content: 주축(→) 방향 정렬 / align-items: 교차축(↓) 방향 정렬
          <br />
          flex-direction을 column으로 바꾸면 축이 뒤바뀝니다!
        </div>
        <FlexPlayground />
      </div>

      <div className="section">
        <h2>🔧 직접 해보기</h2>
        <ul style={{ marginLeft: 20 }}>
          <li>우측 패널도 접힘/펼침이 되게 만들어보세요</li>
          <li>탭에 "알림" 탭을 추가하고 뱃지(알림 개수)를 표시해보세요</li>
          <li>Flexbox 플레이그라운드에 flex-wrap 옵션을 추가해보세요</li>
        </ul>
      </div>
    </div>
  );
}

export default Chapter12;
