import React, { useState } from "react";
import ReactMarkdown from "react-markdown";

const App = () => {
  const [file, setFile] = useState(null);
  const [summary, setSummary] = useState("");
  const [question, setQuestion] = useState("");
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fileName, setFileName] = useState("");
  const [isDocumentUploaded, setIsDocumentUploaded] = useState(false);

  const BackendURL = import.meta.env.VITE_BACKEND_URL;

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file.");
      return;
    }

    if (file.type !== "application/pdf") {
      setError("Please upload a PDF file.");
      return;
    }

    setLoading(true);
    setError("");
    const formData = new FormData();
    formData.append("document", file);

    try {
      const response = await fetch(`${BackendURL}/upload`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setSummary(data.summary);
      setIsDocumentUploaded(true);

      // Add the summary as the first message in the conversation
      setAnswers([
        {
          type: "summary",
          content: data.summary,
        },
      ]);
    } catch (error) {
      setError("An error occurred while uploading the file.");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAskQuestion = async (e) => {
    e.preventDefault();

    if (!isDocumentUploaded) {
      setError("Please upload a document first.");
      return;
    }

    if (!question.trim()) {
      setError("Please enter a question.");
      return;
    }

    const currentQuestion = question;
    setQuestion("");
    setLoading(true);
    setError("");

    // Immediately add the question to the conversation
    setAnswers((prev) => [
      ...prev,
      {
        type: "question",
        content: currentQuestion,
      },
    ]);

    const formData = new FormData();
    formData.append("document", file);
    formData.append("question", currentQuestion);

    try {
      const response = await fetch(`${BackendURL}/ask`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      // Add the answer to the conversation
      setAnswers((prev) => [
        ...prev,
        {
          type: "answer",
          content: data.answer,
        },
      ]);
    } catch (error) {
      setError("An error occurred while processing your question.");
      console.error("Error:", error);

      // Add the error to the conversation
      setAnswers((prev) => [
        ...prev,
        {
          type: "error",
          content: "An error occurred while processing your question.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleResetDocument = () => {
    // Reset document state
    setFile(null);
    setFileName("");
    setSummary("");
    setAnswers([]);
    setIsDocumentUploaded(false);
    setError("");
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      {/* Side Icons */}
      {/* <div className="fixed w-10 h-50 top-[50%] left-7 translate-y-[-50%] flex flex-col justify-center items-center gap-4">
        <a target="_blank" className="cursor-pointer" href="https://github.com/githubxnishant">
          
        </a>
        <a target="_blank" href="https://www.linkedin.com/in/nishantxchauhan/">
          <svg width="35" height="35" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#94A3B8" className="text-text-secondary hover:text-text-primary transition-all duration-300 hover:fill-[#E2E8F0]" aria-hidden="true">
            <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z"></path>
          </svg>
        </a>
        <a target="_blank" href="https://x.com/chauhanishant_">
          <svg width="28" height="28" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 1227" fill="#94A3B8" className="text-text-secondary hover:text-text-primary transition-all duration-300 hover:fill-[#E2E8F0]" aria-hidden="true">
            <path d="M714.163 519.284L1160.89 0H1055.03L667.137 450.887L357.328 0H0L468.492 681.821L0 1226.37H105.866L515.491 750.218L842.672 1226.37H1200L714.137 519.284H714.163ZM569.165 687.828L521.697 619.934L144.011 79.6944H306.615L611.412 515.685L658.88 583.579L1055.08 1150.3H892.476L569.165 687.854V687.828Z"></path>
          </svg>
        </a>
      </div> */}

      {/* Header with gradient underline */}
      <header className="p-4 flex justify-between items-center border-b border-blue-500/30">
        <a href="" className="text-2xl cursor-pointer font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
          DocGPT
        </a>

        <div className="flex gap-3 justify-center items-center">
          <a href="https://github.com/githubxnishant/docGPT.git" className="bg-gray-800/50 px-3 md:flex justify-center items-center gap-2 py-2 cursor-pointer rounded-lg font-medium text-sm transition-all hover:bg-gray-600 border border-gray-600 hidden">
            <svg width="20" height="20" className="text-text-secondary hover:text-text-primary cursor-pointer transition-all duration-300 hover:fill-[#E2E8F0]" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="#94A3B8" viewBox="0 0 24 24">
              <path fill-rule="evenodd" d="M12.006 2a9.847 9.847 0 0 0-6.484 2.44 10.32 10.32 0 0 0-3.393 6.17 10.48 10.48 0 0 0 1.317 6.955 10.045 10.045 0 0 0 5.4 4.418c.504.095.683-.223.683-.494 0-.245-.01-1.052-.014-1.908-2.78.62-3.366-1.21-3.366-1.21a2.711 2.711 0 0 0-1.11-1.5c-.907-.637.07-.621.07-.621.317.044.62.163.885.346.266.183.487.426.647.71.135.253.318.476.538.655a2.079 2.079 0 0 0 2.37.196c.045-.52.27-1.006.635-1.37-2.219-.259-4.554-1.138-4.554-5.07a4.022 4.022 0 0 1 1.031-2.75 3.77 3.77 0 0 1 .096-2.713s.839-.275 2.749 1.05a9.26 9.26 0 0 1 5.004 0c1.906-1.325 2.74-1.05 2.74-1.05.37.858.406 1.828.101 2.713a4.017 4.017 0 0 1 1.029 2.75c0 3.939-2.339 4.805-4.564 5.058a2.471 2.471 0 0 1 .679 1.897c0 1.372-.012 2.477-.012 2.814 0 .272.18.592.687.492a10.05 10.05 0 0 0 5.388-4.421 10.473 10.473 0 0 0 1.313-6.948 10.32 10.32 0 0 0-3.39-6.165A9.847 9.847 0 0 0 12.007 2Z" clip-rule="evenodd"></path>
            </svg>DOCS</a>
          {/* Document indicator when uploaded */}
          {isDocumentUploaded && (
            <div className="flex items-center">
              <div className="flex items-center px-3 py-2 bg-blue-500/20 rounded-lg border border-blue-500/30">
                <svg
                  className="w-4 h-4 mr-2 text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  ></path>
                </svg>
                <span className="text-sm">{fileName}</span>
              </div>
              <button
                onClick={handleResetDocument}
                className="px-3 py-2 ml-4 cursor-pointer rounded-lg font-medium text-sm transition-all bg-gray-700 hover:bg-gray-600 border border-gray-600"
              >
                <div className="flex items-center">
                  <svg
                    className="w-4 h-4 mr-2 text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 4v16m8-8H4"
                    ></path>
                  </svg>
                  New Document
                </div>
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Welcome message or conversation area */}
      <main className="flex-grow overflow-y-auto p-4 md:pl-0">
        {!isDocumentUploaded && answers.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full">
            {/* Welcome message */}
            <div className="bg-gray-800/70 backdrop-blur-sm rounded-full px-6 py-3 flex items-center mb-8 shadow-lg shadow-blue-500/10 border border-blue-500/20">
              <div className="mr-3 text-blue-400">
                <svg
                  viewBox="0 0 24 24"
                  width="20"
                  height="20"
                  fill="currentColor"
                >
                  <rect width="20" height="20" rx="4" fill="currentColor" />
                </svg>
              </div>
              <span className="font-medium">
                New! Introducing AI Document Q&A
              </span>
            </div>

            <h1 className="text-5xl font-bold text-center mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
              What do you want to ask?
            </h1>

            {/* Subheading */}
            <p className="text-gray-300 text-lg mb-12 text-center max-w-2xl">
              Upload, summarize, and ask questions about your{" "}
              <span className="text-white font-medium">pdf documents</span>{" "}
              using our advanced AI technology.
            </p>

            {!isDocumentUploaded && (
              <div className="flex items-center">
                <input
                  type="file"
                  id="file-upload"
                  onChange={handleFileChange}
                  className="hidden"
                  accept="application/pdf"
                />
                <label
                  htmlFor="file-upload"
                  className="flex items-center mr-3 px-3 py-2 bg-gray-700/70 hover:bg-gray-700 cursor-pointer rounded-lg border border-gray-600 transition-colors"
                >
                  <svg
                    className="w-4 h-4 mr-2 text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 4v16m8-8H4"
                    ></path>
                  </svg>
                  {fileName ? fileName : "Select PDF"}
                </label>

                <button
                  onClick={handleUpload}
                  className={`px-4 py-2 mr-2 rounded-lg font-medium cursor-pointer text-sm transition-all
                ${loading
                      ? "bg-gray-700 cursor-not-allowed"
                      : "bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 shadow-md hover:shadow-blue-500/20"
                    }`}
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <svg
                        className="animate-spin h-4 w-4 mr-2 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Processing...
                    </div>
                  ) : (
                    "Upload & Summarize"
                  )}
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6 pb-4">
            {/* Conversation messages */}
            {answers.map((item, index) => (
              <div
                key={index}
                className={`max-w-3xl mx-auto ${item.type === "question" ? "ml-auto mr-0 max-w-xl" : ""
                  }`}
              >
                {item.type === "question" ? (
                  <div className="bg-blue-600/30 m-8 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-blue-500/30">
                    <ReactMarkdown >
                      {item.content}
                    </ReactMarkdown>
                  </div>
                ) : item.type === "summary" ? (
                  <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-700/50">
                    <h2 className="font-bold text-lg mb-3 text-blue-300 flex items-center">
                      <svg
                        className="w-5 h-5 mr-2 text-blue-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        ></path>
                      </svg>
                      Document Summary
                    </h2>
                    <div className="bg-gray-700/30 p-4 rounded-lg border border-gray-600/50">
                      <ReactMarkdown >
                        {item.content}
                      </ReactMarkdown>
                    </div>
                  </div>
                ) : item.type === "error" ? (
                  <div className="bg-red-900/30 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-red-500/50">
                    <p className="text-red-200">{item.content}</p>
                  </div>
                ) : (
                  <div className="bg-gr3333ay-800/50 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-700/50">
                    <h2 className="font-bold text-lg mb-3 text-blue-300 flex items-center">
                      <svg
                        className="w-5 h-5 mr-2 text-blue-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        ></path>
                      </svg>
                      Answer
                    </h2>
                    <div className="bg-gray-700/30 p-4 rounded-lg border border-gray-600/50">
                      <ReactMarkdown >
                        {item.content}
                      </ReactMarkdown>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Loading indicator */}
            {loading && (
              <div className="max-w-3xl mx-auto">
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-gray-700/50 flex items-center">
                  <svg
                    className="animate-spin h-5 w-5 mr-3 text-blue-400"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <p className="text-gray-300">Processing your question...</p>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Fixed input box at bottom */}
      {isDocumentUploaded && (
        <div className="p-4 border-t border-gray-700 bg-gray-900">
          {/* Error message */}
          {error && (
            <div className="max-w-3xl mx-auto mb-4 p-3 bg-red-900/30 backdrop-blur-sm border border-red-500/50 rounded-lg text-red-200 shadow-lg">
              <div className="flex items-start">
                <svg
                  className="w-5 h-5 mr-2 mt-0.5 text-red-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
                <span>{error}</span>
              </div>
            </div>
          )}

          {/* Question input form */}
          <form onSubmit={handleAskQuestion} className="max-w-3xl mx-auto">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-gray-700/50 transition-all hover:border-blue-500/30">
              <div className="flex items-center">
                <textarea
                  className="flex-grow bg-gray-700/50 border border-gray-600 rounded-lg p-3 outline-none resize-none h-12 text-white placeholder-gray-400 focus:border-blue-500/50 transition-colors"
                  placeholder="Ask a question about your document..."
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleAskQuestion(e);
                    }
                  }}
                />
                <button
                  type="submit"
                  className={`ml-3 px-4 py-3 rounded-lg font-medium transition-all
                    ${loading
                      ? "bg-gray-700 cursor-not-allowed"
                      : "bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 shadow-md hover:shadow-blue-500/20"
                    }`}
                  disabled={loading}
                >
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    ></path>
                  </svg>
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>

  );
};

export default App;
