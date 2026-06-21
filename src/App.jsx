  import { useState } from "react";

function App() {
  const [showResult, setShowResult] = useState(false);
  const [stroke, setStroke] = useState("Freestyle");
  const [distance, setDistance] = useState("100");
  const [fileName, setFileName] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [swimmerName, setSwimmerName] = useState("");
  const [lane, setLane] = useState("5");

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #020617, #0f172a, #075985)",
      color: "white",
      fontFamily: "Arial",
      padding: "40px"
    }}>
      <div style={{maxWidth: "1100px", margin: "0 auto"}}>
        <div style={{textAlign: "center", marginBottom: "40px"}}>
          <h1 style={{fontSize: "56px", marginBottom: "10px"}}>SwimAI</h1>
          <p style={{color:"#cbd5e1", fontSize:"20px"}}>
            Upload race video, identify the swimmer, and generate a structured race review.
          </p>
          <p style={{
            color:"#fbbf24",
            background:"#422006",
            padding:"12px",
            borderRadius:"10px",
            marginTop:"20px"
          }}>
            Prototype mode: this version previews video and generates sample feedback.
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
            <h2>Race Details</h2>

            <label>Swimmer Name</label>
            <input
              type="text"
              placeholder="Example: Koren Levy"
              value={swimmerName}
              onChange={(e) => {
                setSwimmerName(e.target.value);
                setShowResult(false);
              }}
              style={{
                width: "100%",
                padding: "12px",
                marginTop: "8px",
                marginBottom: "18px",
                borderRadius: "8px",
                border: "none"
              }}
            />

            <label>Lane</label>
            <select
              value={lane}
              onChange={(e) => {
                setLane(e.target.value);
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
              <option>1</option>
              <option>2</option>
              <option>3</option>
              <option>4</option>
              <option>5</option>
              <option>6</option>
              <option>7</option>
              <option>8</option>
            </select>

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

            <h2>Upload Video</h2>

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
                Works with videos from computer, iPhone, or Photos library
              </p>

              <input
                type="file"
                accept="video/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    setFileName(file.name);
                    setVideoUrl(URL.createObjectURL(file));
                    setShowResult(false);
                  }
                }}
              />

              {fileName && (
                <p style={{color:"#38bdf8", marginTop:"15px"}}>
                  Selected video: {fileName}
                </p>
              )}
            </div>

            {videoUrl && (
              <div style={{marginBottom: "24px"}}>
                <h3>Video Preview</h3>
                <video
                  src={videoUrl}
                  controls
                  style={{
                    width: "100%",
                    borderRadius: "12px",
                    background: "black"
                  }}
                />
              </div>
            )}

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
              Generate Sample Race Review
            </button>
          </div>

          <div style={{
            background: "#1e293b",
            padding: "30px",
            borderRadius: "18px"
          }}>
            <h2>SwimAI Race Report</h2>

            {!showResult && (
              <p style={{color:"#94a3b8", lineHeight:"1.6"}}>
                Enter swimmer details, upload a video, and generate a structured sample race report.
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
                  <p><strong>Swimmer:</strong> {swimmerName || "Not entered"}</p>
                  <p><strong>Event:</strong> {distance} {stroke}</p>
                  <p><strong>Lane:</strong> {lane}</p>
                  <p><strong>Video:</strong> {fileName || "No video selected"}</p>
                  <h1 style={{color:"#38bdf8"}}>82/100</h1>
                  <p style={{color:"#cbd5e1"}}>Sample Race Score</p>
                </div>

                <div style={{background:"#052e2b", padding:"18px", borderRadius:"12px", marginBottom:"16px"}}>
                  <h3>Race Summary</h3>
                  <p>
                    {swimmerName || "The swimmer"} shows a solid overall race pattern with good early tempo
                    and a controlled body line. The main opportunity is maintaining efficiency late in the race.
                  </p>
                </div>

                <div style={{background:"#0f172a", padding:"18px", borderRadius:"12px", marginBottom:"16px"}}>
                  <h3>Start & Breakout</h3>
                  <p>✅ Strong push-off and early acceleration.</p>
                  <p>⚠️ Breakout timing should be reviewed once real video analysis is added.</p>
                </div>

                <div style={{background:"#0f172a", padding:"18px", borderRadius:"12px", marginBottom:"16px"}}>
                  <h3>Stroke Analysis</h3>
                  <p>✅ Consistent stroke rhythm through the first half.</p>
                  <p>⚠️ Stroke length appears to shorten late in the race.</p>
                </div>

                <div style={{background:"#3b1d0b", padding:"18px", borderRadius:"12px", marginBottom:"16px"}}>
                  <h3>Turn Analysis</h3>
                  <p>⚠️ Turn rotation and wall speed should be a focus area.</p>
                  <p>⚠️ Future video AI will estimate time lost or gained at each wall.</p>
                </div>

                <div style={{background:"#0f172a", padding:"18px", borderRadius:"12px"}}>
                  <h3>Coach Recommendation</h3>
                  <p style={{lineHeight:"1.6"}}>
                    Focus practice on maintaining stroke length under fatigue, faster wall transitions,
                    and consistent breakout timing.
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