import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import googleImage from '../assets/images/google.png';
import toast from "react-hot-toast";
// import { auth } from "../firebase";
import {auth} from '../firebase'
import { useState } from "react";
import { useAppDispatch } from "../../hooks";
import { newUser } from "../redux/reducer/userReducer";

const Login = () => {
  const dispatch = useAppDispatch();
  const [gender, setGender] = useState("");
  const [date, setDate] = useState("");

  const handleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const user = await signInWithPopup(auth, provider);
      console.log("user", user.user);
      const userData = {
        name: user.user.displayName!,
        email: user.user.email!,
        photo: user.user.photoURL!,
        gender: gender,
        role: "user",
        dob: date,
        _id: user.user.uid,
      };
      dispatch(newUser(userData)) // is dispatched first then getUserInfo dispatch in APP.TSX called 2nd
        .unwrap()
        .then(() => {
          // focus
          toast.success("Login successfully!");
        })
        .catch((error: any) => {
          toast.error(error.message || "Failed to login.");
        });
    } catch (error) {
      toast.error("Sign in failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 flex flex-col gap-6 transform transition-all duration-300 hover:shadow-xl">
        {/* Header */}
        <h1 className="text-3xl font-bold text-center text-gray-800 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Welcome Back
        </h1>
        <p className="text-center text-gray-500 text-sm">
          Sign in to explore your shopping adventure
        </p>

        {/* Form */}
        <div className="flex flex-col gap-6">
          {/* Gender Select */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="gender"
              className="text-sm font-medium text-gray-700"
            >
              Gender
            </label>
            <select
              name="gender"
              className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all duration-200 bg-gray-50 text-gray-700"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>

          {/* Date of Birth */}
          <div className="flex flex-col gap-2">
            <label htmlFor="dob" className="text-sm font-medium text-gray-700">
              Date of Birth
            </label>
            <input
              type="date"
              className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all duration-200 bg-gray-50 text-gray-700 cursor-pointer"
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
        </div>

        {/* Google Sign-In Button */}
        <div
          onClick={handleLogin}
          className="flex items-center mt-6 bg-gradient-to-r from-indigo-600 to-blue-500 text-white rounded-lg shadow-md hover:from-indigo-700 hover:to-blue-600 transform hover:-translate-y-1 transition-all duration-300 cursor-pointer"
        >
          <img
            src={googleImage}
            alt="Google"
            className="h-16 w-16 p-2 rounded-l-lg"
          />
          <button className="flex-1 py-3 px-4 font-semibold text-center">
            Sign In with Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login