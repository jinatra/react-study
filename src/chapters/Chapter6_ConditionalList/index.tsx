import { useState } from "react";
import ChapterHeader from "../../components/ChapterHeader";

/**
 * Chapter 6: 조건부 렌더링과 리스트
 *
 * [백엔드 비유]
 * 조건부 렌더링 = if/else로 응답을 다르게 보내는 것
 * 리스트 렌더링 = for 루프로 데이터를 순회하며 HTML을 생성하는 것
 *
 * Python의 [f"<li>{item}</li>" for item in items] 와
 * React의 items.map(item => <li>{item}</li>) 는 같은 개념입니다!
 */

// ✅ 1. 조건부 렌더링 - 여러 가지 방법
function ConditionalRendering() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState<"admin" | "user" | "guest">("guest");
  const [score, setScore] = useState(75);

  return (
    <div>
      {/* 방법 1: && 연산자 - 조건이 true일 때만 렌더링 */}
      <div className="mb-12">
        <strong>1. && 연산자:</strong>
        <button
          onClick={() => setIsLoggedIn(!isLoggedIn)}
          style={{ marginLeft: 8 }}
        >
          {isLoggedIn ? "로그아웃" : "로그인"}
        </button>
        {isLoggedIn && (
          <span
            style={{ marginLeft: 8, color: "#16a34a" }}
          >
            ✅ 환영합니다!
          </span>
        )}
      </div>

      {/* 방법 2: 삼항 연산자 - if/else */}
      <div className="mb-12">
        <strong>2. 삼항 연산자 (조건 ? A : B):</strong>
        <div className="result-box">
          {isLoggedIn
            ? "대시보드를 표시합니다 📊"
            : "로그인 페이지를 표시합니다 🔐"}
        </div>
      </div>

      {/* 방법 3: 여러 조건 분기 */}
      <div className="mb-12">
        <strong>3. 여러 조건 분기:</strong>
        <div className="flex-gap mb-8">
          <button
            className={role === "admin" ? undefined : "secondary"}
            onClick={() => setRole("admin")}
          >
            관리자
          </button>
          <button
            className={role === "user" ? undefined : "secondary"}
            onClick={() => setRole("user")}
          >
            일반 사용자
          </button>
          <button
            className={role === "guest" ? undefined : "secondary"}
            onClick={() => setRole("guest")}
          >
            게스트
          </button>
        </div>
        <div className="result-box">
          {role === "admin" && "🛠 관리자 패널: 모든 기능에 접근 가능"}
          {role === "user" && "👤 사용자 페이지: 기본 기능 사용 가능"}
          {role === "guest" && "👋 게스트: 읽기만 가능합니다. 로그인해주세요."}
        </div>
      </div>

      {/* 방법 4: 스타일 조건부 적용 */}
      <div>
        <strong>4. 조건부 스타일:</strong>
        <div className="flex-gap mb-8">
          <input
            type="range"
            min={0}
            max={100}
            value={score}
            onChange={(e) => setScore(Number(e.target.value))}
          />
          <span>{score}점</span>
        </div>
        <div
          className="result-box"
          style={{
            borderLeft: `4px solid ${score >= 60 ? "#16a34a" : "#ef4444"}`,
            color: score >= 60 ? "#16a34a" : "#ef4444",
          }}
        >
          {score >= 90
            ? "🏆 우수"
            : score >= 60
              ? "✅ 합격"
              : "❌ 불합격"}
        </div>
      </div>
    </div>
  );
}

// ✅ 2. 리스트 렌더링 - map으로 배열을 JSX로 변환
interface Todo {
  id: number;
  text: string;
  done: boolean;
}

function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([
    { id: 1, text: "React 기초 배우기", done: true },
    { id: 2, text: "Props 이해하기", done: true },
    { id: 3, text: "State 활용하기", done: false },
  ]);
  const [newTodo, setNewTodo] = useState("");

  // 할일 추가
  const addTodo = () => {
    if (!newTodo.trim()) return;
    const todo: Todo = {
      id: Date.now(), // 간단히 timestamp를 id로 사용
      text: newTodo,
      done: false,
    };
    setTodos([...todos, todo]); // 기존 배열 + 새 항목 (스프레드 연산자)
    setNewTodo("");
  };

  // 완료 토글
  const toggleTodo = (id: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, done: !todo.done } : todo
      )
    );
  };

  // 삭제
  const deleteTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  return (
    <div>
      {/* 입력 영역 */}
      <div className="flex-gap mb-12">
        <input
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTodo()}
          placeholder="할 일을 입력하세요"
          style={{ flex: 1 }}
        />
        <button onClick={addTodo}>추가</button>
      </div>

      {/* 리스트 렌더링 - map()으로 배열을 JSX 배열로 변환 */}
      {todos.length === 0 ? (
        <p style={{ color: "#64748b" }}>할 일이 없습니다. 추가해보세요!</p>
      ) : (
        <ul style={{ listStyle: "none" }}>
          {todos.map((todo) => (
            // ⚠️ key는 필수! React가 리스트의 각 항목을 구별하는 데 사용
            // DB의 Primary Key처럼, 각 항목의 고유 식별자입니다
            <li
              key={todo.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "8px 12px",
                background: "#f8fafc",
                marginBottom: 4,
                borderRadius: 6,
              }}
            >
              <input
                type="checkbox"
                checked={todo.done}
                onChange={() => toggleTodo(todo.id)}
              />
              <span
                style={{
                  flex: 1,
                  textDecoration: todo.done ? "line-through" : "none",
                  color: todo.done ? "#94a3b8" : "#1e293b",
                }}
              >
                {todo.text}
              </span>
              <button
                className="danger"
                onClick={() => deleteTodo(todo.id)}
                style={{ padding: "4px 8px", fontSize: 12 }}
              >
                삭제
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* 통계 */}
      <div className="result-box">
        전체: {todos.length} / 완료: {todos.filter((t) => t.done).length} / 남은
        것: {todos.filter((t) => !t.done).length}
      </div>
    </div>
  );
}

function Chapter6() {
  return (
    <div>
      <ChapterHeader
        title="6. 조건부 렌더링 & 리스트"
        learningPoints={[
          "&&, 삼항 연산자 등으로 조건에 따라 다른 UI 보여주기",
          "map()으로 배열 데이터를 리스트로 렌더링하기",
          "key prop의 중요성 이해하기",
        ]}
      />

      <div className="section">
        <h2>조건부 렌더링</h2>
        <div className="code-comment">
          💡 React에서는 if문 대신 JSX 안에서 &&, 삼항연산자(? :)를 주로 사용합니다.
          <br />
          Python의 리스트 컴프리헨션에서 조건을 거는 것과 비슷한 패턴입니다.
        </div>
        <ConditionalRendering />
      </div>

      <div className="section">
        <h2>리스트 렌더링 (Todo List)</h2>
        <div className="code-comment">
          💡 배열.map(item =&gt; JSX)로 리스트를 렌더링합니다.
          <br />
          ⚠️ 각 항목에 고유한 key prop이 필수! DB의 PK처럼 React가 항목을 추적하는 데 사용합니다.
          <br />
          배열 수정 시 직접 변경(push, splice) 대신 새 배열을 만들어야 합니다 (불변성).
        </div>
        <TodoList />
      </div>

      <div className="section">
        <h2>🔧 직접 해보기</h2>
        <ul style={{ marginLeft: 20 }}>
          <li>Todo에 "우선순위" 필드를 추가하고, 높은 순서대로 정렬해보세요</li>
          <li>"완료된 항목만 보기" 필터 버튼을 만들어보세요</li>
          <li>할 일 수정(edit) 기능을 추가해보세요</li>
        </ul>
      </div>
    </div>
  );
}

export default Chapter6;
