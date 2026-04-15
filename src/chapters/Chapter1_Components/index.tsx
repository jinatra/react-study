import ChapterHeader from "../../components/ChapterHeader";

/**
 * Chapter 1: 컴포넌트 기초
 *
 * [백엔드 비유]
 * React 컴포넌트 = Python의 클래스 또는 C#의 partial view
 * 하나의 UI 조각을 독립적으로 관리하는 단위입니다.
 *
 * 핵심 개념:
 * - 함수형 컴포넌트: JSX를 반환하는 함수
 * - JSX: HTML처럼 생겼지만 JavaScript 안에서 쓰는 문법
 * - 컴포넌트 분리: 하나의 큰 UI를 작은 조각으로 나누기
 */

// ✅ 가장 기본적인 컴포넌트 - 그냥 함수가 JSX를 반환하면 됩니다
function Greeting() {
  return <p>안녕하세요! 저는 Greeting 컴포넌트입니다잉.</p>;
}

// ✅ 변수를 JSX 안에서 사용하기 - 중괄호 {}로 감싸면 됩니다
function CurrentTime() {
  // JSX 안에서 JavaScript 표현식을 쓸 때는 중괄호 {} 사용
  const now = new Date().toLocaleTimeString("ko-KR");
  return (
    <p>
      현재 시간: <strong>{now}</strong>
    </p>
  );
}

// ✅ 여러 요소를 반환할 때는 하나의 부모로 감싸야 합니다
function UserProfile() {
  const name = "김개발";
  const role = "백엔드 개발자";

  // JSX는 반드시 하나의 루트 요소를 반환해야 함
  // <div>로 감싸거나, 빈 태그 <> </>  (Fragment)를 사용
  return (
    <div style={{ padding: 12, background: "#f0f9ff", borderRadius: 8 }}>
      <h3>{name}</h3>
      <p>역할: {role}</p>
      <p>경력: {2026 - 2020}년</p> {/* JSX 안에서 연산도 가능 */}
    </div>
  );
}

// ✅ 컴포넌트 안에서 다른 컴포넌트 사용하기 (조합/합성)
function Chapter1() {
  return (
    <div>
      <ChapterHeader
        title="1. 컴포넌트 기초"
        learningPoints={[
          "함수형 컴포넌트 만들기",
          "JSX 문법 이해하기",
          "컴포넌트를 분리하고 조합하기",
        ]}
      />

      {/* 섹션 1: 기본 컴포넌트 */}
      <div className="section">
        <h2>기본 컴포넌트</h2>
        <div className="code-comment">
          💡 컴포넌트는 UI를 반환하는 함수입니다. 함수 이름이 곧 태그 이름이 됩니다.
          <br />
          Python의 함수가 값을 return하듯, React 컴포넌트는 JSX를 return합니다.
        </div>
        {/* 컴포넌트는 HTML 태그처럼 사용합니다 */}
        <Greeting />
      </div>

      {/* 섹션 2: JSX에서 JavaScript 사용 */}
      <div className="section">
        <h2>JSX에서 변수/표현식 사용</h2>
        <div className="code-comment">
          💡 JSX 안에서 {`{중괄호}`}를 쓰면 JavaScript 표현식을 넣을 수 있습니다.
          <br />
          Python의 f-string이나 C#의 $"string"과 비슷한 개념입니다.
        </div>
        <CurrentTime />
      </div>

      {/* 섹션 3: 컴포넌트 조합 */}
      <div className="section">
        <h2>컴포넌트 분리 & 조합</h2>
        <div className="code-comment">
          💡 큰 UI를 작은 컴포넌트로 나누고, 레고 블록처럼 조립합니다.
          <br />
          C#에서 클래스를 분리하듯이, UI도 역할별로 컴포넌트를 분리하면 관리가 쉬워집니다.
        </div>
        <UserProfile />
      </div>

      {/* 섹션 4: 직접 해보기 */}
      <div className="section">
        <h2>🔧 직접 해보기</h2>
        <p>이 파일을 열어서 아래를 시도해보세요:</p>
        <ul style={{ marginLeft: 20, marginTop: 8 }}>
          <li>
            <code>Greeting</code> 컴포넌트의 텍스트를 바꿔보세요
          </li>
          <li>
            <code>UserProfile</code>에 새로운 필드(이메일 등)를 추가해보세요
          </li>
          <li>
            새로운 컴포넌트 <code>MyCard</code>를 만들어서 이 페이지에 추가해보세요
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Chapter1;
