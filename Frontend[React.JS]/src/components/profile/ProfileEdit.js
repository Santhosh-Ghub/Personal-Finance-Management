import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../Dashboard.css";
import { getProfile,updateProfile } from "../services/profileService";
import { useAuth } from "../../AuthContext";
export default function ProfileEdit() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const fetchProfile = async () => {
    try {
      const response = await getProfile();
      setName(response.data.name);
      setEmail(response.data.email);
    } catch (error) {
      console.error('Error fetching profile', error);
      setError('Error fetching profile data. Please try again.');
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const validateForm = () => {
    let isValid = true;
    setError('');
    
    if (newPassword && newPassword.length < 6) {
      setError('New password must be at least 6 characters long.');
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await updateProfile( {
        name,
        email,
        oldPassword,
        newPassword
      });
      setSuccess(true);
      setTimeout(() => navigate('/profile'), 2000); 
    } catch (error) {
      console.error('Error updating profile', error);
      setError('Failed to update profile. Please check your credentials.');
    }
  };

  return (
    isAuthenticated?(<form className="add-transaction" onSubmit={handleSubmit}>
      <h1>Edit Profile</h1>
      <div className="profile-form">
        <label>Name
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </label>

        <label>Email
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>

        <label>Old Password (if changing)
          <input type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />
        </label>

        <label>New Password (if changing)
          <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
        </label>

        <button type="submit">Update Profile</button>
      </div>

      {error && <p className="error">{error}</p>}
      {success && <p className="success">Profile updated successfully! Redirecting...</p>}
    </form>):(<h2 className="login-error">Please log in to access this page.</h2>)
    
  );
}
