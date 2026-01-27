import { useState, useEffect } from "react";
import LearnWithAudio from "./components/LearnWithAudio";
import LearnWithAudioEnglish from "./components/LearnWithAudioEnglish";

const AD_URL = "https://www.effectivegatecpm.com/ynr4zqfyc?key=47c7532215e22f2958124a99aa5ab73e";

function App() {

  const [activePage, setActivePage] = useState(null);
  const [adShown, setAdShown] = useState(false);
  const [timer, setTimer] = useState(0);

  // Timer countdown
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((t) => t - 1);
      }, 1000);
      return () => clearInterval(interval);
    }

    // Timer finished → open component
    if (timer === 0 && activePage && adShown) {
      setActivePage(activePage);
    }
  }, [timer]);

  const handleOpen = (pageName) => {

    // अगर ad पहले ही दिख चुका है → direct open
    if (adShown) {
      setActivePage(pageName);
      return;
    }

    // पहली बार → open ad + start timer
    window.open(AD_URL, "_blank");

    setAdShown(true);
    setActivePage(pageName);
    setTimer(5); // 5 second countdown
  };

  // जब timer चल रहा हो
  if (timer > 0) {
    return (
      <div style={{
        height:"100vh",
        display:"flex",
        alignItems:"center",
        justifyContent:"center",
        flexDirection:"column",
        fontFamily:"Arial"
      }}>
        <h2>Ad opened in new tab</h2>
        <p>Opening page in {timer} seconds...</p>
      </div>
    );
  }

  return (
    <div style={{background:'', width:"100vw", height:"100vh"}}>

      {/* Home Buttons */}
      {!activePage && (
        <div style={{
          height:"100vh",
          display:"flex",
          flexDirection:"column",
          justifyContent:"center",
          alignItems:"center",
          gap:"20px"
        }}>
          <button onClick={() => handleOpen("hindiToEnglish")}>
            Hindi → English Practice
          </button>

          <button onClick={() => handleOpen("englishToHindi")}>
            English → Hindi Practice
          </button>
        </div>
      )}

      {/* Load Components */}
      {activePage === "hindiToEnglish" && <LearnWithAudio />}
      {activePage === "englishToHindi" && <LearnWithAudioEnglish />}

    </div>
  );
}

export default App;
