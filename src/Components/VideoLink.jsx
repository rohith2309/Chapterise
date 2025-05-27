import React, { useState } from 'react';
import './VideoLink.css'; 

function VideoLink({ onSubmit }) {
  // Handle form submission 
  const [url,seturl]=useState('');
  const handleSubmit = () => {
   
    if (url) {
      const videoId = extractVideoId(url);
      if (videoId) {
        onSubmit(videoId);
        document.getElementById('url').value = ''; // Clear input after submission
      } else {
        alert('Invalid YouTube URL');
      }
    }
  };

  // Extract video ID from YouTube URL
  const extractVideoId = (url) => {
    const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  return (
    <div className="video-link mb-6">
     
      <input
        type="text"
        placeholder="Please enter the YouTube URL"
        id="url"
        className="input-field"
        onChange={(e) => seturl(e.target.value)}
      />
      <button
        className="btn bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        onClick={handleSubmit}
      >
        Submit
      </button>
    </div>
  );
}

export default VideoLink;