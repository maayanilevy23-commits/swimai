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

  const laneFeedback = {
    1: {
      title: "Lane 1 Review",
      camera:
        "Outside lane. Review accuracy depends heavily on whether the camera is angled toward lane 1 or centered on the pool. Adjacent-lane interference is lower, but wall-side distortion can make body-line judgment harder.",
      focus:
        "Best focus areas: breakout distance, body line against the lane rope, approach into turns, and whether the swimmer drifts toward the wall side of the lane.",
      risk:
        "Risk: if the camera is on the opposite side, elbow path, kick width, and breathing mechanics may be partially hidden."
    },
    2: {
      title: "Lane 2 Review",
      camera:
        "Lane 2 usually gives better visibility than lane 1, but the outside angle can still make depth and underwater distance harder to judge.",
      focus:
        "Best focus areas: stroke alignment, lane-line stability, kick symmetry, and whether the swimmer maintains a straight path off the breakout.",
      risk:
        "Risk: adjacent swimmers can overlap during the middle of the race, especially during turns and breakouts."
    },
    3: {
      title: "Lane 3 Review",
      camera:
        "Lane 3 is usually a strong review lane because the swimmer is close enough for body mechanics but still central enough to track through turns.",
      focus:
        "Best focus areas: early vertical forearm, hand entry position, kick timing, turn approach speed, and breathing disruption.",
      risk:
        "Risk: camera zoom and side angle may still affect exact underwater distance."
    },
    4: {
      title: "Lane 4 Review",
      camera:
        "Lane 4 is one of the best lanes for review. The swimmer is typically central, easier to track, and less distorted by angle.",
      focus:
        "Best focus areas: start reaction, breakout timing, pull mechanics, tempo consistency, turn speed, and finish timing.",
      risk:
        "Risk: if the camera follows the field instead of the lane, tracking can still shift away during the race."
    },
    5: {
      title: "Lane 5 Review",
      camera:
        "Lane 5 is also ideal for technical review. Center-lane visibility usually allows the clearest view of stroke rhythm, kick, underwater, and turns.",
      focus:
        "Best focus areas: body position, elbow angle during catch, kick amplitude, underwater breakout, wall contact, and late-race tempo decay.",
      risk:
        "Risk: center lanes often have nearby swimmers on both sides, so overlap can affect automated tracking later."
    },
    6: {
      title: "Lane 6 Review",
      camera:
        "Lane 6 is usable for technical review but may start to show more side-angle distortion depending on camera position.",
      focus:
        "Best focus areas: pull path, breathing-side mechanics, lane-line drift, turn approach, and breakout line.",
      risk:
        "Risk: elbow and shoulder mechanics may look different depending on whether the camera is on the swimmer's breathing side."
    },
    7: {
      title: "Lane 7 Review",
      camera:
        "Lane 7 is closer to the outside. Review should focus on large technical patterns rather than tiny joint-angle details unless the camera is close.",
      focus:
        "Best focus areas: kick timing, body-line stability, head position during breathing, turn rotation, and breakout quality.",
      risk:
        "Risk: underwater and elbow detail may be less reliable if the swimmer is far from the camera."
    },
    8: {
      title: "Lane 8 Review",
      camera:
        "Outside lane. Tracking can be clean if the camera is on the same side, but difficult if the swimmer is far from the camera.",
      focus:
        "Best focus areas: start, breakout distance, straight-line swimming, finish timing, and major body-position changes.",
      risk:
        "Risk: detailed elbow, knee, and underwater analysis may require better zoom or a closer camera angle."
    },
  };

  const strokeFeedback = {
    Freestyle: {
      title: "Freestyle Technical Feedback",
      pull:
        "Pull/catch: look for a high-elbow catch. If the elbow drops early, the swimmer will press down on the water instead of anchoring and pulling back.",
      elbow:
        "Elbow position: the elbow should stay higher than the wrist during the catch. A collapsed elbow reduces propulsion and usually increases stroke count.",
      kick:
        "Kick: kick should be compact from the hips. Excessive knee bend creates drag and can make the legs sink late in the race.",
      underwater:
        "Underwater/breakout: streamline should stay tight with no early head lift. The breakout should connect directly into the first stroke without a pause.",
      breathing:
        "Breathing: avoid lifting the head forward. Breath should happen through rotation, not by raising the head out of alignment."
    },
    Backstroke: {
      title: "Backstroke Technical Feedback",
      pull:
        "Pull/catch: hand should enter cleanly and set up pressure quickly. A shallow catch usually leads to slipping water and slower tempo.",
      elbow:
        "Elbow/arm path: avoid crossing over behind the head. Entry should stay closer to the shoulder line to protect alignment and maximize pull.",
      kick:
        "Kick: hips should stay high with a steady flutter kick. Too much knee bend will break the surface and create drag.",
      underwater:
        "Underwater/breakout: dolphin kicks should stay narrow and connected. Breakout timing matters because surfacing too early wastes speed.",
      breathing:
        "Body line: head must remain still. Chin lift or head movement usually causes hip drop and tempo disruption."
    },
    Breaststroke: {
      title: "Breaststroke Technical Feedback",
      pull:
        "Pull: hands should accelerate out and around, then recover quickly forward. Pulling too far back delays the kick and breaks timing.",
      elbow:
        "Elbow position: elbows should stay controlled during the in-sweep. If they drop too low, the swimmer loses leverage and rises too much.",
      kick:
        "Kick: knees should not open too wide. Wide knees create drag; the heels should recover efficiently and snap into a tight streamline.",
      underwater:
        "Underwater/pullout: pullout should be powerful but clean, with a fast transition into the first stroke. A late or weak kick reduces breakout speed.",
      breathing:
        "Timing: breath should fit naturally into the pull. Overlifting the head increases drag and delays the recovery."
    },
    Butterfly: {
      title: "Butterfly Technical Feedback",
      pull:
        "Pull/catch: hands should establish pressure before the breath. If the swimmer lifts to breathe before the catch, the hips drop.",
      elbow:
        "Elbow/arm recovery: arms should recover low and relaxed over the water. Bent or tense recovery usually indicates fatigue or poor rhythm.",
      kick:
        "Kick: power should come from the hips, not excessive knee bend. Knees bending too much creates drag and disrupts rhythm.",
      underwater:
        "Underwater/breakout: dolphin kicks should build speed into the breakout. Surfacing flat or late can kill momentum.",
      breathing:
        "Breathing: breath should be low and quick. A high breath causes the chest to rise and hips to fall."
    },
  };

  const distanceFeedback = {
    50: {
      title: "50 Race Priorities",
      start:
        "Start/reaction: reaction time and first 15 meters are critical. The swimmer cannot afford a slow reaction, loose streamline, or passive breakout.",
      pacing:
        "Race model: no pacing phase. The goal is maximal speed while preserving enough technique to avoid spinning or shortening the stroke.",
      turn:
        "Turns/finish: if this is a 50 with a turn, wall contact and breakout must be aggressive. Finish should not include a glide into the wall."
    },
    100: {
      title: "100 Race Priorities",
      start:
        "Start/reaction: start must be fast but controlled. A poor breakout can force the swimmer to overwork the first 25.",
      pacing:
        "Race model: the key issue is second-half efficiency. Look for stroke length loss, tempo decay, and breathing disruption after the 50.",
      turn:
        "Turns: the 50 turn is a major performance point. Slow rotation or weak push-off can cost more than a small stroke flaw."
    },
    200: {
      title: "200 Race Priorities",
      start:
        "Start/reaction: start matters, but the swimmer should not over-sprint the first 25 at the cost of body position.",
      pacing:
        "Race model: pacing discipline is critical. The third 50 often reveals whether the swimmer can hold technique under fatigue.",
      turn:
        "Turns: repeatable walls matter. Each turn should preserve speed with controlled breakout timing."
    },
    500: {
      title: "500 Race Priorities",
      start:
        "Start/reaction: start should be efficient, not reckless. The goal is to enter the race rhythm quickly.",
      pacing:
        "Race model: focus on stroke economy, breathing rhythm, and minimizing technical breakdown over the back half.",
      turn:
        "Turns: small losses add up. Turn speed, push-off angle, and breakout consistency are major factors across the race."
    },
  };

  const currentLane = laneFeedback[lane];
  const currentStroke = strokeFeedback[stroke];
  const currentDistance = distanceFeedback[distance];

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
            Prototype mode: frames are real. Technical feedback changes by lane, stroke, and distance.
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

                <div style={{ background: "#0f172a", padding: "18px", borderRadius: "12px", marginBottom: "15px" }}>
                  <h3>{currentLane.title}</h3>
                  <p><strong>Camera:</strong> {currentLane.camera}</p>
                  <p><strong>Lane focus:</strong> {currentLane.focus}</p>
                  <p><strong>Tracking risk:</strong> {currentLane.risk}</p>
                </div>

                <div style={{ background: "#052e2b", padding: "18px", borderRadius: "12px", marginBottom: "15px" }}>
                  <h3>{currentStroke.title}</h3>
                  <p><strong>Pull:</strong> {currentStroke.pull}</p>
                  <p><strong>Elbow / arm path:</strong> {currentStroke.elbow}</p>
                  <p><strong>Kick:</strong> {currentStroke.kick}</p>
                  <p><strong>Underwater / breakout:</strong> {currentStroke.underwater}</p>
                  <p><strong>Body / breathing:</strong> {currentStroke.breathing}</p>
                </div>

                <div style={{ background: "#1e1b4b", padding: "18px", borderRadius: "12px", marginBottom: "15px" }}>
                  <h3>{currentDistance.title}</h3>
                  <p><strong>Start / reaction:</strong> {currentDistance.start}</p>
                  <p><strong>Race model:</strong> {currentDistance.pacing}</p>
                  <p><strong>Turns / finish:</strong> {currentDistance.turn}</p>
                </div>

                <div style={{ background: "#3b1d0b", padding: "18px", borderRadius: "12px" }}>
                  <h3>Important</h3>
                  <p>
                    These technical notes change based on lane, stroke, and distance.
                    They are not yet visual AI judgments. To detect a truly bent elbow,
                    knee position, underwater distance, kick timing, or breakout quality
                    from the uploaded video, the next step is connecting AI vision to the extracted frames.
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