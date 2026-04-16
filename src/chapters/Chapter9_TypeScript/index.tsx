import { useState } from "react";
import ChapterHeader from "../../components/ChapterHeader";

/**
 * Chapter 9: TypeScript 기초
 *
 * [백엔드 비유]
 * TypeScript의 타입 시스템 = C#의 강타입 시스템과 거의 동일한 개념
 * Python의 type hints(def func(name: str) -> int)보다 훨씬 엄격합니다.
 *
 * interface = C#의 interface / Python의 TypedDict
 * type = C#의 record 또는 type alias
 * 제네릭 = C#의 List<T>, Dictionary<K,V>와 같은 개념
 * 유니온 = C#의 discriminated union 패턴
 */

// =============================================
// ✅ 1. interface vs type
// =============================================

// interface: 객체의 구조를 정의 (C#의 interface와 거의 동일)
interface User {
  id: number;
  name: string;
  email: string;
  isActive: boolean;
}

// type: 더 유연한 타입 정의 (유니온, 교차, 리터럴 등 가능)
type Role = "admin" | "editor" | "viewer"; // 리터럴 유니온 = C#의 enum과 비슷
type UserWithRole = User & { role: Role }; // 교차 타입 = 기존 타입 합치기

function InterfaceVsType() {
  const [users] = useState<UserWithRole[]>([
    { id: 1, name: "김개발", email: "kim@dev.com", isActive: true, role: "admin" },
    { id: 2, name: "이프론트", email: "lee@front.com", isActive: true, role: "editor" },
    { id: 3, name: "박뷰어", email: "park@view.com", isActive: false, role: "viewer" },
  ]);

  // 역할에 따른 배지 색상 매핑
  const roleColors: Record<Role, string> = {
    admin: "#ef4444",
    editor: "#3b82f6",
    viewer: "#64748b",
  };

  return (
    <div>
      {users.map((user) => (
        <div
          key={user.id}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: 12,
            background: user.isActive ? "#f0fdf4" : "#fef2f2",
            borderRadius: 8,
            marginBottom: 8,
          }}
        >
          <div>
            <strong>{user.name}</strong>
            <span style={{ color: "#64748b", marginLeft: 8, fontSize: 13 }}>
              {user.email}
            </span>
          </div>
          <div className="flex-gap">
            <span
              style={{
                padding: "2px 10px",
                borderRadius: 12,
                fontSize: 12,
                color: "#fff",
                background: roleColors[user.role],
              }}
            >
              {user.role}
            </span>
            <span style={{ fontSize: 12 }}>
              {user.isActive ? "🟢 활성" : "🔴 비활성"}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

// =============================================
// ✅ 2. 제네릭 (Generics)
// =============================================

// 제네릭 = C#의 List<T>처럼 타입을 매개변수로 받는 것
// 어떤 타입이든 담을 수 있는 "범용 컨테이너"를 만들 때 사용
interface ApiResponse<T> {
  data: T;
  status: "success" | "error";
  message: string;
}

// 제네릭 함수: 타입을 호출 시점에 결정
function createResponse<T>(data: T, message: string): ApiResponse<T> {
  return { data, status: "success", message };
}

function GenericExample() {
  // 다양한 타입으로 같은 구조 사용
  const userResponse = createResponse<User>(
    { id: 1, name: "김개발", email: "kim@dev.com", isActive: true },
    "사용자 조회 성공"
  );

  const numberResponse = createResponse<number[]>(
    [10, 20, 30],
    "숫자 목록 조회 성공"
  );

  const stringResponse = createResponse<string>(
    "Hello TypeScript!",
    "문자열 조회 성공"
  );

  return (
    <div>
      <div className="result-box mb-8">
        <strong>ApiResponse&lt;User&gt;:</strong>
        <pre style={{ fontSize: 13, marginTop: 4 }}>
          {JSON.stringify(userResponse, null, 2)}
        </pre>
      </div>
      <div className="result-box mb-8">
        <strong>ApiResponse&lt;number[]&gt;:</strong>
        <pre style={{ fontSize: 13, marginTop: 4 }}>
          {JSON.stringify(numberResponse, null, 2)}
        </pre>
      </div>
      <div className="result-box">
        <strong>ApiResponse&lt;string&gt;:</strong>
        <pre style={{ fontSize: 13, marginTop: 4 }}>
          {JSON.stringify(stringResponse, null, 2)}
        </pre>
      </div>
    </div>
  );
}

// =============================================
// ✅ 3. 유니온 타입으로 메시지 종류 구분
// =============================================

// Discriminated Union: 공통 필드(type)로 구분하는 패턴
// C#에서 abstract class + 자식 클래스로 하는 것과 같은 효과

// 일반 텍스트 메시지
interface TextMessage {
  type: "text";
  id: number;
  sender: "user" | "ai";
  content: string;
}

// 검색 버블
interface SearchMessage {
  type: "search";
  id: number;
  sender: "ai";
  query: string;
  resultCount: number;
}

// 결과 테이블 버블
interface TableMessage {
  type: "table";
  id: number;
  sender: "ai";
  title: string;
  headers: string[];
  rows: string[][];
}

// 유니온 타입: 위 3개 중 하나
type ChatMessage = TextMessage | SearchMessage | TableMessage;

// 메시지 타입에 따라 다른 컴포넌트를 렌더링하는 함수
function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.sender === "user";
  const bgColor = isUser ? "#3b82f6" : "#f1f5f9";
  const textColor = isUser ? "#fff" : "#1e293b";

  // switch로 타입 분기 - TypeScript가 각 case에서 타입을 자동으로 좁혀줌 (타입 내로잉)
  switch (message.type) {
    case "text":
      return (
        <div
          style={{
            padding: "10px 16px",
            background: bgColor,
            color: textColor,
            borderRadius: 12,
            marginBottom: 8,
            maxWidth: "70%",
            marginLeft: isUser ? "auto" : 0,
          }}
        >
          {message.content}
        </div>
      );

    case "search":
      // TypeScript가 여기서 message를 SearchMessage로 인식 (content는 접근 불가, query는 접근 가능)
      return (
        <div
          style={{
            padding: 12,
            background: "#eff6ff",
            border: "1px solid #bfdbfe",
            borderRadius: 12,
            marginBottom: 8,
            maxWidth: "70%",
          }}
        >
          <div style={{ fontSize: 12, color: "#3b82f6", marginBottom: 4 }}>
            🔍 검색 수행
          </div>
          <strong>"{message.query}"</strong>
          <p style={{ fontSize: 13, color: "#64748b" }}>
            {message.resultCount}개 결과를 찾았습니다
          </p>
        </div>
      );

    case "table":
      // TypeScript가 여기서 message를 TableMessage로 인식
      return (
        <div
          style={{
            background: "#f8fafc",
            border: "1px solid #e2e8f0",
            borderRadius: 12,
            overflow: "hidden",
            marginBottom: 8,
            maxWidth: "80%",
          }}
        >
          <div style={{ padding: "8px 12px", background: "#f1f5f9", fontWeight: 600, fontSize: 14 }}>
            📊 {message.title}
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr>
                {message.headers.map((h, i) => (
                  <th
                    key={i}
                    style={{
                      padding: "8px 12px",
                      background: "#e2e8f0",
                      textAlign: "left",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {message.rows.map((row, i) => (
                <tr key={i}>
                  {row.map((cell, j) => (
                    <td
                      key={j}
                      style={{
                        padding: "6px 12px",
                        borderBottom: "1px solid #e2e8f0",
                      }}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
  }
}

function UnionTypeDemo() {
  const [messages] = useState<ChatMessage[]>([
    { type: "text", id: 1, sender: "user", content: "최근 매출 데이터 알려줘" },
    { type: "search", id: 2, sender: "ai", query: "2024년 분기별 매출", resultCount: 12 },
    { type: "text", id: 3, sender: "ai", content: "검색 결과를 정리했습니다. 아래 표를 확인해주세요." },
    {
      type: "table",
      id: 4,
      sender: "ai",
      title: "2024 분기별 매출",
      headers: ["분기", "매출", "전분기 대비"],
      rows: [
        ["Q1", "12.5억", "+8%"],
        ["Q2", "15.2억", "+21%"],
        ["Q3", "14.8억", "-2%"],
        ["Q4", "18.1억", "+22%"],
      ],
    },
    { type: "text", id: 5, sender: "user", content: "Q4 실적이 좋네!" },
  ]);

  return (
    <div style={{ maxWidth: 500 }}>
      {messages.map((msg) => (
        <MessageBubble key={msg.id} message={msg} />
      ))}
    </div>
  );
}

function Chapter9() {
  return (
    <div>
      <ChapterHeader
        title="9. TypeScript 기초"
        learningPoints={[
          "interface와 type으로 데이터 구조 정의하기",
          "제네릭으로 재사용 가능한 타입 만들기",
          "유니온 타입으로 메시지 종류를 구분해서 렌더링하기",
        ]}
      />

      <div className="section">
        <h2>interface & type</h2>
        <div className="code-comment">
          💡 interface: 객체 구조 정의 (C#의 interface와 동일).
          <br />
          type: 유니온, 교차, 리터럴 등 유연한 타입 정의.
          <br />
          Record&lt;K, V&gt;는 C#의 Dictionary&lt;K, V&gt;와 같습니다.
        </div>
        <InterfaceVsType />
      </div>

      <div className="section">
        <h2>제네릭 (Generics)</h2>
        <div className="code-comment">
          💡 C#의 List&lt;T&gt;처럼, 타입을 매개변수로 받아 재사용 가능한 구조를 만듭니다.
          <br />
          ApiResponse&lt;User&gt;, ApiResponse&lt;number[]&gt; 등 같은 구조에 다른 데이터를 담을 수 있습니다.
        </div>
        <GenericExample />
      </div>

      <div className="section">
        <h2>유니온 타입 - 메시지 버블 분기</h2>
        <div className="code-comment">
          💡 Discriminated Union: 공통 필드(type)로 구분하면 switch문에서 TypeScript가 자동으로 타입을 좁혀줍니다.
          <br />
          C#의 패턴 매칭(switch expression)이나 Python의 match-case와 같은 개념입니다.
          <br />
          텍스트/검색/테이블 3종류의 메시지를 하나의 ChatMessage 타입으로 관리합니다.
        </div>
        <UnionTypeDemo />
      </div>

      <div className="section">
        <h2>🔧 직접 해보기</h2>
        <ul style={{ marginLeft: 20 }}>
          <li>새로운 메시지 타입 (예: ImageMessage)을 추가하고 렌더링해보세요</li>
          <li>User interface에 optional 필드(phone?)를 추가해보세요</li>
          <li>createResponse 함수에 에러 케이스(status: "error")도 처리해보세요</li>
        </ul>
      </div>
    </div>
  );
}

export default Chapter9;
