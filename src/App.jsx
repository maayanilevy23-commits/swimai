import { useState } from "react";

function App() {
  const [showResult, setShowResult] = useState(false);
  const [stroke, setStroke] = useState("Freestyle");
  const [distance, setDistance] = useState("100");
  const [fileName, setFileName] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [swimmerName, setSwimmerName] = useState("");
  const [lane, setLane] = useState("5");

  const handleVideo = (file) => {
    if (!file) return;

    if (!file.type.startsWith("video/")) {
      alert("Please upload a video file.");
      return;
    }

    setFileName(file.name);
    setVideoUrl(URL.createObjectURL(file));
    setShowResult(false);
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg,#020617,#0f172a,#075985)",
      color: "white",
      fontFamily: "Arial",
      padding: "40px"
    }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <h1 style={{ fontSize: "60px", marginBottom: "10px" }}>SwimAI</h1>
          <p style={{ fontSize: "20px", color: "#cbd5e1" }}>
            Upload race videos and generate a structured swim race review.
          </p>
          <div style={{
            marginTop: "20px",
            background: "#5b2c00",
            color: "#fbbf24",
            padding: "15px",
            borderRadius: "10px"
          }}>
            Prototype mode: this version previews video and shows sample feedback.
          </div>
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

            <p>Swimmer Name</p>
            <input
              type="text"
              placeholder="Example: Koren Levy"
              value={swimmerName}
              onChange={(e) => setSwimmerName(e.target.value)}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "8px",
                border: "none",
                marginBottom: "20px"
              }}
            />

            <p>Lane</p>
            <select
              value={lane}
              onChange={(e) => setLane(e.target.value)}
              style={{ width: "100%", padding: "12px", borderRadius: "8px", marginBottom: "20px" }}
            >
              {[1,2,3,4,5,6,7,8].map((n) => <option key={n}>{n}</option>)}
            </select>

            <h2>Upload Race Video</h2>

            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                handleVideo(e.dataTransfer.files[0]);
              }}
              onPaste={(e) => {
                const file = e.clipboardData.files[0];
                handleVideo(file);
              }}
              style={{
                border: "2px dashed #38bdf8",
                borderRadius: "14px",
                padding: "30px",
                textAlign: "center",
                background: "#0f172a",
                marginBottom: "20px"
              }}
            >
              <p style={{ fontSize: "22px" }}>Drop or paste a swim video here</p>
              <p style={{ color: "#94a3b8" }}>
                Or choose a file from your computer
              </p>

              <input
                type="file"
                accept="video/*,.mov,.mp4,.m4v"
                onChange={(e) => handleVideo(e.target.files[0])}
              />

              {fileName && (
                <p style={{ marginTop: "15px", color: "#38bdf8" }}>
                  Selected video: {fileName}
                </p>
              )}
            </div>

            {videoUrl && (
              <>
                <h3>Video Preview</h3>
                <video
                  src={videoUrl}
                  controls
                  playsInline
                  style={{
                    width: "100%",
                    borderRadius: "12px",
                    marginBottom: "20px",
                    background: "black"
                  }}
                />
              </>
            )}

            <p>Stroke</p>
            <select
              value={stroke}
              onChange={(e) => setStroke(e.target.value)}
              style={{ width: "100%", padding: "12px", borderRadius: "8px", marginBottom: "20px" }}
            >
              <option>Freestyle</option>
              <option>Backstroke</option>
              <option>Breaststroke</option>
              <option>Butterfly</option>
            </select>

            <p>Distance</p>
            <select
              value={distance}
              onChange={(e) => setDistance(e.target.value)}
              style={{ width: "100%", padding: "12px", borderRadius: "8px", marginBottom: "20px" }}
            >
              <option>50</option>
              <option>100</option>
              <option>200</option>
              <option>500</option>
            </select>

            <button
              onClick={() => setShowResult(true)}
              style={{
                width: "100%",
                padding: "15px",
                background: "#38bdf8",
                color: "white",
                border: "none",
                borderRadius: "10px",
                cursor: "pointer",
                fontSize: "18px",
                fontWeight: "bold"
              }}
            >
              Generate Sample Race Review
            </button>
          </div>

          <div style={{
            background: "#1e293b",
            padding: "30px",
            borderRadius: "18px"
          }}>
            <h2>SwimAI Report</h2>

            {!showResult && (
              <p style={{ color: "#94a3b8", fontSize: "20px" }}>
                Enter swimmer information, upload a race video, and generate a sample race review.
              </p>
            )}

            {showResult && (
              <>
                <div style={{
                  background: "#0f172a",
                  padding: "20px",
                  borderRadius: "12px",
                  marginBottom: "20px"
                }}>
                  <p><strong>Swimmer:</strong> {swimmerName || "Not Entered"}</p>
                  <p><strong>Event:</strong> {distance} {stroke}</p>
                  <p><strong>Lane:</strong> {lane}</p>
                  <p><strong>Video:</strong> {fileName || "No Video Uploaded"}</p>
                  <h1 style={{ color: "#38bdf8" }}>82 / 100</h1>
                  <p>Sample Race Score</p>
                </div>

                <div style={{ background: "#052e2b", padding: "18px", borderRadius: "12px", marginBottom: "15px" }}>
                  <h3>Race Summary</h3>
                  <p>{swimmerName || "The swimmer"} demonstrated a strong first half with consistent tempo and good body position.</p>
                </div>

                <div style={{ background: "#0f172a", padding: "18px", borderRadius: "12px", marginBottom: "15px" }}>
                  <h3>Start & Breakout</h3>
                  <p>✅ Strong push-off from the start.</p>
                  <p>⚠️ Breakout timing will be evaluated when full video AI is enabled.</p>
                </div>

                <div style={{ background: "#0f172a", padding: "18px", borderRadius: "12px", marginBottom: "15px" }}>
                  <h3>Stroke Analysis</h3>
                  <p>✅ Good early-race rhythm.</p>
                  <p>⚠️ Stroke length appears to decrease late in the race.</p>
                </div>

                <div style={{ background: "#3b1d0b", padding: "18px", borderRadius: "12px", marginBottom: "15px" }}>
                  <h3>Turn Analysis</h3>
                  <p>⚠️ Future versions will estimate turn efficiency and wall speed automatically.</p>
                </div>

                <div style={{ background: "#0f172a", padding: "18px", borderRadius: "12px" }}>
                  <h3>Coach Recommendation</h3>
                  <p>
                    Focus on maintaining stroke length under fatigue, improving wall transitions,
                    and preserving tempo through the final section of the race.
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;