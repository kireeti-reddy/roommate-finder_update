
import { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from 'react-router-dom';

const RoomCard = ({ room }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Default image if no images are provided
  const defaultImage = "https://images.unsplash.com/photo-1721322800607-8c38375eef04";
  
  const nextImage = () => {
    if (room.images && room.images.length > 0) {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % room.images.length);
    }
  };
  
  const prevImage = () => {
    if (room.images && room.images.length > 0) {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === 0 ? room.images.length - 1 : prevIndex - 1
      );
    }
  };

  // Helper function to handle image errors
  const handleImageError = (e) => {
    e.target.src = defaultImage;
  };

  // Function to get active image source
  const getImageSrc = () => {
    if (room.images && room.images.length > 0) {
      return room.images[currentImageIndex];
    }
    return defaultImage;
  };

  return (
    <Card className="overflow-hidden shadow-md hover:shadow-lg transition-shadow scale-hover">
      <div className="relative aspect-w-16 aspect-h-10 h-48 bg-gray-100 overflow-hidden">
        {/* Image carousel */}
        <img
          src={getImageSrc()}
          alt={`Room in ${room.location}`}
          onError={handleImageError}
          className="object-cover w-full h-full"
        />
        
        {/* Image navigation buttons - only show if there are multiple images */}
        {room.images && room.images.length > 1 && (
          <>
            <button 
              onClick={(e) => { e.stopPropagation(); prevImage(); }} 
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 rounded-full p-1 hover:bg-white"
              aria-label="Previous image"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); nextImage(); }} 
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 rounded-full p-1 hover:bg-white"
              aria-label="Next image"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </>
        )}
        
        {/* Price tag */}
        <div className="absolute top-3 right-3 bg-white px-2 py-1 rounded-md shadow text-sm font-semibold">
          ${room.price}/month
        </div>

        {/* Compatibility score if available */}
        {room.compatibilityScore && (
          <div className="absolute bottom-3 right-3 bg-secondary text-white px-2 py-1 rounded-full shadow text-sm font-semibold">
            {room.compatibilityScore}% Match
          </div>
        )}
      </div>

      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between items-start">
          <h3 className="font-semibold text-lg truncate">{room.title}</h3>
        </div>
        <p className="text-sm text-gray-500">{room.location}</p>
      </CardHeader>
      
      <CardContent className="p-4 pt-2 pb-3">
        <div className="flex gap-2 flex-wrap mb-2">
          {room.amenities && room.amenities.slice(0, 3).map((amenity, index) => (
            <Badge key={index} variant="outline" className="bg-primary/10 hover:bg-primary/20">
              {amenity}
            </Badge>
          ))}
          {room.amenities && room.amenities.length > 3 && (
            <Badge variant="outline" className="bg-muted">
              +{room.amenities.length - 3}
            </Badge>
          )}
        </div>
        <p className="text-sm line-clamp-2">{room.description}</p>
      </CardContent>
      
      <CardFooter className="p-4 pt-2 flex justify-between">
        <div className="text-sm text-gray-600">
          <span className="font-medium">{room.roomType}</span>
          {room.availableFrom && (
            <span> · Available {new Date(room.availableFrom).toLocaleDateString()}</span>
          )}
        </div>
        <Link to={`/rooms/${room.id}`}>
          <Button size="sm" variant="secondary">View Details</Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default RoomCard;
