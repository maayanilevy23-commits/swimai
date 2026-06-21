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

  const strokeTechnicalFeedback = {
    Freestyle: [
      "Maintain a longer catch phase before initiating the pull; avoid slipping water early.",
      "Keep the head lower during breathing so the hips do not drop.",
      "Drive rotation from the hips and shoulders instead of crossing the arm across the center line.",
      "Keep kick compact; avoid excessive knee bend that creates drag.",
      "Hold distance-per-stroke late in the race instead of relying only on faster tempo."
    ],
    Backstroke: [
      "Keep the head still and avoid lifting the chin, which can drop the hips.",
      "Improve shoulder rotation to create a deeper catch and stronger pull path.",
      "Avoid crossing over on hand entry; enter closer to shoulder line.",
      "Maintain hip height through the second half of the race.",
      "Underwater breakout should stay tighter with stronger dolphin-kick rhythm."
    ],
    Breaststroke: [
      "Improve pull-kick timing so the kick finishes into a tighter streamline.",
      "Avoid lifting the head too high during the breath; this increases frontal drag.",
      "Keep knees narrower during the kick recovery to reduce resistance.",
      "Hold the glide line longer after the kick without pausing too long.",
      "Pullout should finish with a cleaner transition into the first stroke."
    ],
    Butterfly: [
      "Use a smoother first kick into the catch instead of forcing the upper body up.",
      "Keep the breath lower and earlier to avoid hips dropping.",
      "Maintain second-kick strength as the arms recover forward.",
      "Avoid bending the knees too much during the kick; generate power from the hips.",
      "Hold rhythm late in the race instead of shortening the front-end catch."
    ]
  };

  const distanceTechnicalFeedback = {
    50: [
      "Reaction time and first 15 meters are critical; start mechanics should be a top priority.",
      "Breakout must be aggressive but controlled; surfacing too early costs speed.",
      "No pacing phase — the swimmer must hold maximum tempo with clean mechanics.",
      "Finish should be timed without gliding into the wall."
    ],
    100: [
      "The key risk is tempo decay after the first 50.",
      "Second 50 should maintain stroke length, not just increase turnover.",
      "Turn speed and breakout distance can decide the race.",
      "Breathing pattern should stay controlled under fatigue."
    ],
    200: [
      "Pacing should be controlled through the first 100 with no major technical breakdown.",
      "Third 50 is usually where stroke length and body line start to fail.",
      "Turns need to stay consistent; slow walls compound over the race.",
      "Efficiency matters more than raw tempo."
    ],
    500: [
      "Primary focus should be rhythm consistency and stroke economy.",
      "Breathing pattern must stay stable to avoid late-race collapse.",
      "Every turn should be repeatable and low-effort.",
      "Avoid over-kicking early; save legs for the final 100."
    ]
  };

  const laneTechnicalFeedback = () => {
    if (lane === "1" || lane === "8") {
      return "Outside lane: review may be affected by camera angle. Best focus areas are breakout visibility, body line, and lane-relative movement.";
    }

    if (lane === "4" || lane === "5") {
      return "Center lane: best visibility for technical review. This is ideal for analyzing tempo, body position, turns, and breakout timing.";
    }

    return "Middle lane: visibility should be usable, but adjacent swimmers may interfere with lane-specific tracking.";
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
            Upload race video, extract frames, and generate technical swim feedback.
          </p>

          <div style={{
            marginTop: "20px",
            background: "#5b2c00",
            color: "#fbbf24",
            padding: "15px",
            borderRadius: "10px"
          }}>
            Prototype mode: video frames are real. Feedback is technical sample logic until AI is connected.
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
              placeholder="Name"
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
              Generate Technical Race Feedback
            </button>
          </div>

          <div style={{
            background: "#1e293b",
            padding: "30px",
            borderRadius: "18px"
          }}>
            <h2>SwimAI Report</h2>

            {frames.length > 0 && (
              <div style={{
                background: "#0f172a",
                padding: "20px",
                borderRadius: "12px",
                marginBottom: "20px"
              }}>
                <h3>Extracted Video Frames</h3>

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

            {!showResult && (
              <p style={{ color: "#94a3b8", fontSize: "20px", lineHeight: "1.6" }}>
                Upload a video, extract frames, and generate technical feedback.
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
                  <p><strong>Frames Extracted:</strong> {frames.length}</p>
                  <h1 style={{ color: "#38bdf8" }}>Technical Review</h1>
                </div>

                <div style={{ background: "#052e2b", padding: "18px", borderRadius: "12px", marginBottom: "15px" }}>
                  <h3>Stroke-Specific Technical Focus</h3>
                  {strokeTechnicalFeedback[stroke].map((item, index) => (
                    <p key={index}>• {item}</p>
                  ))}
                </div>

                <div style={{ background: "#0f172a", padding: "18px", borderRadius: "12px", marginBottom: "15px" }}>
                  <h3>Distance-Specific Race Priorities</h3>
                  {distanceTechnicalFeedback[distance].map((item, index) => (
                    <p key={index}>• {item}</p>
                  ))}
                </div>

                <div style={{ background: "#0f172a", padding: "18px", borderRadius: "12px", marginBottom: "15px" }}>
                  <h3>Lane / Camera Context</h3>
                  <p>{laneTechnicalFeedback()}</p>
                </div>

                <div style={{ background: "#3b1d0b", padding: "18px", borderRadius: "12px" }}>
                  <h3>Important</h3>
                  <p>
                    These are technical sample recommendations based on stroke, distance, and lane.
                    The extracted frames are real. The next step is connecting AI vision so the feedback
                    comes directly from the swimmer's actual body position and race execution.
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