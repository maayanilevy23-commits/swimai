import { useState, useRef } from "react";

function App() {
  const [stroke, setStroke] = useState("Freestyle");
  const [distance, setDistance] = useState("100");
  const [swimmerName, setSwimmerName] = useState("");
  const [lane, setLane] = useState("5");
  const [fileName, setFileName] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [markers, setMarkers] = useState({});
  const [showResult, setShowResult] = useState(false);

  const videoRef = useRef(null);

  const handleVideo = (file) => {
    if (!file) return;
    if (!file.type.startsWith("video/")) {
      alert("Please upload a video file.");
      return;
    }

    setFileName(file.name);
    setVideoUrl(URL.createObjectURL(file));
    setMarkers({});
    setShowResult(false);
  };

  const markTime = (label) => {
    const video = videoRef.current;
    if (!video) {
      alert("Upload a video first.");
      return;
    }

    setMarkers({
      ...markers,
      [label]: video.currentTime,
    });

    setShowResult(false);
  };

  const formatTime = (seconds) => {
    if (seconds === undefined || seconds === null) return "—";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}:${secs.toFixed(2).padStart(5, "0")}` : secs.toFixed(2);
  };

  const segment = (from, to) => {
    if (markers[from] === undefined || markers[to] === undefined) return null;
    return markers[to] - markers[from];
  };

  const getSplitNotes = () => {
    const notes = [];

    const startTo15 = segment("Start", "15m");
    const fifteenTo35 = segment("15m", "35m");
    const thirtyFiveTo50 = segment("35m", "50m");
    const fiftyTo75 = segment("50m", "75m");
    const seventyFiveToFinish = segment("75m", "Finish");
    const first50 = segment("Start", "50m");
    const second50 = segment("50m", "Finish");

    if (startTo15 !== null) {
      notes.push(`Start to 15m: ${formatTime(startTo15)} — measures reaction, streamline, underwater speed, and breakout timing.`);
    }

    if (fifteenTo35 !== null) {
      notes.push(`15m to 35m: ${formatTime(fifteenTo35)} — measures early surface speed after breakout.`);
    }

    if (thirtyFiveTo50 !== null) {
      notes.push(`35m to 50m: ${formatTime(thirtyFiveTo50)} — shows how well speed is held into the first wall.`);
    }

    if (fiftyTo75 !== null) {
      notes.push(`50m to 75m: ${formatTime(fiftyTo75)} — evaluates turn speed, breakout, and early second-half tempo.`);
    }

    if (seventyFiveToFinish !== null) {
      notes.push(`75m to Finish: ${formatTime(seventyFiveToFinish)} — measures late-race fatigue, kick strength, and finish timing.`);
    }

    if (first50 !== null && second50 !== null) {
      const dropOff = second50 - first50;
      notes.push(`First 50: ${formatTime(first50)}.`);
      notes.push(`Second 50: ${formatTime(second50)}.`);
      notes.push(`Drop-off: ${dropOff >= 0 ? "+" : ""}${dropOff.toFixed(2)} seconds.`);

      if (dropOff > 3) {
        notes.push("Large fade detected. Focus on maintaining stroke length, kick pressure, and wall speed after the 50.");
      } else if (dropOff > 1.5) {
        notes.push("Moderate fade detected. Focus on holding distance-per-stroke and tempo through the final 25.");
      } else {
        notes.push("Pacing profile looks strong. The swimmer held the second half well.");
      }
    }

    if (notes.length === 0) {
      notes.push("Use the video marker buttons to create split-based feedback.");
    }

    return notes;
  };

  const strokeFeedback = {
    Freestyle: [
      "High-elbow catch: avoid dropping the elbow early in the pull.",
      "Kick should stay compact from the hips; excessive knee bend creates drag.",
      "Breakout should connect directly into the first stroke with no pause.",
      "Breathing should happen through rotation, not head lift."
    ],
    Backstroke: [
      "Head should stay still; chin lift can drop the hips.",
      "Avoid crossing over on hand entry.",
      "Underwater dolphin kicks should stay narrow and fast.",
      "Kick should remain steady without excessive knee bend."
    ],
    Breaststroke: [
      "Knees should stay narrower during kick recovery.",
      "Pull-kick timing should finish into a tight streamline.",
      "Avoid lifting the head too high during the breath.",
      "Pullout should transition quickly into the first stroke."
    ],
    Butterfly: [
      "Breath should stay low and early to avoid hip drop.",
      "Kick power should come from the hips, not excessive knee bend.",
      "Catch should establish pressure before the breath.",
      "Underwater dolphin kicks should build speed into breakout."
    ],
  };

  const laneFeedback = {
    1: "Lane 1: outside lane. Focus on straight-line swimming and breakout visibility.",
    2: "Lane 2: review kick width, lane-line stability, and direct breakout line.",
    3: "Lane 3: good lane for hand entry, elbow catch, breathing mechanics, and turn approach.",
    4: "Lane 4: center lane. Strong for start, breakout, tempo, pull path, kick rhythm, and turns.",
    5: "Lane 5: center lane. Strong for body position, elbow angle, kick amplitude, underwater timing, and fatigue review.",
    6: "Lane 6: review breathing-side mechanics, elbow path, lane drift, and breakout line.",
    7: "Lane 7: focus on body line, kick timing, head position, and wall speed.",
    8: "Lane 8: outside lane. Best for start, breakout distance, straight-line swimming, and finish timing.",
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
            Upload race video, mark race points, and calculate real video-based splits.
          </p>
          <div style={{
            marginTop: "20px",
            background: "#5b2c00",
            color: "#fbbf24",
            padding: "15px",
            borderRadius: "10px"
          }}>
            Marker mode: split times are calculated from the video timeline you mark.
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
          <div style={{ background: "#1e293b", padding: "30px", borderRadius: "18px" }}>
            <h2>Race Details</h2>

            <p>Swimmer Name</p>
            <input
              type="text"
              placeholder="Name"
              value={swimmerName}
              onChange={(e) => setSwimmerName(e.target.value)}
              style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "none", marginBottom: "20px" }}
            />

            <p>Lane</p>
            <select value={lane} onChange={(e) => setLane(e.target.value)} style={{ width: "100%", padding: "12px", borderRadius: "8px", marginBottom: "20px" }}>
              {[1,2,3,4,5,6,7,8].map((n) => <option key={n}>{n}</option>)}
            </select>

            <p>Stroke</p>
            <select value={stroke} onChange={(e) => setStroke(e.target.value)} style={{ width: "100%", padding: "12px", borderRadius: "8px", marginBottom: "20px" }}>
              <option>Freestyle</option>
              <option>Backstroke</option>
              <option>Breaststroke</option>
              <option>Butterfly</option>
            </select>

            <p>Distance</p>
            <select value={distance} onChange={(e) => setDistance(e.target.value)} style={{ width: "100%", padding: "12px", borderRadius: "8px", marginBottom: "20px" }}>
              <option>50</option>
              <option>100</option>
              <option>200</option>
              <option>500</option>
            </select>

            <h2>Upload Race Video</h2>

            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                handleVideo(e.dataTransfer.files[0]);
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
              <p style={{ fontSize: "22px" }}>Drop a swim video here</p>
              <input type="file" accept="video/*,.mov,.mp4,.m4v" onChange={(e) => handleVideo(e.target.files[0])} />
              {fileName && <p style={{ marginTop: "15px", color: "#38bdf8" }}>Selected video: {fileName}</p>}
            </div>

            {videoUrl && (
              <>
                <h3>Video Preview</h3>
                <video
                  ref={videoRef}
                  src={videoUrl}
                  controls
                  playsInline
                  style={{ width: "100%", borderRadius: "12px", marginBottom: "20px", background: "black" }}
                />

                <h3>Split Markers</h3>
                <p style={{ color: "#cbd5e1" }}>
                  Play or scrub the video. When the swimmer reaches each point, click the matching marker.
                </p>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "20px" }}>
                  {["Start", "15m", "35m", "50m", "75m", "Finish"].map((label) => (
                    <button
                      key={label}
                      onClick={() => markTime(label)}
                      style={{
                        padding: "12px",
                        background: markers[label] !== undefined ? "#22c55e" : "#334155",
                        color: "white",
                        border: "none",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontWeight: "bold"
                      }}
                    >
                      Mark {label}: {markers[label] !== undefined ? formatTime(markers[label]) : "—"}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setMarkers({})}
                  style={{
                    width: "100%",
                    padding: "12px",
                    background: "#ef4444",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    marginBottom: "20px"
                  }}
                >
                  Clear Markers
                </button>
              </>
            )}

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
              Generate Split Report
            </button>
          </div>

          <div style={{ background: "#1e293b", padding: "30px", borderRadius: "18px" }}>
            <h2>SwimAI Report</h2>

            {!showResult && (
              <p style={{ color: "#94a3b8", fontSize: "20px", lineHeight: "1.6" }}>
                Mark the video timeline points and generate a split report.
              </p>
            )}

            {showResult && (
              <>
                <div style={{ background: "#0f172a", padding: "20px", borderRadius: "12px", marginBottom: "20px" }}>
                  <p><strong>Swimmer:</strong> {swimmerName || "Not Entered"}</p>
                  <p><strong>Event:</strong> {distance} {stroke}</p>
                  <p><strong>Lane:</strong> {lane}</p>
                  <p><strong>Video:</strong> {fileName || "No Video Uploaded"}</p>
                  <h1 style={{ color: "#38bdf8" }}>Video Split Report</h1>
                </div>

                <div style={{ background: "#1e1b4b", padding: "18px", borderRadius: "12px", marginBottom: "15px" }}>
                  <h3>Marked Times</h3>
                  {["Start", "15m", "35m", "50m", "75m", "Finish"].map((label) => (
                    <p key={label}><strong>{label}:</strong> {formatTime(markers[label])}</p>
                  ))}
                </div>

                <div style={{ background: "#0f172a", padding: "18px", borderRadius: "12px", marginBottom: "15px" }}>
                  <h3>Split Analysis</h3>
                  {getSplitNotes().map((note, index) => (
                    <p key={index}>• {note}</p>
                  ))}
                </div>

                <div style={{ background: "#0f172a", padding: "18px", borderRadius: "12px", marginBottom: "15px" }}>
                  <h3>Lane Review</h3>
                  <p>{laneFeedback[lane]}</p>
                </div>

                <div style={{ background: "#052e2b", padding: "18px", borderRadius: "12px" }}>
                  <h3>{stroke} Technical Focus</h3>
                  {strokeFeedback[stroke].map((item, index) => (
                    <p key={index}>• {item}</p>
                  ))}
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