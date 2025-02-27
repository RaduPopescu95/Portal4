import React, { useState, useEffect } from "react";
import { LoadScript, Autocomplete } from "@react-google-maps/api";

const AutocompleteInput = ({ onPlaceChanged, adresa, buttonPressed }) => {
  const [autocomplete, setAutocomplete] = useState(null);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    if (adresa) {
      setInputValue(adresa); // Setează adresa inițială dacă există
    }
  }, [adresa]);

  const onLoad = (autocomplete) => {
    setAutocomplete(autocomplete);
  };

  const onPlaceChangedLocal = () => {
    if (autocomplete) {
      const place = autocomplete.getPlace();
      if (place.geometry) {
        // Asigură-te că locația are o geometrie definită
        onPlaceChanged(
          place.geometry.location.lat(),
          place.geometry.location.lng(),
          place.formatted_address,
          place.url
        );
        setInputValue(place.formatted_address); // Actualizează adresa în input după selecție
      } else {
        console.log("No location selected from suggestions.");
      }
    }
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value); // Permite modificarea inputului
  };

  return (
    <Autocomplete
      onLoad={onLoad}
      onPlaceChanged={onPlaceChangedLocal}
      className="autocomplete-dropdown mb-3"
    >
      <input
        type="text"
        className={`form-control ${
          !adresa && buttonPressed && "border-danger"
        }`}
        placeholder="Introduceți adresa"
        style={{ width: "100%", padding: "10px" }}
        value={inputValue}
        onChange={handleInputChange}
      />
    </Autocomplete>
  );
};

export default AutocompleteInput;
