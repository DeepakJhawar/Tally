import { useState } from 'react';

const useLanguage = () => {
  const [language, setLanguage] = useState('python'); // Default language

  const changeLanguage = (newLanguage) => {
    setLanguage(newLanguage);
  };

  return { language, changeLanguage };
};

export default useLanguage;
