import React from 'react'

import CourseCard from '../Components/CourseCard'
import { useAuth } from '../context/AuthContext'
import './DashBoard.css' 
const DashBoard = () => {
   
   const { course }=useAuth(); // Replace with the actual user ID

   

  

  return (
    <>
    <div>DashBoard</div>
    <div className="courses-page p-5">
      <h1 className="text-2xl font-bold mb-4">Your Courses</h1>
      <div className='course-container'>
        
      {course.map((videoId) => (
        <CourseCard videoId={videoId} 
        key={videoId}/>
      ))}
      </div>
    </div>  
    </>
  )
}

export default DashBoard