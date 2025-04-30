
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import { useToast } from "@/hooks/use-toast";

const UserType = () => {
  const navigate = useNavigate();
  const { setUserType, user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [selectedType, setSelectedType] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // If user is not authenticated, redirect to login
  if (!isAuthenticated) {
    navigate("/login");
  }

  const handleSubmit = async () => {
    if (!selectedType) {
      toast({
        title: "Selection required",
        description: "Please select your user type to continue.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      await setUserType(selectedType);
      toast({
        title: "User type set",
        description: `You are now registered as a ${selectedType === "seeker" ? "room seeker" : "room owner"}.`,
      });
      navigate("/preferences");
    } catch (error) {
      console.error("Error setting user type:", error);
      toast({
        title: "Error",
        description: "Could not set user type. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar isAuthenticated={isAuthenticated} />
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900">
            What are you looking for?
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Choose your role to help us personalize your experience
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Room Seeker Card */}
                <Card 
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedType === "seeker" ? "ring-2 ring-primary" : ""
                  }`}
                  onClick={() => setSelectedType("seeker")}
                >
                  <CardContent className="p-6 text-center">
                    <div className="mb-4">
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className={`mx-auto h-16 w-16 ${selectedType === "seeker" ? "text-primary" : "text-gray-400"}`} 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium mb-2">Room Seeker</h3>
                    <p className="text-gray-500 text-sm">
                      I'm looking for a room and possibly roommates
                    </p>
                  </CardContent>
                </Card>

                {/* Room Owner Card */}
                <Card 
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedType === "owner" ? "ring-2 ring-primary" : ""
                  }`}
                  onClick={() => setSelectedType("owner")}
                >
                  <CardContent className="p-6 text-center">
                    <div className="mb-4">
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className={`mx-auto h-16 w-16 ${selectedType === "owner" ? "text-primary" : "text-gray-400"}`} 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium mb-2">Room Owner</h3>
                    <p className="text-gray-500 text-sm">
                      I have a room and I'm looking for roommates
                    </p>
                  </CardContent>
                </Card>
              </div>

              <p className="text-sm text-center text-gray-500">
                Don't worry, you can change your role later from your profile settings
              </p>

              <Button
                className="w-full"
                onClick={handleSubmit}
                disabled={isLoading || !selectedType}
              >
                {isLoading ? "Saving..." : "Continue"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserType;
