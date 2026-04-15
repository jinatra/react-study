/**
 * ChapterHeader - 각 챕터 상단에 표시되는 요약 컴포넌트
 *
 * [백엔드 비유] Python의 docstring처럼, 이 컴포넌트는 각 챕터가
 * 무엇을 가르치는지 한눈에 보여주는 역할을 합니다.
 */

// Props의 타입을 미리 정의 (C#의 interface와 같은 개념)
interface ChapterHeaderProps {
  title: string;
  learningPoints: string[];
}

// 함수형 컴포넌트: props를 받아서 JSX를 반환하는 함수
function ChapterHeader({ title, learningPoints }: ChapterHeaderProps) {
  return (
    <div className="chapter-header">
      <h1>{title}</h1>
      <p style={{ fontWeight: 500, marginBottom: 4 }}>📚 이 챕터에서 배우는 것:</p>
      <ul>
        {learningPoints.map((point, index) => (
          <li key={index}>{point}</li>
        ))}
      </ul>
    </div>
  );
}

export default ChapterHeader;
