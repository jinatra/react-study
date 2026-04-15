import { NavLink, Outlet } from "react-router-dom";

/**
 * Layout - 사이드바 네비게이션 + 메인 콘텐츠 영역
 *
 * [백엔드 비유] ASP.NET의 _Layout.cshtml이나 Django의 base.html처럼
 * 공통 레이아웃을 정의하고, 각 페이지(챕터)가 안에 렌더링됩니다.
 *
 * Outlet: React Router가 현재 URL에 맞는 자식 컴포넌트를 여기에 끼워 넣습니다.
 * NavLink: 현재 URL과 매칭되면 자동으로 active 클래스를 붙여줍니다.
 */

const chapters = [
  { path: "/chapter1", label: "1. 컴포넌트 기초" },
  { path: "/chapter2", label: "2. Props" },
  { path: "/chapter3", label: "3. State (useState)" },
  { path: "/chapter4", label: "4. 이벤트 핸들링" },
  { path: "/chapter5", label: "5. useEffect" },
  { path: "/chapter6", label: "6. 조건부 렌더링 & 리스트" },
  { path: "/chapter7", label: "7. API 연동" },
  { path: "/chapter8", label: "8. 라우팅" },
];

function Layout() {
  return (
    <div className="layout">
      {/* 사이드바 네비게이션 */}
      <nav className="sidebar">
        <h2>React Study</h2>
        <NavLink to="/" end>
          🏠 홈
        </NavLink>
        {chapters.map((ch) => (
          <NavLink key={ch.path} to={ch.path}>
            {ch.label}
          </NavLink>
        ))}
      </nav>

      {/* 메인 콘텐츠 - 현재 라우트에 해당하는 컴포넌트가 여기 렌더링됨 */}
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
