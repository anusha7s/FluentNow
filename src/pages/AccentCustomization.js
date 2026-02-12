import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../App.css'; // Contains merged styles from AccentCustomizer.css

const AccentCustomization = () => {
  const [text, setText] = useState('');
  const [accent, setAccent] = useState('american');
  const [audioUrl, setAudioUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState(null);

  const accents = [
    { value: 'american', label: 'American' },
    { value: 'british', label: 'British' },
    { value: 'indian', label: 'Indian' },
    { value: 'australian', label: 'Australian' },
    { value: 'african', label: 'African' },
  ];

  // Initialize SpeechRecognition
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = SpeechRecognition ? new SpeechRecognition() : null;

  useEffect(() => {
    if (recognition) {
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setText(transcript);
        setIsListening(false);
      };

      recognition.onerror = (event) => {
        setError('Speech recognition error: ' + event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };
    }

    return () => {
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  const startListening = () => {
    if (!recognition) {
      setError('Speech recognition is not supported in this browser.');
      return;
    }
    setError(null);
    setText('');
    setIsListening(true);
    recognition.start();
  };

  const stopListening = () => {
    if (recognition && isListening) {
      recognition.stop();
      setIsListening(false);
    }
  };

  const generateAudio = async () => {
    if (!text) {
      setError('Please enter or speak some text.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setAudioUrl(null);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/generate-audio`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text, accent }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error ${response.status}: ${errorText || response.statusText}`);
      }

      const audioBlob = await response.blob();
      const url = URL.createObjectURL(audioBlob);
      setAudioUrl(url);
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Error generating audio: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="App">
      <nav className="navbar">
        <div className="nav-content">
          <div className="nav-logo">
            <img src="/logo.png" alt="FluentNow Logo" className="logo" />
            <Link to="/" style={{ textDecoration: 'none', color: '#58cc02' }}>
              <h1>FluentNow</h1>
            </Link>
          </div>
          <button className="get-started-btn">Get Started</button>
        </div>
      </nav>

      <section className="accent-customizer">
        <div className="container">
          <h1>Accent Customizer</h1>
          <p>Enter text or speak, then select an accent to hear it in American or British English.</p>

          <textarea
            rows="4"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter text or speak..."
            disabled={isListening}
          />

          <div className="speech-input">
            <button
              onClick={isListening ? stopListening : startListening}
              disabled={isLoading}
              className={isListening ? 'listening' : ''}
            >
              {isListening ? 'Stop Listening' : 'Start Speaking'}
            </button>
          </div>

          <div className="accent-selector">
            <label>Select Accent:</label>
            <select
              value={accent}
              onChange={(e) => setAccent(e.target.value)}
              disabled={isLoading}
            >
              {accents.map((acc) => (
                <option key={acc.value} value={acc.value}>
                  {acc.label}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={generateAudio}
            disabled={isLoading || !text || isListening}
          >
            {isLoading ? 'Generating...' : 'Generate Audio'}
          </button>

          {audioUrl && (
            <div className="audio-player">
              <audio controls src={audioUrl}>
                Your browser does not support the audio element.
              </audio>
            </div>
          )}

          {error && <p className="error">{error}</p>}

          <p className="note">
            Note: Requires a running backend server with ElevenLabs API key. Speech recognition works in Chrome/Edge.
          </p>
        </div>
      </section>

      <footer className="footer">
        <p>© 2025 FluentNow. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default AccentCustomization;
