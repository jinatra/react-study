import { useState, useEffect, useCallback } from "react";
import ChapterHeader from "../../components/ChapterHeader";

/**
 * Chapter 11: 비동기 API 통신 패턴
 *
 * [백엔드 비유]
 * 프론트의 API 호출 패턴 = 백엔드에서 외부 서비스를 호출할 때와 동일한 고민
 *
 * Python: try/except + loading flag + response data
 * C#: try/catch + Task<T> + loading state
 * React: useState로 loading/error/data 관리 + useEffect로 호출
 *
 * 이 챕터에서는 이 패턴을 커스텀 훅으로 추상화하는 법을 배웁니다.
 * C#에서 HttpClient를 래핑하는 서비스 클래스를 만드는 것과 같은 개념입니다.
 */

// =============================================
// ✅ 1. 커스텀 훅: useFetch
// =============================================

// API 호출 상태의 3가지: loading, error, data
// C#의 Task<T> 결과를 관리하는 wrapper와 비슷

interface UseFetchResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

// 커스텀 훅: use로 시작하는 함수는 React 훅
// C#의 HttpClient 래퍼 서비스처럼, 공통 API 호출 로직을 캡슐화
function useFetch<T>(url: string): UseFetchResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      const json = await response.json();
      setData(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : "알 수 없는 에러");
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

// =============================================
// ✅ 2. 커스텀 훅 사용 예제 - 사용자 목록
// =============================================

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  website: string;
  company: { name: string };
}

function UserListWithHook() {
  // 커스텀 훅 사용 - 한 줄로 API 호출 + 상태 관리 해결!
  const { data: users, loading, error, refetch } = useFetch<User[]>(
    "https://jsonplaceholder.typicode.com/users"
  );

  // 로딩 상태 표시
  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: 40 }}>
        <div
          style={{
            width: 40,
            height: 40,
            border: "4px solid #e2e8f0",
            borderTop: "4px solid #3b82f6",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
            margin: "0 auto 12px",
          }}
        />
        <p className="loading-spinner">사용자 목록을 불러오는 중...</p>
      </div>
    );
  }

  // 에러 상태 표시
  if (error) {
    return (
      <div
        style={{
          padding: 20,
          background: "#fef2f2",
          border: "1px solid #fecaca",
          borderRadius: 8,
          textAlign: "center",
        }}
      >
        <p className="error-msg">❌ {error}</p>
        <button onClick={refetch} style={{ marginTop: 12 }}>
          다시 시도
        </button>
      </div>
    );
  }

  // 성공 상태 - 데이터 표시
  return (
    <div>
      <div className="flex-gap mb-12">
        <button onClick={refetch}>🔄 새로고침</button>
        <span style={{ fontSize: 13, color: "#64748b" }}>
          {users?.length}명의 사용자
        </span>
      </div>
      {users?.map((user) => (
        <div key={user.id} className="user-card">
          <div style={{ flex: 1 }}>
            <strong>{user.name}</strong>
            <p style={{ fontSize: 13, color: "#64748b" }}>
              📧 {user.email} · 📞 {user.phone}
            </p>
            <p style={{ fontSize: 13, color: "#64748b" }}>
              🏢 {user.company.name} · 🌐 {user.website}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

// =============================================
// ✅ 3. 목록 → 상세 연결 패턴
// =============================================

interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

interface Comment {
  postId: number;
  id: number;
  name: string;
  email: string;
  body: string;
}

function PostListWithDetail() {
  const { data: posts, loading, error } = useFetch<Post[]>(
    "https://jsonplaceholder.typicode.com/posts"
  );

  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);

  return (
    <div style={{ display: "flex", gap: 16 }}>
      {/* 왼쪽: 게시글 목록 */}
      <div style={{ width: 280, maxHeight: 400, overflowY: "auto" }}>
        {loading && <p className="loading-spinner">로딩 중...</p>}
        {error && <p className="error-msg">에러: {error}</p>}
        {posts?.slice(0, 15).map((post) => (
          <div
            key={post.id}
            onClick={() => setSelectedPostId(post.id)}
            style={{
              padding: "10px 12px",
              marginBottom: 4,
              borderRadius: 6,
              cursor: "pointer",
              background: selectedPostId === post.id ? "#eff6ff" : "#f8fafc",
              borderLeft: selectedPostId === post.id ? "3px solid #3b82f6" : "3px solid transparent",
              fontSize: 13,
              transition: "all 0.2s",
            }}
          >
            <strong>[{post.id}]</strong> {post.title.slice(0, 30)}...
          </div>
        ))}
      </div>

      {/* 오른쪽: 선택된 게시글 상세 + 댓글 */}
      <div style={{ flex: 1 }}>
        {selectedPostId ? (
          <PostDetail postId={selectedPostId} />
        ) : (
          <div
            className="result-box"
            style={{ textAlign: "center", padding: 40, color: "#94a3b8" }}
          >
            ← 왼쪽에서 게시글을 선택하세요
          </div>
        )}
      </div>
    </div>
  );
}

// 게시글 상세 + 댓글 (선택할 때마다 API 호출)
function PostDetail({ postId }: { postId: number }) {
  // postId가 바뀌면 자동으로 refetch (URL이 바뀌니까)
  const { data: post, loading: postLoading } = useFetch<Post>(
    `https://jsonplaceholder.typicode.com/posts/${postId}`
  );

  const { data: comments, loading: commentsLoading } = useFetch<Comment[]>(
    `https://jsonplaceholder.typicode.com/posts/${postId}/comments`
  );

  if (postLoading) return <p className="loading-spinner">게시글 로딩 중...</p>;
  if (!post) return null;

  return (
    <div>
      <div
        style={{
          background: "#f8fafc",
          padding: 16,
          borderRadius: 8,
          marginBottom: 12,
        }}
      >
        <h3 style={{ fontSize: 16, marginBottom: 8 }}>{post.title}</h3>
        <p style={{ fontSize: 14, color: "#475569" }}>{post.body}</p>
      </div>

      <h4 style={{ fontSize: 14, marginBottom: 8, color: "#64748b" }}>
        💬 댓글 {commentsLoading ? "(로딩 중...)" : `(${comments?.length || 0}개)`}
      </h4>
      {comments?.slice(0, 3).map((comment) => (
        <div
          key={comment.id}
          style={{
            padding: 10,
            background: "#fff",
            border: "1px solid #e2e8f0",
            borderRadius: 6,
            marginBottom: 6,
            fontSize: 13,
          }}
        >
          <strong>{comment.name}</strong>
          <span style={{ color: "#94a3b8", marginLeft: 8 }}>{comment.email}</span>
          <p style={{ color: "#475569", marginTop: 4 }}>{comment.body}</p>
        </div>
      ))}
    </div>
  );
}

function Chapter11() {
  return (
    <div>
      <ChapterHeader
        title="11. 비동기 API 통신 패턴"
        learningPoints={[
          "커스텀 훅(useFetch)으로 API 호출 로직 재사용하기",
          "loading/error/success 3가지 상태 관리 패턴",
          "목록 → 상세 보기 연결 패턴",
        ]}
      />

      <div className="section">
        <h2>커스텀 훅: useFetch</h2>
        <div className="code-comment">
          💡 커스텀 훅 = 로직을 재사용하는 함수 (C#의 서비스 클래스와 같은 역할)
          <br />
          use로 시작하는 함수는 React에서 훅으로 인식합니다.
          <br />
          useFetch 하나로 loading/error/data/refetch를 모두 관리할 수 있습니다.
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <UserListWithHook />
      </div>

      <div className="section">
        <h2>목록 → 상세 연결</h2>
        <div className="code-comment">
          💡 목록에서 항목을 선택하면 → selectedId가 바뀌고 → 상세 컴포넌트가 해당 데이터를 fetch
          <br />
          useFetch의 URL에 postId를 넣으면, postId가 바뀔 때마다 자동으로 새 데이터를 불러옵니다.
        </div>
        <PostListWithDetail />
      </div>

      <div className="section">
        <h2>🔧 직접 해보기</h2>
        <ul style={{ marginLeft: 20 }}>
          <li>useFetch에 캐싱 기능을 추가해보세요 (같은 URL은 다시 호출하지 않기)</li>
          <li>로딩 스피너 대신 스켈레톤 UI를 만들어보세요</li>
          <li>에러 발생 시 자동 재시도(최대 3회) 로직을 넣어보세요</li>
        </ul>
      </div>
    </div>
  );
}

export default Chapter11;
