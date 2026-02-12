import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { createWorker } from 'tesseract.js';
import '../App.css';

function CameraTranslation() {
  const [image, setImage] = useState(null);
  const [extractedText, setExtractedText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const workerRef = useRef(null);

  const languages = [
    { name: 'Italian', flag: '🇮🇹', code: 'it' },
    { name: 'Portuguese', flag: '🇵🇹', code: 'pt' },
    { name: 'Dutch', flag: '🇳🇱', code: 'nl' },
    { name: 'Japanese', flag: '🇯🇵', code: 'ja' },
    { name: 'Arabic', flag: '🇸🇦', code: 'ar' },
    { name: 'Czech', flag: '🇨🇿', code: 'cs' },
    { name: 'Welsh', flag: '🏴󠁧󠁢󠁷󠁬󠁳󠁿', code: 'cy' },
    { name: 'Spanish', flag: '🇪🇸', code: 'es' },
    { name: 'French', flag: '🇫🇷', code: 'fr' },
    { name: 'German', flag: '🇩🇪', code: 'de' },
    { name: 'Chinese', flag: '🇨🇳', code: 'zh' },
    { name: 'Russian', flag: '🇷🇺', code: 'ru' },
    { name: 'Korean', flag: '🇰🇷', code: 'ko' },
    { name: 'Hindi', flag: '🇮🇳', code: 'hi' },
    { name: 'Swahili', flag: '🇰🇪', code: 'sw' },
  ];

  useEffect(() => {
    const initializeWorker = async () => {
      try {
        const worker = await createWorker({
          workerPath: 'tesseract/worker.min.js', // Ensure worker path is correct
          corePath: 'tesseract/tesseract-core.wasm.js', // Ensure core path is correct
          langPath: 'tesseract/lang-data', // Ensure language data path is correct
        });
        workerRef.current = worker;
        await worker.loadLanguage('eng');
        await worker.initialize('eng');
        console.log('Worker initialized');
      } catch (error) {
        console.error('Worker initialization error:', error);
      }
    };
    initializeWorker();

    return () => {
      if (workerRef.current) {
        workerRef.current.terminate().catch(err => console.warn('Terminate error:', err));
      }
    };
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraActive(true);
      }
    } catch (error) {
      console.error('Camera error:', error);
      alert('Camera access denied.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      setIsCameraActive(false);
      setIsVideoReady(false);
      setImage(null);
    }
  };

  const handleVideoLoaded = () => {
    setIsVideoReady(true);
  };

  const captureImage = async () => {
    if (!isVideoReady) {
      alert('Video not ready.');
      return;
    }
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        const imageData = canvas.toDataURL('image/png');
        setImage(imageData);
        setIsProcessing(true);
        await processImage(imageData);
      }
    }
  };

  const processImage = async (imageUrl) => {
    if (!workerRef.current) {
      setExtractedText('OCR not ready.');
      setIsProcessing(false);
      return;
    }
    try {
      const result = await workerRef.current.recognize(imageUrl, { lang: 'eng' });
      setExtractedText(result.data.text || 'No text detected');
      await translateText(result.data.text || '');
    } catch (error) {
      console.error('OCR error:', error);
      setExtractedText('OCR failed.');
    } finally {
      setIsProcessing(false);
    }
  };

  const translateText = async (text) => {
    if (!text || !selectedLanguage) return;
    const targetLang = languages.find(lang => lang.name === selectedLanguage)?.code || 'en';
    try {
      const response = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${targetLang}`
      );
      const data = await response.json();
      setTranslatedText(data.responseData?.translatedText || 'Translation failed');
      const utterance = new SpeechSynthesisUtterance(data.responseData?.translatedText || '');
      utterance.lang = targetLang;
      window.speechSynthesis.speak(utterance);
    } catch (error) {
      console.error('Translation error:', error);
      setTranslatedText('Translation failed.');
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      stopCamera();
      setIsProcessing(true);
      const url = URL.createObjectURL(file);
      setImage(url);
      await processImage(url);
    }
  };

  useEffect(() => {
    return () => stopCamera();
  }, []);

  const scanLineVariants = {
    move: (i) => ({ x: [-1000, 1000], transition: { duration: 5 + i * 2, repeat: Infinity, ease: 'linear' } }),
  };

  const particleVariants = {
    orbit: (i) => ({
      rotate: 360,
      x: Math.cos(i) * 100,
      y: Math.sin(i) * 100,
      transition: { duration: 3 + i, repeat: Infinity, ease: 'linear' },
    }),
  };

  const shapeVariants = {
    spin: (i) => ({
      rotate: 360,
      opacity: [0, 0.5, 0],
      transition: { duration: 6 + i * 2, repeat: Infinity, ease: 'easeInOut' },
    }),
  };

  const rippleVariants = {
    ripple: { scale: [0, 10], opacity: [0.3, 0], transition: { duration: 4, repeat: Infinity, repeatDelay: 2 } },
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
      <section className="camera-translation-section">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="scan-line"
            style={{ top: `${20 + i * 15}%`, height: '2px', opacity: 0.2 }}
            variants={scanLineVariants}
            animate="move"
            custom={i}
          />
        ))}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className={`shape ${i % 2 === 0 ? 'triangle' : 'circle'}`}
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: i % 2 === 0 ? '40px' : '30px',
              height: i % 2 === 0 ? '40px' : '30px',
            }}
            variants={shapeVariants}
            animate="spin"
            custom={i}
          />
        ))}
        <motion.div
          className="ripple"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '100px',
            height: '100px',
            background: 'rgba(174, 213, 129, 0.3)',
            borderRadius: '50%',
            transform: 'translate(-50%, -50%)',
          }}
          variants={rippleVariants}
          animate="ripple"
        />
        <div className="camera-header">
          <motion.h2
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1, textShadow: '0 0 10px rgba(174, 213, 129, 0.5)' }}
            transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
          >
            Camera Translation
          </motion.h2>
        </div>
        <div className="camera-container">
          <motion.div
            className="language-card-camera"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ y: -5, boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)' }}
          >
            <h3>Select Language</h3>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="language-select-camera"
            >
              <option value="">-- Select Language --</option>
              {languages.map((language, index) => (
                <option key={index} value={language.name}>
                  {language.flag} {language.name}
                </option>
              ))}
            </select>
          </motion.div>
          <motion.div
            className="camera-frame"
            initial={{ scale: 0.9 }}
            animate={{ scale: image || isCameraActive ? 1 : 0.9 }}
            transition={{ duration: 0.5 }}
          >
            {isCameraActive && !image ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="camera-video"
                onLoadedMetadata={handleVideoLoaded}
                style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
              />
            ) : image ? (
              <>
                <img src={image} alt="Captured" className="camera-image" />
                {isProcessing && (
                  <div className="scan-overlay">
                    <motion.div
                      className="scan-line-overlay"
                      animate={{ y: [-150, 150, -150] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                    />
                  </div>
                )}
              </>
            ) : (
              <div className="camera-placeholder">Use camera or upload an image</div>
            )}
            {isProcessing &&
              [...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="particle"
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    width: '8px',
                    height: '8px',
                    background: '#AED581',
                    borderRadius: '50%',
                  }}
                  variants={particleVariants}
                  animate="orbit"
                  custom={i}
                />
              ))}
            <div className="camera-controls">
              {!isCameraActive ? (
                <motion.button
                  className="camera-btn"
                  onClick={startCamera}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Start Camera
                </motion.button>
              ) : (
                <>
                  <motion.button
                    className="camera-btn"
                    onClick={captureImage}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={isProcessing || !isVideoReady}
                  >
                    Capture
                  </motion.button>
                  <motion.button
                    className="camera-btn stop"
                    onClick={stopCamera}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Stop Camera
                  </motion.button>
                </>
              )}
              <label htmlFor="image-upload" className="camera-upload-btn">
                <motion.div
                  className="progress-circle"
                  animate={isProcessing ? { rotate: 360 } : { rotate: 0 }}
                  transition={{ duration: 2, repeat: isProcessing ? Infinity : 0 }}
                >
                  Upload Image
                </motion.div>
              </label>
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="upload-input"
              />
            </div>
            <canvas ref={canvasRef} style={{ display: 'none' }} />
          </motion.div>
          {(extractedText || translatedText) && (
            <motion.div
              className="translation-panel"
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {extractedText && (
                <>
                  <h4>Extracted Text:</h4>
                  <p>{extractedText}</p>
                </>
              )}
              {translatedText && (
                <>
                  <h4>Translated Text:</h4>
                  <p>{translatedText}</p>
                </>
              )}
            </motion.div>
          )}
        </div>
      </section>
      <footer className="footer" style={{ background: '#E8F5E9' }}>
        <p>© 2025 FluentNow. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default CameraTranslation;