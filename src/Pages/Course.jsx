import React from "react";
import { useParams } from "react-router-dom";
import { useState,useEffect,useRef } from "react";

import  "./Course.css"
import { useAuth } from "../context/AuthContext";
import ReactPlayer from "react-player";

const API_KEY = import.meta.env.VITE_YOUTUBE_API;



function Course(){
    const {course} = useAuth();
    const PlayerRef = useRef(null);
    const[chapters,setChapters]=useState();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const { id } = useParams();
    const [title, setTitle] = useState("");
    
   
  function handleSeek(timestamp) {
    const player = PlayerRef.current;
    if (player) {
        const seconds = timestamp.split(':').reduce((acc, time) => (60 * acc) + parseInt(time));
        player.seekTo(seconds, 'seconds');
    }
}
    useEffect(() => {   
        const fetchVideoDetails = async () => {
            try {
                setLoading(true);
                setError("");
                const metaData_=course[id];
                setChapters(metaData_);
                const res = await fetch(
                  `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${id}&key=${API_KEY}`
                );
                const data = await res.json();
                if(data.items && data.items.length>0){
                    setTitle(data.items[0].snippet.title);
                }
             
                
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
      
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}
      {!loading && !error && (

        <div className="Chapter-container">
          
          <div className="chapter-section">

          <h4>Chapters</h4>
          {chapters.length > 0 ? (
            <ul>
              {chapters.map((chapter, index) => (
                <li key={index} onClick={() => handleSeek(chapter.timestamp)}>
                  {chapter.timestamp} - {chapter.title} {chapter.completed ? '(Completed)' : ''}
                </li>
              ))}
            </ul>
          ) : (
            <p>No chapters found</p>
          )}
          </div>

          <div className="video-section">

            <div className="video-box">
              <ReactPlayer
                ref={PlayerRef}
                url={`https://www.youtube.com/watch?v=${id}`}
                controls={true}
                width="100%"
                height="100%"
              />
              <h4>{title}</h4>

            </div>

            


          </div>
        </div>
      )}
    </>
    )
}
export default Course;