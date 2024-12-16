import { useEffect, useRef } from 'react';
import { Input } from "@/components/ui/input";

interface PlacesAutocompleteProps {
  onPlaceSelected: (placeId: string) => void;
  value: string;
}

declare global {
  interface Window {
    google: typeof google;
  }
}

const PlacesAutocomplete = ({ onPlaceSelected, value }: PlacesAutocompleteProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  useEffect(() => {
    if (!inputRef.current) return;

    autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current, {
      types: ['establishment'],
    });

    autocompleteRef.current.addListener('place_changed', () => {
      const place = autocompleteRef.current?.getPlace();
      if (place?.place_id) {
        console.log('Place selected:', place);
        onPlaceSelected(place.place_id);
      }
    });

    return () => {
      window.google.maps.event.clearInstanceListeners(autocompleteRef.current!);
    };
  }, [onPlaceSelected]);

  return (
    <Input
      ref={inputRef}
      type="text"
      placeholder="Search for your business"
      defaultValue={value}
      className="w-full"
    />
  );
};

export default PlacesAutocomplete;