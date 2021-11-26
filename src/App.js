import './App.css';
import React, { useEffect, useState } from "react";

function App() {
  const [posterImage, setPosterImage] = useState("https://www.themoviedb.org/t/p/original/6FfCtAuVAW8XJjZ7eWeLibRLWTw.jpg");
  
  useEffect(() => {
    const posterTimer = setInterval(() => {
      TogglePoster();
    }, 5000);
    return () => clearInterval(posterTimer);
  }, []);

  function TogglePoster() {
    console.log("Toggling Poster");
    setPosterImage("https://www.themoviedb.org/t/p/original/456FcvyTujRwzgoMoKKoheeCOlU.jpg");
    
  };
  
  

  return (
    <div className="App">
      <header className="App-header">
        <div className="Poster-Frame">
        <img className="PosterImage" src={posterImage}></img>

        </div>

        
        
      </header>
    </div>
  );
}



export default App;
