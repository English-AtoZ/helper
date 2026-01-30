import React, { useState, useEffect } from 'react';

const Audios3Bolkar = () => {
  const [paragraph, setParagraph] = useState('');
  const [clickedWord, setClickedWord] = useState('');
  const [translation, setTranslation] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);

  // --- Voice Logic (Text to Speech) ---
  const speakHindi = (text) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'hi-IN';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  const speakEnglish = (e, word) => {
    e.stopPropagation();
    window.speechSynthesis.cancel();
    const cleanWord = word.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "").trim();
    const utterance = new SpeechSynthesisUtterance(cleanWord);
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
  };

  // --- Speech to Text Logic (Mic functionality) ---
  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Aapka browser voice typing support nahi karta. Kripya Chrome use karein.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setParagraph((prev) => prev + (prev ? " " : "") + transcript);
      setIsListening(false);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  // --- Translation Logic ---
  const translateWord = async (word) => {
    const cleanWord = word.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "").trim();
    if (!cleanWord) return;

    setClickedWord(cleanWord);
    setLoading(true);
    setTranslation('...');

    try {
      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=hi&dt=t&q=${encodeURIComponent(cleanWord)}`;
      const response = await fetch(url);
      const data = await response.json();
      const hindiResult = data[0][0][0];
      setTranslation(hindiResult);
      speakHindi(hindiResult);
    } catch (error) {
      setTranslation("N/A");
    } finally {
      setLoading(false);
    }
  };

  const words = paragraph.split(/\s+/).filter(w => w !== "");

  return (
    <div style={{ padding: '2px', maxWidth: '100%', margin: 'auto', fontFamily: 'Arial, sans-serif' }}>
      <div className="container-fluid">
        <div className="row">
          <div className="col">
            <h4 className="text-center text-bg-dark rounded-pill p-1 mb-4">
              Word Click → Hindi Audio Translator
            </h4>
          </div>
          <div className="col">
            <h4 className="text-center text-bg-dark rounded-pill p-1 mb-4">Smart Voice & Text Translator</h4>
          </div>
        </div>
      </div>

      {/* Input Section with Mic */}
      <div style={{ position: 'relative', marginBottom: '20px' }}>
        <textarea
          rows="5"
          style={{
            width: '100%',
            padding: '5px',
            paddingRight: '10px', // Mic button ke liye space
            borderRadius: '10px',
            border: '2px solid #ddd',
            fontSize: '16px',
            boxSizing: 'border-box',
          }}
          placeholder="Type karein ya Mic button par click karke boleinn..."
          value={paragraph}
          onChange={(e) => setParagraph(e.target.value)}
        />
        <button
          onClick={startListening}
          style={{
            position: 'absolute',
            right: '15px',
            top: '15px',
            background: isListening ? '#ff4b2b' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            cursor: 'pointer',
            fontSize: '20px',
            boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          title="Bolein (English)"
        >
          {isListening ? '🛑' : '🎤'}
        </button>
        {isListening && <p style={{ color: '#ff4b2b', fontSize: '12px', marginTop: '5px' }}>Listening... Please speak in English</p>}
      </div>

      {/* Paragraph Display Area */}
      <div style={{
        lineHeight: '2.8',
        fontSize: '20px',
        padding: '25px',
        backgroundColor: '#fdfdfd',
        borderRadius: '12px',
        border: '1px solid #e0e0e0',
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        minHeight: '150px'
      }}>
        {words.length > 0 ? words.map((word, index) => (
          <span key={index} style={{ display: 'inline-flex', alignItems: 'center', marginRight: '15px' }}>
            <span
              onClick={() => translateWord(word)}
              style={{
                cursor: 'pointer',
                padding: '2px 6px',
                borderRadius: '6px',
                color: '#2c3e50',
                backgroundColor: '#f1f3f4',
                transition: 'all 0.2s',
                fontWeight: '500'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#d1e7ff'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#f1f3f4'}
            >
              {word}
            </span>
            <button
              onClick={(e) => speakEnglish(e, word)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '14px',
                padding: '0 2px',
                color: '#007bff',
                marginLeft: '4px'
              }}
            >
              🔈
            </button>
          </span>
        )) : <p style={{ color: '#999', textAlign: 'center' }}>Aapka text yahan clickable words mein dikhega...</p>}
      </div>

      {/* Result Card */}
      {clickedWord && (
        <div style={{
          marginTop: '30px',
          padding: '20px',
          textAlign: 'center',
          backgroundColor: '#e8f5e9',
          borderRadius: '15px',
          border: '1px solid #a5d6a7'
        }}>
          <div style={{ fontSize: '14px', color: '#555' }}>Word: <span style={{ color: '#1b5e20', fontWeight: 'bold' }}>{clickedWord}</span></div>
          <div style={{
            fontSize: '32px',
            fontWeight: 'bold',
            color: '#2e7d32',
            marginTop: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '15px'
          }}>
            {loading ? '...' : translation}
            {!loading && (
              <button
                onClick={() => speakHindi(translation)}
                style={{ background: 'none', border: 'none', fontSize: '28px', cursor: 'pointer' }}
              >
                🔊
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Audios3Bolkar;