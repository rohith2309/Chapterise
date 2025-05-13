import React, { useEffect, useState } from 'react';
import './CouseCard.css'; // Import your CSS file for styling

function CourseCard({ videoId }) {
  const [videoData, setVideoData] = useState(null);
  const [error, setError] = useState(null);

  const API_KEY = import.meta.env.VITE_YOUTUBE_API; // Ensure this is in your .env file

  useEffect(() => {
    const fetchVideoDetails = async () => {
      try {
        const res = await fetch(
          `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${API_KEY}`
        );
        const data = await res.json();
        if (data.items && data.items.length > 0) {
          setVideoData(data.items[0].snippet);
        } else {
          setError('No video data found');
        }
      } catch (err) {
        setError('Failed to fetch video details');
        console.error(err);
      }
    };

    fetchVideoDetails();
  }, [videoId]);

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  if (!videoData) {
    return <div className="text-gray-500">Loading...</div>;
  }

  // Extract hashtags from description or use default
  

  
  
  // Format the date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const month = date.toLocaleString('default', { month: 'short' });
    return `${month} ${date.getDate()} ${date.getFullYear()}`;
  };
  
  // Get first character of channel title for avatar
  const getAvatarText = () => {
    if (!videoData.channelTitle) return "A";
    return videoData.channelTitle.charAt(0).toUpperCase();
  };
  
  // Avatar class based on first letter (just to simulate different colors)
  const getAvatarClass = () => {
    const firstChar = getAvatarText();
    return firstChar === "T" ? "avatar-tc" : "avatar-bc";
  };

  return (
    <div className="course-card">
      <div className="course-card-image">
        <img
          src={videoData.thumbnails.high.url || videoData.thumbnails.medium.url}
          alt={videoData.title}
        />
      </div>
      <div className="course-content">
        <div className="course-label">VIDEO</div>
        <h3 className="course-title">{videoData.title}</h3>
        <p className="course-description">{videoData.description}</p>
        
      
        
        <div className="course-author">
          <div className={`author-avatar ${getAvatarClass()}`}>
            {getAvatarText()}
          </div>
          <div className="author-info">
            <div className="author-name">{videoData.channelTitle || "Course Author"}</div>
            <div className="author-date">{formatDate(videoData.publishedAt)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CourseCard;