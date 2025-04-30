
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const FilterBar = ({ onApplyFilters }) => {
  const [ageRange, setAgeRange] = useState([18, 100]);
  const [gender, setGender] = useState("");
  const [createdAtSort, setCreatedAtSort] = useState("newest");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Handle filter application
  const handleApplyFilter = () => {
    onApplyFilters({
      ageMin: ageRange[0],
      ageMax: ageRange[1],
      gender,
      createdAtSort,
    });
    if (window.innerWidth < 768) {
      setIsFilterOpen(false);
    }
  };

  // Handle filter reset
  const handleResetFilters = () => {
    setAgeRange([18, 100]);
    setGender("");
    setCreatedAtSort("newest");
    onApplyFilters({});
  };

  return (
    <div className="w-full bg-white shadow-sm rounded-lg mb-6">
      {/* Mobile Filter Button */}
      <div className="md:hidden p-4">
        <Button 
          variant="outline" 
          className="w-full flex justify-between items-center"
          onClick={() => setIsFilterOpen(!isFilterOpen)}
        >
          <span>Filters</span>
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            {isFilterOpen ? (
              <path d="M18 6L6 18M6 6l12 12" />
            ) : (
              <path d="M4 21v-7m0-4V3m8 18v-4m0-8V3m8 18v-11m0-4V3M1 14h6m2-6h6m2 12h6" />
            )}
          </svg>
      </Button>
      </div>

      {/* Filter Content - Hidden on mobile unless toggled */}
      <div className={`${isFilterOpen || 'md:block hidden'} p-4`}>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* Age Range */}
          <div className="md:col-span-2 space-y-2">
            <Label>Age Range</Label>
            <div className="pt-4 px-2">
              <Slider 
                defaultValue={[18, 100]} 
                min={18}
                max={100} 
                step={1}
                value={ageRange}
                onValueChange={setAgeRange}
              />
            </div>
            <div className="flex justify-between text-sm text-gray-600 pt-1">
              <span>{ageRange[0]}</span>
              <span>{ageRange[1]}</span>
            </div>
          </div>

          {/* Gender */}
          <div>
            <Label htmlFor="gender">Gender</Label>
          <Select value={gender || undefined} onValueChange={setGender}>
            <SelectTrigger>
              <SelectValue placeholder="Any" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any</SelectItem>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
          </div>

          {/* Created At Sort */}
          <div>
            <Label htmlFor="created-at-sort">Sort By Created At</Label>
            <Select value={createdAtSort} onValueChange={setCreatedAtSort}>
              <SelectTrigger>
                <SelectValue placeholder="Newest" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="oldest">Oldest</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Filter Actions */}
        <div className="flex justify-end mt-4 gap-2">
          <Button variant="outline" onClick={handleResetFilters}>
            Reset
          </Button>
          <Button onClick={handleApplyFilter}>
            Apply Filters
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
