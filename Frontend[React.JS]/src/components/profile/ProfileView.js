import { useState, useEffect } from "react";
import "../../Dashboard.css";
import { Link } from "react-router-dom";
import "../../profile.css";
import { getProfile } from "../services/profileService";
import { useAuth } from "../../AuthContext";
export default function ProfileView() {
  const { isAuthenticated } = useAuth();
  const [profile, setProfile] = useState({});
  const [error, setError] = useState('');

  const fetchProfile = async () => {
    try {
      const response = await getProfile();
      setProfile(response.data.userDetails);
    } catch (error) {
      console.error('Error fetching profile', error);
      setError(`Error fetching profile. Please try again later.${error}`);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    isAuthenticated?(<div className="profile-view">
      <h1>Your Profile</h1>
      {error && <p className="error">{error}</p>}

      {profile&&!error ? (
        <div>
          <p><strong>User Name - </strong> {profile.username}</p>
          <p><strong>Name - </strong> {profile.name}</p>
          <p><strong>Email - </strong> {profile.email}</p>
          <Link to="/profile/edit">
          <button >Edit Profile</button>
          </Link>
        </div>
      ) : (
        <p>No profile data available.</p>
      )}
    </div>):(<h2 className="login-error">Please log in to access this page.</h2>)
    
  );
}
