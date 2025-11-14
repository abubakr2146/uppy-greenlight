import React, { useEffect, useRef, useState } from 'react';
import Uppy from '@uppy/core';
import Dashboard from '@uppy/dashboard';
import Webcam from '@uppy/webcam';
import Audio from '@uppy/audio';
import ScreenCapture from '@uppy/screen-capture';
import ImageEditor from '@uppy/image-editor';
import Url from '@uppy/url';
import Tus from '@uppy/tus';

import '@uppy/core/css/style.css';
import '@uppy/dashboard/css/style.css';
import '@uppy/webcam/css/style.css';
import '@uppy/audio/css/style.css';
import '@uppy/screen-capture/css/style.css';
import '@uppy/image-editor/css/style.css';
import '@uppy/url/css/style.css';

const UppyUploader = ({ onUploadSuccess, onUploadError, onComplete }) => {
  const dashboardRef = useRef(null);
  const [uppy] = useState(() => {
    const uppyInstance = new Uppy({
      debug: true,
      autoProceed: false,
      restrictions: {
        maxFileSize: 1024 * 1024 * 1024, // 1GB
        maxNumberOfFiles: 10,
        allowedFileTypes: null, // Allow all file types
      },
    });

    // Use Tus for resumable uploads
    uppyInstance.use(Tus, {
      endpoint: 'https://tusd.tusdemo.net/files/', // Replace with your own
      retryDelays: [0, 1000, 3000, 5000],
      limit: 5,
    });

    return uppyInstance;
  });

  useEffect(() => {
    if (dashboardRef.current && !uppy.getPlugin('Dashboard')) {
      // Dashboard plugin
      uppy.use(Dashboard, {
        target: dashboardRef.current,
        inline: true,
        width: '100%',
        height: 470,
        showProgressDetails: true,
        proudlyDisplayPoweredByUppy: false,
        note: 'Files up to 1GB • Max 10 files',
        metaFields: [
          { id: 'name', name: 'Name', placeholder: 'File name' },
          { id: 'caption', name: 'Caption', placeholder: 'Describe what this file is about' },
        ],
        theme: 'auto',
      });

      // Other plugins (target Dashboard)
      uppy.use(Webcam, {
        target: Dashboard,
        modes: ['picture', 'video'],
        mirror: true,
        facingMode: 'user',
        showRecordingLength: true,
      });

      uppy.use(Audio, {
        target: Dashboard,
        showRecordingLength: true,
      });

      uppy.use(ScreenCapture, { target: Dashboard });
      uppy.use(ImageEditor, { target: Dashboard });
      uppy.use(Url, {
        target: Dashboard,
        companionUrl: 'http://168.231.74.150:3020',
      });

      // Event listeners
      uppy.on('file-added', (file) => console.log('File added:', file.name));
      uppy.on('upload', (data) => console.log('Upload started:', data));
      uppy.on('upload-progress', (file, progress) => {
        console.log(`${file.name}: ${progress.bytesUploaded}/${progress.bytesTotal}`);
      });
      uppy.on('upload-success', (file, response) => {
        console.log('Upload success:', file.name, response);
        onUploadSuccess?.(file, response);
      });
      uppy.on('upload-error', (file, error, response) => {
        console.error('Upload error:', file?.name, error);
        onUploadError?.(file, error, response);
      });
      uppy.on('complete', (result) => {
        console.log('Upload complete:', result);
        onComplete?.(result);
      });
    }

    return () => {
      if (uppy && typeof uppy.close === 'function') {
        uppy.cancelAll();
        uppy.close({ reason: 'unmount' });
      }
    };
  }, [uppy, onUploadSuccess, onUploadError, onComplete]);

  return (
    <div className="uppy-container">
      <div ref={dashboardRef}></div>
    </div>
  );
};

export default UppyUploader;
