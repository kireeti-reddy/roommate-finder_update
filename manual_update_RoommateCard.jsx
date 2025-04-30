import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from './ui/card';
import { Button } from './ui/button';

const RoommateCard = ({ roommate, compatibilityScore }) => {
  const [expanded, setExpanded] = useState(false);

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
          <div className="mt-2 space-y-1 text-sm text-gray-700">
            <p><strong>Cleanliness:</strong> {roommate.cleanliness ?? 'N/A'}</p>
            <p><strong>Noise Tolerance:</strong> {roommate.noise_tolerance ?? 'N/A'}</p>
            <p><strong>Guests Frequency:</strong> {roommate.guests_frequency ?? 'N/A'}</p>
            <p><strong>Partying:</strong> {roommate.partying ?? 'N/A'}</p>
            <p><strong>Smoking:</strong> {yesNo(roommate.smoking)}</p>
            <p><strong>Drinking:</strong> {roommate.drinking ?? 'N/A'}</p>
            <p><strong>Marijuana:</strong> {roommate.marijuana ?? 'N/A'}</p>
            <p><strong>Cooking:</strong> {roommate.cooking ?? 'N/A'}</p>
            <p><strong>Food Preferences:</strong> {roommate.food_preferences ?? 'N/A'}</p>
            <p><strong>Introversion:</strong> {roommate.introversion ?? 'N/A'}</p>
            <p><strong>Openness:</strong> {roommate.openness ?? 'N/A'}</p>
            <p><strong>Conscientiousness:</strong> {roommate.conscientiousness ?? 'N/A'}</p>
            <p><strong>Agreeableness:</strong> {roommate.agreeableness ?? 'N/A'}</p>
            <p><strong>Neuroticism:</strong> {roommate.neuroticism ?? 'N/A'}</p>
            <p><strong>Preferred Genders:</strong> {roommate.preferred_genders ?? 'N/A'}</p>
            <p><strong>Age Preference Min:</strong> {roommate.age_pref_min ?? 'N/A'}</p>
            <p><strong>Age Preference Max:</strong> {roommate.age_pref_max ?? 'N/A'}</p>
            <p><strong>LGBTQ+ Friendly:</strong> {yesNo(roommate.lgbtq_friendly)}</p>
            <p><strong>Work Schedule:</strong> {roommate.work_schedule ?? 'N/A'}</p>
            <p><strong>Home Frequency:</strong> {roommate.home_frequency ?? 'N/A'}</p>
          </div>
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
