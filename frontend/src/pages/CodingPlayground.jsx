import React, { useEffect, useState } from "react";
import axios from "axios";
import { classnames } from "../utils/general";
import { languageOptions } from "../constants/languageOptions";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useKeyPress from "../hooks/useKeyPress";
import CodeEditorWindow from "../components/codingPlayground/CodeEditorWindow";
import CustomInput from "../components/codingPlayground/CustomInput";
import LanguagesDropdown from "../components/codingPlayground/LanguagesDropdown";
import Navbar from "../components/Navbar";



const CodingPlayGround = () => {
  const [code, setCode] = useState();
  const [customInput, setCustomInput] = useState("");
  const [outputDetails, setOutputDetails] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [language, setLanguage] = useState(languageOptions[0]);

  const enterPress = useKeyPress("Enter");
  const ctrlPress = useKeyPress("Control");

  const onSelectChange = (sl) => {
    setLanguage(sl);
  };

  useEffect(() => {
    if (enterPress && ctrlPress) {
      handleCompile();
    }
  }, [ctrlPress, enterPress]);

  const onChange = (action, data) => {
    switch (action) {
      case "code":
        setCode(data);
        break;
      default:
        console.warn("Unhandled action type:", action, data);
    }
  };

  const handleCompile = async () => {
    setProcessing(true);
    const formData = {
      language: language.value,
      code: btoa(code),
      input: btoa(customInput),
    };

    const response = await axios.post("http://localhost:6969/run-playground-code", formData, {
      validateStatus: (status) => status >= 200 && status < 500,
    });
    if(response.data.status === 'passed'){
      setOutputDetails(response.data);
      setProcessing(false);
      showSuccessToast("Compiled Successfully!");
    }else{
      showErrorToast(response.data.message);
      setProcessing(false);
    }
  };

  const showSuccessToast = (msg) => {
    if (!toast.isActive("success-toast")) {
      toast.success(msg || "Compiled Successfully!", {
        toastId: "success-toast",
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const showErrorToast = (msg, timer) => {
    if (!toast.isActive("error-toast")) {
      toast.error(msg || "Something went wrong! Please try again.", {
        toastId: "error-toast",
        position: "top-right",
        autoClose: timer || 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  return (
    <>
      <Navbar />
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <div className="flex flex-row">
        <div className="px-4 py-2">
          <LanguagesDropdown onSelectChange={onSelectChange} />
        </div>
      </div>
      <div className="flex flex-row space-x-4 items-start px-4 py-4">
        <div className="flex flex-col w-full h-full justify-start items-end">
          <CodeEditorWindow
            code={code}
            onChange={onChange}
            language={language?.value}
          />
        </div>

        <div className="right-container flex flex-shrink-0 w-[30%] flex-col h-[60%]">
          {/* <OutputWindow outputDetails={outputDetails} /> */}
          <div className="flex flex-col items-end">
            <CustomInput
              customInput={customInput}
              setCustomInput={setCustomInput}
            />
            <button
              onClick={handleCompile}
              disabled={!code || processing}
              className={classnames(
                "mt-4 border-2 border-black z-10 rounded-md shadow-[5px_5px_0px_0px_rgba(0,0,0)] px-4 py-2 hover:shadow transition duration-200 bg-white flex-shrink-0 text-black",
                !code || processing ? "opacity-50" : ""
              )}
            >
              {processing ? "Processing..." : "Compile and Execute"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CodingPlayGround;
