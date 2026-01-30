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

  // Top Ad Script
  useEffect(() => {
    const script = document.createElement("script");
    script.innerHTML = `
      atOptions = {
        'key' : 'b08bb8c33e3d7563562686618ec84848',
        'format' : 'iframe',
        'height' : 90,
        'width' : 728,
        'params' : {}
      };
    `;
    const scriptSrc = document.createElement("script");
    scriptSrc.src = "https://www.highperformanceformat.com/b08bb8c33e3d7563562686618ec84848/invoke.js";
    scriptSrc.async = true;

    document.body.prepend(script);
    document.body.prepend(scriptSrc);

    return () => {
      script.remove();
      scriptSrc.remove();
    };
  }, []);

  // Timer countdown
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    }
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
    <div style={{ width: "100vw", height: "100vh", position: "relative" }}>

      {/* Top Ad Placeholder */}
      <div style={{ width: "100%", textAlign: "center", marginBottom: "20px" }}>
        <div id="top-ad"></div>
      </div>

      {/* Home Buttons */}
      {!activePage && (
        <div style={{
          height: "calc(100vh - 350px)",
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

      {/* Bottom Ad Script */}
      <div id="bottom-ad" style={{ position: "absolute", bottom: 0, right: 0 }}>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              atOptions = {
                'key' : 'cf112d050bf90b1a1ddf6ab695fbde86',
                'format' : 'iframe',
                'height' : 250,
                'width' : 300,
                'params' : {}
              };
            `
          }}
        ></script>
        <script src="https://www.highperformanceformat.com/cf112d050bf90b1a1ddf6ab695fbde86/invoke.js"></script>
      </div>
    </div>
  );
}

export default App;
