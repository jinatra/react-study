import { useState, useEffect } from "react";
import ChapterHeader from "../../components/ChapterHeader";

/**
 * Chapter 5: useEffect
 *
 * [백엔드 비유]
 * useEffect = 컴포넌트의 "라이프사이클 훅"
 *
 * Python의 __init__이나 C#의 생성자처럼 초기화 시 실행하거나,
 * 특정 값이 변할 때 부수 효과(side effect)를 실행합니다.
 *
 * 주요 용도: API 호출, 타이머 설정, DOM 조작, 이벤트 리스너 등록
 */

// ✅ 1. 마운트 시 실행 (빈 의존성 배열 [])
function MountExample() {
  const [mountTime, setMountTime] = useState("");

  // 의존성 배열이 빈 배열 [] → 컴포넌트가 처음 화면에 나타날 때 1번만 실행
  // C#의 생성자, Python의 __init__과 비슷
  useEffect(() => {
    const time = new Date().toLocaleTimeString("ko-KR");
    setMountTime(time);
    console.log("✅ 컴포넌트가 마운트되었습니다!"); // 브라우저 콘솔에서 확인
  }, []); // ← 빈 배열 = 마운트 시 1번만

  return (
    <div className="result-box">
      <p>이 컴포넌트가 마운트된 시간: <strong>{mountTime}</strong></p>
      <p style={{ fontSize: 13, color: "#64748b" }}>
        (브라우저 콘솔(F12)을 열어서 로그도 확인해보세요)
      </p>
    </div>
  );
}

// ✅ 2. 의존성 배열 - 특정 값이 바뀔 때 실행
function DependencyExample() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedTerm, setDebouncedTerm] = useState("");

  // searchTerm이 바뀔 때마다 실행됨
  // 실제로 API 검색할 때 자주 쓰는 디바운스 패턴
  useEffect(() => {
    // 500ms 후에 실행 (타이핑이 끝날 때까지 기다림)
    const timer = setTimeout(() => {
      setDebouncedTerm(searchTerm);
      if (searchTerm) {
        console.log(`🔍 검색 실행: "${searchTerm}"`);
      }
    }, 500);

    // 클린업: 다음 실행 전에 이전 타이머를 취소
    return () => clearTimeout(timer);
  }, [searchTerm]); // ← searchTerm이 바뀔 때마다 실행

  return (
    <div>
      <input
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="검색어를 입력하세요 (타이핑 후 0.5초 대기)"
        style={{ width: "100%", maxWidth: 400 }}
      />
      <div className="result-box">
        <p>입력 중: {searchTerm || "(비어있음)"}</p>
        <p>디바운스 적용 (0.5초 후): <strong>{debouncedTerm || "(비어있음)"}</strong></p>
      </div>
    </div>
  );
}

// ✅ 3. 클린업(Cleanup) - 타이머, 이벤트 리스너 정리
function CleanupExample() {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (!isRunning) return; // 실행 중이 아니면 아무것도 안 함

    // 1초마다 카운트 증가
    const interval = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);

    // 클린업 함수: 컴포넌트가 사라지거나, isRunning이 바뀔 때 실행
    // 메모리 누수를 방지합니다 (백엔드에서 DB 커넥션 닫는 것과 비슷)
    return () => {
      console.log("🧹 타이머 클린업!");
      clearInterval(interval);
    };
  }, [isRunning]); // isRunning이 바뀔 때마다 effect 재실행

  return (
    <div>
      <p style={{ fontSize: 24, fontWeight: "bold", marginBottom: 8 }}>
        ⏱ {seconds}초
      </p>
      <div className="flex-gap">
        <button onClick={() => setIsRunning(true)}>시작</button>
        <button className="secondary" onClick={() => setIsRunning(false)}>
          정지
        </button>
        <button
          className="danger"
          onClick={() => {
            setIsRunning(false);
            setSeconds(0);
          }}
        >
          리셋
        </button>
      </div>
    </div>
  );
}

// ✅ 4. 윈도우 이벤트 리스너 등록/해제
function WindowEventExample() {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    // 이벤트 리스너 등록
    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);

    // 클린업: 반드시 이벤트 리스너를 제거해야 메모리 누수 방지
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []); // 마운트/언마운트 시에만

  return (
    <div className="result-box">
      <p>브라우저 너비: <strong>{windowWidth}px</strong> (창 크기를 바꿔보세요)</p>
      <p>마우스 위치: <strong>({mousePos.x}, {mousePos.y})</strong></p>
    </div>
  );
}

function Chapter5() {
  return (
    <div>
      <ChapterHeader
        title="5. useEffect"
        learningPoints={[
          "컴포넌트 마운트 시 코드 실행하기",
          "의존성 배열로 특정 값 변화 감지하기",
          "클린업 함수로 리소스 정리하기",
        ]}
      />

      <div className="section">
        <h2>마운트 시 실행 (의존성 배열: [])</h2>
        <div className="code-comment">
          💡 useEffect(함수, [])에서 빈 배열 []은 "마운트 시 1번만 실행"을 의미합니다.
          <br />
          API 초기 데이터 로드, 설정 초기화 등에 사용합니다.
        </div>
        <MountExample />
      </div>

      <div className="section">
        <h2>의존성 배열 - 값 변화 감지</h2>
        <div className="code-comment">
          💡 useEffect(함수, [값])에서 [값]에 넣은 변수가 바뀔 때마다 함수가 재실행됩니다.
          <br />
          return으로 클린업 함수를 반환하면, 다음 실행 전에 이전 것을 정리합니다.
        </div>
        <DependencyExample />
      </div>

      <div className="section">
        <h2>스톱워치 (클린업 패턴)</h2>
        <div className="code-comment">
          💡 setInterval, setTimeout, addEventListener 등을 사용하면 반드시 클린업해야 합니다.
          <br />
          안 하면 메모리 누수! 백엔드에서 DB 연결을 안 닫는 것과 같은 문제입니다.
        </div>
        <CleanupExample />
      </div>

      <div className="section">
        <h2>윈도우 이벤트 리스너</h2>
        <div className="code-comment">
          💡 브라우저 API(window, document)를 사용할 때는 useEffect 안에서 등록하고, 클린업에서 해제합니다.
        </div>
        <WindowEventExample />
      </div>

      <div className="section">
        <h2>🔧 직접 해보기</h2>
        <ul style={{ marginLeft: 20 }}>
          <li>마운트 예제에 "마운트된 지 N초 경과" 실시간 표시를 추가해보세요</li>
          <li>스톱워치에 "랩 타임" 기록 기능을 넣어보세요</li>
          <li>document.title을 useEffect로 바꿔보세요 (브라우저 탭 제목)</li>
        </ul>
      </div>
    </div>
  );
}

export default Chapter5;
