import React from 'react';
import Editor from '@monaco-editor/react';

const CodeEditorWindow = ({ onChange, language, code }) => {
  const handleEditorChange = (value) => {
    onChange('code', value);
  };

  return (
    <div className="w-full h-full bg-gray-900 p-4 rounded-md shadow-lg">
      <Editor
        height="85vh"
        width="100%"
        language={language || 'python'}
        value={code}  
        onChange={handleEditorChange}
        theme="vs-dark"
        options={{
          selectOnLineNumbers: true,
          automaticLayout: true,
        }}
      />
    </div>
  );
};

export default CodeEditorWindow;
