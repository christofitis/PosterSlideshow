import './App.css';
import React, { useEffect, useState } from "react";
import Data from "./config.json"

function App() {
  const [posterImage1, setPosterImage1] = useState("https://www.themoviedb.org/t/p/original/6FfCtAuVAW8XJjZ7eWeLibRLWTw.jpg");
  const [posterImage2, setPosterImage2] = useState("https://www.themoviedb.org/t/p/original/nx9EtxO7OuOgwmrQdHVgCpBthkw.jpg");
  const [poster1opacity, setPoster1opacity] = useState(1);
  const [poster2opacity, setPoster2opacity] = useState(0);

  let showPoster1 = true;
  let posterToggleTime = 5000;

  useEffect(() => {
    const posterTimer = setInterval(() => {
      TogglePoster();
    }, posterToggleTime);
    return () => clearInterval(posterTimer);
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
  }, []);


  function handleKeyPress(e) {
    console.log(e);
    if (e.key == " "){
      console.log('pause');
    }
  }

  

  function TogglePoster() {
    
    //setPosterImage(GetNewPoster());

    setPoster1opacity(+!showPoster1);
    setPoster2opacity(+showPoster1);

    showPoster1 = !showPoster1;
    console.log(showPoster1);

    setTimeout(() => GetNewPoster(), posterToggleTime/2);
  }
  
  

  return (
    <div className="App">
      <header className="App-header">
        <div className="Poster-Frame">
          <img id="poster1" className="PosterImage" src={posterImage1} style={{opacity: poster1opacity}}></img>
          <img id="poster2" className="PosterImage" src={posterImage2} style={{opacity: poster2opacity}}></img>
        </div>
      </header>
    </div>
  );


function GetNewPoster(){
  let newPoster = "https://www.themoviedb.org/t/p/original/456FcvyTujRwzgoMoKKoheeCOlU.jpg";
  showPoster1 ? setPosterImage2(newPoster) : setPosterImage1(newPoster);
  }
  
}



export default App;
