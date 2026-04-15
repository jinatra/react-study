import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App";

/**
 * 엔트리 포인트 - 앱의 시작점
 *
 * BrowserRouter: React Router의 라우팅 기능을 앱 전체에서 사용 가능하게 함
 * StrictMode: 개발 모드에서 잠재적 문제를 감지해주는 도우미 (프로덕션에선 영향 없음)
 */
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
