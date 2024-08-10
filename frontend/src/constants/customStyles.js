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
    backgroundColor: "#f5f5f5", // Light gray background
    cursor: "pointer",
    border: "2px solid #dcdcdc", // Light gray border
    ":hover": {
      border: "2px solid #b0b0b0", // Slightly darker gray on hover
    },
  }),
  option: (styles, { isSelected, isFocused }) => ({
    ...styles,
    color: isSelected ? "#000" : "#333", // Dark text color for selected
    fontSize: "0.8rem",
    lineHeight: "1.75rem",
    width: "100%",
    backgroundColor: isSelected
      ? "#e0e0e0" // Gray background for selected option
      : isFocused
      ? "#f0f0f0" // Light gray background for focused option
      : "#f5f5f5", // Default light gray background
    ":hover": {
      backgroundColor: "#d0d0d0", // Darker gray on hover
      color: "#000",
      cursor: "pointer",
    },
  }),
  menu: (styles) => ({
    ...styles,
    backgroundColor: "#f5f5f5", // Light gray background
    maxWidth: "14rem",
    border: "2px solid #dcdcdc", // Light gray border
    borderRadius: "5px",
  }),
  placeholder: (defaultStyles) => ({
    ...defaultStyles,
    color: "#666", // Medium gray for placeholder text
    fontSize: "0.8rem",
    lineHeight: "1.75rem",
  }),
};
