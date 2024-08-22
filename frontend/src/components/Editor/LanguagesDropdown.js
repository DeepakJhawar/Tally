import React from "react";
import { MenuItem, Select } from "@mui/material";
import { languageOptions } from "../../constants/languageOptions";

const LanguagesDropdown = ({ onSelectChange }) => {
  const [selectedLanguage, setSelectedLanguage] = React.useState(languageOptions[0]);

  const handleChange = (event) => {
    const selected = languageOptions.find(option => option.value === event.target.value);
    setSelectedLanguage(selected);
    onSelectChange(selected); 
  };

  return (
    <Select
      value={selectedLanguage.value}
      onChange={handleChange}
      displayEmpty
    >
      {languageOptions.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </Select>
  );
};

export default LanguagesDropdown;
