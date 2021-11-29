import './App.css';
import React, { useEffect, useState } from "react";
import Data from "./config.json"
import ControlPanel from './components/Controlpanel';

function App() {
  const [posterImage1, setPosterImage1] = useState("https://media3.giphy.com/media/KDKEMEQvCFsUpbckhT/200.gif");
  const [posterImage2, setPosterImage2] = useState("https://media3.giphy.com/media/KDKEMEQvCFsUpbckhT/200.gif");
  const [poster1opacity, setPoster1opacity] = useState(1);
  const [poster2opacity, setPoster2opacity] = useState(0);
  const [controlPanelOpacity, setControlPanelOpacity] = useState(1);
  const [startYear, setStartYear] = useState(1970);
  const [endYear, setEndYear] = useState(+(new Date().getFullYear()) + 2);
  const [pageLimit, setPageLimit] = useState(1); //0 = all posible pages
  const [displayMessage, setDisplayMessage] = useState("");
  const [displayMessageTimeout, setDisplayMessageTimeout] = useState(2000);
  


  
  let poster1MovieData = {};
  let poster2MovieData = {};
  let currentPosterMovieData = {};

  
  let showPoster1 = true;
  let togglePosters = true;
  let posterToggleTime = 5000;

  let posterTimer;

  
  function startPosterToggle(){
    console.log('poster toggle');
    clearTimeout(posterTimer);
    posterTimer = setTimeout(() => {
      if (togglePosters){
        togglePoster(); 
        startPosterToggle();
      }
    }, posterToggleTime);
    
  }

  useEffect(() => {
    console.log("Starting...");
    getMovieId();
    startPosterToggle();
  }, []);
    
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
      
      if (togglePosters){
        showDisplayMessage("Pause", 2000);
      }
      else{
        showDisplayMessage("Play", 2000);
        startPosterToggle();
      }
      togglePosters = !togglePosters;
    }
    if (e.key === "g"){
      getMovieId();
    }
    if (e.key === "b"){
      blacklistMovie();
    }
    if (e.key === "m"){
      showControlPanel();
    }
    if (e.key === "t"){
      setPosterToggleTime(10000);
      
    }
  }

  function setTime(){
    setPosterToggleTime(20000);
  }

  function setPosterToggleTime(time) {
    showDisplayMessage(time/1000 + "s", 2000);
    posterToggleTime = time;
    startPosterToggle();
  }

  function getMovieId(){
    console.log("Getting data");
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
        //console.log(url + " index" + index);
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
    showDisplayMessage("Blacklisting: " + currentPosterMovieData["title"], 2000);
  }

  useEffect(() => {
    const time = setTimeout(() => setDisplayMessage(""), displayMessageTimeout);
    return () => clearTimeout(time);
  }, [displayMessage, displayMessageTimeout]);
 
  function showDisplayMessage(message, time){
    setDisplayMessage(message);
    setDisplayMessageTimeout(time);
  }

  function showControlPanel(){
    setControlPanelOpacity(1);
  }

  function getRandInt(min, max) {
    return Math.floor(Math.random() * (+max - +min + 1)) + +min;
  }

  return (
    <div className="App">
      <header className="App-header">
      <h1 className="message_text">{displayMessage}</h1>
      <ControlPanel opacity={controlPanelOpacity}/>
      
        <div className="Poster-Frame">
          <img id="poster1" className="PosterImage" src={posterImage1} style={{opacity: poster1opacity}} alt="poster1"></img>
          <img id="poster2" className="PosterImage" src={posterImage2} style={{opacity: poster2opacity}} alt="poster2"></img>
        </div>
      </header>
    </div>
  );
}


export default App;
