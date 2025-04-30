import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import FilterBar from '../components/FilterBar.jsx';
import TopMatchesList from '../components/TopMatchesList.jsx';
import { Button } from '../components/ui/button.tsx';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar.tsx';

const RoommateCard = ({ roommate }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-6">
        <div className="flex items-center gap-4 mb-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={roommate.profile_url} alt={roommate.full_name} />
            <AvatarFallback>{roommate.full_name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-lg font-semibold">{roommate.full_name}</h3>
            <p className="text-gray-600 text-sm">{roommate.age} • {roommate.gender}</p>
          </div>
        </div>

        <p className={`text-gray-700 mb-4 transition-opacity duration-500 ${expanded ? 'opacity-100' : 'opacity-0 max-h-0 overflow-hidden'}`}>
          {roommate.bio}
        </p>

        <div className="flex items-center justify-between">
          <div className="text-primary font-semibold">Phone: {roommate.phone_number || 'N/A'}</div>
          <Button variant="outline" size="sm" onClick={() => setExpanded(!expanded)}>
            {expanded ? 'Hide Profile' : 'View Profile'}
          </Button>
        </div>

        {expanded && (
          <div className="mt-4 text-gray-700 transition-opacity duration-500 opacity-100">
            <p><strong>Email:</strong> {roommate.email || 'N/A'}</p>
            <p><strong>Bio:</strong> {roommate.bio || 'N/A'}</p>
            <p><strong>Phone:</strong> {roommate.phone_number || 'N/A'}</p>
          </div>
        )}
      </div>
    </div>
  );
};

const Roommates = () => {
  const { isAuthenticated, user } = useAuth();
  const [roommatesData, setRoommatesData] = useState([]);

  const fetchRoommates = async () => {
    try {
      const response = await fetch('/api/users');
      if (!response.ok) {
        throw new Error('Failed to fetch roommates data');
      }
      let data = await response.json();
      if (user && user.id) {
        data = data.filter(r => r.id !== user.id);
      }
      setRoommatesData(data);
    } catch (error) {
      console.error('Error fetching roommates:', error);
    }
  };

  useEffect(() => {
    fetchRoommates();
    const interval = setInterval(fetchRoommates, 30000);
    return () => clearInterval(interval);
  }, [user]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar isAuthenticated={isAuthenticated} />

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Find Roommates</h1>

        <div className="mb-8">
          <FilterBar onApplyFilters={filters => {
            setRoommatesData(prevData => {
              return prevData
                .filter(r => r.age >= filters.ageMin && r.age <= filters.ageMax)
                .filter(r => filters.gender === "any" || filters.gender === "" || r.gender.toLowerCase() === filters.gender.toLowerCase())
                .sort((a, b) => {
                  if (filters.createdAtSort === "newest") {
                    return new Date(b.created_at) - new Date(a.created_at);
                  } else {
                    return new Date(a.created_at) - new Date(b.created_at);
                  }
                });
            });
          }} />
        </div>

        <TopMatchesList />

        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 mt-8">
          {roommatesData.map(roommate => (
            <RoommateCard key={roommate.id} roommate={roommate} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Roommates;
