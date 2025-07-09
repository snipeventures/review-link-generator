import { useState, useEffect, useRef } from 'react';
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";

interface PlacesAutocompleteProps {
  onPlaceSelected: (placeId: string, businessName: string) => void;
  value: string;
}

interface Prediction {
  place_id: string;
  description: string;
}

const PlacesAutocomplete = ({ onPlaceSelected, value }: PlacesAutocompleteProps) => {
  const [inputValue, setInputValue] = useState(value);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const searchPlaces = async () => {
      if (!inputValue || inputValue.trim().length < 3) {
        setPredictions([]);
        setShowDropdown(false);
        return;
      }

      setIsLoading(true);
      try {
        const { data, error } = await supabase.functions.invoke('places-autocomplete', {
          body: { input: inputValue.trim() }
        });

        if (error) {
          console.error('Error fetching places:', error);
          setPredictions([]);
        } else if (data?.predictions) {
          setPredictions(data.predictions);
          setShowDropdown(true);
        }
      } catch (error) {
        console.error('Error calling places function:', error);
        setPredictions([]);
      } finally {
        setIsLoading(false);
      }
    };

    const timeoutId = setTimeout(searchPlaces, 300);
    return () => clearTimeout(timeoutId);
  }, [inputValue]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handlePredictionSelect = async (prediction: Prediction) => {
    setInputValue(prediction.description);
    setShowDropdown(false);
    setPredictions([]);

    try {
      const { data, error } = await supabase.functions.invoke('place-details', {
        body: { placeId: prediction.place_id }
      });

      if (error) {
        console.error('Error fetching place details:', error);
        onPlaceSelected(prediction.place_id, prediction.description);
      } else if (data?.result) {
        onPlaceSelected(prediction.place_id, data.result.name || prediction.description);
      } else {
        onPlaceSelected(prediction.place_id, prediction.description);
      }
    } catch (error) {
      console.error('Error calling place details function:', error);
      onPlaceSelected(prediction.place_id, prediction.description);
    }
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <Input
        ref={inputRef}
        type="text"
        placeholder="Search for your business"
        value={inputValue}
        onChange={handleInputChange}
        className="w-full"
      />
      
      {showDropdown && predictions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
          {predictions.map((prediction) => (
            <div
              key={prediction.place_id}
              className="p-3 cursor-pointer hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
              onClick={() => handlePredictionSelect(prediction)}
            >
              <div className="text-sm text-gray-900">{prediction.description}</div>
            </div>
          ))}
        </div>
      )}
      
      {isLoading && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
        </div>
      )}
    </div>
  );
};

export default PlacesAutocomplete;