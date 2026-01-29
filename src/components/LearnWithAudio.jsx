import React, { useState, useEffect } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

const LearnWithAudio = () => {
  const [englishTranslation, setEnglishTranslation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [lang, setLang] = useState('hi-IN');

  // Advanced: Use library for better mobile support
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
    isMicrophoneAvailable
  } = useSpeechRecognition();

  useEffect(() => {
    // HTTPS check
    if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost') {
      setError('Requires HTTPS on mobile. Deploy to secure server.');
    }

    // Log device info for debugging
    console.log('Browser:', navigator.userAgent);
    console.log('Supports Speech:', browserSupportsSpeechRecognition);
    console.log('Mic Available:', isMicrophoneAvailable);

    if (!browserSupportsSpeechRecognition) {
      setError('Speech recognition not supported. Try Chrome/Samsung Internet on Android.');
    }
  }, []);

  useEffect(() => {
    // Auto-translate when transcript changes
    if (transcript) {
      translateToEnglish(transcript);
    }
  }, [transcript]);

  const translateToEnglish = async (text) => {
    if (!text) return;
    setIsLoading(true);
    try {
      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=hi&tl=en&dt=t&q=${encodeURIComponent(text)}`;
      const response = await fetch(url);
      const data = await response.json();
      const translated = data[0][0][0];
      setEnglishTranslation(translated);
      speakEnglish(translated);
    } catch (error) {
      setEnglishTranslation("Translation failed.");
      setError("Translation error. Check internet.");
      console.error('Translation error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const speakEnglish = (text) => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const msg = new SpeechSynthesisUtterance(text);
      msg.lang = 'en-US';
      msg.rate = 0.9;
      window.speechSynthesis.speak(msg);
    } else {
      setError("Speech synthesis not supported.");
    }
  };

  const startListening = () => {
    resetTranscript();
    setEnglishTranslation('');
    setError('');

    // Advanced: Request permission explicitly
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(() => {
          SpeechRecognition.startListening({
            language: lang,
            continuous: false, // Off for mobile
          });
        })
        .catch((err) => {
          setError("Microphone denied. Allow in browser settings > Site settings > Microphone.");
          console.error('Permission error:', err);
        });
    } else {
      SpeechRecognition.startListening({ language: lang, continuous: false });
    }
  };

  const stopListening = () => {
    SpeechRecognition.stopListening();
  };

  return (
    <div style={styles.container}>
      <div style={styles.innerWrap}>
        <div style={styles.displayArea}>
          <div style={styles.resultBox}>
            <small>{lang === 'hi-IN' ? 'Hindi Input' : 'English Input'}:</small>
            <p style={styles.hindiText}>{transcript || "..."}</p>
          </div>

          <div style={{...styles.resultBox, borderLeft: '5px solid #2e7d32', backgroundColor: '#e8f5e9'}}>
            <small>English Translation:</small>
            <p style={styles.engText}>
              {isLoading ? "Translating..." : englishTranslation || "..."}
            </p>
          </div>
        </div>

        <div style={styles.inputWrapper}>
          <button 
            onClick={startListening} 
            disabled={listening || isLoading}
            style={styles.micBtn}
          >
            Start Listening
          </button>
          <button 
            onClick={stopListening} 
            disabled={!listening}
            style={{...styles.micBtn, marginLeft: '10px', color: 'red'}}
          >
            Stop
          </button>

          <p style={styles.status}>
            {listening ? "Listening... Speak now!" : "Tap Start to Begin"}
          </p>
          {error && <p style={styles.error}>{error}</p>}

          {/* Language Toggle */}
          <div style={{ marginTop: '10px' }}>
            <button onClick={() => setLang('hi-IN')} style={styles.langBtn}>Hindi</button>
            <button onClick={() => setLang('en-US')} style={styles.langBtn}>English</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
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

  inputWrapper: { textAlign: 'center', marginBottom: '10px' },

  micBtn: {
    border: 'none',
    fontWeight: 'bold',
    color: '#0ddd06',
    fontSize: '15px',
    transition: '0.3s',
    background:'transparent',
    padding: '10px'
  },

  status: { 
    marginTop: '10px', 
    color: '#ff4b2b', 
    fontWeight: 'bold', 
    fontSize: '14px' 
  },

  displayArea: { 
    display: 'flex', 
    flexDirection: 'column', 
    gap: '20px',
    overflowY:'auto'
  },

  resultBox: { 
    padding: '15px', 
    borderRadius: '10px', 
    backgroundColor: '#f1f3f4', 
    textAlign: 'left' 
  },

  hindiText: { 
    fontSize: '30px', 
    fontWeight: 'bold', 
    margin: '5px 0', 
    color: '#0b2ef8' 
  },

  engText: { 
    fontSize: '30px', 
    fontWeight: 'bold', 
    margin: '5px 0', 
    color: '#fd1313' 
  },

  error: {
    color: 'red',
    fontSize: '12px',
    marginTop: '5px'
  },

  langBtn: {
    margin: '0 5px',
    padding: '5px 10px',
    fontSize: '12px',
    background: '#ddd',
    border: 'none',
    borderRadius: '5px'
  }
};

export default LearnWithAudio;