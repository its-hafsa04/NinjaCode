import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './components/LandingPage.tsx';
import ProblemListPage from './components/ProblemListPage.tsx';
import EditorPage from './components/EditorPage.tsx';
import Navbar from './components/Navbar.tsx';
import Signup from './components/Signup.tsx';
import ProtectedRoute from './components/ProtectedRoute.tsx';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-900">
        <Navbar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/problems" element={
            <ProtectedRoute>
              <ProblemListPage />
            </ProtectedRoute>
          } />
          <Route path="/problem/:id" element={
            <ProtectedRoute>
              <EditorPage />
            </ProtectedRoute>
          } />
        </Routes>
      </div>
      <ToastContainer
    position="bottom-center"
    autoClose={5000}
    hideProgressBar={false}
    newestOnTop={false}
    closeOnClick
    rtl={false}
    pauseOnFocusLoss
    draggable
    pauseOnHover
    theme="dark"
  />
    </Router>
  );
};

export default App;
