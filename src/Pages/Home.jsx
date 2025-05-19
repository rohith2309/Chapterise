import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
//import { createContext } from 'react';
import CourseCard from '../Components/CourseCard';
import VideoLink from '../Components/VideoLink';
import { updateDoc,doc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import './Home.css'; // Import your CSS file for styling

function Home() {
  const {course,user} = useAuth();
  const [videoIds, setVideoIds] = useState(course);
  const navigate = useNavigate();
// Store list of video IDs

 

  // Add new video ID to the list
  const handleVideoSubmit = async(videoId) => {
    if (!course.includes(videoId)) {
      setVideoIds([...videoIds, videoId]);
      console.log(videoIds);
      try{
        if(user){
          const docRef=doc(db,'users',user.uid);
          await updateDoc(docRef,{courses:[...videoIds,videoId]})
          course.push(videoId);
          console.log('Video ID added successfully!');
          navigate('/dashboard');
        
      }}
      catch (error) {
        console.error('Error adding video ID:', error);
      }

    } else {
      alert('This video has already been added');
    }
  };

  return (
    <div className="Home-page">
      <div className="course-container">
        
         <VideoLink onSubmit={handleVideoSubmit} />
      </div>
      
    </div>
  );
}

export default Home;