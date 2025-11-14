import React, { useState, useEffect } from 'react';
import './App.css';
import UppyUploader from './components/UppyUploader';
import Statistics from './components/Statistics';
import Features from './components/Features';
import UploadedFiles from './components/UploadedFiles';

function App() {
  const [filesUploaded, setFilesUploaded] = useState(0);
  const [totalSize, setTotalSize] = useState(0);
  const [successfulUploads, setSuccessfulUploads] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  // Load uploaded files from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('uploadedFiles');
    if (stored) {
      const files = JSON.parse(stored);
      setUploadedFiles(files);

      // Recalculate stats
      const totalUploaded = files.length;
      const size = files.reduce((acc, file) => acc + (file.size || 0), 0);
      setFilesUploaded(totalUploaded);
      setTotalSize(size);
      setSuccessfulUploads(totalUploaded);
      setTotalAttempts(totalUploaded);
    }
  }, []);

  // Save to localStorage whenever uploadedFiles changes
  useEffect(() => {
    localStorage.setItem('uploadedFiles', JSON.stringify(uploadedFiles));
  }, [uploadedFiles]);

  const handleUploadSuccess = (file, response) => {
    setFilesUploaded(prev => prev + 1);
    setTotalSize(prev => prev + file.size);
    setSuccessfulUploads(prev => prev + 1);
    setTotalAttempts(prev => prev + 1);

    const uploadedFile = {
      id: file.id || Date.now().toString(),
      name: file.name,
      size: file.size,
      type: file.type,
      url: response.uploadURL || response.url || '#',
      uploadedAt: new Date().toISOString(),
      isImage: file.type && file.type.startsWith('image/')
    };

    setUploadedFiles(prev => [uploadedFile, ...prev]);
  };

  const handleUploadError = (file, error, response) => {
    setTotalAttempts(prev => prev + 1);
  };

  const handleComplete = (result) => {
    if (result.successful.length > 0) {
      const message = result.successful.length === 1
        ? `Successfully uploaded "${result.successful[0].name}"!`
        : `Successfully uploaded ${result.successful.length} file(s)!`;
      alert(message);

      // Scroll to uploaded files section
      setTimeout(() => {
        const section = document.querySelector('.uploaded-files-section');
        if (section) {
          section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 500);
    }

    if (result.failed.length > 0) {
      alert(`${result.failed.length} file(s) failed to upload.`);
    }
  };

  const handleDeleteFile = (fileId) => {
    if (window.confirm('Are you sure you want to delete this file?')) {
      setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
      setFilesUploaded(prev => Math.max(0, prev - 1));
    }
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all uploaded files?')) {
      setUploadedFiles([]);
      setFilesUploaded(0);
      setTotalSize(0);
      setSuccessfulUploads(0);
      setTotalAttempts(0);
    }
  };

  const successRate = totalAttempts > 0
    ? Math.round((successfulUploads / totalAttempts) * 100)
    : 100;

  return (
    <div className="App">
      <div className="container">
        <header className="App-header">
          <h1>🚀 Uppy File Uploader</h1>
          <p>Upload files with ease using drag & drop, webcam, or URL import</p>
        </header>

        <main>
          <div className="upload-section">
            <UppyUploader
              onUploadSuccess={handleUploadSuccess}
              onUploadError={handleUploadError}
              onComplete={handleComplete}
            />

            <Features />

            <Statistics
              filesUploaded={filesUploaded}
              totalSize={totalSize}
              successRate={successRate}
            />
          </div>

          <UploadedFiles
            files={uploadedFiles}
            onDelete={handleDeleteFile}
            onClearAll={handleClearAll}
          />
        </main>

        <footer className="footer">
          <p>Powered by Uppy • Companion: http://168.231.74.150:3020</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
