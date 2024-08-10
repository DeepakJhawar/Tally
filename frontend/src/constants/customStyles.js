export const customStyles = {
  control: (styles) => ({
    ...styles,
    width: "100%",
    maxWidth: "14rem",
    minWidth: "12rem",
    borderRadius: "5px",
    color: "#000",
    fontSize: "0.8rem",
    lineHeight: "1.75rem",
    backgroundColor: "#f5f5f5", 
    cursor: "pointer",
    border: "2px solid #dcdcdc", 
    ":hover": {
      border: "2px solid #b0b0b0",
    },
  }),
  option: (styles, { isSelected, isFocused }) => ({
    ...styles,
    color: isSelected ? "#000" : "#333", 
    fontSize: "0.8rem",
    lineHeight: "1.75rem",
    width: "100%",
    backgroundColor: isSelected
      ? "#e0e0e0"
      : isFocused
      ? "#f0f0f0" 
      : "#f5f5f5", 
    ":hover": {
      backgroundColor: "#d0d0d0", 
      color: "#000",
      cursor: "pointer",
    },
  }),
  menu: (styles) => ({
    ...styles,
    backgroundColor: "#f5f5f5", 
    maxWidth: "14rem",
    border: "2px solid #dcdcdc", 
    borderRadius: "5px",
  }),
  placeholder: (defaultStyles) => ({
    ...defaultStyles,
    color: "#666",
    fontSize: "0.8rem",
    lineHeight: "1.75rem",
  }),
};
