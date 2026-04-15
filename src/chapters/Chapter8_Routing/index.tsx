import { useState } from "react";
import {
  Routes,
  Route,
  Link,
  useParams,
  useNavigate,
  useSearchParams,
  Outlet,
} from "react-router-dom";
import ChapterHeader from "../../components/ChapterHeader";

/**
 * Chapter 8: 라우팅 (React Router)
 *
 * [백엔드 비유]
 * React Router = 프론트엔드의 URL 라우팅
 *
 * 백엔드에서:
 *   Python Flask: @app.route("/users/<id>")
 *   C# ASP.NET: [Route("users/{id}")]
 *
 * 프론트에서:
 *   React Router: <Route path="/users/:id" element={<UserDetail />} />
 *
 * 같은 개념이지만, 페이지 새로고침 없이 URL만 바뀝니다 (SPA).
 */

// ✅ 중첩 라우트의 레이아웃
function RoutingLayout() {
  return (
    <div>
      {/* 이 챕터 내부의 네비게이션 */}
      <nav
        className="flex-gap mb-12"
        style={{ padding: 12, background: "#f1f5f9", borderRadius: 8 }}
      >
        <Link to="/chapter8" style={{ color: "#3b82f6" }}>
          홈
        </Link>
        <Link to="/chapter8/about" style={{ color: "#3b82f6" }}>
          소개
        </Link>
        <Link to="/chapter8/users" style={{ color: "#3b82f6" }}>
          사용자 목록
        </Link>
        <Link to="/chapter8/search?q=react&page=1" style={{ color: "#3b82f6" }}>
          검색 (쿼리 파라미터)
        </Link>
      </nav>

      {/* Outlet: 자식 라우트가 여기에 렌더링됨 (ASP.NET의 @RenderBody()와 같음) */}
      <Outlet />
    </div>
  );
}

// 라우팅 홈
function RoutingHome() {
  return (
    <div className="result-box">
      <h3>🏠 라우팅 챕터 홈</h3>
      <p>위 네비게이션 링크를 클릭하여 라우팅을 체험해보세요!</p>
      <p style={{ fontSize: 13, color: "#64748b", marginTop: 8 }}>
        URL이 바뀌지만 페이지가 새로고침되지 않는 것을 확인하세요 (SPA).
      </p>
    </div>
  );
}

// 소개 페이지
function About() {
  return (
    <div className="result-box">
      <h3>ℹ️ 소개 페이지</h3>
      <p>이 페이지는 /chapter8/about 경로에 매칭됩니다.</p>
      <p>Link 컴포넌트를 사용하면 페이지 새로고침 없이 이동합니다.</p>
    </div>
  );
}

// ✅ URL 파라미터 사용 - /chapter8/users/:id
function UserDetail() {
  // useParams: URL의 :id 부분을 가져옴 (Flask의 request.args, C#의 RouteData와 같음)
  const { id } = useParams<{ id: string }>();

  const users: Record<string, { name: string; role: string }> = {
    "1": { name: "김개발", role: "백엔드" },
    "2": { name: "이프론트", role: "프론트엔드" },
    "3": { name: "박풀스택", role: "풀스택" },
  };

  const user = users[id || ""];

  if (!user) {
    return (
      <div className="result-box" style={{ borderLeft: "4px solid #ef4444" }}>
        ❌ 사용자를 찾을 수 없습니다 (id: {id})
      </div>
    );
  }

  return (
    <div className="result-box">
      <h3>👤 {user.name}</h3>
      <p>역할: {user.role}</p>
      <p style={{ fontSize: 13, color: "#64748b" }}>
        URL 파라미터 id = {id} (useParams로 가져옴)
      </p>
    </div>
  );
}

// 사용자 목록 + 네비게이션
function UserListPage() {
  // useNavigate: 코드에서 페이지 이동 (Python의 redirect()와 같음)
  const navigate = useNavigate();

  const users = [
    { id: 1, name: "김개발" },
    { id: 2, name: "이프론트" },
    { id: 3, name: "박풀스택" },
  ];

  return (
    <div>
      <div className="code-comment">
        💡 Link: 클릭으로 이동 / useNavigate: 코드로 이동 (예: 폼 제출 후 리다이렉트)
      </div>
      {users.map((user) => (
        <div
          key={user.id}
          className="result-box flex-gap"
          style={{ marginBottom: 8, justifyContent: "space-between" }}
        >
          <span>{user.name}</span>
          <div className="flex-gap">
            {/* Link로 이동 */}
            <Link to={`/chapter8/users/${user.id}`}>
              <button>Link로 이동</button>
            </Link>
            {/* navigate로 이동 */}
            <button
              className="secondary"
              onClick={() => navigate(`/chapter8/users/${user.id}`)}
            >
              navigate로 이동
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

// ✅ 쿼리 파라미터 - /chapter8/search?q=react&page=1
function SearchPage() {
  // useSearchParams: URL의 ?key=value를 읽고 쓰기
  // 백엔드의 request.query_params (FastAPI) 또는 Request.Query (ASP.NET)와 같음
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const page = searchParams.get("page") || "1";

  const [inputValue, setInputValue] = useState(query);

  const handleSearch = () => {
    setSearchParams({ q: inputValue, page: "1" });
  };

  return (
    <div>
      <div className="flex-gap mb-12">
        <input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder="검색어 입력"
        />
        <button onClick={handleSearch}>검색</button>
      </div>
      <div className="result-box">
        <p>현재 검색어 (q): <strong>{query || "(없음)"}</strong></p>
        <p>현재 페이지 (page): <strong>{page}</strong></p>
        <p style={{ fontSize: 13, color: "#64748b", marginTop: 8 }}>
          URL을 확인해보세요: ?q={query}&page={page}
        </p>
      </div>
      <div className="flex-gap mt-12">
        <button
          className="secondary"
          onClick={() =>
            setSearchParams({ q: query, page: String(Math.max(1, Number(page) - 1)) })
          }
        >
          이전 페이지
        </button>
        <button
          className="secondary"
          onClick={() =>
            setSearchParams({ q: query, page: String(Number(page) + 1) })
          }
        >
          다음 페이지
        </button>
      </div>
    </div>
  );
}

// 챕터 메인 컴포넌트 - 중첩 라우트를 포함
function Chapter8() {
  return (
    <div>
      <ChapterHeader
        title="8. 라우팅 (React Router)"
        learningPoints={[
          "Link로 페이지 이동하기 (SPA 방식)",
          "URL 파라미터(:id)와 useParams",
          "쿼리 파라미터(?q=...)와 useSearchParams",
          "useNavigate로 코드에서 페이지 이동하기",
        ]}
      />

      <div className="section">
        <h2>라우팅 체험</h2>
        <div className="code-comment">
          💡 아래 링크를 클릭하면 URL이 바뀌면서 다른 컴포넌트가 렌더링됩니다.
          <br />
          Flask의 @app.route(), ASP.NET의 [Route()]와 같은 개념이지만, 서버 요청 없이 클라이언트에서 처리됩니다.
        </div>

        {/* 중첩 라우트 */}
        <Routes>
          <Route element={<RoutingLayout />}>
            <Route index element={<RoutingHome />} />
            <Route path="about" element={<About />} />
            <Route path="users" element={<UserListPage />} />
            <Route path="users/:id" element={<UserDetail />} />
            <Route path="search" element={<SearchPage />} />
          </Route>
        </Routes>
      </div>

      <div className="section">
        <h2>🔧 직접 해보기</h2>
        <ul style={{ marginLeft: 20 }}>
          <li>새로운 페이지(예: /chapter8/settings)를 추가해보세요</li>
          <li>존재하지 않는 URL에 대한 404 페이지를 만들어보세요</li>
          <li>사용자 상세에서 "뒤로가기" 버튼(navigate(-1))을 추가해보세요</li>
        </ul>
      </div>
    </div>
  );
}

export default Chapter8;
