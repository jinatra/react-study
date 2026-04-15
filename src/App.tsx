import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./chapters/Home";
import Chapter1 from "./chapters/Chapter1_Components";
import Chapter2 from "./chapters/Chapter2_Props";
import Chapter3 from "./chapters/Chapter3_State";
import Chapter4 from "./chapters/Chapter4_Events";
import Chapter5 from "./chapters/Chapter5_UseEffect";
import Chapter6 from "./chapters/Chapter6_ConditionalList";
import Chapter7 from "./chapters/Chapter7_API";
import Chapter8 from "./chapters/Chapter8_Routing";

/**
 * App - 최상위 라우트 정의
 *
 * [백엔드 비유]
 * Python Flask의 url_for, C# ASP.NET의 MapControllerRoute처럼
 * URL 경로와 컴포넌트(페이지)를 매핑합니다.
 *
 * Layout 안에 Outlet이 있어서, 현재 URL에 맞는 챕터가 거기에 렌더링됩니다.
 */
function App() {
  return (
    <Routes>
      {/* Layout이 공통 껍데기(사이드바), 자식 Route가 각 페이지 */}
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/chapter1" element={<Chapter1 />} />
        <Route path="/chapter2" element={<Chapter2 />} />
        <Route path="/chapter3" element={<Chapter3 />} />
        <Route path="/chapter4" element={<Chapter4 />} />
        <Route path="/chapter5" element={<Chapter5 />} />
        <Route path="/chapter6" element={<Chapter6 />} />
        <Route path="/chapter7" element={<Chapter7 />} />
        {/* Chapter8은 내부에 자체 중첩 라우트가 있으므로 *로 매칭 */}
        <Route path="/chapter8/*" element={<Chapter8 />} />
      </Route>
    </Routes>
  );
}

export default App;
