import './App.css';
import React, { useEffect, useState } from "react";
import Data from "./config.json"

function App() {
  const [posterImage1, setPosterImage1] = useState("https://media3.giphy.com/media/KDKEMEQvCFsUpbckhT/200.gif");
  const [posterImage2, setPosterImage2] = useState("https://media3.giphy.com/media/KDKEMEQvCFsUpbckhT/200.gif");
  const [poster1opacity, setPoster1opacity] = useState(1);
  const [poster2opacity, setPoster2opacity] = useState(0);
  const [messageText, setMessageText] = useState("");
  const [startYear, setStartYear] = useState(1970);
  const [endYear, setEndYear] = useState(+(new Date().getFullYear()) + 2);
  const [pageLimit, setPageLimit] = useState(1); //0 = all posible pages


  let poster1MovieData = {};
  let poster2MovieData = {};
  let currentPosterMovieData = {};


  let showPoster1 = true;
  let togglePosters = true;
  let posterToggleTime = 5000;
  

  useEffect(() => {
    function startPosterToggle(){
      const posterTimer = setInterval(() => {
        if (togglePosters){
          togglePoster();
        }
        
      }, posterToggleTime);
      return () => clearInterval(posterTimer);
    }
    startPosterToggle();
    getMovieId();
  }, [])
  
  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
    
  },[])

  function togglePoster() {
    
    setPoster1opacity(+!showPoster1);
    setPoster2opacity(+showPoster1);
    showPoster1 = !showPoster1;
    setTimeout(() => getMovieId(), posterToggleTime/2);
    currentPosterMovieData = showPoster1 ? poster1MovieData : poster2MovieData;
  }


  function handleKeyPress(e) {
    console.log(e);
    if (e.key === " "){
      togglePosters ? displayMessage("Pause", 2000) : displayMessage("Play", 2000);
      togglePosters = !togglePosters;
    }
    if (e.key === "g"){
      getMovieId();
    }
    if (e.key === "b"){
      blacklistMovie();
    }
  }

 

  function getMovieId(){
    let movie_year = getRandInt(startYear, endYear);
    let maxPage = 1;
    let index = 0;
    let url = "https://api.themoviedb.org/3/discover/movie?api_key="
    + Data['themoviedb-apikey'] +
    "&certification_country=US&include_adult=false&certification.gte=PG&primary_release_year="
    + movie_year +
    "&region=US&language=en-US&sort_by=popularity.desc"
    
    
    fetch(url)
      .then(responce => responce.json())
      .then(data => {
        if (pageLimit === 0){
          maxPage = data.total_pages
        }
        else{
          maxPage = Math.min(pageLimit, data.total_pages)
        }
        index = getRandInt(0, Math.min(19, data.total_results-1));
      })
      .then(() => {
        let page = getRandInt(1, maxPage);
        url = url + "&page=" + page;
        console.log(url + " index" + index);
        fetch(url)
          .then(responce => responce.json())
          .then(data => getPosterFromID(data["results"][index]));
      
      });
  }

  function getPosterFromID(movieData){
    let movieId = movieData["id"];
    let url = "https://api.themoviedb.org/3/movie/"
      + movieId + 
      "/images?api_key="
      + Data['themoviedb-apikey']
      + "&language=en";
    let posterImage = "";

    fetch(url)
      .then(responce => responce.json())
      .then(data => {
        let posterIndex = getRandInt(0, data["posters"].length-1);
        //console.log("movie: " + movieId + " num of posters: " + data["posters"].length + " getting: " + posterIndex);
        if (data["posters"].length > 0){
          posterImage = "https://image.tmdb.org/t/p/original/" + data["posters"][posterIndex]["file_path"];
          if (showPoster1)
          {
            setPosterImage2(posterImage);
            poster2MovieData = movieData;
          }
          else{
            setPosterImage1(posterImage);
            poster1MovieData = movieData;
          }
        }
      })
      .catch(error => console.log(error))
  }

  function blacklistMovie(){
    console.log("Blacklist:" + currentPosterMovieData["id"]);
    displayMessage("Blacklisting: " + currentPosterMovieData["title"], 2000);
  }

  
 
  function displayMessage(message, time){
    setMessageText(message);
    setTimeout(() => {setMessageText("")}, time);
  }

  function getRandInt(min, max) {
    return Math.floor(Math.random() * (+max - +min + 1)) + +min;
  };

  

  return (
    <div className="App">
      <header className="App-header">
      <h1 className="message_text">{messageText}</h1>
        <div className="Poster-Frame">
          <img id="poster1" className="PosterImage" src={posterImage1} style={{opacity: poster1opacity}} alt="poster1"></img>
          <img id="poster2" className="PosterImage" src={posterImage2} style={{opacity: poster2opacity}} alt="poster2"></img>
        </div>
      </header>
    </div>
  );
  
}



export default App;
