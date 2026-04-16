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
  { path: "/chapter9", label: "9. TypeScript 기초", section: "실전" },
  { path: "/chapter10", label: "10. 전역 상태 관리" },
  { path: "/chapter11", label: "11. 비동기 API 패턴" },
  { path: "/chapter12", label: "12. CSS 레이아웃 실전" },
  { path: "/chapter13", label: "13. 종합 미니 프로젝트" },
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
        {chapters.map((ch, i) => (
          <div key={ch.path}>
            {"section" in ch && ch.section && (
              <div
                style={{
                  padding: "12px 20px 4px",
                  fontSize: 11,
                  color: "#64748b",
                  textTransform: "uppercase",
                  letterSpacing: 1,
                  borderTop: i > 0 ? "1px solid #334155" : undefined,
                  marginTop: i > 0 ? 8 : 0,
                }}
              >
                {ch.section}
              </div>
            )}
            <NavLink to={ch.path}>{ch.label}</NavLink>
          </div>
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
