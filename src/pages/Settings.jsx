import React, { useState, useEffect } from "react";
import { getUserProfile, updateUserProfile, updateLogo, getLogo } from "../apis/api";
import { toast } from "react-toastify";
import { User, Upload, Save } from "lucide-react";

const Settings = () => {
  const [userData, setUserData] = useState({
    name: "",
    username: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [logo, setLogo] = useState(null);
  const [logoPreview, setLogoPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [logoLoading, setLogoLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
    fetchLogo();
  }, []);

  const fetchUserData = async () => {
    try {
      const res = await getUserProfile();
      if (res && res.success) {
        setUserData(prev => ({
          ...prev,
          name: res.user.name || "",
          username: res.user.username || ""
        }));
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load user data");
    } finally {
      setPageLoading(false);
    }
  };

  const fetchLogo = async () => {
    try {
      const res = await getLogo();
      if (res && res.success && res.logo) {
        setLogoPreview(res.logo);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Logo must be less than 2MB");
        return;
      }
      if (!file.type.startsWith('image/')) {
        toast.error("Please select an image file");
        return;
      }
      setLogo(file);
      const reader = new FileReader();
      reader.onload = (e) => setLogoPreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleLogoUpload = async () => {
    if (!logo) return toast.error("Please select a logo first");

    try {
      setLogoLoading(true);
      const formData = new FormData();
      formData.append("logo", logo);

      const res = await updateLogo(formData);
      if (res && res.success) {
        toast.success("Logo updated successfully");
        setLogo(null);
        if (res.logo) setLogoPreview(res.logo);
      } else {
        toast.error(res.message || "Failed to upload logo");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to upload logo");
    } finally {
      setLogoLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (userData.newPassword || userData.confirmPassword) {
        if (userData.newPassword.length < 6) {
          toast.error("Password must be at least 6 characters long");
          setLoading(false);
          return;
        }
        if (userData.newPassword !== userData.confirmPassword) {
          toast.error("Passwords do not match");
          setLoading(false);
          return;
        }
      }

      const updateData = {
        name: userData.name,
        username: userData.username
      };

      if (userData.newPassword) {
        updateData.currentPassword = userData.currentPassword;
        updateData.newPassword = userData.newPassword;
      }

      const res = await updateUserProfile(updateData);
      if (res && res.success) {
        toast.success("Profile updated successfully");
        setUserData(prev => ({
          ...prev,
          currentPassword: "",
          newPassword: "",
          confirmPassword: ""
        }));
      } else {
        toast.error(res.message || "Failed to update profile");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="space-y-4 w-full max-w-2xl">
          <div className="h-6 bg-gray-200 rounded w-1/3 animate-pulse"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-48 bg-gray-200 rounded-lg animate-pulse"></div>
            <div className="h-64 bg-gray-200 rounded-lg animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h2 className="text-xl font-bold">Settings</h2>
          <p className="text-gray-600">Manage your account settings and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Logo Upload */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Upload size={20} /> Website Logo
            </h3>

            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                {logoPreview ? (
                  <img src={logoPreview} alt="Website Logo" className="w-20 h-20 object-contain border rounded-lg" />
                ) : (
                  <div className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                    <span className="text-gray-400 text-sm">No logo</span>
                  </div>
                )}

                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Upload Logo</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoChange}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                  />
                  <p className="text-xs text-gray-500 mt-1">Supported: JPEG, PNG, GIF, SVG, WEBP. Max 2MB</p>
                </div>
              </div>

              {logo && (
                <button
                  onClick={handleLogoUpload}
                  disabled={logoLoading}
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {logoLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload size={16} /> Upload Logo
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Profile Settings */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <User size={20} /> Profile Settings
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={userData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                <input
                  type="text"
                  name="username"
                  value={userData.username}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter your username"
                />
              </div>

              <div className="pt-4 border-t border-gray-200">
                <h4 className="text-md font-medium text-gray-700 mb-3">Change Password</h4>

                <div className="space-y-3">
                  {['currentPassword', 'newPassword', 'confirmPassword'].map((field, idx) => (
                    <div key={idx}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {field === 'currentPassword' ? 'Current Password' : field === 'newPassword' ? 'New Password' : 'Confirm New Password'}
                      </label>
                      <input
                        type="password"
                        name={field}
                        value={userData[field]}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder={field === 'currentPassword' ? 'Enter current password' : field === 'newPassword' ? 'Enter new password (min 6 characters)' : 'Confirm new password'}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Updating...
                  </>
                ) : (
                  <>
                    <Save size={16} /> Update Profile
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
