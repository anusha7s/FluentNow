// import React, { useState, useEffect } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { useAuth } from '../AuthContext';
// import { config } from 'dotenv';
// import '../App.css';

// config(); // Load environment variables

// function LanguageLearning() {
//   const { user } = useAuth();
//   const [currentStage, setCurrentStage] = useState('languageSelection');
//   const [selectedLanguage, setSelectedLanguage] = useState(null);
//   const [startOption, setStartOption] = useState(null);
//   const [currentLevel, setCurrentLevel] = useState(1);
//   const [score, setScore] = useState(() => {
//     const savedScore = localStorage.getItem(`score_${user?.uid}_${selectedLanguage}`);
//     return savedScore ? parseInt(savedScore, 10) : 0;
//   });
//   const [questions, setQuestions] = useState([]);
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//   const [showResult, setShowResult] = useState(false);
//   const [userLevel, setUserLevel] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);

//   const languages = [
//     { name: 'Spanish', flag: '🇪🇸', color: '#ff6b6b' },
//     { name: 'Japanese', flag: '🇯🇵', color: '#4ecdc4' },
//     { name: 'French', flag: '🇫🇷', color: '#45b7d1' },
//     { name: 'German', flag: '🇩🇪', color: '#96ceb4' },
//   ];

//   const levels = {
//     1: { title: 'Beginner', color: '#ff6b6b' },
//     2: { title: 'Intermediate', color: '#4ecdc4' },
//     3: { title: 'Advanced', color: '#45b7d1' },
//   };

//   useEffect(() => {
//     if (selectedLanguage && startOption && currentStage === 'quiz') {
//       localStorage.setItem(`score_${user?.uid}_${selectedLanguage}`, score);
//     }
//   }, [score, selectedLanguage, startOption, user?.uid, currentStage]);

//   const fetchQuestions = async (level) => {
//     setIsLoading(true);
//     try {
//       const apiKey = process.env.REACT_APP_OPENAI_API_KEY;
//       if (!apiKey) {
//         throw new Error('API key is missing. Please check your .env file.');
//       }
//       const response = await fetch('https://api.openai.com/v1/custom/questions', { // Replace with actual Open AI endpoint
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${apiKey}`,
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           language: selectedLanguage,
//           level: level,
//           num_questions: 2, // Adjust number of questions as needed
//           prompt: `Generate ${level === 1 ? 'beginner' : level === 2 ? 'intermediate' : 'advanced'} level quiz questions in ${selectedLanguage}. Return in JSON format with fields: type (mcq/fill), question, options (for mcq), correct (for mcq), answer (for fill), points.`,
//         }),
//       });
//       const data = await response.json();
//       console.log('API Response:', data); // Debug log
//       if (data.questions && data.questions.length > 0) {
//         setQuestions(data.questions);
//       } else {
//         console.warn('No questions received:', data);
//         setQuestions([{ type: 'mcq', question: 'No questions available.', options: ['Try again'], correct: 'Try again', points: 0 }]);
//       }
//     } catch (error) {
//       console.error('Error fetching questions:', error);
//       setQuestions([{ type: 'mcq', question: 'API error. Please try again later.', options: ['Retry'], correct: 'Retry', points: 0 }]);
//     } finally {
//       setIsLoading(false);
//       setCurrentQuestionIndex(0);
//     }
//   };

//   const handleLanguageSelect = (language) => {
//     setSelectedLanguage(language);
//     setCurrentStage('startOptions');
//   };

//   const handleStartOption = (option) => {
//     setStartOption(option);
//     if (option === 'startFromScratch') {
//       setCurrentLevel(1);
//       fetchQuestions(1);
//       setCurrentStage('quiz');
//     } else {
//       setCurrentStage('levelAssessment');
//       fetchQuestions(1); // Start with beginner questions for assessment
//     }
//   };

//   const handleAnswer = (answer) => {
//     const question = questions[currentQuestionIndex];
//     const isCorrect = question.type === 'mcq' ? answer === question.correct : answer.toLowerCase() === question.answer.toLowerCase();
//     if (isCorrect) {
//       setScore(score + (question.points || 10));
//       setShowResult(true);
//     } else {
//       setShowResult(false);
//     }
//     setTimeout(() => {
//       setShowResult(false);
//       if (currentQuestionIndex + 1 < questions.length) {
//         setCurrentQuestionIndex(currentQuestionIndex + 1);
//       } else if (startOption === 'findMyLevel') {
//         assessLevel();
//       } else {
//         proceedToNextLevel();
//       }
//     }, 1000);
//   };

//   const handleTryAgain = () => {
//     fetchQuestions(currentLevel);
//   };

//   const assessLevel = () => {
//     const correctCount = questions.filter((q, i) => {
//       const userAnswer = typeof q.userAnswer === 'string' ? q.userAnswer.toLowerCase() : q.userAnswer;
//       return (q.type === 'mcq' && userAnswer === q.correct) || (q.type === 'fill' && userAnswer === q.answer.toLowerCase());
//     }).length;
//     setUserLevel(correctCount >= 2 ? 2 : 1);
//     setCurrentLevel(correctCount >= 2 ? 2 : 1);
//     fetchQuestions(correctCount >= 2 ? 2 : 1);
//     setCurrentStage('quiz');
//   };

//   const proceedToNextLevel = () => {
//     if (currentLevel < 3) {
//       setCurrentLevel(currentLevel + 1);
//       fetchQuestions(currentLevel + 1);
//     } else {
//       alert('Congratulations! You’ve mastered all levels!');
//     }
//   };

//   const getQuestionComponent = () => {
//     const question = questions[currentQuestionIndex];
//     if (isLoading) {
//       return <div className="loading">Loading questions...</div>;
//     }
//     if (question.question === 'No questions available.' || question.question === 'API error. Please try again later.') {
//       return (
//         <div className="question-container">
//           <h3>{question.question}</h3>
//           <motion.button
//             className="option-button"
//             onClick={handleTryAgain}
//             whileHover={{ scale: 1.1, boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)' }}
//             whileTap={{ scale: 0.95 }}
//             style={{ backgroundColor: levels[currentLevel].color }}
//           >
//             Try again
//           </motion.button>
//         </div>
//       );
//     }
//     if (question.type === 'mcq') {
//       return (
//         <div className="question-container">
//           <h3>{question.question}</h3>
//           <div className="options">
//             {question.options.map((option, idx) => (
//               <motion.button
//                 key={idx}
//                 className="option-button"
//                 onClick={() => {
//                   question.userAnswer = option;
//                   handleAnswer(option);
//                 }}
//                 whileHover={{ scale: 1.1, boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)' }}
//                 whileTap={{ scale: 0.95 }}
//                 style={{ backgroundColor: levels[currentLevel].color }}
//               >
//                 {option}
//               </motion.button>
//             ))}
//           </div>
//         </div>
//       );
//     } else if (question.type === 'fill') {
//       return (
//         <div className="question-container">
//           <h3>{question.question}</h3>
//           <input
//             type="text"
//             className="fill-input"
//             onKeyPress={(e) => {
//               if (e.key === 'Enter') {
//                 question.userAnswer = e.target.value;
//                 handleAnswer(e.target.value);
//                 e.target.value = '';
//               }
//             }}
//             style={{ borderColor: levels[currentLevel].color }}
//           />
//         </div>
//       );
//     }
//     return null;
//   };

//   return (
//     <div className="App">
//       <section className="language-learning-section">
//         <div className="background-particles">
//           {Array.from({ length: 12 }).map((_, i) => (
//             <motion.div
//               key={i}
//               className="particle"
//               animate={{ y: ['100vh', '-10vh'], opacity: [0, 1, 0] }}
//               transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: i * 0.5 }}
//               style={{ backgroundColor: `hsl(${i * 30}, 70%, 60%)` }}
//             />
//           ))}
//         </div>

//         <AnimatePresence mode="wait">
//           {currentStage === 'languageSelection' && (
//             <motion.div
//               key="languageSelection"
//               className="learning-card"
//               initial={{ opacity: 0, scale: 0.5 }}
//               animate={{ opacity: 1, scale: 1 }}
//               exit={{ opacity: 0 }}
//               transition={{ duration: 0.6 }}
//             >
//               <motion.div
//                 className="duo-bubble"
//                 animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
//                 transition={{ duration: 2, repeat: Infinity }}
//               >
//                 <h2>Hi there! I’m Duo!</h2>
//               </motion.div>
//               <motion.div className="language-cards">
//                 {languages.map((lang, idx) => (
//                   <motion.div
//                     key={idx}
//                     className="language-card"
//                     style={{ background: `linear-gradient(135deg, ${lang.color}, #fff)` }}
//                     onClick={() => handleLanguageSelect(lang.name)}
//                     whileHover={{ scale: 1.1, boxShadow: '0 0 20px rgba(0, 0, 0, 0.2)' }}
//                     whileTap={{ scale: 0.95 }}
//                   >
//                     <span>{lang.flag}</span>
//                     <h3>{lang.name}</h3>
//                     <motion.div
//                       className="language-glow"
//                       animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
//                       transition={{ duration: 2, repeat: Infinity }}
//                     />
//                   </motion.div>
//                 ))}
//               </motion.div>
//               <motion.button
//                 className="continue-btn"
//                 onClick={() => setCurrentStage('startOptions')}
//                 whileHover={{ scale: 1.1, backgroundColor: '#4ecdc4' }}
//                 whileTap={{ scale: 0.95 }}
//               >
//                 CONTINUE
//               </motion.button>
//             </motion.div>
//           )}

//           {currentStage === 'startOptions' && (
//             <motion.div
//               key="startOptions"
//               className="learning-card"
//               initial={{ opacity: 0, scale: 0.5 }}
//               animate={{ opacity: 1, scale: 1 }}
//               exit={{ opacity: 0 }}
//               transition={{ duration: 0.6 }}
//             >
//               <h2>Choose Your Path</h2>
//               <div className="option-cards">
//                 <motion.button
//                   className="option-card"
//                   onClick={() => handleStartOption('startFromScratch')}
//                   whileHover={{ scale: 1.1, backgroundColor: '#ff6b6b' }}
//                   whileTap={{ scale: 0.95 }}
//                 >
//                   Start from Scratch
//                 </motion.button>
//                 <motion.button
//                   className="option-card"
//                   onClick={() => handleStartOption('findMyLevel')}
//                   whileHover={{ scale: 1.1, backgroundColor: '#96ceb4' }}
//                   whileTap={{ scale: 0.95 }}
//                 >
//                   Find My Level
//                 </motion.button>
//               </div>
//             </motion.div>
//           )}

//           {currentStage === 'levelAssessment' && (
//             <motion.div
//               key="levelAssessment"
//               className="learning-card"
//               initial={{ opacity: 0, scale: 0.5 }}
//               animate={{ opacity: 1, scale: 1 }}
//               exit={{ opacity: 0 }}
//               transition={{ duration: 0.6 }}
//             >
//               <h2>Level Assessment</h2>
//               {getQuestionComponent()}
//               {showResult && (
//                 <motion.div
//                   className="result-message"
//                   initial={{ scale: 0 }}
//                   animate={{ scale: 1 }}
//                   transition={{ duration: 0.5 }}
//                 >
//                   {questions[currentQuestionIndex].type === 'mcq' ? 'Correct!' : 'Check your answer!'} 🎉
//                 </motion.div>
//               )}
//               <p>Score: {score}</p>
//             </motion.div>
//           )}

//           {currentStage === 'quiz' && (
//             <motion.div
//               key="quiz"
//               className="learning-card"
//               initial={{ opacity: 0, scale: 0.5 }}
//               animate={{ opacity: 1, scale: 1 }}
//               exit={{ opacity: 0 }}
//               transition={{ duration: 0.6 }}
//             >
//               <div className="level-banner" style={{ backgroundColor: levels[currentLevel].color }}>
//                 <h2>Level {currentLevel}: {levels[currentLevel].title}</h2>
//               </div>
//               <div className="progress-bar">
//                 <motion.div
//                   className="progress-fill"
//                   style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
//                   animate={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
//                   transition={{ duration: 0.5 }}
//                 />
//               </div>
//               <motion.div
//                 className="quiz-card"
//                 initial={{ rotateY: 180 }}
//                 animate={{ rotateY: 0 }}
//                 transition={{ duration: 0.8 }}
//               >
//                 {getQuestionComponent()}
//               </motion.div>
//               {showResult && (
//                 <motion.div
//                   className="result-message"
//                   initial={{ scale: 0 }}
//                   animate={{ scale: 1}}
//                   transition={{ duration: 0.5 }}
//                 >
//                   Correct! 🎉 +{(questions[currentQuestionIndex].points || 10)} points
//                 </motion.div>
//               )}
//               <p>Total Score: {score}</p>
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </section>
//     </div>
//   );
// }

// export default LanguageLearning;