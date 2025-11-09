import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { getInitialAssessmentQuestions, analyzeAssessmentAnswers } from '../services/geminiService';
import { Question } from '../types';
import { LanguageContext, UserContext } from '../App';
import { LanguageSwitcher } from '../components/Navbar';
import { CheckCircle } from 'lucide-react';

const Onboarding: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { t, language } = useContext(LanguageContext);
  const { completeAssessment } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        setError(null);
        setAnswers({});
        setCurrentQuestionIndex(0);
        const fetchedQuestions = await getInitialAssessmentQuestions(language);
        setQuestions(fetchedQuestions);
      } catch (e) {
        setError(t.error);
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, [language, t.error]);

  const handleAnswer = (questionIndex: number, answer: string) => {
    setAnswers({ ...answers, [questionIndex]: answer });
    setTimeout(() => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    }, 300);
  };

  const handleSubmit = async () => {
    if (Object.keys(answers).length !== questions.length) {
      alert('Please answer all questions.');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const result = await analyzeAssessmentAnswers(answers, language);
      completeAssessment(result);
      navigate('/dashboard');
    } catch (e) {
      setError(t.error);
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };
  
  const progress = questions.length > 0 ? (Object.keys(answers).length / questions.length) * 100 : 0;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-lg">{t.loading}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
  }
  
  if (submitting) {
      return (
        <div className="flex justify-center items-center h-screen">
            <div className="text-center">
                <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin mx-auto"></div>
                <p className="mt-4 text-lg">{t.assessmentInProgress}</p>
            </div>
        </div>
      );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4 relative">
      <div className="absolute top-4 end-4 z-10">
        <LanguageSwitcher />
      </div>
      <div className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-10 transition-all">
        <h1 className="text-3xl sm:text-4xl font-bold text-center text-blue-600 dark:text-blue-400 mb-2">{t.assessmentTitle}</h1>
        <p className="text-center text-gray-600 dark:text-gray-300 mb-8">{t.assessmentDescription}</p>
        
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-8">
            <div className="bg-blue-600 h-2.5 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
        </div>

        {questions.length > 0 && currentQuestionIndex < questions.length && (
            <div key={currentQuestionIndex}>
              <h2 className="text-xl sm:text-2xl font-semibold mb-6 text-center">{questions[currentQuestionIndex].question}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {questions[currentQuestionIndex].options.map((option, optionIndex) => (
                  <button
                    key={optionIndex}
                    onClick={() => handleAnswer(currentQuestionIndex, option)}
                    className={`p-4 rounded-lg text-lg text-center font-medium border-2 transition-all duration-200 ${
                      answers[currentQuestionIndex] === option
                        ? 'bg-blue-500 border-blue-500 text-white shadow-lg transform -translate-y-1'
                        : 'bg-gray-100 dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:bg-blue-100 dark:hover:bg-gray-600 hover:border-blue-300'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
        )}

        {questions.length > 0 && Object.keys(answers).length === questions.length && (
            <div className="text-center mt-10">
                <div className="flex justify-center items-center text-green-500 mb-4">
                    <CheckCircle size={40} />
                    <h2 className="text-2xl font-semibold ml-3">{t.assessmentComplete}</h2>
                </div>
                <button
                  onClick={handleSubmit}
                  className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-10 rounded-lg text-xl transition-transform transform hover:scale-105"
                >
                  {t.submit}
                </button>
            </div>
        )}
      </div>
    </div>
  );
};

export default Onboarding;