import React, { useState } from 'react';
import { auth } from '../firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import '../App.css';

function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      navigate('/');
    } catch (err) {
      setError('Authentication failed. Check your credentials or try again.');
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  };

  const inputVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: (i) => ({
      x: 0,
      opacity: 1,
      transition: { delay: i * 0.2, duration: 0.5 },
    }),
  };

  const buttonVariants = {
    hover: { scale: 1.05, boxShadow: '0 0 15px rgba(88, 204, 2, 0.7)' },
    tap: { scale: 0.95 },
  };

  return (
    <div className="camera-translation-section" style={{ minHeight: '100vh', position: 'relative' }}>
      {/* Background Particles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="particle"
          style={{
            position: 'absolute',
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            width: '10px',
            height: '10px',
            background: i % 2 === 0 ? '#58cc02' : '#AED581',
            borderRadius: '50%',
            zIndex: 0,
          }}
          animate={{
            y: [0, -50, 0],
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{
            duration: 5 + i * 0.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Gradient Background Animation */}
      <motion.div
        className="background-gradient"
        animate={{
          background: [
            'linear-gradient(135deg, #C8E6C9 0%, #E8F5E9 100%)',
            'linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%)',
            'linear-gradient(135deg, #C8E6C9 0%, #E8F5E9 100%)',
          ],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1 }}
      />

      <div className="translation-container">
        <motion.div
          className="translation-card glassmorphism"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.img
            src="/logo.png"
            alt="FluentNow Logo"
            className="logo"
            style={{ width: '80px', marginBottom: '20px' }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 10 }}
          />
          <motion.h2
            style={{ fontSize: '2.5rem', color: '#558B2F', marginBottom: '20px' }}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            FluentNow
          </motion.h2>
          <h3>{isLogin ? 'Login' : 'Sign Up'}</h3>
          {error && <p style={{ color: 'red', marginBottom: '15px' }}>{error}</p>}
          <form onSubmit={handleAuth}>
            <motion.input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="language-select-modern"
              style={{ marginBottom: '15px', width: '100%' }}
              variants={inputVariants}
              initial="hidden"
              animate="visible"
              custom={0}
            />
            <motion.input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="language-select-modern"
              style={{ marginBottom: '15px', width: '100%' }}
              variants={inputVariants}
              initial="hidden"
              animate="visible"
              custom={1}
            />
            <motion.button
              type="submit"
              className="translate-btn-modern"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              {isLogin ? 'Login' : 'Sign Up'}
            </motion.button>
          </form>
          <motion.p
            style={{ marginTop: '15px', color: '#558B2F', cursor: 'pointer' }}
            onClick={toggleMode}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Login'}
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}

export default Auth;