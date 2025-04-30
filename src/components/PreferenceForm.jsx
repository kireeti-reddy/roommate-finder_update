import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

const LifestyleSection = ({ values, handleChange }) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>How clean do you keep your space?</Label>
        <RadioGroup 
          value={values.cleanliness || "moderate"} 
          onValueChange={(val) => handleChange("cleanliness", val)}
          className="flex flex-col gap-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="very-clean" id="very-clean" />
            <Label htmlFor="very-clean">Very clean (daily cleaning)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="clean" id="clean" />
            <Label htmlFor="clean">Clean (regular cleaning)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="moderate" id="moderate" />
            <Label htmlFor="moderate">Moderate (tidy but not obsessive)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="relaxed" id="relaxed" />
            <Label htmlFor="relaxed">Relaxed (clean when necessary)</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-2">
        <Label>How often do you have guests over?</Label>
        <RadioGroup 
          value={values.guestFrequency || "sometimes"} 
          onValueChange={(val) => handleChange("guestFrequency", val)}
          className="flex flex-col gap-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="never" id="never" />
            <Label htmlFor="never">Never/Rarely</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="sometimes" id="sometimes" />
            <Label htmlFor="sometimes">Sometimes (a few times a month)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="often" id="often" />
            <Label htmlFor="often">Often (weekly)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="very-often" id="very-often" />
            <Label htmlFor="very-often">Very often (multiple times a week)</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-2">
        <Label>What's your typical sleep schedule?</Label>
        <RadioGroup 
          value={values.sleepSchedule || "average"} 
          onValueChange={(val) => handleChange("sleepSchedule", val)}
          className="flex flex-col gap-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="early" id="early" />
            <Label htmlFor="early">Early bird (sleep early, wake early)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="average" id="average" />
            <Label htmlFor="average">Average (typical 11PM-7AM)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="night" id="night" />
            <Label htmlFor="night">Night owl (sleep late, wake late)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="irregular" id="irregular" />
            <Label htmlFor="irregular">Irregular (varies day to day)</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-3">
        <Label>Do you smoke?</Label>
        <RadioGroup 
          value={values.smoking || "non-smoker"} 
          onValueChange={(val) => handleChange("smoking", val)}
          className="flex gap-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="non-smoker" id="non-smoker" />
            <Label htmlFor="non-smoker">No</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="outside-only" id="outside-only" />
            <Label htmlFor="outside-only">Outside only</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="regular-smoker" id="regular-smoker" />
            <Label htmlFor="regular-smoker">Yes</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-3">
        <Label>Do you drink alcohol?</Label>
        <RadioGroup 
          value={values.drinking || "occasional"} 
          onValueChange={(val) => handleChange("drinking", val)}
          className="flex gap-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="non-drinker" id="non-drinker" />
            <Label htmlFor="non-drinker">No</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="occasional" id="occasional" />
            <Label htmlFor="occasional">Occasionally</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="regular" id="regular" />
            <Label htmlFor="regular">Regularly</Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
};

const RoommatePreferencesSection = ({ values, handleChange }) => {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Label>Preferred gender of roommate</Label>
        <RadioGroup 
          value={values.preferredGender || "no-preference"} 
          onValueChange={(val) => handleChange("preferredGender", val)}
          className="flex gap-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="male" id="male" />
            <Label htmlFor="male">Male</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="female" id="female" />
            <Label htmlFor="female">Female</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="no-preference" id="no-preference" />
            <Label htmlFor="no-preference">No preference</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-3">
        <Label>Age range of preferred roommate</Label>
        <div className="pt-6 px-2">
          <Slider
            defaultValue={[18, 45]}
            min={18}
            max={75}
            step={1}
            value={values.ageRange || [18, 45]}
            onValueChange={(val) => handleChange("ageRange", val)}
          />
        </div>
        <div className="flex justify-between text-sm pt-1">
          <span>{values.ageRange ? values.ageRange[0] : 18} years</span>
          <span>{values.ageRange ? values.ageRange[1] : 45} years</span>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label htmlFor="pets-ok">Pets allowed</Label>
          <Switch 
            id="pets-ok" 
            checked={values.petsAllowed}
            onCheckedChange={(checked) => handleChange("petsAllowed", checked)}
          />
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label htmlFor="smoker-ok">Smoker roommate okay</Label>
          <Switch 
            id="smoker-ok" 
            checked={values.smokerOkay}
            onCheckedChange={(checked) => handleChange("smokerOkay", checked)}
          />
        </div>
      </div>

      <div className="space-y-3">
        <Label>Cleanliness expectation from roommate</Label>
        <RadioGroup 
          value={values.cleanlinessExpectation || "moderate"} 
          onValueChange={(val) => handleChange("cleanlinessExpectation", val)}
          className="flex flex-col gap-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="very-clean" id="exp-very-clean" />
            <Label htmlFor="exp-very-clean">Very clean</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="clean" id="exp-clean" />
            <Label htmlFor="exp-clean">Clean</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="moderate" id="exp-moderate" />
            <Label htmlFor="exp-moderate">Moderate</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="relaxed" id="exp-relaxed" />
            <Label htmlFor="exp-relaxed">Relaxed</Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
};

const RoomPreferencesSection = ({ values, handleChange, type }) => {
  return (
    <div className="space-y-6">
      {type === "seeker" && (
        <>
          <div className="space-y-3">
            <Label htmlFor="budget">Monthly Budget</Label>
            <div className="flex items-center">
              <span className="mr-2">$</span>
              <Input
                id="budget"
                type="number"
                placeholder="1000"
                value={values.budget || ""}
                onChange={(e) => handleChange("budget", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-3">
            <Label htmlFor="location">Preferred Location</Label>
            <Input
              id="location"
              placeholder="Neighborhood, city, etc."
              value={values.preferredLocation || ""}
              onChange={(e) => handleChange("preferredLocation", e.target.value)}
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="moveInDate">Move-in Date</Label>
            <Input
              id="moveInDate"
              type="date"
              value={values.moveInDate || ""}
              onChange={(e) => handleChange("moveInDate", e.target.value)}
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="roomType">Room Type</Label>
            <Select 
              value={values.roomType || "private"} 
              onValueChange={(val) => handleChange("roomType", val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select room type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="private">Private Room</SelectItem>
                <SelectItem value="shared">Shared Room</SelectItem>
                <SelectItem value="studio">Studio</SelectItem>
                <SelectItem value="entire">Entire Place</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </>
      )}

      {type === "owner" && (
        <>
          <div className="space-y-3">
            <Label htmlFor="roomTitle">Room Title</Label>
            <Input
              id="roomTitle"
              placeholder="Cozy private room in downtown"
              value={values.roomTitle || ""}
              onChange={(e) => handleChange("roomTitle", e.target.value)}
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              placeholder="123 Main St"
              value={values.address || ""}
              onChange={(e) => handleChange("address", e.target.value)}
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              placeholder="San Francisco"
              value={values.city || ""}
              onChange={(e) => handleChange("city", e.target.value)}
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="rent">Monthly Rent ($)</Label>
            <Input
              id="rent"
              type="number"
              placeholder="1000"
              value={values.rent || ""}
              onChange={(e) => handleChange("rent", e.target.value)}
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="roomType">Room Type</Label>
            <Select 
              value={values.roomType || "private"} 
              onValueChange={(val) => handleChange("roomType", val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select room type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="private">Private Room</SelectItem>
                <SelectItem value="shared">Shared Room</SelectItem>
                <SelectItem value="studio">Studio</SelectItem>
                <SelectItem value="entire">Entire Place</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label htmlFor="availableFrom">Available From</Label>
            <Input
              id="availableFrom"
              type="date"
              value={values.availableFrom || ""}
              onChange={(e) => handleChange("availableFrom", e.target.value)}
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe your room and living situation"
              rows={4}
              value={values.description || ""}
              onChange={(e) => handleChange("description", e.target.value)}
            />
          </div>

          <div className="space-y-3">
            <Label>Image Upload</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
              <p className="text-sm text-gray-500">
                Image upload feature will be implemented
              </p>
              <Button variant="outline" className="mt-2" disabled>Upload Images</Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const PreferenceForm = ({ type }) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("lifestyle");
  const [formData, setFormData] = useState({
    // Initial values for all form fields can be set here
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted with data:", formData);
    
    // Here would be the API call to save preferences
    toast({
      title: "Preferences updated",
      description: "Your preferences have been saved successfully.",
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>
            {type === "seeker" ? "Room Seeker Preferences" : "Room Owner Details"}
          </CardTitle>
          <CardDescription>
            {type === "seeker" 
              ? "Tell us what you're looking for in a room and roommate" 
              : "Tell us about your room and your ideal roommate"
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full mb-6">
              <TabsTrigger value="lifestyle" className="flex-1">
                Lifestyle
              </TabsTrigger>
              <TabsTrigger value="roommate" className="flex-1">
                Roommate Preferences
              </TabsTrigger>
              <TabsTrigger value="room" className="flex-1">
                {type === "seeker" ? "Room Preferences" : "Room Details"}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="lifestyle">
              <LifestyleSection values={formData} handleChange={handleChange} />
            </TabsContent>
            
            <TabsContent value="roommate">
              <RoommatePreferencesSection values={formData} handleChange={handleChange} />
            </TabsContent>
            
            <TabsContent value="room">
              <RoomPreferencesSection 
                values={formData} 
                handleChange={handleChange} 
                type={type}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline">
            Save Draft
          </Button>
          <Button type="submit">
            Save Preferences
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
};

export default PreferenceForm;
