import { useState, useEffect } from "react";
import LearnWithAudio from "./components/LearnWithAudio";
import LearnWithAudioEnglish from "./components/LearnWithAudioEnglish";
import Audios3Bolkar from "./components/Audios3Bolkar";
import HindiToSansikritAudio from "./components/HindiToSansikritAudio";

const AD_URL = "https://www.effectivegatecpm.com/ynr4zqfyc?key=47c7532215e22f2958124a99aa5ab73e";

function App() {
  const [activePage, setActivePage] = useState(null);
  const [adShown, setAdShown] = useState(false);
  const [timer, setTimer] = useState(0);

  // Timer countdown
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    }

    // Timer finished → component already set in handleOpen
  }, [timer]);

  const handleOpen = (pageName) => {
    if (adShown) {
      setActivePage(pageName);
      return;
    }

    // Open ad first time
    window.open(AD_URL, "_blank");
    setAdShown(true);
    setActivePage(pageName);
    setTimer(5); // 5 second countdown
  };

  // Show countdown if timer is running
  if (timer > 0) {
    return (
      <div style={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        fontFamily: "Arial"
      }}>
        <h2>Ad opened in new tab</h2>
        <p>Opening page in {timer} seconds...</p>
      </div>
    );
  }

  return (
    <div style={{ width: "100vw", height: "100vh" }}>

      {/* Home Buttons */}
      {!activePage && (
        <div style={{
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: "20px"
        }}>
          <button onClick={() => handleOpen("hindiToEnglish")}>
            Hindi → English Practice
          </button>

          <button onClick={() => handleOpen("englishToHindi")}>
            English → Hindi Practice
          </button>



          <button onClick={() => handleOpen("hindiToSansikrit")}>
            Hindi → Sanskirit Practice
          </button>

          <button onClick={() => handleOpen("audios3Bolkar")}>
            Audios 3 Bolkar
          </button>
        </div>
      )}

      {/* Load Components */}
      {activePage === "hindiToEnglish" && <LearnWithAudio />}
      {activePage === "englishToHindi" && <LearnWithAudioEnglish />}
      {activePage === "audios3Bolkar" && <Audios3Bolkar />}
      {activePage === "hindiToSansikrit" && <HindiToSansikritAudio />}
    </div>
  );
}

export default App;
