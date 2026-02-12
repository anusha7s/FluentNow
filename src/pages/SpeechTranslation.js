import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import '../App.css';

function SpeechTranslation() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcribedText, setTranscribedText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  
  const [history, setHistory] = useState([]);
  const [recognition, setRecognition] = useState(null);

  const languages = [
    { name: 'Italian', flag: '🇮🇹', code: 'it-IT' },
    { name: 'Portuguese', flag: '🇵🇹', code: 'pt-PT' },
    { name: 'Dutch', flag: '🇳🇱', code: 'nl-NL' },
    { name: 'Japanese', flag: '🇯🇵', code: 'ja-JP' },
    { name: 'Arabic', flag: '🇸🇦', code: 'ar-SA' },
    { name: 'Czech', flag: '🇨🇿', code: 'cs-CZ' },
    { name: 'Welsh', flag: '🏴󠁧󠁢󠁷󠁬󠁳󠁿', code: 'cy-GB' },
    { name: 'Spanish', flag: '🇪🇸', code: 'es-ES' },
    { name: 'French', flag: '🇫🇷', code: 'fr-FR' },
    { name: 'German', flag: '🇩🇪', code: 'de-DE' },
    { name: 'Chinese', flag: '🇨🇳', code: 'zh-CN' },
    { name: 'Russian', flag: '🇷🇺', code: 'ru-RU' },
    { name: 'Korean', flag: '🇰🇷', code: 'ko-KR' },
    { name: 'Hindi', flag: '🇮🇳', code: 'hi-IN' },
    { name: 'Swahili', flag: '🇰🇪', code: 'sw-KE' },
  ];

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recog = new SpeechRecognition();
      recog.continuous = false; // One recognition per start
      recog.interimResults = false;
      recog.maxAlternatives = 1;
      setRecognition(recog);
    } else {
      console.error('Speech Recognition not supported in this browser.');
    }
  }, []);

  const handleRecord = () => {
    if (!recognition) {
      alert('Speech Recognition not supported. Try a different browser.');
      return;
    }

    if (!selectedLanguage) {
      alert('Please select a language first!');
      return;
    }

    if (isRecording) {
      recognition.stop(); // Stop if already recording
      setIsRecording(false);
      return;
    }

    setIsRecording(true);
    setTranscribedText(''); // Clear previous text
    setTranslatedText('');  // Clear previous translation
    recognition.lang = 'en-US'; // Transcribe in English
    recognition.start();

    recognition.onresult = (event) => {
      const speechResult = event.results[0][0].transcript;
      setTranscribedText(speechResult);
      translateText(speechResult);
      setHistory([...history, { transcribed: speechResult, translated: translatedText }]);
    };

    recognition.onerror = (event) => {
      console.error('Recognition error:', event.error);
      setTranscribedText('Error processing speech.');
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
      console.log('Recording ended.');
    };
  };

  const translateText = async (text) => {
    if (!text || !selectedLanguage) return;

    const targetLang = languages.find(lang => lang.name === selectedLanguage)?.code.split('-')[0] || 'en';
    try {
      const response = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${targetLang}`
      );
      const data = await response.json();
      const translated = data.responseData?.translatedText || 'Translation failed';
      setTranslatedText(translated);

      // Play translated text
      const utterance = new SpeechSynthesisUtterance(translated);
      utterance.lang = targetLang;
      window.speechSynthesis.speak(utterance);
    } catch (error) {
      console.error('Translation error:', error);
      setTranslatedText('Error translating text.');
    }
  };

  const bubbleVariants = {
    float: (i) => ({
      y: -1000,
      transition: {
        duration: 5 + i * 2,
        repeat: Infinity,
        ease: 'linear',
      },
    }),
  };

  return (
    <div className="App">
      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="nav-content">
          <div className="nav-logo">
            <img src="/logo.png" alt="FluentNow Logo" className="logo" />
            <Link to="/" style={{ textDecoration: 'none', color: '#58cc02' }}>
              <h1>FluentNow</h1>
            </Link>
          </div>
          <div className="nav-languages">
            {languages.slice(0, 3).map((language, index) => (
              <span key={index} className="language-chip">
                {language.flag} {language.name}
              </span>
            ))}
          </div>
          <button className="get-started-btn">Get Started</button>
        </div>
      </nav>

      {/* Speech Translation Section */}
      <section className="speech-translation-section">
        {/* Floating Bubbles Background */}
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="bubble"
            style={{
              left: `${Math.random() * 100}%`,
              width: `${20 + Math.random() * 30}px`,
              height: `${20 + Math.random() * 30}px`,
              opacity: 0.3,
            }}
            variants={bubbleVariants}
            animate="float"
            custom={i}
          />
        ))}

        {/* Header */}
        <div className="speech-header">
          <motion.h2
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Speech Translation
          </motion.h2>
          <motion.div
            className="header-wave"
            animate={{ x: [0, 20, 0] }}
            transition={{ repeat: Infinity, duration: 3 }}
          />
        </div>

        {/* Main Content */}
        <div className="speech-container">
          {/* Language Selection */}
          <motion.div
            className="language-card"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ y: -5, boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)' }}
          >
            <h3>Select Language</h3>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="language-select-speech"
            >
              <option value="">-- Select Language --</option>
              {languages.map((language, index) => (
                <option key={index} value={language.name}>
                  {language.flag} {language.name}
                </option>
              ))}
            </select>
          </motion.div>

          {/* Microphone Orb */}
          <motion.div
            className="mic-orb"
            animate={{
              scale: isRecording ? [1, 1.1, 1] : [1, 1.05, 1],
              boxShadow: isRecording
                ? '0 0 30px rgba(128, 222, 234, 0.7)'
                : '0 0 20px rgba(128, 222, 234, 0.5)',
            }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            onClick={handleRecord}
          >
            <span className="mic-icon">🎙️</span>
            <p>{isRecording ? 'Stop Recording' : 'Start Recording'}</p>
          </motion.div>

          {/* Waveform Visualization */}
          {isRecording && (
            <motion.div
              className="waveform"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {[...Array(10)].map((_, i) => (
                <motion.div
                  key={i}
                  className="wave-bar"
                  animate={{ height: [10, 40, 10] }}
                  transition={{
                    repeat: Infinity,
                    duration: 0.5 + i * 0.1,
                    delay: i * 0.05,
                  }}
                />
              ))}
            </motion.div>
          )}

          {/* Speech Bubble */}
          {(transcribedText || translatedText) && (
            <motion.div
              className="speech-bubble"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, type: 'spring' }}
            >
              {transcribedText && (
                <>
                  <h4>Transcribed:</h4>
                  <p>{transcribedText}</p>
                </>
              )}
              {translatedText && (
                <>
                  <h4>Translated:</h4>
                  <p>{translatedText}</p>
                </>
              )}
            </motion.div>
          )}
        </div>

        {/* History Panel */}
        {history.length > 0 && (
          <motion.div
            className="history-panel"
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h3>History</h3>
            {history.map((entry, index) => (
              <motion.div
                key={index}
                className="history-card"
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <p><strong>Transcribed:</strong> {entry.transcribed}</p>
                <p><strong>Translated:</strong> {entry.translated}</p>
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>

      {/* Footer */}
      <footer className="footer" style={{ background: '#E1F5FE' }}>
        <p>© 2025 FluentNow. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default SpeechTranslation;