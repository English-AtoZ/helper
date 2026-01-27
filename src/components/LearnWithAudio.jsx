import React, { useState, useEffect, useRef } from 'react';

const LearnWithAudio = () => {
  const [isListening, setIsListening] = useState(false);
  const [hindiText, setHindiText] = useState('');
  const [englishTranslation, setEnglishTranslation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.lang = 'hi-IN';
      recognitionRef.current.continuous = false;

      recognitionRef.current.onresult = async (event) => {
        const text = event.results[0][0].transcript;
        setHindiText(text);
        await translateToEnglish(text);
      };

      recognitionRef.current.onend = () => setIsListening(false);
      recognitionRef.current.onerror = () => setIsListening(false);
    }
  }, []);

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
      setEnglishTranslation("Translation failed. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const speakEnglish = (text) => {
    window.speechSynthesis.cancel();
    const msg = new SpeechSynthesisUtterance(text);
    msg.lang = 'en-US';
    msg.rate = 0.9;
    window.speechSynthesis.speak(msg);
  };

  const startListening = () => {
    setHindiText('');
    setEnglishTranslation('');
    setIsListening(true);
    recognitionRef.current.start();
  };

  return (
    <div style={styles.container}>

      <div style={styles.innerWrap}>

        <div style={styles.displayArea}>
          <div style={styles.resultBox}>
            <small>Hindi Sentences:</small>
            <p style={styles.hindiText}>{hindiText || "..."}</p>
          </div>

          <div style={{...styles.resultBox, borderLeft: '5px solid #2e7d32', backgroundColor: '#e8f5e9'}}>
            <small>English Sentences:</small>
            <p style={styles.engText}>
              {isLoading ? "Translating..." : englishTranslation || "..."}
            </p>
          </div>
        </div>

        <div style={styles.inputWrapper}>
          <button 
            onClick={startListening} 
            disabled={isListening || isLoading}
            style={styles.micBtn}
          >
            Every Day English Practice 
          </button>

          <p style={styles.status}>
            {isListening ? "English Speaking Practice" : "English-Speaking-Practice"}
          </p>
        </div>

      </div>
    </div>
  );
};

const styles = {

  /* ===== FULL MOBILE FIT FIX ===== */
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

  inputWrapper: { textAlign: 'center', marginBottom: '10px' },

  micBtn: {
    border: 'none',
    fontWeight: 'bold',
    color: '#0ddd06',
    fontSize: '15px',
    transition: '0.3s',
    background:'transparent'
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
  }
};

export default LearnWithAudio;
