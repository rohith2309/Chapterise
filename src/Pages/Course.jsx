import React, { use } from "react";
import { useParams } from "react-router-dom";
import { useState,useEffect } from "react";

const API_KEY = import.meta.env.VITE_YOUTUBE_API;
function Course(){
    
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const { id } = useParams();
    useEffect(() => {   
        
      
          fetchVideoDetails();
          console.log(id);
    
    }, [id]);
    useEffect(() => {
        
        console.log(chapters);   

    },[description]);

   

    return(
        <>
      <h3>Course Page</h3>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}
      {!loading && !error && (
        <div>
          <h4>Video Description</h4>
          <p className="course-description">{description || "No description available"}</p>
          <h4>Chapters</h4>
          {chapters.length > 0 ? (
            <ul>
              {chapters.map((chapter, index) => (
                <li key={index}>
                  {chapter[0]} - {chapter[1]}
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