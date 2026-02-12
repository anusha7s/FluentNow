import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaFileDownload, FaMicrophone, FaCamera, FaBook, FaGlobe, FaUser } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../AuthContext';
import '../App.css';

function Home() {
  const { user } = useAuth();
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);

  const scrollingFeatures = [
    {
      title: 'Translation & Downloads',
      description: 'Translate text and download documents instantly.',
      icon: <FaFileDownload className="feature-icon" />,
      link: '/translation-downloads',
      backgroundColor: 'rgba(245, 166, 35, 0.2)',
    },
    {
      title: 'Speech Translation',
      description: 'Convert speech to text and text to speech seamlessly.',
      icon: <FaMicrophone className="feature-icon" />,
      link: '/speech-translation',
      backgroundColor: 'rgba(28, 176, 246, 0.2)',
    },
    {
      title: 'Camera Translation',
      description: 'Translate text from images in real-time.',
      icon: <FaCamera className="feature-icon" />,
      link: '/camera-translation',
      backgroundColor: 'rgba(88, 204, 2, 0.2)',
    },
    {
      title: 'Language Learning',
      description: 'Learn with lessons and interactive quizzes.',
      icon: <FaBook className="feature-icon" />,
      link: '/language-learning',
      backgroundColor: 'rgba(255, 75, 92, 0.2)',
    },
    {
      title: 'Accent Customization',
      description: 'Tailor translations to accents and dialects.',
      icon: <FaGlobe className="feature-icon" />,
      link: '/accent-customization',
      backgroundColor: 'rgba(245, 166, 35, 0.2)',
    },
  ];

  const languages = [
    { name: 'Italian', flag: '🇮🇹' },
    { name: 'Portuguese', flag: '🇵🇹' },
    { name: 'Dutch', flag: '🇳🇱' },
    { name: 'Japanese', flag: '🇯🇵' },
    { name: 'Arabic', flag: '🇸🇦' },
    { name: 'Czech', flag: '🇨🇿' },
    { name: 'Welsh', flag: '🏴󠁧󠁢󠁷󠁬󠁳󠁿' },
    { name: 'Spanish', flag: '🇪🇸' },
    { name: 'French', flag: '🇫🇷' },
    { name: 'German', flag: '🇩🇪' },
    { name: 'Chinese', flag: '🇨🇳' },
    { name: 'Russian', flag: '🇷🇺' },
    { name: 'Korean', flag: '🇰🇷' },
    { name: 'Hindi', flag: '🇮🇳' },
    { name: 'Swahili', flag: '🇰🇪' },
  ];

  const alternateFeatures = [
    {
      title: 'Fun',
      description: 'Enjoy learning with engaging and interactive lessons.',
      image: '/fun.png',
    },
    {
      title: 'Personalised Learnings',
      description: 'Tailored lessons that adapt to your learning style.',
      image: '/personalised.png',
    },
    {
      title: 'Anywhere! Anytime!',
      description: 'Learn on the go, whenever and wherever you want.',
      image: '/anywhere.png',
    },
    {
      title: 'Smart Practice',
      description: 'Reinforce your skills with intelligent practice sessions.',
      image: '/smart-practice.png',
    },
    {
      title: 'Multilingual Mastery',
      description: 'Master multiple languages with ease and confidence.',
      image: '/multilingual.png',
    },
    {
      title: 'Fast Progress',
      description: 'See quick results with bite-sized, effective lessons.',
      image: '/fast-progress.png',
    },
  ];

  // Animation variants
  const chipVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: { delay: i * 0.2, duration: 0.5 },
    }),
  };

  const cardVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: { delay: i * 0.2, duration: 0.5, type: 'spring' },
    }),
  };

  const iconVariants = {
    hidden: { scale: 0 },
    visible: { scale: 1, transition: { type: 'spring', stiffness: 200, damping: 10 } },
  };

  const alternateFeatureVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const alternateTextVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i) => ({ opacity: 1, x: 0, transition: { delay: i * 0.2, duration: 0.5 } }),
  };

  const alternateImageVariants = {
    hidden: { scale: 0 },
    visible: { scale: 1, transition: { type: 'spring', stiffness: 200, damping: 10 } },
  };

  const particleVariants = {
    float: (i) => ({
      x: [0, 1000],
      y: [0, Math.sin(i) * 100],
      opacity: [0, 0.5, 0],
      transition: { duration: 10 + i * 2, repeat: Infinity, ease: 'linear' },
    }),
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3, type: 'spring' } },
    exit: { opacity: 0, scale: 0.8, transition: { duration: 0.3 } },
  };

  return (
    <div className="App">
      <motion.div
        className="background-gradient"
        animate={{
          background: [
            'linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)',
            'linear-gradient(135deg, #e0e0e0 0%, #f5f5f5 100%)',
            'linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)',
          ],
        }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      />

      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="particle"
          style={{
            position: 'absolute',
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            width: '8px',
            height: '8px',
            background: i % 2 === 0 ? '#58cc02' : '#0288D1',
            borderRadius: '50%',
          }}
          variants={particleVariants}
          animate="float"
          custom={i}
        />
      ))}

      <nav className="navbar">
        <div className="nav-content">
          <motion.div
            className="nav-logo"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 10 }}
          >
            <img src="/logo.png" alt="FluentNow Logo" className="logo" />
            <h1>FluentNow</h1>
          </motion.div>
          <div className="nav-languages">
            {languages.slice(0, 3).map((language, index) => (
              <motion.span
                key={index}
                className="language-chip"
                variants={chipVariants}
                initial="hidden"
                animate="visible"
                custom={index}
              >
                {language.flag} {language.name}
              </motion.span>
            ))}
            <motion.button
              className="more-languages-btn"
              whileHover={{ scale: 1.05, boxShadow: '0 0 10px rgba(88, 204, 2, 0.5)' }}
              onClick={() => setIsLanguageModalOpen(true)}
            >
              More
            </motion.button>
          </div>
          {!user && (
            <motion.button
              className="get-started-btn"
              animate={{
                scale: [1, 1.05, 1],
                boxShadow: [
                  '0 0 10px rgba(88, 204, 2, 0.5)',
                  '0 0 20px rgba(88, 204, 2, 0.7)',
                  '0 0 10px rgba(88, 204, 2, 0.5)',
                ],
              }}
              transition={{ repeat: Infinity, duration: 2 }}
              onClick={() => (window.location.href = '/auth')}
            >
              Get Started
            </motion.button>
          )}
          {user && (
            <motion.button
              className="get-started-btn"
              whileHover={{ scale: 1.05, boxShadow: '0 0 10px rgba(88, 204, 2, 0.5)' }}
              onClick={() => (window.location.href = '/profile')}
            >
              <FaUser style={{ marginRight: '5px' }} />
            </motion.button>
          )}
        </div>
      </nav>

      <AnimatePresence>
        {isLanguageModalOpen && (
          <motion.div
            className="language-modal"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={modalVariants}
          >
            <motion.div className="language-modal-content">
              <h2>Select a Language</h2>
              <div className="language-list">
                {languages.map((language, index) => (
                  <motion.span
                    key={index}
                    className="language-chip"
                    variants={chipVariants}
                    initial="hidden"
                    animate="visible"
                    custom={index}
                  >
                    {language.flag} {language.name}
                  </motion.span>
                ))}
              </div>
              <motion.button
                className="close-modal-btn"
                whileHover={{ scale: 1.05, boxShadow: '0 0 10px rgba(88, 204, 2, 0.5)' }}
                onClick={() => setIsLanguageModalOpen(false)}
              >
                Close
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <header className="hero">
        <div className="hero-content">
          <img src="/logo.png" alt="FluentNow Logo" className="logo" />
          <h1>FluentNow</h1>
        </div>
        <p className="subtitle">
          Master languages in real-time with cutting-edge translation and learning tools.
        </p>
        {!user && (
          <motion.button
            className="cta-button"
            whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(88, 204, 2, 0.5)', transition: { duration: 0.3 } }}
            whileTap={{ scale: 0.95 }}
            onClick={() => (window.location.href = '/auth')}
          >
            Start Your Journey
          </motion.button>
        )}
        {user && null} {/* No button after login to avoid fade issue */}
      </header>

      <section className="features-scroll">
        <div className="features-container">
          {scrollingFeatures.map((feature, index) => (
            <Link
              to={feature.link}
              key={index}
              className="feature-card"
              style={{ backgroundColor: feature.backgroundColor }}
            >
              <motion.div
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                custom={index}
              >
                <div className="feature-number">0{index + 1}</div>
                <div className="feature-content">
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </div>
                <motion.div
                  className="feature-image"
                  variants={iconVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.3 }}
                >
                  {feature.icon}
                </motion.div>
              </motion.div>
            </Link>
          ))}
        </div>
      </section>

      <section className="alternate-features">
        {alternateFeatures.map((feature, index) => (
          <motion.div
            key={index}
            className={`alternate-feature ${index % 2 === 0 ? 'left-align' : 'right-align'}`}
            variants={alternateFeatureVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <div className="alternate-feature-content">
              <motion.h2
                variants={alternateTextVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3}}
                custom={0}
              >
                {feature.title}
              </motion.h2>
              <motion.p
                variants={alternateTextVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3}}
                custom={1}
              >
                {feature.description}
              </motion.p>
            </div>
            <motion.div
              className="alternate-feature-image"
              variants={alternateImageVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3}}
            >
              <img
                src={feature.image}
                alt={feature.title}
                className="alternate-feature-img"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/300x200?text=' + feature.title;
                }}
              />
            </motion.div>
          </motion.div>
        ))}
      </section>

      <motion.footer
        className="footer"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5 }}
      >
        <p>© 2025 FluentNow. All rights reserved.</p>
      </motion.footer>
    </div>
  );
}

export default Home;