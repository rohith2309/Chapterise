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
    
   
  //chat requirements
  const [chatMessages, setChatMessages] = useState([]);
  const [userMessage, setUserMessage] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const wsRef = useRef(null)

  function handleSeek(timestamp) {
    const player = PlayerRef.current;
    if (player) {
        const seconds = timestamp.split(':').reduce((acc, time) => (60 * acc) + parseInt(time));
        player.seekTo(seconds, 'seconds');
        
    }
  }
  function Setup(){
    const player = PlayerRef.current;
    if (player) {
        player.seekTo(0, 'seconds');
        player.play(false);
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
    

   //chat logic

   // Initialize WebSocket connection when chat is opened
  useEffect(() => {
    if (!isChatOpen) return;

    // Create WebSocket connection
     const backendBase = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
    const wsProtocol = backendBase.startsWith("https") ? "wss" : "ws";
    const wsUrl = `${wsProtocol}://${backendBase.replace(/^https?:\/\//, "")}/ws/chat/${id}`;
    wsRef.current = new WebSocket(wsUrl);

  
    wsRef.current.onmessage = (event) => {
      const message = JSON.parse(event.data)
      
      setChatMessages((prev) => [...prev, { sender: "Fabi", text: message["message"] }]);
    };

  
    wsRef.current.onerror = (error) => {
      console.error("WebSocket error:", error);
      setChatMessages((prev) => [...prev, { sender: "System", text: "Error connecting to chat." }]);
    };


    wsRef.current.onclose = () => {
      console.log("WebSocket connection closed");
      setChatMessages((prev) => [...prev, { sender: "System", text: "Chat session ended." }]);
    };

    
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
        setChatMessages([]);

      }
    };
  }, [isChatOpen, id]);

  // Handle sending a message
  const sendMessage = () => {
    if (!userMessage.trim()) return;
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      setChatMessages((prev) => [...prev, { sender: "System", text: "Chat is not connected." }]);
      return;
    }

    // Send the user's message
    wsRef.current.send(userMessage);
    setChatMessages((prev) => [...prev, { sender: "User", text: userMessage }]);
    setUserMessage("");
  };
    

    return (
        <>
            {loading && <p>Loading...</p>}
            {error && <p style={{ color: "red" }}>Error: {error}</p>}
            {!loading && !error && (
                <>
                    <div className="Chapter-container">
                        <div className="video-section">
                            <h3>{title}</h3>
                            <div className="video-box">
                                <ReactPlayer
                                    ref={PlayerRef}
                                    onReady={Setup}
                                    playing={true}
                                    url={`https://www.youtube.com/watch?v=${id}`}
                                    controls={true}
                                    width="100%"
                                    height="100%"
                                />
                            </div>
                        </div>
                        <div className="chapter-section">
                            <h4>Chapters</h4>
                            {chapters && chapters.length > 0 ? (
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
                        {/* Chat Bubble */}
                        <div className="chat-bubble" onClick={() => setIsChatOpen(!isChatOpen)}>
                            💬
                        </div>
                        {/* Chat Pop-up */}
                        {isChatOpen && (
                            <div className="chat-popup">
                                <div className="chat-header" onClick={() => setIsChatOpen(false)}>
                                    Chat <span style={{ float: "right", cursor: "pointer" }}>✖</span>
                                </div>
                                <div className="chat-messages">
                                    {chatMessages.map((msg, index) => (
                                        <div key={index} className={`chat-message ${msg.sender.toLowerCase()}`}>
                                            <strong>{msg.sender}: </strong>{msg.text}
                                        </div>
                                    ))}
                                </div>
                                <div className="chat-input">
                                    <input
                                        type="text"
                                        value={userMessage}
                                        onChange={(e) => setUserMessage(e.target.value)}
                                        placeholder="Ask a question about the video..."
                                        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                                    />
                                    <button onClick={sendMessage}>Send</button>
                                </div>
                            </div>
                        )}
                    </div>
                </>
            )}
        </>
    )
}
export default Course;