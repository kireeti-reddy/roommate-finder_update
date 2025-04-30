
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/context/AuthContext';
import RoomCard from '@/components/RoomCard';
import FilterBar from '@/components/FilterBar';

// Sample room data - This would come from API in a real app
const roomsData = [
  {
    id: 1,
    title: "Cozy Private Room in Downtown",
    price: 800,
    location: "Downtown, San Francisco",
    amenities: ["Private Bathroom", "Furnished", "Utilities Included"],
    description: "Bright and spacious private room in a shared apartment located in the heart of downtown. Close to public transportation and restaurants.",
    roomType: "Private Room",
    availableFrom: "2023-06-01",
    images: [
      "https://images.unsplash.com/photo-1649972904349-6e44c42644a7",
    ],
    compatibilityScore: 85
  },
  {
    id: 2,
    title: "Modern Studio with City Views",
    price: 1200,
    location: "SOMA, San Francisco",
    amenities: ["Full Kitchen", "Gym Access", "Laundry"],
    description: "Beautiful studio apartment with amazing city views. Building includes gym and laundry facilities. Great location near tech companies.",
    roomType: "Studio",
    availableFrom: "2023-05-15",
    images: [
      "https://images.unsplash.com/photo-1721322800607-8c38375eef04",
      "https://images.unsplash.com/photo-1582562124811-c09040d0a901"
    ],
    compatibilityScore: 75
  },
  {
    id: 3,
    title: "Shared Room in Student Housing",
    price: 600,
    location: "University District, Berkeley",
    amenities: ["Shared Kitchen", "Study Room", "WiFi"],
    description: "Affordable shared room in student housing near UC Berkeley. Great for students looking for budget-friendly accommodation with a studious environment.",
    roomType: "Shared Room",
    availableFrom: "2023-07-01",
    images: [
      "https://images.unsplash.com/photo-1472396961693-142e6e269027",
      "https://images.unsplash.com/photo-1500673922987-e212871fec22"
    ],
    compatibilityScore: 65
  },
  {
    id: 4,
    title: "Luxury 1-Bedroom Apartment",
    price: 2200,
    location: "Marina District, San Francisco",
    amenities: ["In-Unit Laundry", "Parking", "Pet-Friendly", "Gym"],
    description: "High-end 1-bedroom apartment with modern finishes throughout. Building includes gym, rooftop lounge, and 24-hour security.",
    roomType: "Entire Apartment",
    availableFrom: "2023-05-10",
    images: [
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2",
      "https://images.unsplash.com/photo-1560448205-4d9b3e6bb6db"
    ],
    compatibilityScore: 90
  }
];

const Rooms = () => {
  const { isAuthenticated } = useAuth();
  const [filteredRooms, setFilteredRooms] = useState(roomsData);

  const handleApplyFilters = (filters) => {
    console.log("Applied filters:", filters);
    
    // If no filters are applied (reset case), show all rooms
    if (Object.keys(filters).length === 0) {
      setFilteredRooms(roomsData);
      return;
    }

    // Apply filters to rooms
    let filtered = [...roomsData];
    
    // Filter by price range
    if (filters.priceMin !== undefined && filters.priceMax !== undefined) {
      filtered = filtered.filter(room => 
        room.price >= filters.priceMin && room.price <= filters.priceMax
      );
    }
    
    // Filter by room type
    if (filters.roomType && filters.roomType !== "any") {
      filtered = filtered.filter(room => {
        const roomTypeMap = {
          'private': 'Private Room',
          'shared': 'Shared Room',
          'studio': 'Studio',
          'entire': 'Entire Apartment'
        };
        return room.roomType.toLowerCase().includes(roomTypeMap[filters.roomType].toLowerCase());
      });
    }
    
    // Filter by location
    if (filters.location) {
      filtered = filtered.filter(room =>
        room.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }
    
    // Sort rooms
    if (filters.sortBy) {
      switch (filters.sortBy) {
        case 'price-asc':
          filtered.sort((a, b) => a.price - b.price);
          break;
        case 'price-desc':
          filtered.sort((a, b) => b.price - a.price);
          break;
        case 'newest':
          // For demo, we could sort by id assuming newer listings have higher ids
          filtered.sort((a, b) => b.id - a.id);
          break;
        case 'rating':
          // Sort by compatibility score
          filtered.sort((a, b) => b.compatibilityScore - a.compatibilityScore);
          break;
        default:
          // 'relevance' - default order
          break;
      }
    }
    
    setFilteredRooms(filtered);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar isAuthenticated={isAuthenticated} />

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Available Rooms</h1>
        
        <div className="mb-8">
          <FilterBar onApplyFilters={handleApplyFilters} />
        </div>

        {filteredRooms.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredRooms.map(room => (
              <RoomCard key={room.id} room={room} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-xl text-gray-500">No rooms match your search criteria.</p>
            <button 
              className="mt-4 text-primary underline"
              onClick={() => handleApplyFilters({})}
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Rooms;
