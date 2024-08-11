import React, { useState } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import CodeEditorWindow from '../codingPlayground/CodeEditorWindow';
import LanguagesDropdown from '../codingPlayground/LanguagesDropdown';
import useLanguage from '../../hooks/useLanguage';

const Editor = ({ onCodeChange }) => {
  const [code, setCode] = useState('');
  const { language, changeLanguage } = useLanguage(); 

  const handleLanguageChange = (selectedLanguage) => {
    changeLanguage(selectedLanguage.value);
    if (onCodeChange) {
      onCodeChange(code); 
    }
  };

  const handleCodeChange = (action, data) => {
    if (action === 'code') {
      setCode(data);
      if (onCodeChange) {
        onCodeChange(data);
      }
    } else {
      console.warn('Unhandled action type:', action);
    }
  };

  return (
    <>
      <div className="flex flex-row">
        <div className="px-4 py-2">
          <LanguagesDropdown onSelectChange={handleLanguageChange} />
        </div>
      </div>
      <div className="flex flex-row space-x-4 items-start px-4 py-4">
        <div className="flex flex-col w-full h-full justify-start items-end">
          <CodeEditorWindow
            code={code}
            onChange={handleCodeChange}
            language={language} 
          />
        </div>
      </div>
    </>
  );
};

export default Editor;
