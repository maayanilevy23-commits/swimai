import { useState } from "react";

function App() {
  const [showResult, setShowResult] = useState(false);
  const [stroke, setStroke] = useState("Freestyle");
  const [distance, setDistance] = useState("100");
  const [fileName, setFileName] = useState("");

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #020617, #0f172a, #075985)",
      color: "white",
      fontFamily: "Arial",
      padding: "40px"
    }}>
      <div style={{maxWidth: "1000px", margin: "0 auto"}}>
        <div style={{textAlign: "center", marginBottom: "40px"}}>
          <h1 style={{fontSize: "56px", marginBottom: "10px"}}>SwimAI</h1>
          <p style={{color:"#cbd5e1", fontSize:"20px"}}>
            Upload race videos from your computer or Photos library and receive swim race analysis.
          </p>
          <p style={{
            color:"#fbbf24",
            background:"#422006",
            padding:"12px",
            borderRadius:"10px",
            marginTop:"20px"
          }}>
            Prototype mode: this version shows sample feedback. Real video analysis is coming soon.
          </p>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "24px"
        }}>
          <div style={{
            background: "#1e293b",
            padding: "30px",
            borderRadius: "18px"
          }}>
            <h2>Upload Race Video</h2>

            <div style={{
              border: "2px dashed #38bdf8",
              borderRadius: "14px",
              padding: "30px",
              textAlign: "center",
              marginBottom: "20px",
              background: "#0f172a"
            }}>
              <p style={{fontSize:"18px"}}>Select a swim race video</p>
              <p style={{color:"#94a3b8"}}>
                Supports videos from computer, iPhone, or Photos library
              </p>

              <input
                type="file"
                accept="video/*"
                onChange={(e) => {
                  setFileName(e.target.files[0]?.name || "");
                  setShowResult(false);
                }}
              />

              {fileName && (
                <p style={{color:"#38bdf8", marginTop:"15px"}}>
                  Selected video: {fileName}
                </p>
              )}
            </div>

            <label>Stroke</label>
            <select
              value={stroke}
              onChange={(e) => {
                setStroke(e.target.value);
                setShowResult(false);
              }}
              style={{
                width: "100%",
                padding: "12px",
                marginTop: "8px",
                marginBottom: "18px",
                borderRadius: "8px"
              }}
            >
              <option>Freestyle</option>
              <option>Backstroke</option>
              <option>Breaststroke</option>
              <option>Butterfly</option>
            </select>

            <label>Distance</label>
            <select
              value={distance}
              onChange={(e) => {
                setDistance(e.target.value);
                setShowResult(false);
              }}
              style={{
                width: "100%",
                padding: "12px",
                marginTop: "8px",
                marginBottom: "24px",
                borderRadius: "8px"
              }}
            >
              <option>50</option>
              <option>100</option>
              <option>200</option>
              <option>500</option>
            </select>

            <button
              style={{
                width: "100%",
                padding: "15px",
                background: "#38bdf8",
                border: "none",
                borderRadius: "10px",
                cursor: "pointer",
                fontWeight: "bold",
                fontSize: "16px"
              }}
              onClick={() => setShowResult(true)}
            >
              Generate Sample Analysis
            </button>
          </div>

          <div style={{
            background: "#1e293b",
            padding: "30px",
            borderRadius: "18px"
          }}>
            <h2>SwimAI Report</h2>

            {!showResult && (
              <p style={{color:"#94a3b8", lineHeight:"1.6"}}>
                Upload a video, choose the stroke and distance, then generate a sample report.
              </p>
            )}

            {showResult && (
              <div>
                <div style={{
                  background: "#0f172a",
                  padding: "20px",
                  borderRadius: "14px",
                  marginBottom: "20px"
                }}>
                  <p><strong>Video:</strong> {fileName || "No video selected"}</p>
                  <p><strong>Event:</strong> {distance} {stroke}</p>
                  <h1 style={{color:"#38bdf8"}}>82/100</h1>
                  <p style={{color:"#cbd5e1"}}>Sample Race Score</p>
                </div>

                <div style={{background:"#052e2b", padding:"18px", borderRadius:"12px", marginBottom:"16px"}}>
                  <h3>Sample Strengths</h3>
                  <p>✅ Strong breakout</p>
                  <p>✅ Good first-half pace</p>
                  <p>✅ Consistent body line</p>
                </div>

                <div style={{background:"#3b1d0b", padding:"18px", borderRadius:"12px", marginBottom:"16px"}}>
                  <h3>Sample Needs Improvement</h3>
                  <p>⚠️ Stroke rate drops late in the race</p>
                  <p>⚠️ Turns need faster rotation</p>
                  <p>⚠️ Breathing pattern slightly inconsistent</p>
                </div>

                <div style={{background:"#0f172a", padding:"18px", borderRadius:"12px"}}>
                  <h3>Next Product Step</h3>
                  <p style={{lineHeight:"1.6"}}>
                    Real SwimAI will upload the video to storage, process race footage,
                    estimate splits, count strokes, evaluate turns, and generate personalized coaching feedback.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;