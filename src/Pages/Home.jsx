import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
//import { createContext } from 'react';
import CourseCard from '../Components/CourseCard';
import VideoLink from '../Components/VideoLink';
import { updateDoc,doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import './Home.css'; // Import your CSS file for styling

const API_KEY = import.meta.env.VITE_YOUTUBE_API;
function Home() {
  const {course,user} = useAuth();
  const [videoIds, setVideoIds] = useState(course);
  
  const navigate = useNavigate();

  // backend URL to fetch timestamps and title if not available in the description
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
  const getChaptersFromServer = async (videoId) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/chapters`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ videoId }),
      });
      const data = await response.json();
      return data.success ? data.chapters : null;
    } catch (error) {
      console.error('Error fetching chapters from server:', error);
      return null;
    }
  };  
// Store list of video IDs
const parseChapters = (desc) => {
         
  var chapters = [];
  var file = [];

  file = desc.split("\n");
  for (var l in file) {
      var line = file[l].trim();
      var result = "";
      var chapter = "";

      result = line.match(/\(?(\d+[:]\d+[:]\d+)\)?/);

      if (result === null) {
          result = line.match(/\(?(\d+[:]\d+)\)?/);
      }

      if (result === null) continue;
      chapter = line.split(result[1]);
      chapters.push({ timestamp: result[1], title: chapter[1]?.trim() || 'Untitled', completed: false });
  }

  return chapters;    

};

 
     
  // Add new video ID to the list
  const handleVideoSubmit = async(videoId) => {
    
      //setVideoIds([...videoIds, videoId]);  
      const res = await fetch(
                `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${API_KEY}`
              );
      
      try{

        if(user){
          const data = await res.json();
          if (data.items && data.items.length > 0) {
            const videoDescription = data.items[0].snippet.description || "";
            //setDescription(videoDescription);
            console.log(course);
            
          const docRef=doc(db,'users',user.uid);
          const docSnap=await getDoc(docRef);
          const existingCourses = docSnap.exists() ? docSnap.data().courses || {} : {}
          if (existingCourses[videoId]) {
            alert('This video has already been added');
            return;
          }
          let chapters_=parseChapters(videoDescription)

          if (chapters_.length === 0) {
            const serverChapters = await getChaptersFromServer(videoId);
            if (serverChapters && serverChapters.length > 0) {
              chapters_ = serverChapters;
            }
          }
          if (chapters_.length === 0) {
            alert('No chapters found in this video');
            return;
          }


          await updateDoc(docRef,{courses:{...existingCourses,[videoId]:chapters_}})
          course[videoId]=chapters_
          console.log('Video ID added successfully!');
          navigate('/dashboard');
        
      }}}
      catch (error) {
        console.error('Error adding video ID:', error);
      }

  }
  

  return (
    <div className="Home-page">
      <div className="course-container">
        
         <VideoLink onSubmit={handleVideoSubmit} />
      </div>
      
    </div>
  );
}

export default Home;