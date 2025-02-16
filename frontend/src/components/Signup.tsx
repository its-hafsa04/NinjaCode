import { useState } from "react";
import { signUp } from "../Services/auth.tsx";
import { useNavigate } from "react-router-dom";
import { getAuth, signInWithPopup } from "firebase/auth";
import { app, db } from "../firebase.ts";
import { GoogleAuthProvider } from "firebase/auth";
import GoogleIcon from "../assets/google.svg";
import { doc, setDoc } from "firebase/firestore";
import { toast } from "react-toastify";
const provider = new GoogleAuthProvider();

const Signup = () => {
  const auth = getAuth(app);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userCredential = await signUp(email, password);
      const user = userCredential.user;

      // Store the user data in Firestore
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        uid: user.uid,
        signupDate: new Date().toISOString(),
      });

      navigate("/");
    } catch (error) {
      console.error("Error signing up:", error);
    }
  };

  async function onSignin() {
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        if (!credential) {
          return;
        }
        // The signed-in user info.
        const user = result.user;
        console.log(user);
        // Store Google user data in Firestore
        setDoc(doc(db, "users", user.uid), {
          email: user.email,
          uid: user.uid,
          signupDate: new Date().toISOString(),
        });
        console.log(user.uid);
        navigate("/");
        toast.success("Welcome to NinjaCode!");
      })
      .catch((error) => {
        toast.error(error.message);
      });
  }

  return (
    <div className="flex bg-gray-900">
      <div className="w-full md:w-2/5  flex justify-center items-center h-screen max-sm:hidden max-md:hidden">
        <div>
          <img
            src="https://www.codeninjas.com/hubfs/CodeNinjas%20-%20Marketting%20Website/About/expert-mentors@2x.png"
            alt=""
          />

          <div className="grid grid-cols-3 gap-4">
            {[...Array(9)].map((_, index) => (
              <div key={index} className="opacity-50">
                <i className="fas fa-arrow-down fa-3x"></i>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="w-full h-screen md:w-3/5 flex justify-center items-center">
        <div className="w-full max-w-md">
          <div className=" mb-4  justify-center py-1 sm:px-6 lg:px-8 ">
            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
              <div className="bg-white py-12 px-4 shadow sm:rounded-lg sm:px-10">
                <form onSubmit={handleSignup}>
                  <div className="flex flex-col items-center justify-center gap-4">
                    <p className="font-normal text-2xl text-gray-900">
                      Welcome
                    </p>
                    <p className="font-light text-sm text-gray-600">
                      Signup to continue to NinjaCode.
                    </p>
                    <label
                      style={{
                        color: "#333",
                        textAlign: "left",
                        alignSelf: "flex-start",
                      }}
                    >
                      Email:{" "}
                    </label>
                    <input
                      style={{
                        width: "100%",
                        height: "40px",
                        padding: "10px",
                        border: "1px solid gray",
                      }}
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email"
                    />
                    <label
                      style={{
                        color: "#333",
                        textAlign: "left",
                        alignSelf: "flex-start",
                      }}
                    >
                      Password:{" "}
                    </label>
                    <input
                      style={{
                        width: "100%",
                        height: "40px",
                        padding: "10px",
                        border: "1px solid gray",
                      }}
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Password"
                    />
                    <button
                      type="submit"
                      style={{
                        padding: "10px 20px",
                        width: "100px",
                        alignSelf: "flex-start",
                        backgroundColor: "#0384fc",
                        color: "#fff",
                        margin: "10px 20px",
                        borderRadius: "15px",
                      }}
                    >
                      Sign Up
                    </button>

                    <button
                      type="submit"
                      className="w-full flex justify-center items-center gap-2 py-3 px-4 border rounded font-light text-md hover:bg-gray-200 focus:outline-none focus:ring-2 "
                      onClick={() => onSignin()}
                    >
                      <img src={GoogleIcon} className="w-5 h-5 mr-2" />
                      Continue with Google
                    </button>
                  </div>
                </form>
              </div>
            </div>
            <div className="p-2 text-center">
              <p className="text-gray-400">
                Already have an account?{" "}
                <a href="/signup" className="text-blue-500">
                  Login to continue
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Signup;
