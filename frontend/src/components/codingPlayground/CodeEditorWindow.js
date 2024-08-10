import React, { useState } from 'react';
import Editor from '@monaco-editor/react';

const CodeEditorWindow = ({ onChange, language, code }) => {
  const [value, setValue] = useState(code || "");

  const handleEditorChange = (value) => {
    setValue(value);
    onChange('code', value);
  };

  return (
    <div className="w-full h-full bg-gray-900 p-4 rounded-md shadow-lg">
      <Editor
        height="85vh"
        width="100%"
        language={language || 'javascript'}
        value={value}
        defaultValue="// code here"
        onChange={handleEditorChange}
        theme="vs-dark" // Using a built-in dark theme
      />
    </div>
  );
};

export default CodeEditorWindow;
