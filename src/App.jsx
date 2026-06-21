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

  const getLaneNote = () => {
    if (lane === "1" || lane === "8") {
      return "Because this swimmer is in an outside lane, camera angle and visibility may affect review quality. Focus should be placed on body line, turn approach, and breakout visibility.";
    }

    if (lane === "4" || lane === "5") {
      return "This is a center lane, which usually provides better visibility for race review. It should be easier to evaluate pacing, turns, and stroke consistency.";
    }

    return "This lane should provide reasonable visibility, but the quality of analysis depends on camera angle and swimmer tracking.";
  };

  const getDistanceFocus = () => {
    if (distance === "50") {
      return "For a 50, the biggest performance drivers are start reaction, breakout speed, stroke tempo, and finish timing. There is very little room for pacing errors.";
    }

    if (distance === "100") {
      return "For a 100, the key is balancing early speed with late-race efficiency. The second half should be reviewed for stroke shortening and tempo drop.";
    }

    if (distance === "200") {
      return "For a 200, pacing discipline becomes more important. The review should focus on consistency across each 50 and avoiding excessive drop-off.";
    }

    return "For a 500, endurance, pacing consistency, breathing rhythm, and efficient turns become the most important areas to evaluate.";
  };

  const getStrokeFocus = () => {
    if (stroke === "Freestyle") {
      return "Freestyle review should focus on body rotation, breathing pattern, stroke length, kick consistency, and maintaining tempo late in the race.";
    }

    if (stroke === "Backstroke") {
      return "Backstroke review should focus on head stability, hip position, shoulder rotation, stroke rhythm, and underwater breakout timing.";
    }

    if (stroke === "Breaststroke") {
      return "Breaststroke review should focus on timing between pull and kick, glide efficiency, body line, pullout execution, and maintaining rhythm.";
    }

    return "Butterfly review should focus on body undulation, breathing timing, kick rhythm, arm recovery, and maintaining form under fatigue.";
  };

  const getScore = () => {
    let score = 82;

    if (lane === "4" || lane === "5") score += 2;
    if (lane === "1" || lane === "8") score -= 2;
    if (distance === "50") score += 1;
    if (distance === "500") score -= 1;
    if (stroke === "Butterfly") score -= 1;

    return score;
  };

  const score = getScore();

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
            Prototype mode: this version previews video and creates sample feedback based on event, stroke, and lane.
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
              onChange={(e) => {
                setSwimmerName(e.target.value);
                setShowResult(false);
              }}
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
              onChange={(e) => {
                setLane(e.target.value);
                setShowResult(false);
              }}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "8px",
                marginBottom: "20px"
              }}
            >
              {[1,2,3,4,5,6,7,8].map((n) => (
                <option key={n}>{n}</option>
              ))}
            </select>

            <h2>Upload Race Video</h2>

            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                handleVideo(e.dataTransfer.files[0]);
              }}
              onPaste={(e) => {
                handleVideo(e.clipboardData.files[0]);
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
              onChange={(e) => {
                setStroke(e.target.value);
                setShowResult(false);
              }}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "8px",
                marginBottom: "20px"
              }}
            >
              <option>Freestyle</option>
              <option>Backstroke</option>
              <option>Breaststroke</option>
              <option>Butterfly</option>
            </select>

            <p>Distance</p>
            <select
              value={distance}
              onChange={(e) => {
                setDistance(e.target.value);
                setShowResult(false);
              }}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "8px",
                marginBottom: "20px"
              }}
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
              <p style={{ color: "#94a3b8", fontSize: "20px", lineHeight: "1.6" }}>
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
                  <h1 style={{ color: "#38bdf8" }}>{score} / 100</h1>
                  <p>Sample Race Score</p>
                </div>

                <div style={{
                  background: "#052e2b",
                  padding: "18px",
                  borderRadius: "12px",
                  marginBottom: "15px"
                }}>
                  <h3>Race Summary</h3>
                  <p>
                    {swimmerName || "The swimmer"} is entered as lane {lane} in the {distance} {stroke}.
                    This sample review adjusts based on lane, distance, and stroke selection.
                  </p>
                </div>

                <div style={{
                  background: "#0f172a",
                  padding: "18px",
                  borderRadius: "12px",
                  marginBottom: "15px"
                }}>
                  <h3>Lane Visibility Note</h3>
                  <p>{getLaneNote()}</p>
                </div>

                <div style={{
                  background: "#0f172a",
                  padding: "18px",
                  borderRadius: "12px",
                  marginBottom: "15px"
                }}>
                  <h3>Distance Focus</h3>
                  <p>{getDistanceFocus()}</p>
                </div>

                <div style={{
                  background: "#0f172a",
                  padding: "18px",
                  borderRadius: "12px",
                  marginBottom: "15px"
                }}>
                  <h3>Stroke Focus</h3>
                  <p>{getStrokeFocus()}</p>
                </div>

                <div style={{
                  background: "#3b1d0b",
                  padding: "18px",
                  borderRadius: "12px",
                  marginBottom: "15px"
                }}>
                  <h3>Future AI Analysis</h3>
                  <p>
                    In the next paid AI version, SwimAI will use video frames to evaluate body position,
                    breakout timing, stroke consistency, and turn efficiency instead of using sample text.
                  </p>
                </div>

                <div style={{
                  background: "#0f172a",
                  padding: "18px",
                  borderRadius: "12px"
                }}>
                  <h3>Coach Recommendation</h3>
                  <p>
                    Based on the selected event, focus on the highest-impact area first:
                    start and breakout for sprint events, pacing and turns for middle-distance races,
                    and rhythm consistency for longer races.
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