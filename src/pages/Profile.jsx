import { useEffect, useState } from "react";
import { getMe, updateProfile } from "../api/authApi";
import { useAuth } from "../context/AuthContext";

function Profile() {
  const { user, setUser } = useAuth();

  const [fullName, setFullName] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [collegeIdCard, setCollegeIdCard] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getMe();
        setUser(data);
        setFullName(data.fullName);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    if (!user) {
      fetchUser();
    } else {
      setFullName(user.fullName);
      setLoading(false);
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setMessage("");

      const formData = new FormData();
      formData.append("fullName", fullName);

      if (profilePicture) formData.append("profilePicture", profilePicture);
      if (collegeIdCard) formData.append("collegeIdCard", collegeIdCard);

      const res = await updateProfile(formData);

      setUser(res.user);
      setMessage("Profile updated successfully");
    } catch (err) {
      console.log(err);
      setMessage("Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-16 flex justify-center">
      <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl p-8 w-[500px]">
        <h2 className="text-2xl font-bold text-center mb-6">My Profile</h2>

        {message && (
          <p className="text-center text-green-600 mb-4">{message}</p>
        )}

        <div className="flex flex-col items-center mb-6">
          <img
            src={
              user.profilePicture ||
              "https://cdn-icons-png.flaticon.com/512/149/149071.png"
            }
            alt="profile"
            className="w-24 h-24 rounded-full object-cover border"
          />

          <p className="mt-2 text-gray-600 text-sm">{user.email}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />

          <div>
            <label className="text-sm text-gray-600">Profile Picture</label>

            <input
              type="file"
              className="w-full border border-gray-300 rounded-lg p-2 mt-1"
              onChange={(e) => setProfilePicture(e.target.files[0])}
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">College ID Card</label>

            <input
              type="file"
              className="w-full border border-gray-300 rounded-lg p-2 mt-1"
              onChange={(e) => setCollegeIdCard(e.target.files[0])}
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
          >
            {saving ? "Saving..." : "Update Profile"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Profile;
