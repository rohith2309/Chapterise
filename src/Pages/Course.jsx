import React, { use } from "react";
import { useParams } from "react-router-dom";
import { useState,useEffect } from "react";
import { doc,getDoc } from "firebase/firestore";
import { meta } from "@eslint/js";
import { useAuth } from "../context/AuthContext";

const API_KEY = import.meta.env.VITE_YOUTUBE_API;
function Course(){
    const {course,} = useAuth();
    const[chapters,setChapters]=useState();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const { id } = useParams();
    useEffect(() => {   
        const fetchVideoDetails = async () => {
            try {
                setLoading(true);
                setError("");
                const metaData_=course[id];
                setChapters(metaData_);
             
                
                console.log(metaData_);
              
              
            } catch (err) {
              //setError('Failed to fetch video details');
              setError("Failed to fetch video details");
              console.error(err);
            }finally {
                setLoading(false);
            }
          };
      
          fetchVideoDetails();
          console.log(id);
    
    }, [id]);
    

   
    

    return(
        <>
      <h3>Course Page</h3>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}
      {!loading && !error && (
        <div>
          <h4>Video Description</h4>
          <p className="course-description">{  "No description available"}</p>
          <h4>Chapters</h4>
          {chapters.length > 0 ? (
            <ul>
              {chapters.map((chapter, index) => (
                <li key={index}>
                  {chapter.timestamp} - {chapter.title}
                </li>
              ))}
            </ul>
          ) : (
            <p>No chapters found</p>
          )}
        </div>
      )}
    </>
    )
}
export default Course;