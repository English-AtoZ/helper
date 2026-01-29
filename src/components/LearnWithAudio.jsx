import React, { useState, useEffect, useRef } from 'react';

const LearnWithAudio = () => {
  const [isListening, setIsListening] = useState(false);
  const [hindiText, setHindiText] = useState('');
  const [englishTranslation, setEnglishTranslation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [lang, setLang] = useState('hi-IN'); // Toggle for testing
  const recognitionRef = useRef(null);

  useEffect(() => {
    // HTTPS check
    if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost') {
      setError('Speech recognition requires HTTPS on mobile. Deploy to a secure server.');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.lang = lang;
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;

      recognitionRef.current.onstart = () => {
        console.log('Speech recognition started');
        setIsListening(true);
        setError('');
      };

      recognitionRef.current.onresult = async (event) => {
        console.log('Speech result received:', event.results);
        const text = event.results[0][0].transcript;
        setHindiText(text);
        await translateToEnglish(text);
      };

      recognitionRef.current.onend = () => {
        console.log('Speech recognition ended');
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error, event);
        setIsListening(false);
        let errorMsg = 'Speech recognition error: ' + event.error;
        if (event.error === 'not-allowed') {
          errorMsg += ' - Allow microphone in browser settings.';
        } else if (event.error === 'network') {
          errorMsg += ' - Check internet.';
        } else if (event.error === 'no-speech') {
          errorMsg += ' - No speech detected. Speak louder or closer to mic.';
        }
        setError(errorMsg);
      };

      recognitionRef.current.onaudiostart = () => console.log('Audio started');
      recognitionRef.current.onaudioend = () => console.log('Audio ended');
      recognitionRef.current.onnomatch = () => console.log('No match found');
    } else {
      setError('Speech recognition not supported. Use Chrome on Android.');
    }
  }, [lang]); // Re-init on lang change

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
      setError("Translation error.");
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
    if (!recognitionRef.current) {
      setError('Speech recognition not available.');
      return;
    }

    setHindiText('');
    setEnglishTranslation('');
    setError('');

    // Request permission and start
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(() => {
          console.log('Microphone permission granted');
          try {
            recognitionRef.current.start();
          } catch (err) {
            console.error('Start error:', err);
            setError('Failed to start. Try again or refresh.');
          }
        })
        .catch((err) => {
          console.error('Permission error:', err);
          setError("Microphone denied. Allow in settings.");
        });
    } else {
      try {
        recognitionRef.current.start();
      } catch (err) {
        console.error('Start error:', err);
        setError('Failed to start.');
      }
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.innerWrap}>
        <div style={styles.displayArea}>
          <div style={styles.resultBox}>
            <small>{lang === 'hi-IN' ? 'Hindi Sentences' : 'English Input'}:</small>
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
            {isListening ? "Listening..." : "Tap to Start"}
          </p>
          {error && <p style={styles.error}>{error}</p>}

          {/* Language Toggle for Testing */}
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
