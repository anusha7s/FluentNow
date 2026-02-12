import React from 'react';
import { useAuth } from '../AuthContext';
import '../App.css';

function Profile() {
  const { user } = useAuth();

  return (
    <div className="camera-translation-section" style={{ minHeight: '100vh', padding: '100px 20px' }}>
      <div className="translation-container">
        <div className="translation-card glassmorphism">
          <h2>Profile</h2>
          {user ? (
            <>
              <p>Welcome, {user.email}</p>
              <p>More profile details will be added here soon!</p>
            </>
          ) : (
            <p>Please log in to view your profile.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;