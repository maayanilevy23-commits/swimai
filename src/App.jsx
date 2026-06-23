import { useState, useRef } from "react";

function App() {
  const [stroke, setStroke] = useState("Freestyle");
  const [distance, setDistance] = useState("100");
  const [swimmerName, setSwimmerName] = useState("");
  const [lane, setLane] = useState("5");
  const [fileName, setFileName] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [frames, setFrames] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);

  const videoRef = useRef(null);

  const handleVideo = (file) => {
    if (!file) return;

    if (!file.type.startsWith("video/")) {
      alert("Please upload a video file.");
      return;
    }

    setFileName(file.name);
    setVideoUrl(URL.createObjectURL(file));
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
      duration * 0.28,
      duration * 0.46,
      duration * 0.64,
      duration * 0.82,
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
            label: `Key Moment ${i + 1}`,
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

  const strokeFeedback = {
    Freestyle: [
      "High-elbow catch should be maintained before pressure is applied.",
      "Kick should stay compact from the hips with limited knee bend.",
      "Breathing should happen through rotation, not head lift.",
      "Breakout should connect directly into the first stroke."
    ],
    Backstroke: [
      "Head should remain still to keep hips high.",
      "Hand entry should stay close to shoulder line without crossover.",
      "Underwater dolphin kicks should stay narrow and connected.",
      "Tempo should stay consistent through the second half."
    ],
    Breaststroke: [
      "Knees should stay narrow during kick recovery.",
      "Pull and kick timing should finish into a tight streamline.",
      "Head lift should stay low to reduce frontal drag.",
      "Pullout should transition quickly into the first stroke."
    ],
    Butterfly: [
      "Breath should stay low and early to prevent hip drop.",
      "Kick power should come from the hips, not excessive knee bend.",
      "Catch should establish pressure before the breath.",
      "Recovery should stay relaxed as fatigue builds."
    ],
  };

  const laneFeedback = {
    1: "Outside lane: prioritize straight-line swimming and breakout visibility.",
    2: "Lane 2: monitor lane-line drift and kick width.",
    3: "Lane 3: good visibility for hand entry, breathing mechanics, and turn approach.",
    4: "Center lane: ideal for evaluating tempo, pull path, kick rhythm, and wall speed.",
    5: "Center lane: strong visibility for body position, elbow angle, underwater timing, and late-race fatigue.",
    6: "Lane 6: review breathing-side mechanics and lane drift.",
    7: "Lane 7: focus on larger technical patterns like body line, kick timing, and head position.",
    8: "Outside lane: best reviewed for start, breakout distance, straight-line path, and finish timing.",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top left, #0ea5e9 0, transparent 30%), linear-gradient(135deg, #020617, #0f172a 50%, #082f49)",
        color: "white",
        fontFamily:
          "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Arial",
        padding: "32px",
      }}
    >
      <div style={{ maxWidth: "1250px", margin: "0 auto" }}>
        <nav
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "45px",
          }}
        >
          <div style={{ fontSize: "26px", fontWeight: "900" }}>
            🏊 SwimAI
          </div>

          <div
            style={{
              color: "#cbd5e1",
              fontSize: "14px",
              border: "1px solid #334155",
              padding: "8px 14px",
              borderRadius: "999px",
              background: "rgba(15,23,42,0.65)",
            }}
          >
            Prototype Preview
          </div>
        </nav>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "1.15fr 0.85fr",
            gap: "28px",
            alignItems: "center",
            marginBottom: "32px",
          }}
        >
          <div>
            <div
              style={{
                display: "inline-block",
                padding: "8px 14px",
                borderRadius: "999px",
                background: "rgba(56,189,248,0.12)",
                border: "1px solid rgba(56,189,248,0.35)",
                color: "#7dd3fc",
                marginBottom: "18px",
                fontWeight: "700",
              }}
            >
              Race video review for competitive swimmers
            </div>

            <h1
              style={{
                fontSize: "68px",
                lineHeight: "0.95",
                margin: "0 0 20px",
                letterSpacing: "-2px",
              }}
            >
              Turn race video into coachable insight.
            </h1>

            <p
              style={{
                color: "#cbd5e1",
                fontSize: "21px",
                lineHeight: "1.6",
                maxWidth: "760px",
              }}
            >
              Upload a swim race, preview the footage, extract key moments, and
              generate a technical review focused on stroke mechanics, underwater
              execution, kick quality, turns, and race discipline.
            </p>

            <div style={{ display: "flex", gap: "12px", marginTop: "24px" }}>
              <div
                style={{
                  background: "rgba(15,23,42,0.75)",
                  border: "1px solid #334155",
                  borderRadius: "16px",
                  padding: "16px 18px",
                }}
              >
                <div style={{ fontSize: "28px", fontWeight: "900" }}>5</div>
                <div style={{ color: "#94a3b8" }}>key frames</div>
              </div>

              <div
                style={{
                  background: "rgba(15,23,42,0.75)",
                  border: "1px solid #334155",
                  borderRadius: "16px",
                  padding: "16px 18px",
                }}
              >
                <div style={{ fontSize: "28px", fontWeight: "900" }}>8</div>
                <div style={{ color: "#94a3b8" }}>lane support</div>
              </div>

              <div
                style={{
                  background: "rgba(15,23,42,0.75)",
                  border: "1px solid #334155",
                  borderRadius: "16px",
                  padding: "16px 18px",
                }}
              >
                <div style={{ fontSize: "28px", fontWeight: "900" }}>4</div>
                <div style={{ color: "#94a3b8" }}>stroke types</div>
              </div>
            </div>
          </div>

          <div
            style={{
              background: "rgba(15,23,42,0.82)",
              border: "1px solid rgba(148,163,184,0.25)",
              borderRadius: "28px",
              padding: "26px",
              boxShadow: "0 25px 80px rgba(0,0,0,0.45)",
            }}
          >
            <h2 style={{ marginTop: 0 }}>Quick Race Setup</h2>

            <p style={{ color: "#94a3b8" }}>
              Add race details before uploading the video.
            </p>

            <label>Name</label>
            <input
              value={swimmerName}
              onChange={(e) => setSwimmerName(e.target.value)}
              placeholder="Name"
              style={{
                width: "100%",
                padding: "14px",
                margin: "8px 0 16px",
                borderRadius: "12px",
                border: "1px solid #334155",
                background: "#020617",
                color: "white",
              }}
            />

            <label>Lane</label>
            <select
              value={lane}
              onChange={(e) => setLane(e.target.value)}
              style={{
                width: "100%",
                padding: "14px",
                margin: "8px 0 16px",
                borderRadius: "12px",
                background: "#020617",
                color: "white",
                border: "1px solid #334155",
              }}
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                <option key={n}>{n}</option>
              ))}
            </select>

            <label>Stroke</label>
            <select
              value={stroke}
              onChange={(e) => setStroke(e.target.value)}
              style={{
                width: "100%",
                padding: "14px",
                margin: "8px 0 16px",
                borderRadius: "12px",
                background: "#020617",
                color: "white",
                border: "1px solid #334155",
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
              onChange={(e) => setDistance(e.target.value)}
              style={{
                width: "100%",
                padding: "14px",
                margin: "8px 0 0",
                borderRadius: "12px",
                background: "#020617",
                color: "white",
                border: "1px solid #334155",
              }}
            >
              <option>50</option>
              <option>100</option>
              <option>200</option>
              <option>500</option>
            </select>
          </div>
        </section>

        <main
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "26px",
          }}
        >
          <div
            style={{
              background: "rgba(15,23,42,0.86)",
              border: "1px solid rgba(148,163,184,0.25)",
              borderRadius: "28px",
              padding: "28px",
              boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
            }}
          >
            <h2 style={{ marginTop: 0 }}>Upload Race Video</h2>

            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                handleVideo(e.dataTransfer.files[0]);
              }}
              style={{
                border: "2px dashed rgba(56,189,248,0.65)",
                borderRadius: "22px",
                padding: "34px",
                textAlign: "center",
                background:
                  "linear-gradient(180deg, rgba(8,47,73,0.45), rgba(2,6,23,0.8))",
                marginBottom: "22px",
              }}
            >
              <div style={{ fontSize: "40px", marginBottom: "10px" }}>🎥</div>
              <h3 style={{ margin: "0 0 8px" }}>Drop your swim race here</h3>
              <p style={{ color: "#94a3b8", marginTop: 0 }}>
                Supports MP4, MOV, and iPhone video exports.
              </p>

              <input
                type="file"
                accept="video/*,.mov,.mp4,.m4v"
                onChange={(e) => handleVideo(e.target.files[0])}
              />

              {fileName && (
                <p style={{ color: "#38bdf8", marginTop: "14px" }}>
                  Selected: {fileName}
                </p>
              )}
            </div>

            {videoUrl && (
              <>
                <video
                  ref={videoRef}
                  src={videoUrl}
                  controls
                  playsInline
                  style={{
                    width: "100%",
                    borderRadius: "18px",
                    background: "black",
                    marginBottom: "18px",
                    border: "1px solid #334155",
                  }}
                />

                <button
                  onClick={extractFrames}
                  style={{
                    width: "100%",
                    padding: "16px",
                    borderRadius: "14px",
                    border: "none",
                    background: "linear-gradient(135deg, #22c55e, #14b8a6)",
                    color: "white",
                    fontWeight: "900",
                    fontSize: "16px",
                    cursor: "pointer",
                    marginBottom: "12px",
                  }}
                >
                  {isExtracting ? "Extracting Key Moments..." : "Extract Key Moments"}
                </button>
              </>
            )}

            <button
              onClick={() => setShowResult(true)}
              style={{
                width: "100%",
                padding: "16px",
                borderRadius: "14px",
                border: "none",
                background: "linear-gradient(135deg, #38bdf8, #2563eb)",
                color: "white",
                fontWeight: "900",
                fontSize: "16px",
                cursor: "pointer",
              }}
            >
              Generate Technical Review
            </button>
          </div>

          <div
            style={{
              background: "rgba(15,23,42,0.86)",
              border: "1px solid rgba(148,163,184,0.25)",
              borderRadius: "28px",
              padding: "28px",
              boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
            }}
          >
            <h2 style={{ marginTop: 0 }}>SwimAI Review</h2>

            {!showResult && frames.length === 0 && (
              <p style={{ color: "#94a3b8", fontSize: "18px", lineHeight: "1.6" }}>
                Upload a video, extract key moments, and generate a technical
                race review.
              </p>
            )}

            {frames.length > 0 && (
              <div style={{ marginBottom: "22px" }}>
                <h3>Extracted Key Moments</h3>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "12px",
                  }}
                >
                  {frames.map((frame, index) => (
                    <div
                      key={index}
                      style={{
                        background: "#020617",
                        borderRadius: "14px",
                        padding: "8px",
                        border: "1px solid #334155",
                      }}
                    >
                      <img
                        src={frame.image}
                        alt={frame.label}
                        style={{ width: "100%", borderRadius: "10px" }}
                      />
                      <p style={{ color: "#cbd5e1", fontSize: "13px" }}>
                        {frame.label} · {frame.time}s
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {showResult && (
              <div>
                <div
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(14,165,233,0.18), rgba(15,23,42,0.9))",
                    border: "1px solid rgba(56,189,248,0.35)",
                    padding: "20px",
                    borderRadius: "18px",
                    marginBottom: "16px",
                  }}
                >
                  <h3 style={{ marginTop: 0 }}>Race Profile</h3>
                  <p><strong>Swimmer:</strong> {swimmerName || "Not entered"}</p>
                  <p><strong>Event:</strong> {distance} {stroke}</p>
                  <p><strong>Lane:</strong> {lane}</p>
                  <p><strong>Video:</strong> {fileName || "No video selected"}</p>
                </div>

                <div
                  style={{
                    background: "rgba(8,47,73,0.65)",
                    padding: "18px",
                    borderRadius: "18px",
                    marginBottom: "14px",
                    border: "1px solid rgba(56,189,248,0.22)",
                  }}
                >
                  <h3>{stroke} Mechanics</h3>
                  {strokeFeedback[stroke].map((item, index) => (
                    <p key={index}>• {item}</p>
                  ))}
                </div>

                <div
                  style={{
                    background: "rgba(2,6,23,0.75)",
                    padding: "18px",
                    borderRadius: "18px",
                    marginBottom: "14px",
                    border: "1px solid #334155",
                  }}
                >
                  <h3>Lane Context</h3>
                  <p>{laneFeedback[lane]}</p>
                </div>

                <div
                  style={{
                    background: "rgba(59,29,11,0.85)",
                    padding: "18px",
                    borderRadius: "18px",
                    border: "1px solid rgba(251,191,36,0.22)",
                  }}
                >
                  <h3>Next AI Step</h3>
                  <p>
                    This prototype extracts real key frames. The next version can
                    send those frames to a vision model to detect elbow position,
                    kick mechanics, underwater quality, body line, and breakout timing.
                  </p>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;