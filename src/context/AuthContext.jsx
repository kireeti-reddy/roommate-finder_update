import { createContext, useState, useContext, useEffect } from 'react';
import { useToast } from '../hooks/use-toast';

// Create the AuthContext
const AuthContext = createContext();

// The AuthProvider component
export const AuthProvider = ({ children }) => {
  const { toast } = useToast();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // New states for registered email and password
  const [registeredEmail, setRegisteredEmail] = useState(null);
  const [registeredPassword, setRegisteredPassword] = useState(null);

  // Check if user is already logged in (from localStorage)
  useEffect(() => {
    const checkLoggedIn = () => {
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          console.log('AuthContext: Loaded user from localStorage:', parsedUser);
          setUser(parsedUser);
        } else {
          console.log('AuthContext: No user found in localStorage');
        }
      } catch (err) {
        console.error("Error checking authentication state:", err);
      } finally {
        setLoading(false);
      }
    };
    
    checkLoggedIn();
  }, []);

  // Register a new user
  const register = async (email, password, full_name, age, gender) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: password, full_name, age, gender }),
      });

      if (!response.ok) {
        let errorData = {};
        let errorText = '';
        try {
          errorData = await response.json();
        } catch {
          // ignore JSON parse error
        }
        try {
          errorText = await response.text();
        } catch {
          // ignore text read error
        }
        console.error(`Registration failed with status ${response.status}: ${errorText}`);
        throw new Error(errorData.error || 'Registration failed');
      }

      let newUser = null;
      try {
        newUser = await response.json();
      } catch {
        // response body empty or invalid JSON
        newUser = null;
      }

      if (newUser) {
        console.log('AuthContext: Registered new user:', newUser);
        localStorage.setItem('user', JSON.stringify(newUser));
        setUser(newUser);
      }

      // Store registered email and password in state
      setRegisteredEmail(email);
      setRegisteredPassword(password);

      toast({
        title: "Registration successful",
        description: "Welcome! Let's set up your preferences now.",
      });

      return newUser;
    } catch (err) {
      console.error("Registration error:", err);
      setError(err.message || 'Registration failed. Please try again.');
      toast({
        title: "Registration failed",
        description: err.message || 'Something went wrong. Please try again.',
        variant: "destructive",
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  // Login a user
  const login = async (email, password) => {
    setLoading(true);
    setError(null);

    // Use stored registered email and password if not provided
    const loginEmail = email || registeredEmail;
    const loginPassword = password || registeredPassword;

    try {
      const response = await fetch('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });

      if (!response.ok) {
        let errorData = {};
        try {
          errorData = await response.json();
        } catch {
          // ignore JSON parse error
        }
        throw new Error(errorData.error || 'Login failed');
      }

      let loggedInUser = null;
      try {
        loggedInUser = await response.json();
      } catch {
        // response body empty or invalid JSON
        loggedInUser = null;
      }

      if (loggedInUser) {
        console.log('AuthContext: Logged in user:', loggedInUser);
        localStorage.setItem('user', JSON.stringify(loggedInUser.user));
        setUser(loggedInUser.user);
      }

      toast({
        title: "Login successful",
        description: "Welcome back!",
      });

      return loggedInUser;
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || 'Login failed. Please check your credentials and try again.');
      toast({
        title: "Login failed",
        description: err.message || 'Invalid email or password.',
        variant: "destructive",
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  // Logout a user
  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    toast({
      title: "Logged out",
      description: "You've been logged out successfully.",
    });
  };
  
  // Update user information
  const updateUserInfo = (updatedInfo) => {
    try {
      const updatedUser = { ...user, ...updatedInfo };
      console.log('AuthContext: Updating user info:', updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      toast({
        title: "Profile updated",
        description: "Your information has been updated successfully.",
      });
      
      return updatedUser;
    } catch (err) {
      console.error("Error updating user info:", err);
      toast({
        title: "Update failed",
        description: "Failed to update your information.",
        variant: "destructive",
      });
      throw err;
    }
  };
  
  // Update user preferences
  const updatePreferences = (preferences) => {
    try {
      const updatedUser = { 
        ...user, 
        preferences: { 
          ...user?.preferences, 
          ...preferences 
        } 
      };
      
      console.log('AuthContext: Updating user preferences:', updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      toast({
        title: "Preferences updated",
        description: "Your preferences have been saved successfully.",
      });
      
      return updatedUser;
    } catch (err) {
      console.error("Error updating preferences:", err);
      toast({
        title: "Update failed",
        description: "Failed to update your preferences.",
        variant: "destructive",
      });
      throw err;
    }
  };
  
  // Set user type (seeker or owner)
  const setUserType = (userType) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to set your user type.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Update the user's preferences with the userType
      return updatePreferences({ userType });
    } catch (err) {
      console.error("Error setting user type:", err);
      toast({
        title: "Error",
        description: "Failed to update your user type.",
        variant: "destructive",
      });
      throw err;
    }
  };

  // Google authentication (mock)
  const loginWithGoogle = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // This would integrate with Google OAuth in a real app
      console.log("Attempting Google login");
      
      // Mock a successful Google login
      setTimeout(() => {
        const mockGoogleUser = {
          id: Math.random().toString(36).substr(2, 9),
          email: "user@gmail.com",
          name: "Google User",
          avatar: "https://lh3.googleusercontent.com/a/default-user",
          preferences: null,
          userType: null,
          createdAt: new Date().toISOString()
        };
        
        console.log('AuthContext: Google login user:', mockGoogleUser);
        localStorage.setItem('user', JSON.stringify(mockGoogleUser));
        setUser(mockGoogleUser);
        
        toast({
          title: "Google login successful",
          description: "Welcome to RoommateMatch!",
        });
        
        setLoading(false);
      }, 1000);
    } catch (err) {
      console.error("Google login error:", err);
      setError('Google login failed. Please try again.');
      toast({
        title: "Google login failed",
        description: "Unable to log in with Google. Please try again.",
        variant: "destructive",
      });
      setLoading(false);
      throw err;
    }
  };

  // Context value
  const value = {
    user,
    loading,
    error,
    register,
    login,
    logout,
    updateUserInfo,
    updatePreferences,
    setUserType,
    loginWithGoogle,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
