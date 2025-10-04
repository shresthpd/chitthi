import React, { useState } from "react";
import assets from "../assets/assets";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [bio, setBio] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle profile update logic here
    console.log({ fullName, bio, profileImage });
  };

  const handleSubmitOnSave = (e) => {
    e.preventDefault();
    navigate("/");
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-black/50 backdrop-blur-md">
      <div className="flex flex-col items-center w-full">
        <form
          onSubmit={handleSubmit}
          className="border border-white/20 rounded-xl p-6 w-[min(90vw,450px)] bg-white/10 backdrop-blur-xl shadow-2xl"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-semibold text-white">
              Profile Details
            </h3>
            <img
              src={assets.arrow_icon}
              alt="Back"
              className="cursor-pointer w-6 h-6 bg-violet-500 p-1 rounded-full hover:bg-violet-400 transition-colors"
              onClick={() => navigate("/")}
            />
          </div>

          <div className="flex flex-col items-center mb-6">
            <div className="relative w-24 h-24 mb-4">
              <img
                src={previewImage || assets.avatar_icon}
                alt="Profile"
                className="w-full h-full rounded-full object-cover border-2 border-white/30"
              />
              <label
                htmlFor="profile-image"
                className="absolute bottom-0 right-0 bg-violet-500 p-1 rounded-full cursor-pointer hover:bg-violet-400 transition-colors"
              >
                <img
                  src={assets.gallery_icon}
                  alt="Upload"
                  className="w-4 h-4"
                />
              </label>
              <input
                type="file"
                id="profile-image"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>
            <p className="text-gray-300 text-sm">Upload Profile Image</p>
          </div>

          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="focus:outline-none text-gray-100 p-2 border border-white/20 rounded-md w-full mb-4 bg-transparent"
          />

          <textarea
            placeholder="Bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={4}
            className="focus:outline-none text-gray-100 p-2 border border-white/20 rounded-md w-full mb-6 resize-none bg-transparent"
          />

          <button
            type="submit"
            className="py-3 bg-violet-500 w-full rounded-lg text-white cursor-pointer hover:bg-violet-400 transition-colors"
            onClick={handleSubmitOnSave}
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
