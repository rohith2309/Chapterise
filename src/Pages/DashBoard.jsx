import React from 'react'
import { useNavigate } from 'react-router-dom'
import CourseCard from '../Components/CourseCard'
import { useAuth } from '../context/AuthContext'
import './DashBoard.css' 
const DashBoard = () => {
   const navigate = useNavigate()
   const { course }=useAuth(); 

   

  

  return (
    <>
    
    <div className="courses-page p-5">
      <h1 className="text-2xl font-bold mb-4">Your Courses</h1>
      <div className='course-container'>
        
      {Object.keys(course).map((videoId) => (
        <CourseCard videoId={videoId} 
        key={videoId} 
        onClick={() => navigate(`/course/${videoId}`)}/>
      ))}
      </div>
    </div>  
    </>
  )
}

export default DashBoard