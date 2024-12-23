import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { auth, db } from '../firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import axios from 'axios';

interface ProblemModel {
  id: string;
  title: string;
  difficulty: string;
  description: string;
  examples: { input: string; output: string; explanation?: string }[];
  constraints: string[];
  starterCode: { [key: string]: string };
  testCases: {
    input: string;
    expectedOutput: string;
    explanation: string;
  }[];
}

interface TestResult {
  input: string;
  expectedOutput: string;
  actualOutput?: string;
  passed: boolean;
  explanation?: string;
  error?: string;
}

interface ValidationResult {
  allPassed: boolean;
  results: TestResult[];
  passedCount: number;
  totalCount: number;
  message: string;
}

const EditorPage = () => {
  const { id } = useParams<{ id: string }>();
  const [problem, setProblem] = useState<ProblemModel | null>(null);
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState<string>('javascript');
  const [isSolved, setIsSolved] = useState(false);
  const [results, setResults] = useState<ValidationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [runError, setRunError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProblem = async () => {
      if (!id) return;
      
      try {
        const problemResponse = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/problems/${id}`);
        const problemData = problemResponse.data;
        setProblem(problemData);
        setCode(problemData.starterCode[language] || '// Write your solution here');
        
        // Check if problem is already solved
        if (auth.currentUser) {
          const submissionDoc = await getDoc(
            doc(db, 'users', auth.currentUser.uid, 'submissions', id)
          );
          setIsSolved(submissionDoc.exists());
        }
      } catch (error) {
        console.error('Error fetching problem:', error);
      }
    };

    fetchProblem();
  }, [id, language]);

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      setCode(value);
      setRunError(null);
      setResults(null);
    }
  };

  const handleRunCode = async () => {
    if (!problem || !auth.currentUser) return;

    setLoading(true);
    setRunError(null);
    setResults(null);
    
    try {
      // Use a separate endpoint for running code without saving
      const response = await axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/run`, {
        userId: auth.currentUser.uid,
        problemId: id,
        code,
        language
      });

      setResults(response.data);
    } catch (error: any) {
      setRunError(error.response?.data?.message || 'An unexpected error occurred');
      console.error('Run code error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!problem || !auth.currentUser || !id) return;

    setLoading(true);
    setRunError(null);
    setResults(null);

    try {
      // Use submit endpoint for final submission
      const response = await axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/submit`, {
        userId: auth.currentUser.uid,
        problemId: id,
        code,
        language
      });

      const validationResult = response.data;
      setResults(validationResult);

      // Only save to database if all tests pass
      if (validationResult.allPassed) {
        await setDoc(doc(db, 'users', auth.currentUser.uid, 'submissions', id), {
          code,
          language,
          timestamp: new Date().toISOString(),
          passed: true
        });
        setIsSolved(true);
      }
    } catch (error: any) {
      setRunError(error.response?.data?.message || 'An unexpected error occurred');
      console.error('Submission error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!problem) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-gray-900 text-white flex flex-col md:flex-row p-5 gap-4">
  <div className="md:w-1/2 w-full">
    <div className="flex items-center gap-2">
      <h1 className="text-2xl md:text-3xl font-bold">{problem.title}</h1>
      {isSolved && <CheckCircle className="text-green-500 w-5 h-5 md:w-6 md:h-6" />}
    </div>
    <p className="text-md md:text-lg font-medium text-blue-400 mb-4">{problem.difficulty}</p>
    
    <div className="mb-6">
      <h2 className="text-lg md:text-xl font-semibold mb-2">Description:</h2>
      <p className="text-gray-300">{problem.description}</p>
    </div>

    <div className="mb-6">
      <h2 className="text-lg md:text-xl font-semibold mb-2">Examples:</h2>
      {problem.examples?.map((example, index) => (
        <div key={index} className="mb-4 bg-gray-800 p-4 rounded-lg">
          <p className="font-medium text-blue-400">Input: <span className="text-gray-300">{example.input}</span></p>
          <p className="font-medium text-blue-400">Output: <span className="text-gray-300">{example.output}</span></p>
          {example.explanation && (
            <p className="font-medium text-blue-400">Explanation: <span className="text-gray-300">{example.explanation}</span></p>
          )}
        </div>
      ))}
    </div>

    {results && (
      <div className="mb-6">
        <h2 className="text-lg md:text-xl font-semibold mb-2">Test Results:</h2>
        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-white">
              {results.passedCount}/{results.totalCount} tests passed
            </span>
          </div>
          {results.results.map((result, index) => (
            <div 
              key={index} 
              className={`p-2 rounded mt-2 ${result.passed ? 'bg-green-900/50' : 'bg-red-900/50'}`}
            >
              <div className="flex items-center gap-2">
                {result.passed ? 
                  <CheckCircle className="text-green-500 w-4 h-4" /> : 
                  <XCircle className="text-red-500 w-4 h-4" />
                }
                <span>Test Case: {result.explanation}</span>
              </div>
              <div className="mt-2 pl-6 text-sm text-gray-300">
                <p>Input: {result.input}</p>
                <p>Expected Output: {result.expectedOutput}</p>
                {!result.passed && (
                  <>
                    <p>Actual Output: {result.actualOutput || 'N/A'}</p>
                    {result.error && <p className="text-red-400">Error: {result.error}</p>}
                  </>
                )}
              </div>
            </div>
          ))}
          <p className="mt-4 text-center font-medium">{results.message}</p>
        </div>
      </div>
    )}

    <div>
      <h2 className="text-lg md:text-xl font-semibold mb-2">Constraints:</h2>
      <ul className="list-disc list-inside text-gray-300">
        {problem.constraints?.map((constraint, index) => (
          <li key={index}>{constraint}</li>
        ))}
      </ul>
    </div>
  </div>

  <div className="md:w-1/2 w-full">
    <div className="mb-4 flex items-center gap-4">
      <select
        className="bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 w-full md:w-auto"
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
      >
        <option value="javascript">JavaScript</option>
      </select>
    </div>

    <div className="h-[300px] md:h-[500px] border border-gray-700 rounded-lg overflow-hidden">
      <Editor
        height="100%"
        language={language}
        value={code}
        onChange={handleEditorChange}
        theme="vs-dark"
        options={{
          minimap: { enabled: false },
          fontSize: 16,
          scrollBeyondLastLine: false,
          lineNumbers: 'on',
          roundedSelection: false,
          automaticLayout: true
        }}
      />
    </div>
    {runError && (
      <div className="mt-4 p-4 rounded-lg bg-red-900/50 border border-red-700">
        <div className="flex items-center gap-2">
          <XCircle className="text-red-500 flex-shrink-0" />
          <pre className="font-mono text-sm text-red-200 whitespace-pre-wrap">{runError}</pre>
        </div>
      </div>
    )}

    <div className="mt-4 flex flex-col md:flex-row gap-4">
      <button
        className={`px-6 py-2 rounded-lg font-medium flex items-center gap-2 ${
          loading ? 'bg-blue-700 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
        }`}
        onClick={handleRunCode}
        disabled={loading}
      >
        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
        Run Code
      </button>
      <button
        className={`px-6 py-2 rounded-lg font-medium flex items-center gap-2 ${
          loading ? 'bg-green-700 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
        }`}
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
        Submit
      </button>
    </div>
  </div>
</div>
  );
};

export default EditorPage;