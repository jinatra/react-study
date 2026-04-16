import { Link } from "react-router-dom";

/**
 * Home - 학습 프로젝트 홈 페이지
 * 전체 챕터 목록과 간단한 설명을 보여줍니다.
 */

const chapters = [
  { path: "/chapter1", title: "1. 컴포넌트 기초", desc: "함수형 컴포넌트, JSX, 컴포넌트 분리" },
  { path: "/chapter2", title: "2. Props", desc: "부모→자식 데이터 전달, 타입, children" },
  { path: "/chapter3", title: "3. State (useState)", desc: "상태 선언, 업데이트, 여러 state" },
  { path: "/chapter4", title: "4. 이벤트 핸들링", desc: "클릭, 입력, 폼 제출 처리" },
  { path: "/chapter5", title: "5. useEffect", desc: "마운트, 의존성 배열, 클린업" },
  { path: "/chapter6", title: "6. 조건부 렌더링 & 리스트", desc: "조건 분기, map, key" },
  { path: "/chapter7", title: "7. API 연동", desc: "fetch, 로딩/에러 처리, POST 요청" },
  { path: "/chapter8", title: "8. 라우팅", desc: "React Router, URL 파라미터, 네비게이션" },
  { path: "/chapter9", title: "9. TypeScript 기초", desc: "interface, type, 제네릭, 유니온 타입" },
  { path: "/chapter10", title: "10. 전역 상태 관리", desc: "Context API로 여러 컴포넌트 상태 공유" },
  { path: "/chapter11", title: "11. 비동기 API 패턴", desc: "커스텀 훅, loading/error 관리, 목록→상세 연결" },
  { path: "/chapter12", title: "12. CSS 레이아웃 실전", desc: "Flexbox 3단 레이아웃, 접힘 패널, 탭 UI" },
  { path: "/chapter13", title: "13. 종합 미니 프로젝트", desc: "채팅 UI - 모든 개념 조합" },
];

function Home() {
  return (
    <div className="home-page">
      <h1>React Study</h1>
      <p style={{ marginBottom: 24, color: "#64748b" }}>
        백엔드 개발자를 위한 React 핵심 개념 학습 프로젝트입니다.
        <br />
        각 챕터를 순서대로 진행하면서 직접 코드를 수정하고 결과를 확인해보세요.
      </p>

      <ul className="chapter-list">
        {chapters.map((ch) => (
          <li key={ch.path}>
            <Link to={ch.path}>{ch.title}</Link>
            <span style={{ color: "#64748b", marginLeft: 8, fontSize: 14 }}>
              — {ch.desc}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Home;
