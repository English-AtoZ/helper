import React, { useState, useEffect, useRef } from 'react';

const HindiToSansikritAudio = () => {
  const [isListening, setIsListening] = useState(false);
  const [hindiText, setHindiText] = useState('');
  const [sanskritTranslation, setSanskritTranslation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.lang = 'hi-IN'; // User Hindi bolega
      recognitionRef.current.continuous = false;

      recognitionRef.current.onresult = async (event) => {
        const text = event.results[0][0].transcript;
        setHindiText(text);
        await translateToSanskrit(text);
      };

      recognitionRef.current.onend = () => setIsListening(false);
      recognitionRef.current.onerror = () => setIsListening(false);
    }
  }, []);

  // --- GOOGLE TRANSLATE LOGIC (HINDI TO SANSKRIT) ---
  const translateToSanskrit = async (text) => {
    if (!text) return;
    setIsLoading(true);
    try {
      // 'tl=sa' ka matlab hai Target Language = Sanskrit
      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=hi&tl=sa&dt=t&q=${encodeURIComponent(text)}`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      const translated = data[0][0][0];
      
      setSanskritTranslation(translated);
      speakSanskrit(translated);
    } catch (error) {
      console.error("Translation Error:", error);
      setSanskritTranslation("Anuvada viphala (Translation failed).");
    } finally {
      setIsLoading(false);
    }
  };

  const speakSanskrit = (text) => {
    window.speechSynthesis.cancel();
    const msg = new SpeechSynthesisUtterance(text);
    // Sanskrit ke liye 'hi-IN' (Hindi) voice sabse best kaam karti hai kyunki script (Devanagari) same hai
    msg.lang = 'hi-IN'; 
    msg.rate = 0.8; // Sanskrit shlokas/words ke liye thoda slow rakha hai
    window.speechSynthesis.speak(msg);
  };

  const startListening = () => {
    setHindiText('');
    setSanskritTranslation('');
    setIsListening(true);
    recognitionRef.current.start();
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3>🎙️ Hindi to Sanskrit Audio Tutor</h3>
        <p>Developed by P K (Sanskrit Version)</p>
      </div>

      <div style={styles.card}>
        

        <div style={styles.displayArea}>
          <div style={styles.resultBox}>
            <small>Aapne kaha (Hindi):</small>
            <p style={styles.hindiText}>{hindiText || "..."}</p>
          </div>

          <div style={{...styles.resultBox, borderLeft: '5px solid #673ab7', backgroundColor: '#f3e5f5'}}>
            <small>Sanskrit Anuvada (Audio):</small>
            <p style={styles.sanskritText}>
              {isLoading ? "Anuvadam karoti..." : sanskritTranslation || "..."}
            </p>
            {sanskritTranslation && (
              <button onClick={() => speakSanskrit(sanskritTranslation)} style={styles.speakBtn}>
                🔊 Punah Shravanam (Re-play)
              </button>
            )}
          </div>
        </div>


        <div style={styles.inputWrapper}>
          <button 
            onClick={startListening} 
            disabled={isListening || isLoading}
            style={{...styles.micBtn, backgroundColor: isListening ? '#ff4b2b' : '#673ab7'}}
          >
            {isListening ? '🛑' : '🎤'}
          </button>
          <p style={styles.status}>
            {isListening ? "Shrunvantu... (Listening in Hindi)" : "Tap the mic to speak Hindi"}
          </p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { padding: '20px', fontFamily: 'Arial, sans-serif', backgroundColor: '#f8f9fa', minHeight: '100vh' },
  header: { textAlign: 'center', backgroundColor: '#4527a0', color: 'white', padding: '15px', borderRadius: '10px', marginBottom: '20px' },
  card: { maxWidth: '100vh', margin: 'auto', background: 'white', padding: '20px', borderRadius: '15px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' },
  inputWrapper: { textAlign: 'center', marginBottom: '30px' },
  micBtn: { width: '70px', height: '70px', borderRadius: '50%', border: 'none', color: 'white', fontSize: '30px', cursor: 'pointer', transition: '0.3s' },
  status: { marginTop: '10px', color: '#673ab7', fontWeight: 'bold', fontSize: '14px' },
  displayArea: { display: 'flex', flexDirection: 'column', gap: '20px' },
  resultBox: { padding: '15px', borderRadius: '10px', backgroundColor: '#f1f3f4', textAlign: 'left' },
  hindiText: { fontSize: '22px', margin: '5px 0', color: '#333' },
  sanskritText: { fontSize: '25px', fontWeight: 'bold', margin: '5px 0', color: '#673ab7' },
  speakBtn: { background: 'none', border: '1px solid #673ab7', color: '#673ab7', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer', marginTop: '10px' }
};

export default HindiToSansikritAudio;