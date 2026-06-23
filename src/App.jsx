import { useState, useRef } from "react";

function App() {
  const [showResult, setShowResult] = useState(false);
  const [stroke, setStroke] = useState("Freestyle");
  const [distance, setDistance] = useState("100");
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState("");
  const [fileType, setFileType] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [videoDuration, setVideoDuration] = useState("");
  const [swimmerName, setSwimmerName] = useState("");
  const [lane, setLane] = useState("5");
  const [frames, setFrames] = useState([]);
  const [isExtracting, setIsExtracting] = useState(false);

  const [split15, setSplit15] = useState("");
  const [split35, setSplit35] = useState("");
  const [split50, setSplit50] = useState("");
  const [split75, setSplit75] = useState("");
  const [finalTime, setFinalTime] = useState("");

  const videoRef = useRef(null);

  const handleVideo = (file) => {
    if (!file) return;
    if (!file.type.startsWith("video/")) {
      alert("Please upload a video file.");
      return;
    }

    setFileName(file.name);
    setFileSize((file.size / (1024 * 1024)).toFixed(2) + " MB");
    setFileType(file.type || "Unknown video type");
    setVideoUrl(URL.createObjectURL(file));
    setVideoDuration("");
    setFrames([]);
    setShowResult(false);
  };

  const extractFrames = async () => {
    const video = videoRef.current;
    if (!video || !videoUrl) {
      alert("Please upload a video first.");
      return;
    }

    setIsExtracting(true);
    setFrames([]);

    const duration = video.duration;
    if (!duration || Number.isNaN(duration)) {
      alert("Video is still loading. Wait a second and try again.");
      setIsExtracting(false);
      return;
    }

    const captureTimes = [
      duration * 0.08,
      duration * 0.22,
      duration * 0.4,
      duration * 0.58,
      duration * 0.76,
      duration * 0.92,
    ];

    const capturedFrames = [];

    for (let i = 0; i < captureTimes.length; i++) {
      const time = captureTimes[i];

      await new Promise((resolve) => {
        const onSeeked = () => {
          const canvas = document.createElement("canvas");
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;

          const ctx = canvas.getContext("2d");
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

          capturedFrames.push({
            label: `Frame ${i + 1}`,
            time: time.toFixed(2),
            image: canvas.toDataURL("image/jpeg", 0.82),
          });

          video.removeEventListener("seeked", onSeeked);
          resolve();
        };

        video.addEventListener("seeked", onSeeked);
        video.currentTime = time;
      });
    }

    setFrames(capturedFrames);
    setIsExtracting(false);
  };

  const toNumber = (value) => {
    const n = parseFloat(value);
    return Number.isNaN(n) ? null : n;
  };

  const getSplitAnalysis = () => {
    const s15 = toNumber(split15);
    const s35 = toNumber(split35);
    const s50 = toNumber(split50);
    const s75 = toNumber(split75);
    const finish = toNumber(finalTime);

    const notes = [];

    if (s15) {
      notes.push(`15m split: ${s15.toFixed(2)}. This reflects start reaction, streamline quality, underwater speed, and breakout timing.`);
    }

    if (s15 && s35) {
      const earlySpeed = s35 - s15;
      notes.push(`15m–35m segment: ${earlySpeed.toFixed(2)} seconds. This measures early surface swimming speed after the breakout.`);
    }

    if (s50) {
      notes.push(`50m split: ${s50.toFixed(2)}. This is the main checkpoint for front-half speed.`);
    }

    if (s50 && finish) {
      const secondHalf = finish - s50;
      const dropOff = secondHalf - s50;
      notes.push(`Second 50: ${secondHalf.toFixed(2)}. Drop-off from first 50: ${dropOff.toFixed(2)} seconds.`);

      if (dropOff > 3) {
        notes.push("Technical concern: large second-half fade. Likely causes include shorter stroke length, weaker kick, slower turn speed, or breathing disruption.");
      } else if (dropOff > 1.5) {
        notes.push("Moderate fade. Main focus should be maintaining distance-per-stroke and tempo after the 50 turn.");
      } else {
        notes.push("Good pacing profile. The swimmer appears to hold the second half well relative to the first half.");
      }
    }

    if (s75 && finish) {
      const last25 = finish - s75;
      notes.push(`Final 25: ${last25.toFixed(2)}. This helps evaluate late-race tempo, kick strength, and finish mechanics.`);
    }

    if (notes.length === 0) {
      notes.push("Enter split times to generate split-based race feedback.");
    }

    return notes;
  };

  const laneFeedback = {
    1: "Lane 1: outside lane. Focus on straight-line swimming, avoiding drift toward the wall side, and maintaining clean breakout visibility.",
    2: "Lane 2: slight outside angle. Review kick width, lane-line stability, and whether the swimmer holds a direct breakout line.",
    3: "Lane 3: good review lane. Focus on hand entry, elbow position during catch, breathing mechanics, and turn approach speed.",
    4: "Lane 4: center lane. Best for start, breakout, stroke tempo, pull path, kick rhythm, and turn-speed review.",
    5: "Lane 5: center lane. Strong visibility for body position, elbow angle, kick amplitude, underwater timing, and late-race tempo drop.",
    6: "Lane 6: mid-outside lane. Review breathing-side mechanics, elbow path, lane drift, and breakout line.",
    7: "Lane 7: outside-biased lane. Focus on bigger technical patterns: body line, kick timing, head position, and wall speed.",
    8: "Lane 8: outside lane. Best reviewed for start, breakout distance, straight-line swimming, finish timing, and major body-position changes.",
  };

  const strokeFeedback = {
    Freestyle: [
      "Elbow/catch: keep the elbow higher than the wrist during the catch. A dropped elbow reduces pull power.",
      "Pull: anchor the hand before pulling back. Avoid pressing down on the water.",
      "Kick: kick should be compact from the hips. Excessive knee bend creates drag.",
      "Underwater: tight streamline with no early head lift. Breakout should connect directly into the first stroke.",
      "Breathing: rotate to breathe instead of lifting the head forward."
    ],
    Backstroke: [
      "Head position: keep the head still. Chin lift drops the hips.",
      "Entry: avoid crossing over behind the head. Enter closer to shoulder line.",
      "Kick: steady flutter kick with high hips and limited knee bend.",
      "Underwater: narrow dolphin kicks with clean breakout timing.",
      "Pull: set pressure early instead of slipping through the catch."
    ],
    Breaststroke: [
      "Kick: keep knees narrower during recovery. Wide knees create drag.",
      "Timing: kick should finish into a tight streamline.",
      "Pull: do not pull too far back; it delays recovery and breaks rhythm.",
      "Head: avoid lifting too high during breath.",
      "Pullout: clean pullout with fast transition into first stroke."
    ],
    Butterfly: [
      "Breath timing: breathe low and early. A high breath drops the hips.",
      "Kick: generate power from hips, not excessive knee bend.",
      "Catch: establish pressure before lifting to breathe.",
      "Recovery: arms should stay relaxed over the water.",
      "Underwater: dolphin kicks should build speed into breakout."
    ],
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
            Upload race video, extract frames, add splits, and generate technical swim feedback.
          </p>
          <div style={{
            marginTop: "20px",
            background: "#5b2c00",
            color: "#fbbf24",
            padding: "15px",
            borderRadius: "10px"
          }}>
            Prototype mode: frames and splits are real. Technical feedback is rule-based until AI vision is connected.
          </div>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "24px"
        }}>
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
            <select
              value={lane}
              onChange={(e) => {
                setLane(e.target.value);
                setShowResult(false);
              }}
              style={{ width: "100%", padding: "12px", borderRadius: "8px", marginBottom: "20px" }}
            >
              {[1,2,3,4,5,6,7,8].map((n) => <option key={n}>{n}</option>)}
            </select>

            <p>Stroke</p>
            <select
              value={stroke}
              onChange={(e) => {
                setStroke(e.target.value);
                setShowResult(false);
              }}
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
              onChange={(e) => {
                setDistance(e.target.value);
                setShowResult(false);
              }}
              style={{ width: "100%", padding: "12px", borderRadius: "8px", marginBottom: "20px" }}
            >
              <option>50</option>
              <option>100</option>
              <option>200</option>
              <option>500</option>
            </select>

            <h2>Split Times</h2>

            {[
              ["15m Split", split15, setSplit15],
              ["35m Split", split35, setSplit35],
              ["50m Split", split50, setSplit50],
              ["75m Split", split75, setSplit75],
              ["Final Time", finalTime, setFinalTime],
            ].map(([label, value, setter]) => (
              <div key={label}>
                <p>{label}</p>
                <input
                  type="number"
                  step="0.01"
                  placeholder="Example: 28.83"
                  value={value}
                  onChange={(e) => {
                    setter(e.target.value);
                    setShowResult(false);
                  }}
                  style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "none", marginBottom: "12px" }}
                />
              </div>
            ))}

            <h2>Upload Race Video</h2>

            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                handleVideo(e.dataTransfer.files[0]);
              }}
              onPaste={(e) => handleVideo(e.clipboardData.files[0])}
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
              <p style={{ color: "#94a3b8" }}>Or choose a video file from your computer</p>

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
                  ref={videoRef}
                  src={videoUrl}
                  controls
                  playsInline
                  onLoadedMetadata={(e) => setVideoDuration(e.target.duration.toFixed(2) + " seconds")}
                  style={{ width: "100%", borderRadius: "12px", marginBottom: "20px", background: "black" }}
                />

                <div style={{ background: "#0f172a", padding: "15px", borderRadius: "10px", marginBottom: "20px" }}>
                  <p><strong>File:</strong> {fileName}</p>
                  <p><strong>Type:</strong> {fileType}</p>
                  <p><strong>Size:</strong> {fileSize}</p>
                  <p><strong>Duration:</strong> {videoDuration || "Loading..."}</p>
                </div>

                <button
                  onClick={extractFrames}
                  style={{
                    width: "100%",
                    padding: "15px",
                    background: "#22c55e",
                    color: "white",
                    border: "none",
                    borderRadius: "10px",
                    cursor: "pointer",
                    fontSize: "18px",
                    fontWeight: "bold",
                    marginBottom: "20px"
                  }}
                >
                  {isExtracting ? "Extracting Frames..." : "Extract Key Frames"}
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
              Generate Technical Race Feedback
            </button>
          </div>

          <div style={{ background: "#1e293b", padding: "30px", borderRadius: "18px" }}>
            <h2>SwimAI Report</h2>

            {frames.length > 0 && (
              <div style={{ background: "#0f172a", padding: "20px", borderRadius: "12px", marginBottom: "20px" }}>
                <h3>Extracted Video Frames</h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  {frames.map((frame, index) => (
                    <div key={index}>
                      <img src={frame.image} alt={frame.label} style={{ width: "100%", borderRadius: "8px", border: "1px solid #334155" }} />
                      <p style={{ color: "#cbd5e1", fontSize: "14px" }}>{frame.label} — {frame.time}s</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!showResult && (
              <p style={{ color: "#94a3b8", fontSize: "20px", lineHeight: "1.6" }}>
                Add race details, split times, and video to generate technical feedback.
              </p>
            )}

            {showResult && (
              <>
                <div style={{ background: "#0f172a", padding: "20px", borderRadius: "12px", marginBottom: "20px" }}>
                  <p><strong>Swimmer:</strong> {swimmerName || "Not Entered"}</p>
                  <p><strong>Event:</strong> {distance} {stroke}</p>
                  <p><strong>Lane:</strong> {lane}</p>
                  <p><strong>Video:</strong> {fileName || "No Video Uploaded"}</p>
                  <p><strong>Frames Extracted:</strong> {frames.length}</p>
                  <h1 style={{ color: "#38bdf8" }}>Technical Review</h1>
                </div>

                <div style={{ background: "#1e1b4b", padding: "18px", borderRadius: "12px", marginBottom: "15px" }}>
                  <h3>Split Analysis</h3>
                  {getSplitAnalysis().map((note, index) => (
                    <p key={index}>• {note}</p>
                  ))}
                </div>

                <div style={{ background: "#0f172a", padding: "18px", borderRadius: "12px", marginBottom: "15px" }}>
                  <h3>Lane-Specific Review</h3>
                  <p>{laneFeedback[lane]}</p>
                </div>

                <div style={{ background: "#052e2b", padding: "18px", borderRadius: "12px", marginBottom: "15px" }}>
                  <h3>{stroke} Technical Focus</h3>
                  {strokeFeedback[stroke].map((item, index) => (
                    <p key={index}>• {item}</p>
                  ))}
                </div>

                <div style={{ background: "#3b1d0b", padding: "18px", borderRadius: "12px" }}>
                  <h3>Next Step</h3>
                  <p>
                    This now supports split-based feedback. The next major step is AI vision so SwimAI can detect elbow position,
                    kick mechanics, underwater distance, and breakout quality directly from extracted frames.
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