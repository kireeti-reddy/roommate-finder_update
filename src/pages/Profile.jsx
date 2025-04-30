import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button.tsx';
import { Input } from '../components/ui/input.tsx';
import { Label } from '../components/ui/label.tsx';

const Profile = () => {
  const { user, updateUserInfo } = useAuth();
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone_number: '',
    bio: '',
    age: '',
    gender: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [topMatches, setTopMatches] = useState([]);
  const [loadingMatches, setLoadingMatches] = useState(false);
  const [matchesError, setMatchesError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setFormData({
        full_name: user.full_name || '',
        email: user.email || '',
        phone_number: user.phone_number || '',
        bio: user.bio || '',
        age: user.age || '',
        gender: user.gender || '',
      });
      fetchTopMatches(user.id);
    }
  }, [user]);

  const fetchTopMatches = async (userId) => {
    setLoadingMatches(true);
    setMatchesError(null);
    try {
      const response = await fetch(`/api/users/${userId}/top-matches`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch top matches');
      }
      const data = await response.json();
      setTopMatches(data);
    } catch (err) {
      setMatchesError(err.message);
    } finally {
      setLoadingMatches(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!user || !user.id) {
      setError('You must be logged in to update your profile.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`/api/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update profile');
      }

      const updatedUser = await response.json();
      updateUserInfo(updatedUser);
      alert('Profile updated successfully');
      navigate('/profile');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar isAuthenticated={false} />
        <div className="container mx-auto px-4 py-8">
          <p className="text-red-600">You must be logged in to view this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar isAuthenticated={true} />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Edit Profile</h1>
        {error && <p className="text-red-600 mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
          <div>
            <Label htmlFor="full_name">Full Name</Label>
            <Input id="full_name" name="full_name" value={formData.full_name} onChange={handleChange} required />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required disabled />
          </div>
          <div>
            <Label htmlFor="phone_number">Phone Number</Label>
            <Input id="phone_number" name="phone_number" value={formData.phone_number} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="bio">Bio</Label>
            <textarea id="bio" name="bio" value={formData.bio} onChange={handleChange} className="w-full border rounded p-2" />
          </div>
          <div>
            <Label htmlFor="age">Age</Label>
            <Input id="age" name="age" type="number" value={formData.age} onChange={handleChange} min="18" max="100" />
          </div>
          <div>
            <Label htmlFor="gender">Gender</Label>
            <select id="gender" name="gender" value={formData.gender} onChange={handleChange} className="w-full border rounded p-2">
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? 'Updating...' : 'Update Profile'}
          </Button>
        </form>

        <div className="mt-12">
          <h2 className="text-2xl font-semibold mb-4">Top 15 Compatible Matches</h2>
          {loadingMatches && <p>Loading matches...</p>}
          {matchesError && <p className="text-red-600">{matchesError}</p>}
          {!loadingMatches && !matchesError && topMatches.length === 0 && <p>No matches found.</p>}
          {!loadingMatches && !matchesError && topMatches.length > 0 && (
            <ul className="space-y-4">
              {topMatches.map(({ user: matchUser, compatibility_score }) => (
                <li key={matchUser.id} className="border p-4 rounded shadow">
                  <p className="font-bold">{matchUser.full_name} ({matchUser.age} years old, {matchUser.gender})</p>
                  <p>Compatibility Score: {compatibility_score.toFixed(2)}%</p>
                  {matchUser.bio && <p>Bio: {matchUser.bio}</p>}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
