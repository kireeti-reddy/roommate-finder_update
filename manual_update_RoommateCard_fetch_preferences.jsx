import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from './ui/card';
import { Button } from './ui/button';

const RoommateCard = ({ roommate, compatibilityScore }) => {
  const [expanded, setExpanded] = useState(false);
  const [preferences, setPreferences] = useState(null);
  const [loadingPrefs, setLoadingPrefs] = useState(false);
  const [errorPrefs, setErrorPrefs] = useState(null);

  useEffect(() => {
    if (!roommate || !roommate.id) {
      setPreferences(null);
      return;
    }

    const fetchPreferences = async () => {
      setLoadingPrefs(true);
      setErrorPrefs(null);
      try {
        const response = await fetch(`/api/preferences/${roommate.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch preferences');
        }
        const data = await response.json();
        setPreferences(data);
      } catch (err) {
        setErrorPrefs(err.message);
      } finally {
        setLoadingPrefs(false);
      }
    };

    fetchPreferences();
  }, [roommate]);

  // Helper to display boolean yes/no fields
  const yesNo = (val) => {
    if (val === undefined || val === null) return 'N/A';
    if (typeof val === 'string') {
      return val.toLowerCase() === 'yes' ? 'Yes' : 'No';
    }
    return val ? 'Yes' : 'No';
  };

  return (
    <Card className="overflow-hidden shadow-md hover:shadow-lg transition-shadow scale-hover">
      <CardHeader className="p-4 pb-2">
        <div className="flex items-center gap-4">
          <img
            src={roommate.profile_url}
            alt={roommate.full_name}
            className="h-12 w-12 rounded-full object-cover"
          />
          <div>
            <h3 className="font-semibold text-lg truncate">{roommate.full_name}</h3>
            <p className="text-gray-600 text-sm">{roommate.age} • {roommate.gender}</p>
            {compatibilityScore !== undefined && (
              <p className="text-primary font-semibold">{compatibilityScore.toFixed(2)}% Match</p>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 pt-2 pb-3">
        <p className={`text-gray-700 mb-2 transition-opacity duration-500 ${expanded ? 'opacity-100 max-h-full' : 'opacity-0 max-h-0 overflow-hidden'}`}>
          {roommate.bio}
        </p>

        {expanded && (
          <>
            {loadingPrefs && <p>Loading preferences...</p>}
            {errorPrefs && <p className="text-red-600">Error: {errorPrefs}</p>}
            {preferences && (
              <div className="mt-2 space-y-1 text-sm text-gray-700">
                <p><strong>Cleanliness:</strong> {preferences.cleanliness ?? 'N/A'}</p>
                <p><strong>Noise Tolerance:</strong> {preferences.noise_tolerance ?? 'N/A'}</p>
                <p><strong>Guests Frequency:</strong> {preferences.guests_frequency ?? 'N/A'}</p>
                <p><strong>Partying:</strong> {preferences.partying ?? 'N/A'}</p>
                <p><strong>Smoking:</strong> {yesNo(preferences.smoking)}</p>
                <p><strong>Drinking:</strong> {preferences.drinking ?? 'N/A'}</p>
                <p><strong>Marijuana:</strong> {preferences.marijuana ?? 'N/A'}</p>
                <p><strong>Cooking:</strong> {preferences.cooking ?? 'N/A'}</p>
                <p><strong>Food Preferences:</strong> {preferences.food_preferences ?? 'N/A'}</p>
                <p><strong>Introversion:</strong> {preferences.introversion ?? 'N/A'}</p>
                <p><strong>Openness:</strong> {preferences.openness ?? 'N/A'}</p>
                <p><strong>Conscientiousness:</strong> {preferences.conscientiousness ?? 'N/A'}</p>
                <p><strong>Agreeableness:</strong> {preferences.agreeableness ?? 'N/A'}</p>
                <p><strong>Neuroticism:</strong> {preferences.neuroticism ?? 'N/A'}</p>
                <p><strong>Preferred Genders:</strong> {preferences.preferred_genders ?? 'N/A'}</p>
                <p><strong>Age Preference Min:</strong> {preferences.age_pref_min ?? 'N/A'}</p>
                <p><strong>Age Preference Max:</strong> {preferences.age_pref_max ?? 'N/A'}</p>
                <p><strong>LGBTQ+ Friendly:</strong> {yesNo(preferences.lgbtq_friendly)}</p>
                <p><strong>Work Schedule:</strong> {preferences.work_schedule ?? 'N/A'}</p>
                <p><strong>Home Frequency:</strong> {preferences.home_frequency ?? 'N/A'}</p>
              </div>
            )}
          </>
        )}
      </CardContent>

      <CardFooter className="p-4 pt-2 flex justify-between items-center">
        <div className="text-primary font-semibold">Phone: {roommate.phone_number || 'N/A'}</div>
        <Button variant="outline" size="sm" onClick={() => setExpanded(!expanded)}>
          {expanded ? 'Hide Profile' : 'View Profile'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default RoommateCard;
