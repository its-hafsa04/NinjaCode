import { Typewriter } from 'react-simple-typewriter';
import { Code2, Brain, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import Footer from './Footer';

const LandingPage = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    const user = auth.currentUser;
    if (user) {
      navigate('/problems');
    } else {
      navigate('/signup');
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-20">
        <div className="text-center mt-10 md:mt-[150px]">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Master Coding with{' '}
            <span className="text-blue-500">
              <Typewriter
                words={[' NinjaCode']}
                loop={100}
                cursor
                cursorStyle="|"
                typeSpeed={90}
                deleteSpeed={80}
                delaySpeed={2000}
              />
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-400 mt-5 md:mt-10 mb-5 max-w-3xl mx-auto">
            Enhance your coding skills with our curated collection of programming challenges.
            Practice, learn, and become a better developer.
          </p>
          <ul className="text-left md:text-center text-sm md:text-[20px] text-gray-400 mb-8 md:mb-12 space-y-2 md:space-y-0">
            <li>👉 Solve real coding problems</li>
            <li>👉 Track your progress</li>
            <li>👉 Compete with others</li>
          </ul>
          <button 
            onClick={handleGetStarted}
            className="bg-blue-600 text-white px-6 py-3 md:px-8 md:py-4 rounded-lg text-sm md:text-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Get Started
          </button>
        </div>
        <hr className="text-white mt-12 md:mt-20" />
        <h1 className="mt-12 md:mt-20 text-center text-white font-semibold text-3xl md:text-[50px]">
          Features
        </h1>
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 place-items-center">
          <div className="w-[150px] h-[200px] md:w-[180px] md:h-[250px]">
            <img
              src="https://images.assets-landingi.com/uc/2444136f-b44c-4c01-94d5-675187b53c50/NinjaHero2.gif"
              alt="Ninja Hero"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="bg-gray-800 p-4 md:p-6 rounded-lg hover:bg-slate-500">
            <Code2 className="h-10 w-10 md:h-12 md:w-12 text-blue-500 mb-4" />
            <h3 className="text-lg md:text-xl font-semibold text-white mb-2">
              Diverse Problem Set
            </h3>
            <p className="text-gray-400 text-sm md:text-base">
              From easy to hard, our problems cover various algorithms and data structures.
            </p>
          </div>
          <div className="bg-gray-800 p-4 md:p-6 rounded-lg hover:bg-slate-500">
            <Brain className="h-10 w-10 md:h-12 md:w-12 text-blue-500 mb-4" />
            <h3 className="text-lg md:text-xl font-semibold text-white mb-2">
              Learn by Doing
            </h3>
            <p className="text-gray-400 text-sm md:text-base">
              Practice with real coding challenges and improve your problem-solving skills.
            </p>
          </div>
          <div className="bg-gray-800 p-4 md:p-6 rounded-lg hover:bg-slate-500">
            <Zap className="h-10 w-10 md:h-12 md:w-12 text-blue-500 mb-4" />
            <h3 className="text-lg md:text-xl font-semibold text-white mb-2">
              Instant Feedback
            </h3>
            <p className="text-gray-400 text-sm md:text-base">
              Get immediate feedback on your solutions with our test cases.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default LandingPage;