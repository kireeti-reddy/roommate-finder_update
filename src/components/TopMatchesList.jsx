import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import RoommateCard from './RoommateCard';

const TopMatchesList = () => {
  const { user } = useAuth();
  const [topMatches, setTopMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTopMatches = async () => {
      if (!user || !user.id) return;
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/users/${user.id}/top-matches`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch top matches');
        }
        const data = await response.json();
        setTopMatches(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTopMatches();
  }, [user]);

  if (loading) return <p>Loading top matches...</p>;
  if (error) return <p className="text-red-600">Error: {error}</p>;
  if (!topMatches.length) return <p>No matches found.</p>;

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Top 15 Compatible Matches</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
        {topMatches.map(({ user: matchUser, compatibility_score }) => (
          <RoommateCard key={matchUser.id} roommate={matchUser} compatibilityScore={compatibility_score} />
        ))}
      </div>
    </div>
  );
};

export default TopMatchesList;
