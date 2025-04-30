
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import PreferenceForm from "@/components/PreferenceForm";
import { useAuth } from "@/context/AuthContext";

const Preferences = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  
  // Check if user is authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);
  
  // Check if user has selected a type (seeker/owner)
  useEffect(() => {
    if (isAuthenticated && !user?.preferences?.userType) {
      navigate("/user-type");
    }
  }, [isAuthenticated, user, navigate]);
  
  if (!isAuthenticated || !user?.preferences?.userType) {
    return null; // Will redirect in useEffect
  }

  return (
    <>
      <Navbar isAuthenticated={true} />
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container max-w-4xl mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">
              {user.preferences.userType === "seeker" ? "Room Seeker Preferences" : "Room Owner Details"}
            </h1>
            <p className="text-gray-600 mt-2">
              {user.preferences.userType === "seeker" 
                ? "Tell us what you're looking for to help us find your perfect match." 
                : "Tell us about your room and what you're looking for in a roommate."}
            </p>
          </div>
          
          <PreferenceForm 
            type={user.preferences.userType}
          />
          
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500 mb-2">
              Need to change your user type?
            </p>
            <Button variant="outline" onClick={() => navigate("/user-type")}>
              Change User Type
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Preferences;
