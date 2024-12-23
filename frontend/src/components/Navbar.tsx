import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { Code2, LogOut, Menu } from 'lucide-react';

const Navbar = () => {
  const [user, setUser] = useState<any>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <nav className="bg-gradient-to-r from-black to-gray-700 p-5 border-b border-white">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center">
          <Code2 className="h-8 w-8 text-blue-500 mr-2 animate-spin" />
          <h1 className="text-blue-500 font-bold text-2xl md:text-3xl">NinjaCode</h1>
        </div>
        <button
         className="md:hidden text-white"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <Menu className="w-6 h-6" />
        </button>

        <ul
          className={`absolute md:static top-16 left-0 w-full md:w-auto bg-gray-800 md:bg-transparent md:flex md:items-center md:space-x-6 text-white transition-all duration-300 ${
            isMenuOpen ? 'block' : 'hidden'
          } md:block`}
        >
          <li className="px-4 py-2 md:py-0 text-lg hover:text-gray-300">
            <Link to="/">Home</Link>
          </li>
          {user && (
            <>
              <li className="px-4 py-2 md:py-0 text-lg hover:text-gray-300">
                <Link to="/problems">Problems</Link>
              </li>
              <li className="px-4 py-2 md:py-0 text-lg hover:text-gray-300">
                <button onClick={handleSignOut} className="flex items-center">
                  <LogOut className="w-5 h-5 mr-2" />
                  Sign Out
                </button>
              </li>
            </>
          )}
          {!user && (
            <li className="px-4 py-2 md:py-0 text-lg hover:text-gray-300">
              <Link to="/signup">Signup</Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;