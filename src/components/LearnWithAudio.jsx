import React, { useState, useRef } from 'react';

const LearnWithAudio = () => {
  const [isListening, setIsListening] = useState(false);
  const [hindiText, setHindiText] = useState('');
  const [englishTranslation, setEnglishTranslation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const recognitionRef = useRef(null);

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

  // ✅ Create & Start Recognition ONLY inside user click
  const startListening = () => {
    setHindiText('');
    setEnglishTranslation('');
    setIsListening(true);

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech Recognition not supported in this browser");
      setIsListening(false);
      return;
    }

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

    // 🔥 Must be called directly inside click event
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
            🎤 Every Day English Practice
          </button>

          <p style={styles.status}>
            {isListening ? "Listening..." : "Tap mic to speak"}
          </p>
        </div>
      </div>
    </div>
  );
};

// styles unchanged
const styles = { /* same as your styles */ };

export default LearnWithAudio;
