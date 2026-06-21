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
      duration * 0.1,
      duration * 0.3,
      duration * 0.5,
      duration * 0.7,
      duration * 0.9,
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
            image: canvas.toDataURL("image/jpeg", 0.8),
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

  const getTechnicalReport = () => {
    if (distance === "50") {
      return "For a 50, the highest-value review points are start quality, breakout timing, first-15m velocity, tempo stability, and finish mechanics. Any delay in breakout or loss of tempo has a large impact because there is no time to recover.";
    }

    if (distance === "100") {
      return "For a 100, review whether the swimmer maintains distance-per-stroke after the first 50. Key indicators are tempo decay, breath timing, turn speed, breakout distance, and whether stroke length shortens under fatigue.";
    }

    if (distance === "200") {
      return "For a 200, evaluate pacing discipline across all four 50s. The report should look for controlled early speed, stable stroke count, efficient turns, and limited technical breakdown in the third and fourth 50.";
    }

    return "For a 500, the key technical markers are sustainable tempo, consistent breathing rhythm, stroke economy, turn repeatability, and minimizing efficiency loss over the back half of the race.";
  };

  const getStrokeReport = () => {
    if (stroke === "Freestyle") {
      return "Freestyle focus: body rotation, breathing disruption, distance-per-stroke, catch timing, kick consistency, and whether the head position rises during breathing.";
    }

    if (stroke === "Backstroke") {
      return "Backstroke focus: head stability, hip height, shoulder rotation, hand entry alignment, underwater breakout timing, and whether the swimmer maintains rhythm without crossing over.";
    }

    if (stroke === "Breaststroke") {
      return "Breaststroke focus: pull-kick timing, streamline after each kick, glide length, head lift, pullout execution, and whether the swimmer rushes the recovery phase.";
    }

    return "Butterfly focus: timing of the breath, second-kick strength, body undulation, hip position, arm recovery fatigue, and whether the swimmer loses rhythm late in the race.";
  };

  const getLaneReport = () => {
    if (lane === "1" || lane === "8") {
      return "Outside-lane note: camera angle may make swimmer tracking harder. For real AI analysis, the model will need clear lane selection and enough side visibility to avoid confusing adjacent swimmers.";
    }

    if (lane === "4" || lane === "5") {
      return "Center-lane note: this is usually the best setup for video review because the swimmer is more likely to stay visible and less distorted by angle.";
    }

    return "Mid-lane note: visibility should be usable, but review quality depends heavily on camera position, zoom, and whether adjacent swimmers overlap the selected lane.";
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
            Upload race video, preview it, extract real frames, and prepare for AI video analysis.
          </p>

          <div style={{
            marginTop: "20px",
            background: "#5b2c00",
            color: "#fbbf24",
            padding: "15px",
            borderRadius: "10px"
          }}>
            Prototype mode: frames are extracted from the actual video. Feedback is still sample logic until AI is connected.
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
                Or choose a video file from your computer
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
                  ref={videoRef}
                  src={videoUrl}
                  controls
                  playsInline
                  onLoadedMetadata={(e) => {
                    setVideoDuration(e.target.duration.toFixed(2) + " seconds");
                  }}
                  style={{
                    width: "100%",
                    borderRadius: "12px",
                    marginBottom: "20px",
                    background: "black"
                  }}
                />

                <div style={{
                  background: "#0f172a",
                  padding: "15px",
                  borderRadius: "10px",
                  marginBottom: "20px"
                }}>
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
              Generate Video-Informed Sample Report
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
                Upload a video, extract frames, and generate a technical sample report.
              </p>
            )}

            {frames.length > 0 && (
              <div style={{
                background: "#0f172a",
                padding: "20px",
                borderRadius: "12px",
                marginBottom: "20px"
              }}>
                <h3>Extracted Video Frames</h3>
                <p style={{ color: "#94a3b8" }}>
                  These images are captured from the actual uploaded video.
                </p>

                <div style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "12px"
                }}>
                  {frames.map((frame, index) => (
                    <div key={index}>
                      <img
                        src={frame.image}
                        alt={frame.label}
                        style={{
                          width: "100%",
                          borderRadius: "8px",
                          border: "1px solid #334155"
                        }}
                      />
                      <p style={{ color: "#cbd5e1", fontSize: "14px" }}>
                        {frame.label} — {frame.time}s
                      </p>
                    </div>
                  ))}
                </div>
              </div>
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
                  <p><strong>Frames Extracted:</strong> {frames.length}</p>
                  <h1 style={{ color: "#38bdf8" }}>Video Pipeline Ready</h1>
                </div>

                <div style={{ background: "#052e2b", padding: "18px", borderRadius: "12px", marginBottom: "15px" }}>
                  <h3>Video Processing Status</h3>
                  <p>
                    SwimAI successfully loaded the video, read the video metadata,
                    and extracted key frames from the actual uploaded file.
                  </p>
                </div>

                <div style={{ background: "#0f172a", padding: "18px", borderRadius: "12px", marginBottom: "15px" }}>
                  <h3>Distance-Specific Review Logic</h3>
                  <p>{getTechnicalReport()}</p>
                </div>

                <div style={{ background: "#0f172a", padding: "18px", borderRadius: "12px", marginBottom: "15px" }}>
                  <h3>Stroke-Specific Review Logic</h3>
                  <p>{getStrokeReport()}</p>
                </div>

                <div style={{ background: "#0f172a", padding: "18px", borderRadius: "12px", marginBottom: "15px" }}>
                  <h3>Lane / Camera Context</h3>
                  <p>{getLaneReport()}</p>
                </div>

                <div style={{ background: "#3b1d0b", padding: "18px", borderRadius: "12px" }}>
                  <h3>Next Real AI Step</h3>
                  <p>
                    The next step is sending these extracted frames to an AI vision model.
                    That is where feedback will start coming directly from what the swimmer is doing in the video.
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