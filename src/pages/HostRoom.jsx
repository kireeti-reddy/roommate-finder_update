
import React from 'react';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';

const HostRoom = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Mock data for hosted rooms - in a real app this would come from an API
  const hostedRooms = [
    {
      id: 1,
      title: "Sunny Private Room in Shared Apartment",
      location: "Downtown",
      price: 900,
      status: "active",
      applicants: 3,
      image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?ixlib=rb-4.0.3"
    },
    {
      id: 2,
      title: "Cozy Room with Private Bathroom",
      location: "University District",
      price: 750,
      status: "pending",
      applicants: 0,
      image: "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?ixlib=rb-4.0.3"
    }
  ];

  if (!isAuthenticated) {
    return navigate("/login");
  }

  const showNoRoomsMessage = user?.preferences?.userType !== 'owner' || hostedRooms.length === 0;

  return (
    <>
      <Navbar isAuthenticated={true} />
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container max-w-4xl mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Host a Room</h1>
            <p className="text-gray-600 mt-2">
              Manage your room listings and view applicants
            </p>
          </div>

          <div className="space-y-6">
            {showNoRoomsMessage ? (
              <div className="text-center py-10">
                {user?.preferences?.userType !== 'owner' ? (
                  <div>
                    <h3 className="text-xl font-medium mb-2">You're currently set as a Room Seeker</h3>
                    <p className="text-gray-500 mb-4">To host a room, you need to change your user type to Room Owner</p>
                    <Button 
                      variant="outline" 
                      onClick={() => navigate("/user-type")}
                    >
                      Change User Type
                    </Button>
                  </div>
                ) : (
                  <div>
                    <h3 className="text-xl font-medium mb-2">You haven't listed any rooms yet</h3>
                    <p className="text-gray-500 mb-4">Start hosting by creating your first room listing</p>
                    <Button 
                      onClick={() => navigate("/preferences")}
                    >
                      List a Room
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-medium">Your Hosted Rooms</h3>
                  <Button 
                    size="sm"
                    onClick={() => navigate("/preferences")}
                  >
                    Add New Room
                  </Button>
                </div>
                
                <div className="grid gap-6">
                  {hostedRooms.map(room => (
                    <Card key={room.id}>
                      <div className="flex flex-col md:flex-row">
                        <div className="w-full md:w-1/4 h-48 md:h-auto">
                          <img 
                            src={room.image} 
                            alt={room.title}
                            className="w-full h-full object-cover rounded-t-lg md:rounded-l-lg md:rounded-t-none"
                          />
                        </div>
                        <div className="flex-1 p-6">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-lg font-semibold">{room.title}</h3>
                              <p className="text-gray-500">{room.location}</p>
                            </div>
                            <Badge className={room.status === 'active' ? 'bg-green-500' : 'bg-yellow-500'}>
                              {room.status === 'active' ? 'Active' : 'Pending'}
                            </Badge>
                          </div>
                          
                          <div className="mt-4">
                            <p className="text-lg font-medium">${room.price}/month</p>
                            <p className="text-sm text-gray-600 mt-1">
                              {room.applicants} {room.applicants === 1 ? 'person' : 'people'} interested
                            </p>
                          </div>
                          
                          <div className="flex gap-2 mt-4">
                            <Button variant="outline" size="sm">Edit</Button>
                            <Button variant="outline" size="sm">
                              View Applicants {room.applicants > 0 && 
                                <span className="ml-1 bg-primary/20 text-primary rounded-full w-5 h-5 inline-flex items-center justify-center text-xs">
                                  {room.applicants}
                                </span>
                              }
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default HostRoom;
