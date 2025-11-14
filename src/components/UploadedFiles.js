import React from 'react';

const UploadedFiles = ({ files, onDelete, onClearAll }) => {
  const getFileType = (mimeType) => {
    if (!mimeType) return 'document';
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType.startsWith('video/')) return 'video';
    if (mimeType.startsWith('audio/')) return 'audio';
    return 'document';
  };

  const getFileIcon = (type) => {
    const icons = {
      'image': '🖼️',
      'video': '🎥',
      'audio': '🎵',
      'document': '📄'
    };
    return icons[type] || '📄';
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const viewFile = (url) => {
    window.open(url, '_blank');
  };

  const downloadFile = (url, filename) => {
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  if (files.length === 0) {
    return (
      <div className="uploaded-files-section">
        <h2>
          📁 Uploaded Files
          <span style={{ fontSize: '1rem', opacity: 0.7, marginLeft: 'auto' }}>
            (0 files)
          </span>
        </h2>
        <div className="no-files">
          <div className="icon">📭</div>
          <p>No files uploaded yet. Start uploading to see them here!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="uploaded-files-section">
      <h2>
        📁 Uploaded Files
        <span style={{ fontSize: '1rem', opacity: 0.7, marginLeft: 'auto' }}>
          ({files.length} files)
        </span>
      </h2>

      <div className="files-grid">
        {files.map((file) => {
          const fileType = getFileType(file.type);
          const fileIcon = getFileIcon(fileType);
          const formattedSize = formatFileSize(file.size);
          const timestamp = new Date(file.uploadedAt).toLocaleString();

          return (
            <div key={file.id} className={`file-card ${fileType}`}>
              <div className="file-preview">
                {file.isImage ? (
                  <img
                    src={file.url}
                    alt={file.name}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentElement.innerHTML = `<div class="icon">${fileIcon}</div>`;
                    }}
                  />
                ) : (
                  <div className="icon">{fileIcon}</div>
                )}
              </div>
              <div className="file-info">
                <div className="file-name">{file.name}</div>
                <div className="file-meta">
                  <span>{formattedSize}</span>
                  <span>{fileType.toUpperCase()}</span>
                </div>
                <div className="file-timestamp">{timestamp}</div>
              </div>
              <div className="file-actions">
                <button onClick={() => viewFile(file.url)} title="View file">
                  👁️ View
                </button>
                <button onClick={() => downloadFile(file.url, file.name)} title="Download file">
                  ⬇️ Download
                </button>
                <button onClick={() => onDelete(file.id)} title="Delete file">
                  🗑️ Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <button className="clear-all-btn" onClick={onClearAll}>
        🗑️ Clear All Files
      </button>
    </div>
  );
};

export default UploadedFiles;
