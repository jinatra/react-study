import { useState, useEffect } from "react";
import ChapterHeader from "../../components/ChapterHeader";

/**
 * Chapter 7: API 연동
 *
 * [백엔드 비유]
 * 프론트에서 API를 호출하는 것은 백엔드에서 외부 서비스 API를 호출하는 것과 같습니다.
 * Python의 requests.get() / C#의 HttpClient.GetAsync()와 동일한 패턴입니다.
 *
 * React에서는 useEffect + fetch 조합으로 API를 호출하고,
 * useState로 로딩/에러/데이터 상태를 관리합니다.
 *
 * 사용 API: JSONPlaceholder (https://jsonplaceholder.typicode.com)
 */

// API 응답 타입 정의 - C#의 DTO(Data Transfer Object)와 같은 역할
interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  company: { name: string };
}

interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

// ✅ 1. 기본 API 호출 - 사용자 목록 가져오기
function UserList() {
  // API 연동의 3가지 상태: 데이터, 로딩, 에러
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // fetch로 API 호출 (Python의 requests.get과 같음)
    fetch("https://jsonplaceholder.typicode.com/users")
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json(); // JSON 파싱
      })
      .then((data: User[]) => {
        setUsers(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []); // 마운트 시 1번만 호출

  // 로딩 상태
  if (loading) return <p className="loading-spinner">⏳ 사용자 목록을 불러오는 중...</p>;
  // 에러 상태
  if (error) return <p className="error-msg">❌ 에러: {error}</p>;

  return (
    <div>
      {users.slice(0, 5).map((user) => (
        <div key={user.id} className="user-card">
          <div>
            <strong>{user.name}</strong>
            <p style={{ fontSize: 13, color: "#64748b" }}>{user.email}</p>
            <p style={{ fontSize: 13, color: "#64748b" }}>📞 {user.phone}</p>
            <p style={{ fontSize: 13, color: "#64748b" }}>🏢 {user.company.name}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

// ✅ 2. 검색 + API - 게시글 검색
function PostSearch() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(false);

  // 게시글 전체 로드
  const fetchPosts = () => {
    setLoading(true);
    fetch("https://jsonplaceholder.typicode.com/posts")
      .then((res) => res.json())
      .then((data: Post[]) => {
        setPosts(data);
        setLoading(false);
        setFetched(true);
      })
      .catch(() => setLoading(false));
  };

  // 검색 필터 (프론트에서 필터링 - 소규모 데이터일 때 유용)
  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.body.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="flex-gap mb-12">
        <button onClick={fetchPosts} disabled={loading}>
          {loading ? "로딩 중..." : fetched ? "다시 불러오기" : "게시글 불러오기"}
        </button>
        {fetched && (
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="게시글 검색..."
            style={{ flex: 1 }}
          />
        )}
      </div>

      {fetched && (
        <p className="mb-8" style={{ fontSize: 13, color: "#64748b" }}>
          총 {posts.length}개 중 {filteredPosts.length}개 표시
        </p>
      )}

      {filteredPosts.slice(0, 10).map((post) => (
        <div key={post.id} className="result-box" style={{ marginBottom: 8 }}>
          <strong>
            [{post.id}] {post.title}
          </strong>
          <p style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>
            {post.body.slice(0, 100)}...
          </p>
        </div>
      ))}
    </div>
  );
}

// ✅ 3. async/await 패턴 + POST 요청
function CreatePost() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [result, setResult] = useState("");
  const [sending, setSending] = useState(false);

  // async/await 패턴 - Python의 async def와 비슷
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setSending(true);
    try {
      // POST 요청 - Python의 requests.post()와 같음
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/posts",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, body, userId: 1 }),
        }
      );

      const data = await response.json();
      setResult(`✅ 생성 완료! (id: ${data.id}, title: "${data.title}")`);
      setTitle("");
      setBody("");
    } catch {
      setResult("❌ 요청 실패");
    } finally {
      setSending(false);
    }
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: 8, maxWidth: 400 }}
      >
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="게시글 제목"
        />
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="내용"
          rows={3}
        />
        <button type="submit" disabled={sending}>
          {sending ? "전송 중..." : "POST 요청 보내기"}
        </button>
      </form>
      {result && <div className="result-box mt-12">{result}</div>}
    </div>
  );
}

function Chapter7() {
  return (
    <div>
      <ChapterHeader
        title="7. API 연동"
        learningPoints={[
          "fetch로 GET 요청하여 데이터 불러오기",
          "로딩/에러/데이터 상태 관리 패턴",
          "async/await와 POST 요청 보내기",
        ]}
      />

      <div className="section">
        <h2>GET 요청 - 사용자 목록</h2>
        <div className="code-comment">
          💡 useEffect + fetch 조합이 React API 연동의 기본 패턴입니다.
          <br />
          반드시 로딩/에러/데이터 3가지 상태를 관리하세요.
          <br />
          Python: response = requests.get(url) → React: fetch(url).then(res =&gt; res.json())
        </div>
        <UserList />
      </div>

      <div className="section">
        <h2>검색 + 필터링</h2>
        <div className="code-comment">
          💡 버튼 클릭으로 API를 호출하고, 받아온 데이터를 프론트에서 필터링하는 패턴입니다.
          <br />
          소규모 데이터는 프론트 필터링, 대규모 데이터는 서버 사이드 검색 API를 사용합니다.
        </div>
        <PostSearch />
      </div>

      <div className="section">
        <h2>POST 요청 보내기</h2>
        <div className="code-comment">
          💡 async/await은 Python의 async def와 같습니다.
          <br />
          fetch의 두 번째 인자로 method, headers, body를 설정합니다.
          <br />
          (JSONPlaceholder는 실제로 저장하진 않지만, 성공 응답을 반환합니다)
        </div>
        <CreatePost />
      </div>

      <div className="section">
        <h2>🔧 직접 해보기</h2>
        <ul style={{ marginLeft: 20 }}>
          <li>사용자를 클릭하면 해당 사용자의 게시글을 보여주는 기능을 만들어보세요</li>
          <li>로딩 상태에 스피너 애니메이션을 추가해보세요</li>
          <li>
            에러 발생 시 "다시 시도" 버튼을 만들어보세요
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Chapter7;
