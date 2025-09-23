interface AnswerDisplayProps {
  answer: string;
  contradictions: string[];
}

export default function AnswerDisplay({ answer, contradictions }: AnswerDisplayProps) {
  return (
    <div className="answer-display">
      <h3>Research Answer</h3>
      <div className="answer-content">
        {answer.split('\n').map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
      
      {contradictions && contradictions.length > 0 && (
        <div className="contradictions">
          <h4>⚠️ Contradictions Found</h4>
          <ul>
            {contradictions.map((contra, index) => (
              <li key={index}>{contra}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}