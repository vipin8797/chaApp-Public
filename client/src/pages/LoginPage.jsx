import React, { useContext, useState } from "react";
import assets from "../assets/assets";
import { AuthContext } from "../../context/AuthContext";

const LoginPage = () => {
  const [currState, setCurrState] = useState("Sign Up");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("");
  const [isDataSubmitted, setIsDataSubmitted] = useState(false);

  const {login} = useContext(AuthContext);


  const onSubmitHandler = (event) => {
  event.preventDefault();

  // Step 1 → If Sign Up and user has NOT provided bio yet
  if (currState === "Sign Up" && !isDataSubmitted) {
    setIsDataSubmitted(true);
    return;
  }

  // Step 2 → Call login(), which handles both
  login({
    fullName,
    email,
    password,
    bio,
    isSignUp: currState === "Sign Up"  // IMPORTANT flag
  });
};


  return (
    <div className="min-h-screen bg-cover bg-center flex items-center
    justify-center gap-8 sm:justify-evenly max-sm:flex-col backdrop-blur-2xl">
      
      {/* LEFT SECTION */}
      <img
        src={assets.logo_big}
        alt="logo"
        className="w-[min(30vw,250px)]"
      />

      {/* FORM */}
      <form 
      onSubmit={onSubmitHandler}
      className="border-2
      bg-white/8 text-white border-gray-500 p-6 flex
      flex-col gap-6 rounded-lg shadow-lg">
        
        {/* TITLE + TOGGLE ARROW */}
        <h2 className="font-medium text-2xl flex justify-between items-center">
          {currState}
          {isDataSubmitted && <img src={assets.arrow_icon} alt="" className="w-5 cursor-pointer"
          onClick={()=>setIsDataSubmitted(false)} />}
          
        </h2>

        {/* FULL NAME */}
        {currState === "Sign Up" && !isDataSubmitted && (
          <input
            type="text"
            className="p-2 border border-gray-500 rounded-md focus:outline-none"
            placeholder="Full Name"
            onChange={(e) => setFullName(e.target.value)}
            value={fullName}
            required
          />
        )}

        {/* EMAIL + PASSWORD */}
        {!isDataSubmitted && (
          <>
            <input
              type="email"
              placeholder="Email Address"
              required
              className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />

            <input
              type="password"
              placeholder="Password"
              required
              className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
          </>
        )}

        {/* BIO AFTER SUBMIT */}
        {currState === "Sign Up" && isDataSubmitted && (
          <textarea
            onChange={(e) => setBio(e.target.value)}
            value={bio}
            rows={4}
            className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Provide a short bio..."
            required
          ></textarea>
        )}

        {/* SUBMIT BUTTON */}
        <button
          type="submit"
          className="py-3 bg-gradient-to-r from-purple-400 to-violet-600 text-white rounded-md cursor-pointer"
        >
          {currState === "Sign Up" ? "Create Account" : "Login Now"}
        </button>

        {/* TERMS */}
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <input type="checkbox" />
          <p>Agree to the terms of use & privacy policy.</p>
        </div>

        {/* SWITCH LOGIN / SIGNUP */}
        <div className="text-sm text-gray-300">
          {currState === "Sign Up" ? (
            <p>
              Already have an account?{" "}
              <span
                onClick={() => {
                  setCurrState("Login");
                  setIsDataSubmitted(false);
                }}
                className="font-medium text-violet-500 cursor-pointer"
              >
                Login here
              </span>
            </p>
          ) : (
            <p>
              Create an account{" "}
              <span
                onClick={() => setCurrState("Sign Up")}
                className="font-medium text-violet-500 cursor-pointer"
              >
                Click here
              </span>
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
