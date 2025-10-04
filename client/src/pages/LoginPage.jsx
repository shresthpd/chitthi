import React, { useState } from "react";
import assets from "../assets/assets";

const LoginPage = () => {
  const [currState, setCurrState] = useState("Sign Up");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("");
  const [isDataSubmitted, setIsDataSubmitted] = useState(false);
  const [isPrivacyPolicyChecked, setIsPrivacyPolicyChecked] = useState(false);
  const handelSubmit = (e) => {
    e.preventDefault();
    if (currState === "Sign Up" && !isDataSubmitted) {
      setIsDataSubmitted(true);
      return;
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-black/50 backdrop-blur-md">
      <div className="flex flex-row items-center justify-around w-full">
        <img src={assets.logo_big} alt="" className="w-[min(30vw,250px)]" />
        <form
          onSubmit={handelSubmit}
          className="border border-white/20 rounded-xl p-4 w-[min(40vw,350px)] bg-white/10 backdrop-blur-xl shadow-2xl"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-white">{currState}</h2>
            {isDataSubmitted && (
              <img
                src={assets.arrow_icon}
                onClick={() => setIsDataSubmitted(false)}
                alt=""
                className="cursor-pointer w-6 h-6 bg-violet-500 p-1 rounded-full hover:bg-violet-400 transition-colors"
              />
            )}
          </div>
          {currState === "Sign Up" && !isDataSubmitted && (
            <input
              type="text"
              onChange={(e) => setFullName(e.target.value)}
              value={fullName}
              required
              placeholder="Full Name"
              className="focus:outline-none text-gray-100 p-2 border border-white/20 rounded-md w-full mb-4"
            />
          )}
          {!isDataSubmitted && (
            <>
              <input
                type="email"
                placeholder="Email Address"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                required
                className="focus:outline-none text-gray-100 p-2 border border-white/20 rounded-md w-full mb-4"
              />
              <input
                type="Password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                required
                className="focus:outline-none text-gray-100 p-2 border border-white/20 rounded-md w-full mb-4"
              />
            </>
          )}
          {currState === "Sign Up" && isDataSubmitted && (
            <textarea
              placeholder="Provide a short bio about yourself"
              onChange={(e) => setBio(e.target.value)}
              rows={4}
              value={bio}
              className="focus:outline-none text-gray-100 p-2 border border-white/20 rounded-md w-full mb-4 resize-none"
            />
          )}
          <button
            type="submit"
            className="py-3 bg-violet-500 w-full rounded-lg text-white cursor-pointer hover:bg-violet-400 transition-colors"
          >
            {currState === "Sign Up" ? "Create Account" : "Login Now"}
          </button>
          <div className="flex items-center gap-2 text-sm mt-3 text-gray-300 cursor-pointer hover:text-gray-100 transition-colors">
            <input
              type="checkbox"
              name=""
              id=""
              value={isPrivacyPolicyChecked}
              required
            />
            <p>Agree to the terms of use and privacy policy</p>
          </div>
          <div className="flex flex-col gap-2 mt-5">
            {currState === "Sign Up" ? (
              <p className="text-gray-400 text-sm">
                Already have an account?{" "}
                <span
                  onClick={() => {
                    setCurrState("Login");
                    setIsDataSubmitted(false);
                  }}
                  className="text-violet-500 cursor-pointer hover:text-violet-400 transition-colors font-medium"
                >
                  Login Here
                </span>
              </p>
            ) : (
              <p className="text-gray-400 text-sm">
                Create an account{" "}
                <span
                  onClick={() => {
                    setCurrState("Sign Up");
                    setIsDataSubmitted(false);
                  }}
                  className="text-violet-500 cursor-pointer hover:text-violet-400 transition-colors font-medium"
                >
                  Click Here
                </span>
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
