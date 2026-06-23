import { useState, useRef } from "react";

function App() {
  const [showResult, setShowResult] = useState(false);
  const [stroke, setStroke] = useState("Freestyle");
  const [distance, setDistance] = useState("100");
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState("");
  const [fileType, setFileType] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [videoDurationSeconds, setVideoDurationSeconds] = useState(null);
  const [swimmerName, setSwimmerName] = useState("");
  const [lane, setLane] = useState("5");
  const [frames, setFrames] = useState([]);
  const [isExtracting, setIsExtracting] = useState(false);

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
    setVideoDurationSeconds(null);
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

  const getEstimatedSplits = () => {
    if (!videoDurationSeconds) return null;

    const total = videoDurationSeconds;

    if (distance === "50") {
      return {
        split15: total * 0.28,
        split35: total * 0.68,
        split50: total,
        finalTime: total,
      };
    }

    if (distance === "100") {
      return {
        split15: total * 0.12,
        split35: total * 0.30,
        split50: total * 0.47,
        split75: total * 0.73,
        finalTime: total,
      };
    }

    if (distance === "200") {
      return {
        split15: total * 0.07,
        split35: total * 0.16,
        split50: total * 0.24,
        split75: total * 0.37,
        split100: total * 0.50,
        split150: total * 0.76,
        finalTime: total,
      };
    }

    return {
      split15: total * 0.03,
      split35: total * 0.07,
      split50: total * 0.10,
      split100: total * 0.20,
      split250: total * 0.50,
      finalTime: total,
    };
  };

  const formatTime = (seconds) => {
    if (!seconds && seconds !== 0) return "—";

    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;

    if (mins > 0) {
      return `${mins}:${secs.toFixed(2).padStart(5, "0")}`;
    }

    return secs.toFixed(2);
  };

  const getSplitFeedback = () => {
    const splits = getEstimatedSplits();

    if (!splits) {
      return ["Upload a video so SwimAI can estimate splits from the video duration."];
    }

    const notes = [];

    notes.push(`Estimated 15m: ${formatTime(splits.split15)}. This represents start, streamline, underwater speed, and breakout timing.`);
    notes.push(`Estimated 35m: ${formatTime(splits.split35)}. This helps estimate early surface speed after the breakout.`);

    if (distance === "50") {
      notes.push(`Estimated finish: ${formatTime(splits.finalTime)}.`);
      notes.push("For a 50, the highest-priority review areas are reaction, breakout, tempo, kick speed, and no glide into the wall.");
    }

    if (distance === "100") {
      const first50 = splits.split50;
      const second50 = splits.finalTime - splits.split50;
      const dropOff = second50 - first50;

      notes.push(`Estimated 50m split: ${formatTime(first50)}.`);
      notes.push(`Estimated 75m split: ${formatTime(splits.split75)}.`);
      notes.push(`Estimated second 50: ${formatTime(second50)}.`);
      notes.push(`Estimated drop-off: ${dropOff >= 0 ? "+" : ""}${dropOff.toFixed(2)} seconds.`);

      if (dropOff > 3) {
        notes.push("Large estimated fade. Focus on holding stroke length, kick pressure, and turn speed after the 50.");
      } else if (dropOff > 1.5) {
        notes.push("Moderate estimated fade. Main focus should be maintaining tempo without shortening the pull.");
      } else {
        notes.push("Estimated pacing looks controlled. Focus shifts to breakout quality and small technical details.");
      }
    }

    if (distance === "200") {
      notes.push(`Estimated 50m: ${formatTime(splits.split50)}.`);
      notes.push(`Estimated 100m: ${formatTime(splits.split100)}.`);
      notes.push(`Estimated 150m: ${formatTime(splits.split150)}.`);
      notes.push("For a 200, the third 50 is usually where stroke length, body line, and tempo discipline start to break down.");
    }

    if (distance === "500") {
      notes.push(`Estimated 50m: ${formatTime(splits.split50)}.`);
      notes.push(`Estimated 100m: ${formatTime(splits.split100)}.`);
      notes.push(`Estimated 250m: ${formatTime(splits.split250)}.`);
      notes.push("For a 500, the key indicators are repeatable turns, stable breathing rhythm, and avoiding excessive kick fatigue early.");
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
      "Breathing: rotate to breathe instead of lifting the head forward.",
    ],
    Backstroke: [
      "Head position: keep the head still. Chin lift drops the hips.",
      "Entry: avoid crossing over behind the head. Enter closer to shoulder line.",
      "Kick: steady flutter kick with high hips and limited knee bend.",
      "Underwater: narrow dolphin kicks with clean breakout timing.",
      "Pull: set pressure early instead of slipping through the catch.",
    ],
    Breaststroke: [
      "Kick: keep knees narrower during recovery. Wide knees create drag.",
      "Timing: kick should finish into a tight streamline.",
      "Pull: do not pull too far back; it delays recovery and breaks rhythm.",
      "Head: avoid lifting too high during breath.",
      "Pullout: clean pullout with fast transition into first stroke.",
    ],
    Butterfly: [
      "Breath timing: breathe low and early. A high breath drops the hips.",
      "Kick: generate power from hips, not excessive knee bend.",
      "Catch: establish pressure before lifting to breathe.",
      "Recovery: arms should stay relaxed over the water.",
      "Underwater: dolphin kicks should build speed into breakout.",
    ],
  };

  const estimatedSplits = getEstimatedSplits();

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
            Upload race video, extract frames, and estimate split times automatically.
          </p>

          <div style={{
            marginTop: "20px",
            background: "#5b2c00",
            color: "#fbbf24",
            padding: "15px",
            borderRadius: "10px"
          }}>
            Prototype mode: split times are estimated from video duration. They are not official meet splits yet.
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
                  onLoadedMetadata={(e) => {
                    setVideoDurationSeconds(e.target.duration);
                  }}
                  style={{ width: "100%", borderRadius: "12px", marginBottom: "20px", background: "black" }}
                />

                <div style={{ background: "#0f172a", padding: "15px", borderRadius: "10px", marginBottom: "20px" }}>
                  <p><strong>File:</strong> {fileName}</p>
                  <p><strong>Type:</strong> {fileType}</p>
                  <p><strong>Size:</strong> {fileSize}</p>
                  <p><strong>Video Duration:</strong> {videoDurationSeconds ? formatTime(videoDurationSeconds) : "Loading..."}</p>
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
              Generate Estimated Split Report
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
                Upload a video and generate estimated splits from video duration.
              </p>
            )}

            {showResult && (
              <>
                <div style={{ background: "#0f172a", padding: "20px", borderRadius: "12px", marginBottom: "20px" }}>
                  <p><strong>Swimmer:</strong> {swimmerName || "Not Entered"}</p>
                  <p><strong>Event:</strong> {distance} {stroke}</p>
                  <p><strong>Lane:</strong> {lane}</p>
                  <p><strong>Video:</strong> {fileName || "No Video Uploaded"}</p>
                  <p><strong>Video Duration:</strong> {videoDurationSeconds ? formatTime(videoDurationSeconds) : "No video duration available"}</p>
                  <h1 style={{ color: "#38bdf8" }}>Estimated Split Report</h1>
                </div>

                {estimatedSplits && (
                  <div style={{ background: "#1e1b4b", padding: "18px", borderRadius: "12px", marginBottom: "15px" }}>
                    <h3>Estimated Splits</h3>
                    <p><strong>15m:</strong> {formatTime(estimatedSplits.split15)}</p>
                    <p><strong>35m:</strong> {formatTime(estimatedSplits.split35)}</p>
                    {estimatedSplits.split50 && <p><strong>50m:</strong> {formatTime(estimatedSplits.split50)}</p>}
                    {estimatedSplits.split75 && <p><strong>75m:</strong> {formatTime(estimatedSplits.split75)}</p>}
                    {estimatedSplits.split100 && <p><strong>100m:</strong> {formatTime(estimatedSplits.split100)}</p>}
                    {estimatedSplits.split150 && <p><strong>150m:</strong> {formatTime(estimatedSplits.split150)}</p>}
                    {estimatedSplits.split250 && <p><strong>250m:</strong> {formatTime(estimatedSplits.split250)}</p>}
                    <p><strong>Finish:</strong> {formatTime(estimatedSplits.finalTime)}</p>
                  </div>
                )}

                <div style={{ background: "#0f172a", padding: "18px", borderRadius: "12px", marginBottom: "15px" }}>
                  <h3>Split-Based Feedback</h3>
                  {getSplitFeedback().map((note, index) => (
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
                  <h3>Important</h3>
                  <p>
                    These splits are estimated from video duration only. For accurate splits, SwimAI will need
                    either manual timeline markers or AI/computer vision to detect the start, 15m, 35m, walls, and finish.
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