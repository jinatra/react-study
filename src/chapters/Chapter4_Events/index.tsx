import { useState } from "react";
import ChapterHeader from "../../components/ChapterHeader";

/**
 * Chapter 4: 이벤트 핸들링
 *
 * [백엔드 비유]
 * 이벤트 핸들링 = API 엔드포인트에서 요청을 받아 처리하는 것과 비슷
 * 사용자의 행동(클릭, 타이핑, 제출)에 반응하여 로직을 실행합니다.
 *
 * HTML에서는 onclick="함수()" 이지만,
 * React에서는 onClick={함수} 입니다 (카멜케이스 + 함수 참조).
 */

// ✅ 1. 클릭 이벤트
function ClickExample() {
  const [message, setMessage] = useState("버튼을 클릭해보세요!");
  const [clickCount, setClickCount] = useState(0);

  // 이벤트 핸들러 함수를 별도로 정의
  const handleClick = () => {
    setClickCount((prev) => prev + 1);
    setMessage(`${clickCount + 1}번 클릭했습니다!`);
  };

  // 이벤트 객체를 매개변수로 받을 수도 있음
  const handleButtonName = (e: React.MouseEvent<HTMLButtonElement>) => {
    setMessage(`"${e.currentTarget.textContent}" 버튼을 클릭했어요`);
  };

  return (
    <div>
      <div className="result-box mb-12">{message}</div>
      <div className="flex-gap">
        <button onClick={handleClick}>클릭!</button>
        <button className="secondary" onClick={handleButtonName}>
          내 이름 보기
        </button>
        {/* 인라인으로 바로 작성할 수도 있음 */}
        <button className="danger" onClick={() => setMessage("리셋됨!")}>
          리셋
        </button>
      </div>
    </div>
  );
}

// ✅ 2. 입력(Input) 이벤트
function InputExample() {
  const [text, setText] = useState("");
  const [keyPressed, setKeyPressed] = useState("");

  return (
    <div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, maxWidth: 400 }}>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)} // 타이핑할 때마다 호출
          onKeyDown={(e) => setKeyPressed(e.key)} // 키를 누를 때 호출
          placeholder="여기에 타이핑해보세요"
        />
      </div>
      <div className="result-box">
        <p>입력된 텍스트: {text || "(비어있음)"}</p>
        <p>글자 수: {text.length}자</p>
        <p>마지막 누른 키: {keyPressed || "(없음)"}</p>
      </div>
    </div>
  );
}

// ✅ 3. 폼 제출 이벤트
function FormExample() {
  const [formData, setFormData] = useState({ title: "", content: "" });
  const [submittedList, setSubmittedList] = useState<
    { title: string; content: string }[]
  >([]);

  // 폼 제출 핸들러
  const handleSubmit = (e: React.FormEvent) => {
    // 기본 동작(페이지 새로고침) 방지 - 백엔드에서 CORS 처리하듯 필수!
    e.preventDefault();

    if (!formData.title.trim() || !formData.content.trim()) return;

    setSubmittedList([...submittedList, formData]);
    setFormData({ title: "", content: "" }); // 폼 초기화
  };

  return (
    <div>
      {/* form 태그의 onSubmit으로 제출 처리 */}
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 8, maxWidth: 400 }}>
        <input
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="제목"
        />
        <textarea
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          placeholder="내용을 입력하세요"
          rows={3}
        />
        {/* type="submit"이면 Enter키로도 제출 가능 */}
        <button type="submit">게시하기</button>
      </form>

      {submittedList.length > 0 && (
        <div className="mt-12">
          <strong>게시된 글:</strong>
          {submittedList.map((item, i) => (
            <div key={i} className="result-box">
              <strong>{item.title}</strong>
              <p>{item.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Chapter4() {
  return (
    <div>
      <ChapterHeader
        title="4. 이벤트 핸들링"
        learningPoints={[
          "클릭, 입력 등 이벤트에 함수 연결하기",
          "이벤트 객체(e)에서 정보 가져오기",
          "폼 제출 처리와 e.preventDefault()",
        ]}
      />

      <div className="section">
        <h2>클릭 이벤트</h2>
        <div className="code-comment">
          💡 onClick={`{함수}`}로 클릭 이벤트를 연결합니다.
          <br />
          주의: onClick={`{handleClick()}`}는 ❌ (즉시 실행됨), onClick={`{handleClick}`}가 ✅
        </div>
        <ClickExample />
      </div>

      <div className="section">
        <h2>입력(Input) 이벤트</h2>
        <div className="code-comment">
          💡 onChange: 값이 바뀔 때마다 / onKeyDown: 키를 누를 때 / onFocus, onBlur: 포커스 시
          <br />
          e.target.value로 현재 입력값을 가져옵니다.
        </div>
        <InputExample />
      </div>

      <div className="section">
        <h2>폼(Form) 제출</h2>
        <div className="code-comment">
          💡 e.preventDefault()는 필수! 안 하면 페이지가 새로고침됩니다.
          <br />
          백엔드에서 POST 요청 처리하듯, 프론트에서도 폼 데이터를 모아서 처리합니다.
        </div>
        <FormExample />
      </div>

      <div className="section">
        <h2>🔧 직접 해보기</h2>
        <ul style={{ marginLeft: 20 }}>
          <li>클릭 예제에 더블클릭(onDoubleClick) 이벤트를 추가해보세요</li>
          <li>입력 예제에 입력값을 대문자로 변환하는 기능을 넣어보세요</li>
          <li>폼 예제에 "삭제" 버튼을 추가해서 게시글을 지울 수 있게 만들어보세요</li>
        </ul>
      </div>
    </div>
  );
}

export default Chapter4;
