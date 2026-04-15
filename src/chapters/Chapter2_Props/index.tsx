import ChapterHeader from "../../components/ChapterHeader";

/**
 * Chapter 2: Props
 *
 * [백엔드 비유]
 * Props = 함수의 매개변수(parameter)
 * Python에서 def greet(name: str) 처럼, React 컴포넌트도 외부에서 데이터를 받습니다.
 * 부모 → 자식 방향으로만 전달됩니다 (단방향 데이터 흐름).
 *
 * TypeScript의 interface로 타입을 정의하면
 * C#의 강타입 매개변수처럼 안전하게 사용할 수 있습니다.
 */

// ✅ 1. 기본 Props - interface로 타입 정의
interface ProfileCardProps {
  name: string;
  role: string;
  level: number;
}

// props를 구조분해(destructuring)로 받기 - Python의 **kwargs와 비슷
function ProfileCard({ name, role, level }: ProfileCardProps) {
  return (
    <div style={{ padding: 12, background: "#f0fdf4", borderRadius: 8, marginBottom: 8 }}>
      <strong>{name}</strong>
      <p>역할: {role}</p>
      <p>레벨: {"⭐".repeat(level)}</p>
    </div>
  );
}

// ✅ 2. 선택적(optional) Props와 기본값
interface BadgeProps {
  text: string;
  color?: string; // ? 붙이면 optional (Python의 Optional[str]과 같음)
}

function Badge({ text, color = "#3b82f6" }: BadgeProps) {
  return (
    <span
      style={{
        display: "inline-block",
        padding: "4px 12px",
        background: color,
        color: "#fff",
        borderRadius: 20,
        fontSize: 13,
        marginRight: 4,
      }}
    >
      {text}
    </span>
  );
}

// ✅ 3. children props - 컴포넌트 안에 넣은 내용을 받기
interface CardProps {
  title: string;
  children: React.ReactNode; // children은 태그 사이에 넣은 모든 것
}

function Card({ title, children }: CardProps) {
  return (
    <div style={{ border: "1px solid #e2e8f0", borderRadius: 8, overflow: "hidden" }}>
      <div style={{ background: "#f1f5f9", padding: "8px 16px", fontWeight: 600 }}>
        {title}
      </div>
      <div style={{ padding: 16 }}>{children}</div>
    </div>
  );
}

function Chapter2() {
  return (
    <div>
      <ChapterHeader
        title="2. Props"
        learningPoints={[
          "부모에서 자식으로 데이터 전달하기",
          "TypeScript로 Props 타입 지정하기",
          "children props로 컴포넌트 내부 콘텐츠 전달하기",
        ]}
      />

      {/* 섹션 1: 기본 Props */}
      <div className="section">
        <h2>기본 Props 전달</h2>
        <div className="code-comment">
          💡 Props는 HTML 속성처럼 전달합니다: {`<컴포넌트 name="값" />`}
          <br />
          C#에서 메서드에 인자를 넘기는 것과 같습니다: UserCard(name: "김개발", role: "백엔드")
        </div>
        {/* 같은 컴포넌트를 다른 props로 재사용 */}
        <ProfileCard name="김개발" role="백엔드 개발자" level={3} />
        <ProfileCard name="이프론트" role="프론트엔드 개발자" level={5} />
        <ProfileCard name="박풀스택" role="풀스택 개발자" level={4} />
      </div>

      {/* 섹션 2: Optional Props */}
      <div className="section">
        <h2>선택적(Optional) Props</h2>
        <div className="code-comment">
          💡 interface에서 ?를 붙이면 선택적 props가 됩니다.
          <br />
          Python의 def func(color: str = "blue")와 같은 패턴입니다.
        </div>
        <div className="flex-gap">
          <Badge text="React" />
          <Badge text="TypeScript" color="#3178c6" />
          <Badge text="Python" color="#306998" />
          <Badge text="C#" color="#68217a" />
          {/* color를 안 넘기면 기본값 #3b82f6 사용 */}
          <Badge text="기본색" />
        </div>
      </div>

      {/* 섹션 3: Children Props */}
      <div className="section">
        <h2>Children Props</h2>
        <div className="code-comment">
          💡 children은 컴포넌트 태그 사이에 넣은 내용입니다.
          <br />
          {`<Card>여기가 children</Card>`} - HTML의 슬롯(slot)이나 ASP.NET의 @RenderBody()와 비슷합니다.
        </div>
        <div style={{ display: "flex", gap: 16 }}>
          <Card title="공지사항">
            <p>React 스터디 매주 월요일 진행합니다.</p>
            <p style={{ color: "#64748b", fontSize: 13 }}>2024.01.15</p>
          </Card>
          <Card title="팁">
            <p>컴포넌트를 작게 나눌수록 재사용이 쉬워집니다!</p>
            <Badge text="중요" color="#ef4444" />
          </Card>
        </div>
      </div>

      {/* 섹션 4: 직접 해보기 */}
      <div className="section">
        <h2>🔧 직접 해보기</h2>
        <ul style={{ marginLeft: 20 }}>
          <li>
            <code>ProfileCard</code>에 새로운 prop (예: email)을 추가해보세요
          </li>
          <li>
            <code>Badge</code>에 size prop을 추가해서 크기를 조절해보세요
          </li>
          <li>
            새로운 <code>AlertBox</code> 컴포넌트를 만들어서 children으로 메시지를 받아보세요
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Chapter2;
