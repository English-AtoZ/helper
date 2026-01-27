import React, { useState, useEffect, useRef } from 'react';

const LearnWithAudioEnglish = () => {
  const [isListening, setIsListening] = useState(false);
  const [englishText, setEnglishText] = useState('');
  const [hindiTranslation, setHindiTranslation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.lang = 'en-US';
      recognitionRef.current.continuous = false;

      recognitionRef.current.onresult = async (event) => {
        const text = event.results[0][0].transcript;
        setEnglishText(text);
        await translateToHindi(text);
      };

      recognitionRef.current.onend = () => setIsListening(false);
      recognitionRef.current.onerror = () => setIsListening(false);
    }
  }, []);

  const translateToHindi = async (text) => {
    if (!text) return;
    setIsLoading(true);
    try {
      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=hi&dt=t&q=${encodeURIComponent(text)}`;
      const response = await fetch(url);
      const data = await response.json();
      const translated = data[0][0][0];
      setHindiTranslation(translated);
      speakHindi(translated);
    } catch (error) {
      setHindiTranslation("Translation failed. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const speakHindi = (text) => {
    window.speechSynthesis.cancel();
    const msg = new SpeechSynthesisUtterance(text);
    msg.lang = 'hi-IN';
    msg.rate = 0.9;
    window.speechSynthesis.speak(msg);
  };

  const startListening = () => {
    setEnglishText('');
    setHindiTranslation('');
    setIsListening(true);
    recognitionRef.current.start();
  };

  return (
    <div style={styles.container}>

      <div style={styles.innerWrap}>

        <div style={styles.displayArea}>
          <div style={styles.resultBox}>
            <small>English Sentences (What you said):</small>
            <p style={styles.engText}>{englishText || "..."}</p>
          </div>

          <div style={{...styles.resultBox, borderLeft: '5px solid #2e7d32', backgroundColor: '#e8f5e9'}}>
            <small>Hindi Translation:</small>
            <p style={styles.hindiText}>
              {isLoading ? "Translating..." : hindiTranslation || "..."}
            </p>
          </div>
        </div>

        <div style={styles.inputWrapper}>
          <button 
            onClick={startListening} 
            disabled={isListening || isLoading}
            style={styles.micBtn}
          >
            {isListening ? 'Listening...' : 'Tap to Speak English'}
          </button>
          <p style={styles.status}>
            {isListening ? "Listening... Speak in English" : "English to Hindi Practice"}
          </p>
        </div>

      </div>
    </div>
  );
};

const styles = {

  /* ===== ONLY MOBILE FIT FIX ===== */
  container: { 
    width: '100vw',
    height: '100vh',
    backgroundColor: '#f8f9fa',
    fontFamily: 'Arial, sans-serif',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden'
  },

  innerWrap:{
    width:'100%',
    height:'100%',
    padding:'20px',
    boxSizing:'border-box',
    display:'flex',
    flexDirection:'column',
    justifyContent:'space-between'
  },
  /* ===== END FIX ===== */

  inputWrapper: { textAlign: 'center', marginBottom: '30px' },
  micBtn: { border: 'none', fontWeight: 'bold', color: '#0ddd06', fontSize: '18px', cursor: 'pointer', background: 'none' },
  status: { marginTop: '10px', color: '#ff4b2b', fontWeight: 'bold', fontSize: '14px' },

  displayArea: { display: 'flex', flexDirection: 'column', gap: '20px', overflowY:'auto' },
  resultBox: { padding: '15px', borderRadius: '10px', backgroundColor: '#f1f3f4', textAlign: 'left' },

  engText: { fontSize: '28px', fontWeight: 'bold', margin: '5px 0', color: '#0b2ef8' },
  hindiText: { fontSize: '28px', fontWeight: 'bold', margin: '5px 0', color: '#fd1313' },
};

export default LearnWithAudioEnglish;
