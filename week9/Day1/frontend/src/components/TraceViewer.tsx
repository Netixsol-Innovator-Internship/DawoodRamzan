import { useState } from "react";
import axios from "axios";

interface TraceViewerProps {
  traceId?: string;
}

export default function TraceViewer({ traceId }: TraceViewerProps) {
  const [trace, setTrace] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const loadTrace = async () => {
    if (!traceId) return;

    setLoading(true);
    try {
      const response = await axios.get(
        `https://multi-reasearch-agent-backend.vercel.app/trace/${traceId}`
      );
      setTrace(response.data);
    } catch (error) {
      console.error("Error loading trace:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!traceId) {
    return <div>No trace available</div>;
  }

  return (
    <div className="trace-viewer">
      <button onClick={loadTrace} disabled={loading} className="load-trace-btn">
        {loading ? "Loading..." : "Show Research Process"}
      </button>

      {trace && (
        <div className="trace-content">
          <h4>Research Process Trace</h4>
          <div className="trace-steps">
            {trace.steps?.map((step: any, index: number) => (
              <div key={index} className="trace-step">
                <h5>
                  Step {index + 1}: {step.name}
                </h5>
                {/* <p>Duration: {new Date(step.completedAt) - new Date(step.startedAt)}ms</p> */}
                <pre>{JSON.stringify(step.result, null, 2)}</pre>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
