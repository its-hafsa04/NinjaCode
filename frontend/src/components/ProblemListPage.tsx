import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { auth, db } from '../firebase.ts';
import { collection, getDocs } from 'firebase/firestore';
import { CheckCircle } from 'lucide-react';
import axios from 'axios';

interface Problem {
  id: string;
  title: string;
  difficulty: string;
}

const ProblemListPage = () => {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [solvedProblems, setSolvedProblems] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const problemsResponse = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/problems`,
          { withCredentials: true }
        );
        setProblems(problemsResponse.data);

        // Fetch solved problems for current user from Firestore
        if (auth.currentUser) {
          const submissionsRef = collection(db, 'users', auth.currentUser.uid, 'submissions');
          const submissionsSnapshot = await getDocs(submissionsRef);
          const solvedSet = new Set(submissionsSnapshot.docs.map(doc => doc.id));
          setSolvedProblems(solvedSet);
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching problems:', error);
        setLoading(false);
      }
    };

    fetchProblems();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-white my-10 text-center">Coding Problems</h1>
        
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-700">
                <th className="px-6 py-3 text-left text-white">Status</th>
                <th className="px-6 py-3 text-left text-white">Title</th>
                <th className="px-6 py-3 text-left text-white">Difficulty</th>
              </tr>
            </thead>
            <tbody>
              {problems.map((problem) => (
                <tr key={problem.id} className="border-t border-gray-700 hover:bg-gray-700">
                  <td className="px-6 py-4">
                    {solvedProblems.has(problem.id) && (
                      <CheckCircle className="text-green-500 w-5 h-5" />
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <Link 
                      to={`/problem/${problem.id}`} 
                      className="text-blue-400 hover:text-blue-300"
                    >
                      {problem.title}
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      problem.difficulty === 'Easy' ? 'bg-green-900 text-green-300' :
                      problem.difficulty === 'Medium' ? 'bg-yellow-900 text-yellow-300' :
                      'bg-red-900 text-red-300'
                    }`}>
                      {problem.difficulty}
                    </span>
                  </td>
                </tr>
              ))}
              <tr className="border-t border-gray-700 hover:bg-gray-700">
                <td colSpan={3} className="px-6 py-4 text-center text-blue-500">Coming Soon...</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProblemListPage;