import { useState } from "react";
import ChapterHeader from "../../components/ChapterHeader";

/**
 * Chapter 3: State (useState)
 *
 * [백엔드 비유]
 * State = 컴포넌트 내부의 변수이자, 변하면 화면이 자동으로 다시 그려지는 변수
 *
 * 일반 변수(let count = 0)를 바꿔도 화면은 갱신되지 않습니다.
 * useState로 선언한 값을 바꾸면 React가 자동으로 화면을 다시 렌더링합니다.
 *
 * Python에서 변수를 바꾸면 print를 다시 해야 하지만,
 * React에서는 state를 바꾸면 화면이 자동으로 업데이트됩니다!
 */

// ✅ 1. 기본 카운터 - useState의 가장 기본적인 사용
function Counter() {
  // useState(초기값) → [현재값, 변경함수] 반환
  // 배열 구조분해를 사용합니다 (Python의 a, b = (1, 2)와 비슷)
  const [count, setCount] = useState(0);

  return (
    <div>
      <p style={{ fontSize: 24, fontWeight: "bold", marginBottom: 8 }}>
        카운트: {count}
      </p>
      <div className="flex-gap">
        <button onClick={() => setCount(count - 1)}>-1</button>
        <button onClick={() => setCount(count + 1)}>+1</button>
        <button className="secondary" onClick={() => setCount(0)}>
          리셋
        </button>
      </div>
    </div>
  );
}

// ✅ 2. 문자열 state - 입력값 관리
function NameInput() {
  const [name, setName] = useState("");

  return (
    <div>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="이름을 입력하세요"
      />
      <div className="result-box">
        {name ? `안녕하세요, ${name}님!` : "이름을 입력해보세요."}
      </div>
    </div>
  );
}

// ✅ 3. boolean state - 토글
function ToggleBox() {
  const [isVisible, setIsVisible] = useState(true);

  return (
    <div>
      <button onClick={() => setIsVisible(!isVisible)}>
        {isVisible ? "숨기기" : "보이기"}
      </button>
      {/* 조건부 렌더링: isVisible이 true일 때만 보임 */}
      {isVisible && (
        <div className="result-box" style={{ marginTop: 8 }}>
          🎉 이 박스는 토글로 보이거나 숨길 수 있어요!
        </div>
      )}
    </div>
  );
}

// ✅ 4. 여러 state를 함께 관리
function UserForm() {
  const [nickname, setNickname] = useState("");
  const [age, setAge] = useState("");
  const [language, setLanguage] = useState("python");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    setSubmitted(true);
  };

  const handleReset = () => {
    setNickname("");
    setAge("");
    setLanguage("python");
    setSubmitted(false);
  };

  return (
    <div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, maxWidth: 300 }}>
        <input
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          placeholder="닉네임"
        />
        <input
          value={age}
          onChange={(e) => setAge(e.target.value)}
          placeholder="나이"
          type="number"
        />
        <select value={language} onChange={(e) => setLanguage(e.target.value)}>
          <option value="python">Python</option>
          <option value="csharp">C#</option>
          <option value="javascript">JavaScript</option>
          <option value="typescript">TypeScript</option>
        </select>
        <div className="flex-gap">
          <button onClick={handleSubmit}>제출</button>
          <button className="secondary" onClick={handleReset}>
            초기화
          </button>
        </div>
      </div>

      {submitted && (
        <div className="result-box">
          <strong>제출된 정보:</strong>
          <br />
          닉네임: {nickname || "(없음)"} / 나이: {age || "(없음)"} / 언어: {language}
        </div>
      )}
    </div>
  );
}

function Chapter3() {
  return (
    <div>
      <ChapterHeader
        title="3. State (useState)"
        learningPoints={[
          "useState로 상태 선언하기",
          "상태 업데이트와 자동 리렌더링 이해하기",
          "여러 개의 state를 함께 관리하기",
        ]}
      />

      <div className="section">
        <h2>카운터 (숫자 state)</h2>
        <div className="code-comment">
          💡 useState(초기값)은 [현재값, setter함수] 배열을 반환합니다.
          <br />
          setter를 호출하면 값이 바뀌고 → React가 화면을 자동으로 다시 그립니다.
        </div>
        <Counter />
      </div>

      <div className="section">
        <h2>텍스트 입력 (문자열 state)</h2>
        <div className="code-comment">
          💡 input의 value를 state로 관리하고, onChange로 타이핑할 때마다 업데이트합니다.
          <br />
          이걸 "Controlled Component"라고 부릅니다 - React가 입력값을 통제하는 패턴입니다.
        </div>
        <NameInput />
      </div>

      <div className="section">
        <h2>토글 (boolean state)</h2>
        <div className="code-comment">
          💡 !연산자로 true/false를 뒤집습니다. 조건부 렌더링과 함께 많이 쓰이는 패턴입니다.
        </div>
        <ToggleBox />
      </div>

      <div className="section">
        <h2>여러 State 관리</h2>
        <div className="code-comment">
          💡 하나의 컴포넌트에서 여러 useState를 사용할 수 있습니다.
          <br />
          각 state는 독립적으로 관리됩니다.
        </div>
        <UserForm />
      </div>

      <div className="section">
        <h2>🔧 직접 해보기</h2>
        <ul style={{ marginLeft: 20 }}>
          <li>카운터에 +5, -5 버튼을 추가해보세요</li>
          <li>토글 박스의 내용을 바꿔보세요</li>
          <li>UserForm에 "이메일" 필드를 추가해보세요</li>
        </ul>
      </div>
    </div>
  );
}

export default Chapter3;
