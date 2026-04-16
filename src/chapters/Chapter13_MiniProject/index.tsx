import { useState, useRef, useEffect } from "react";
import ChapterHeader from "../../components/ChapterHeader";

/**
 * Chapter 13: 종합 미니 프로젝트 - AI 채팅 UI
 *
 * 지금까지 배운 모든 개념을 조합합니다:
 * - 컴포넌트 분리 (Ch1) + Props (Ch2)
 * - useState로 상태 관리 (Ch3)
 * - 이벤트 핸들링 (Ch4)
 * - useEffect (Ch5)
 * - 조건부 렌더링 & 리스트 (Ch6)
 * - TypeScript 유니온 타입 (Ch9)
 * - 전역 상태 패턴 (Ch10)
 * - CSS 레이아웃 (Ch12)
 */

// =============================================
// 타입 정의 (Ch9에서 배운 Discriminated Union)
// =============================================

interface TextMessage {
  type: "text";
  id: number;
  sender: "user" | "ai";
  content: string;
  timestamp: string;
}

interface SearchMessage {
  type: "search";
  id: number;
  sender: "ai";
  query: string;
  status: "searching" | "done";
  resultCount?: number;
  timestamp: string;
}

interface TableMessage {
  type: "table";
  id: number;
  sender: "ai";
  title: string;
  headers: string[];
  rows: string[][];
  timestamp: string;
}

type Message = TextMessage | SearchMessage | TableMessage;

interface Conversation {
  id: number;
  title: string;
  preview: string;
  date: string;
  messages: Message[];
}

// =============================================
// 더미 데이터
// =============================================

const DUMMY_CONVERSATIONS: Conversation[] = [
  {
    id: 1,
    title: "매출 데이터 분석",
    preview: "2024년 분기별 매출을 분석해줘",
    date: "오늘",
    messages: [
      { type: "text", id: 1, sender: "user", content: "2024년 분기별 매출 데이터를 분석해줘", timestamp: "14:30" },
      { type: "search", id: 2, sender: "ai", query: "2024 quarterly revenue", status: "done", resultCount: 8, timestamp: "14:30" },
      { type: "text", id: 3, sender: "ai", content: "2024년 분기별 매출 데이터를 조회했습니다. 아래 표를 확인해주세요.", timestamp: "14:31" },
      {
        type: "table", id: 4, sender: "ai", title: "2024 분기별 매출 요약",
        headers: ["분기", "매출(억)", "전분기 대비", "목표 달성률"],
        rows: [
          ["Q1", "12.5", "+8%", "95%"],
          ["Q2", "15.2", "+21%", "110%"],
          ["Q3", "14.8", "-2%", "102%"],
          ["Q4", "18.1", "+22%", "125%"],
        ],
        timestamp: "14:31",
      },
      { type: "text", id: 5, sender: "ai", content: "전체적으로 우상향 추세이며, 특히 Q4에 크게 성장했습니다. Q3만 소폭 감소했는데 이는 계절적 요인으로 보입니다.", timestamp: "14:31" },
    ],
  },
  {
    id: 2,
    title: "신규 기능 기획",
    preview: "알림 기능을 추가하고 싶어",
    date: "어제",
    messages: [
      { type: "text", id: 1, sender: "user", content: "푸시 알림 기능을 추가하고 싶은데, 어떻게 설계하면 좋을까?", timestamp: "10:15" },
      { type: "text", id: 2, sender: "ai", content: "푸시 알림 시스템은 크게 3가지 구성요소로 나눌 수 있습니다:\n\n1. 알림 트리거 서비스\n2. 메시지 큐 (Redis/RabbitMQ)\n3. 푸시 전송 서비스 (FCM/APNs)", timestamp: "10:15" },
      { type: "search", id: 3, sender: "ai", query: "push notification architecture best practices", status: "done", resultCount: 15, timestamp: "10:16" },
      {
        type: "table", id: 4, sender: "ai", title: "알림 유형별 설계",
        headers: ["알림 유형", "트리거", "우선순위", "전송 채널"],
        rows: [
          ["주문 상태", "상태 변경 이벤트", "높음", "푸시 + 이메일"],
          ["프로모션", "스케줄러", "낮음", "푸시"],
          ["시스템 공지", "관리자 입력", "중간", "인앱 + 이메일"],
        ],
        timestamp: "10:16",
      },
    ],
  },
  {
    id: 3,
    title: "버그 리포트 정리",
    preview: "이번 주 버그 리포트 요약해줘",
    date: "3일 전",
    messages: [
      { type: "text", id: 1, sender: "user", content: "이번 주 버그 리포트를 요약해줘", timestamp: "09:00" },
      { type: "text", id: 2, sender: "ai", content: "이번 주 총 7건의 버그가 보고되었습니다. 심각도별로 정리했습니다.", timestamp: "09:01" },
      {
        type: "table", id: 3, sender: "ai", title: "이번 주 버그 요약",
        headers: ["심각도", "건수", "해결", "미해결"],
        rows: [
          ["Critical", "1", "1", "0"],
          ["Major", "3", "2", "1"],
          ["Minor", "3", "1", "2"],
        ],
        timestamp: "09:01",
      },
    ],
  },
];

// =============================================
// 컴포넌트들 (Ch1, Ch2: 분리 + Props)
// =============================================

// 대화 목록 항목
function ConversationItem({
  conversation,
  isActive,
  onClick,
}: {
  conversation: Conversation;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      style={{
        padding: "12px 16px",
        cursor: "pointer",
        background: isActive ? "#eff6ff" : "transparent",
        borderLeft: isActive ? "3px solid #3b82f6" : "3px solid transparent",
        borderBottom: "1px solid #f1f5f9",
        transition: "all 0.15s",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
        <strong style={{ fontSize: 14, color: isActive ? "#1e40af" : "#1e293b" }}>
          {conversation.title}
        </strong>
        <span style={{ fontSize: 11, color: "#94a3b8" }}>{conversation.date}</span>
      </div>
      <p style={{ fontSize: 12, color: "#64748b", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
        {conversation.preview}
      </p>
    </div>
  );
}

// 메시지 버블 (Ch9: 유니온 타입으로 분기)
function MessageBubble({ message }: { message: Message }) {
  const isUser = message.sender === "user";

  switch (message.type) {
    case "text":
      return (
        <div style={{ display: "flex", justifyContent: isUser ? "flex-end" : "flex-start", marginBottom: 12 }}>
          <div
            style={{
              maxWidth: "75%",
              padding: "10px 14px",
              borderRadius: isUser ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
              background: isUser ? "#3b82f6" : "#f1f5f9",
              color: isUser ? "#fff" : "#1e293b",
              fontSize: 14,
              lineHeight: 1.5,
              whiteSpace: "pre-wrap",
            }}
          >
            {!isUser && (
              <div style={{ fontSize: 11, color: "#64748b", marginBottom: 4 }}>AI 어시스턴트</div>
            )}
            {message.content}
            <div style={{ fontSize: 10, color: isUser ? "rgba(255,255,255,0.6)" : "#94a3b8", marginTop: 4, textAlign: "right" }}>
              {message.timestamp}
            </div>
          </div>
        </div>
      );

    case "search":
      return (
        <div style={{ marginBottom: 12, maxWidth: "75%" }}>
          <div
            style={{
              padding: 12,
              background: "#eff6ff",
              border: "1px solid #bfdbfe",
              borderRadius: 12,
              fontSize: 13,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
              <span>{message.status === "searching" ? "⏳" : "🔍"}</span>
              <strong>검색 {message.status === "searching" ? "중..." : "완료"}</strong>
            </div>
            <div style={{ color: "#1e40af" }}>"{message.query}"</div>
            {message.resultCount !== undefined && (
              <div style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>
                {message.resultCount}개 결과
              </div>
            )}
          </div>
        </div>
      );

    case "table":
      return (
        <div style={{ marginBottom: 12, maxWidth: "85%" }}>
          <div
            style={{
              background: "#fff",
              border: "1px solid #e2e8f0",
              borderRadius: 12,
              overflow: "hidden",
            }}
          >
            <div style={{ padding: "8px 14px", background: "#f8fafc", fontWeight: 600, fontSize: 13, borderBottom: "1px solid #e2e8f0" }}>
              📊 {message.title}
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr>
                    {message.headers.map((h, i) => (
                      <th key={i} style={{ padding: "8px 12px", background: "#f1f5f9", textAlign: "left", fontWeight: 600, whiteSpace: "nowrap" }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {message.rows.map((row, i) => (
                    <tr key={i}>
                      {row.map((cell, j) => (
                        <td key={j} style={{ padding: "6px 12px", borderBottom: "1px solid #f1f5f9", whiteSpace: "nowrap" }}>
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ fontSize: 10, color: "#94a3b8", padding: "4px 14px 6px", textAlign: "right" }}>
              {message.timestamp}
            </div>
          </div>
        </div>
      );
  }
}

// =============================================
// 메인 채팅 UI
// =============================================

function ChatUI() {
  const [conversations] = useState<Conversation[]>(DUMMY_CONVERSATIONS);
  const [activeConvId, setActiveConvId] = useState(1);
  const [inputValue, setInputValue] = useState("");
  const [localMessages, setLocalMessages] = useState<Record<number, Message[]>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 현재 대화의 메시지 (원본 + 로컬 추가분)
  const activeConv = conversations.find((c) => c.id === activeConvId);
  const allMessages = [
    ...(activeConv?.messages || []),
    ...(localMessages[activeConvId] || []),
  ];

  // 통계 데이터
  const totalMessages = allMessages.length;
  const userMessages = allMessages.filter((m) => m.sender === "user").length;
  const tableCount = allMessages.filter((m) => m.type === "table").length;

  // 메시지 추가 시 스크롤 (Ch5: useEffect)
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [allMessages.length]);

  // 메시지 전송 (Ch4: 이벤트 핸들링)
  const handleSend = () => {
    if (!inputValue.trim()) return;

    const newMsg: TextMessage = {
      type: "text",
      id: Date.now(),
      sender: "user",
      content: inputValue,
      timestamp: new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" }),
    };

    setLocalMessages((prev) => ({
      ...prev,
      [activeConvId]: [...(prev[activeConvId] || []), newMsg],
    }));
    setInputValue("");

    // 간단한 AI 자동 응답 (1초 후)
    setTimeout(() => {
      const aiReply: TextMessage = {
        type: "text",
        id: Date.now() + 1,
        sender: "ai",
        content: `"${inputValue}" 에 대해 분석 중입니다. (이것은 더미 응답입니다)`,
        timestamp: new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" }),
      };
      setLocalMessages((prev) => ({
        ...prev,
        [activeConvId]: [...(prev[activeConvId] || []), aiReply],
      }));
    }, 1000);
  };

  return (
    <div
      style={{
        display: "flex",
        height: 520,
        border: "1px solid #e2e8f0",
        borderRadius: 12,
        overflow: "hidden",
        background: "#fff",
      }}
    >
      {/* ===== 좌측: 대화 이력 목록 ===== */}
      <div
        style={{
          width: 240,
          borderRight: "1px solid #e2e8f0",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={{ padding: "12px 16px", borderBottom: "1px solid #e2e8f0", fontWeight: 600, fontSize: 15 }}>
          대화 목록
        </div>
        <div style={{ flex: 1, overflowY: "auto" }}>
          {conversations.map((conv) => (
            <ConversationItem
              key={conv.id}
              conversation={conv}
              isActive={conv.id === activeConvId}
              onClick={() => setActiveConvId(conv.id)}
            />
          ))}
        </div>
      </div>

      {/* ===== 중앙: 메시지 영역 ===== */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* 헤더 */}
        <div style={{ padding: "12px 20px", borderBottom: "1px solid #e2e8f0", fontWeight: 600 }}>
          {activeConv?.title || "대화를 선택하세요"}
        </div>

        {/* 메시지 목록 */}
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px" }}>
          {allMessages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* 입력 영역 */}
        <div style={{ padding: 12, borderTop: "1px solid #e2e8f0", display: "flex", gap: 8 }}>
          <input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="메시지를 입력하세요..."
            style={{ flex: 1 }}
          />
          <button onClick={handleSend}>전송</button>
        </div>
      </div>

      {/* ===== 우측: 상태 패널 ===== */}
      <div
        style={{
          width: 180,
          borderLeft: "1px solid #e2e8f0",
          padding: 16,
          background: "#f8fafc",
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
        <h4 style={{ fontSize: 13, color: "#64748b", marginBottom: 0 }}>대화 정보</h4>

        <div style={{ fontSize: 13 }}>
          <div style={{ color: "#64748b", marginBottom: 2 }}>전체 메시지</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: "#1e293b" }}>{totalMessages}</div>
        </div>
        <div style={{ fontSize: 13 }}>
          <div style={{ color: "#64748b", marginBottom: 2 }}>내 메시지</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: "#3b82f6" }}>{userMessages}</div>
        </div>
        <div style={{ fontSize: 13 }}>
          <div style={{ color: "#64748b", marginBottom: 2 }}>테이블 수</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: "#10b981" }}>{tableCount}</div>
        </div>

        <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: 12 }}>
          <h4 style={{ fontSize: 13, color: "#64748b", marginBottom: 8 }}>메시지 유형</h4>
          {(["text", "search", "table"] as const).map((type) => {
            const count = allMessages.filter((m) => m.type === type).length;
            const label = { text: "텍스트", search: "검색", table: "테이블" }[type];
            const color = { text: "#64748b", search: "#3b82f6", table: "#10b981" }[type];
            return (
              <div key={type} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, padding: "3px 0" }}>
                <span style={{ color }}>{label}</span>
                <strong>{count}</strong>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function Chapter13() {
  return (
    <div>
      <ChapterHeader
        title="13. 종합 미니 프로젝트 - 채팅 UI"
        learningPoints={[
          "지금까지 배운 모든 개념을 하나의 프로젝트에 조합하기",
          "3단 레이아웃: 대화 목록 + 메시지 영역 + 상태 패널",
          "유니온 타입으로 메시지 종류별 다른 컴포넌트 렌더링",
          "더미 데이터로 동작하는 인터랙티브 채팅 UI 만들기",
        ]}
      />

      <div className="section">
        <h2>사용된 개념 정리</h2>
        <div className="code-comment">
          💡 이 미니 프로젝트에서 사용된 챕터별 개념:
          <br />
          Ch1 컴포넌트 분리: ConversationItem, MessageBubble 등 독립 컴포넌트
          <br />
          Ch2 Props: conversation, message, isActive 등 데이터 전달
          <br />
          Ch3 useState: 대화 선택, 입력값, 로컬 메시지 관리
          <br />
          Ch4 이벤트: 클릭(대화 선택), Enter(전송), onChange(입력)
          <br />
          Ch5 useEffect: 메시지 추가 시 자동 스크롤
          <br />
          Ch6 조건부 렌더링 & 리스트: 메시지 타입별 분기, map으로 목록 렌더링
          <br />
          Ch9 TypeScript: Discriminated Union으로 메시지 3종류 타입 안전하게 관리
          <br />
          Ch12 CSS: Flexbox 3단 레이아웃
        </div>
      </div>

      <div className="section">
        <h2>AI 채팅 UI</h2>
        <p className="mb-12" style={{ fontSize: 14, color: "#64748b" }}>
          왼쪽에서 대화를 선택하고, 중앙에서 메시지를 확인하세요. 직접 메시지를 보내면 더미 AI 응답이 돌아옵니다.
        </p>
        <ChatUI />
      </div>

      <div className="section">
        <h2>🔧 직접 해보기</h2>
        <ul style={{ marginLeft: 20 }}>
          <li>"새 대화" 버튼을 추가해서 대화를 새로 만들 수 있게 해보세요</li>
          <li>AI 응답에 SearchMessage나 TableMessage 타입도 추가해보세요</li>
          <li>대화 삭제 기능을 추가해보세요</li>
          <li>메시지에 "복사" 버튼을 추가해보세요</li>
          <li>실제 API(jsonplaceholder)를 호출해서 응답을 TableMessage로 표시해보세요</li>
        </ul>
      </div>
    </div>
  );
}

export default Chapter13;
