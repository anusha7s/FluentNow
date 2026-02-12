import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PDFDocument } from 'pdf-lib';
import { getDocument } from 'pdfjs-dist';
import { GlobalWorkerOptions } from 'pdfjs-dist';

// Set the worker source to the local file
GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';

function TranslationDownloads() {
  const [fileContent, setFileContent] = useState(''); // Original content
  const [translatedContent, setTranslatedContent] = useState(''); // Translated content
  const [selectedLanguage, setSelectedLanguage] = useState(''); // Selected language
  const [isProcessing, setIsProcessing] = useState(false); // Processing state
  const [error, setError] = useState(''); // Error state for handling failures

  const languages = [
    { name: 'English', flag: '🇬🇧', code: 'en' },
    { name: 'Hindi', flag: '🇮🇳', code: 'hi' },
    { name: 'Spanish', flag: '🇪🇸', code: 'es' },
    { name: 'French', flag: '🇫🇷', code: 'fr' },
    { name: 'German', flag: '🇩🇪', code: 'de' },
    { name: 'Chinese', flag: '🇨🇳', code: 'zh' },
    { name: 'Arabic', flag: '🇸🇦', code: 'ar' },
    { name: 'Japanese', flag: '🇯🇵', code: 'ja' },
    { name: 'Russian', flag: '🇷🇺', code: 'ru' },
    { name: 'Korean', flag: '🇰🇷', code: 'ko' },
  ];

  // Extract text based on file type
  async function extractTextFromFile(file) {
    const fileType = file.type || file.name.split('.').pop().toLowerCase();

    try {
      if (fileType === 'application/pdf') {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await getDocument({ data: arrayBuffer }).promise;
        let text = '';
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items.map(item => item.str).join(' ');
          text += pageText + '\n\n';
        }
        return text.trim() || 'No extractable text found.';
      } else if (fileType === 'text/plain') {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target.result);
          reader.readAsText(file);
        });
      } else {
        return 'Text extraction not supported for this file type yet.';
      }
    } catch (error) {
      console.error('Error reading file:', error);
      return `Error reading file: ${error.message}`;
    }
  }

  // Get Noto Sans font path based on language code
  function getFontPath(languageCode) {
    const fontMap = {
      'en': '/fonts/NotoSans-Regular.ttf',
      'hi': '/fonts/NotoSansDevanagari-Regular.ttf',
      'zh': '/fonts/NotoSansSC-Regular.ttf',
      'ar': '/fonts/NotoSansArabic-Regular.ttf',
      'ja': '/fonts/NotoSansJP-Regular.ttf',
      'ko': '/fonts/NotoSansKR-Regular.ttf',
      'ru': '/fonts/NotoSans-Regular.ttf',
      'es': '/fonts/NotoSans-Regular.ttf',
      'fr': '/fonts/NotoSans-Regular.ttf',
      'de': '/fonts/NotoSans-Regular.ttf',
    };
    return fontMap[languageCode] || '/fonts/NotoSans-Regular.ttf';
  }

  // Placeholder for translation
  async function translateText(text, targetLanguageCode) {
    if (text.includes('Error')) return text;
    return text; // Placeholder: returns original text for now
  }

  // Create PDF with Noto Sans font
  async function createStyledPdf(text, targetLanguageCode) {
    try {
      console.log('Starting PDF creation for language:', targetLanguageCode);
      const pdfDoc = await PDFDocument.create();
      let page = pdfDoc.addPage();
      
      const fontUrl = getFontPath(targetLanguageCode);
      console.log('Fetching font from:', fontUrl);
      const fontBytes = await fetch(fontUrl).then(res => {
        if (!res.ok) throw new Error(`Failed to fetch font: ${res.statusText}`);
        return res.arrayBuffer();
      });
      console.log('Font fetched successfully, embedding font...');
      const customFont = await pdfDoc.embedFont(fontBytes);

      const fontSize = 12;
      const lines = text.split('\n');
      let yPosition = page.getHeight() - 50;

      for (const line of lines) {
        if (yPosition < 50) {
          page = pdfDoc.addPage();
          yPosition = page.getHeight() - 50;
        }
        console.log('Drawing text:', line.substring(0, 20) + '...');
        page.drawText(line, {
          x: 50,
          y: yPosition,
          size: fontSize,
          font: customFont,
          maxWidth: page.getWidth() - 100,
        });
        yPosition -= fontSize + 10;
      }

      console.log('PDF creation completed, saving...');
      const pdfBytes = await pdfDoc.save();
      return pdfBytes;
    } catch (error) {
      console.error('Error in createStyledPdf:', error);
      throw error;
    }
  }

  // Handle file upload
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        const text = await extractTextFromFile(file);
        setFileContent(text);
        setTranslatedContent(''); // Reset translated content
        setError(''); // Clear any previous errors
      } catch (error) {
        setError('Failed to process the file.');
        console.error('Upload error:', error);
      }
    } else {
      alert('Please upload a supported file (e.g., .pdf, .txt).');
    }
  };

  // Handle PDF processing and download
  const handleProcess = async () => {
    if (!fileContent) {
      alert('Please upload a document first.');
      return;
    }
    if (!selectedLanguage) {
      alert('Please select a language.');
      return;
    }
    setIsProcessing(true);
    const selectedLang = languages.find(lang => lang.name === selectedLanguage);

    try {
      // Translate content
      const translatedText = await translateText(fileContent, selectedLang.code);
      setTranslatedContent(translatedText);

      // Generate and download PDF with Noto Sans font
      if (!translatedText.includes('Error')) {
        console.log('Generating PDF with content:', translatedText.substring(0, 50) + '...');
        const pdfBytes = await createStyledPdf(translatedText, selectedLang.code);
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `noto_document_${selectedLang.name}.pdf`;
        a.click();
        URL.revokeObjectURL(url);
        console.log('PDF downloaded successfully');
      }
    } catch (error) {
      setError('Failed to process or download the PDF.');
      console.error('Process error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  };
  const translatedContentVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: 'easeOut' } },
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

      {/* Translation & Downloads Section */}
      <section className="translation-section">
        <div className="translation-header">
          <h2>PDF Styling & Downloads</h2>
        </div>
        <div className="translation-container">
          {/* Upload Section */}
          <motion.div
            className="translation-card glassmorphism"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
          >
            <h3>Upload Your Document</h3>
            <label htmlFor="file-upload" className="custom-file-upload">
              Choose File
            </label>
            <input
              id="file-upload"
              type="file"
              accept=".pdf,.txt"
              onChange={handleFileUpload}
              className="upload-input"
            />
            {fileContent && (
              <div className="content-preview">
                <h4>Original Content:</h4>
                <div className="content-box">
                  <p>{fileContent.slice(0, 200)}...</p>
                </div>
              </div>
            )}
            {error && <p style={{ color: 'red' }}>{error}</p>}
          </motion.div>

          {/* Language Selection */}
          <motion.div
            className="translation-card glassmorphism"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2 }}
          >
            <h3>Select Language for Font</h3>
            <div className="language-select-wrapper">
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="language-select-modern"
              >
                <option value="">-- Select Language --</option>
                {languages.map((language, index) => (
                  <option key={index} value={language.name}>
                    {language.flag} {language.name}
                  </option>
                ))}
              </select>
            </div>
          </motion.div>

          {/* Process Button */}
          <motion.button
            className="translate-btn-modern"
            onClick={handleProcess}
            disabled={isProcessing}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95, y: 2 }}
          >
            {isProcessing ? (
              <span className="spinner"></span>
            ) : (
              'Process and Download'
            )}
          </motion.button>

          {/* Processed Content */}
          {translatedContent && (
            <motion.div
              className="translation-card glassmorphism"
              variants={translatedContentVariants}
              initial="hidden"
              animate="visible"
            >
              <h3>Processed Content</h3>
              <div className="content-box">
                <p>{translatedContent.slice(0, 200)}...</p>
              </div>
            </motion.div>
          )}
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>© 2025 FluentNow. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default TranslationDownloads;