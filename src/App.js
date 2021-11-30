import './App.css';
import React, { useCallback, useEffect, useState } from "react";
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
  const [posterTimer, setPosterTimer] = useState(0);
  const [displayMessageTimer, setDisplayMessageTimer] = useState(0);
  const [posterToggleTime, setPosterToggleTime] = useState(5000);
  const [displayMessageTimeout, setDisplayMessageTimeout] = useState(2000);
  const [togglePosters, setTogglePosters] = useState(true);
  const [getMovieIdTimer, setGetMovieIdTimer] = useState(0);

  let poster1MovieData = {};
  let poster2MovieData = {};
  let currentPosterMovieData = {};
  
  let showPoster1 = true;

  useEffect(() => {
    //console.log("Starting...");
    getMovieId();
  }, []);
  
  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  },[])

  useEffect(() => {
    //console.log(togglePosters);
    if (togglePosters){
      setDisplayMessage("Play");
    }
    else{
      setDisplayMessage("Pause");
    }
  }, [togglePosters]);

  useEffect(() => {
    //console.log('startPosterToggle()');
    clearInterval(posterTimer);
    setPosterTimer(setInterval(() => {
      if (togglePosters){
        //console.log("togglePoster()");
        setPoster1opacity(+!showPoster1);
        setPoster2opacity(+showPoster1);
        showPoster1 = !showPoster1;
        setGetMovieIdTimer(setTimeout(() => getMovieId(), 2000));
        currentPosterMovieData = showPoster1 ? poster1MovieData : poster2MovieData; 
      }
    }, posterToggleTime));
    return () => {clearInterval(posterTimer); clearTimeout(getMovieIdTimer)};
  }, [posterToggleTime, togglePosters]); 
    
  useEffect(() => {
    clearTimeout(displayMessageTimer);
    setDisplayMessageTimer(setTimeout(() => setDisplayMessage(""), displayMessageTimeout))
    return () => clearTimeout(displayMessageTimer);
  }, [displayMessage, displayMessageTimeout]);


  function handleKeyPress(e) {
    if (e.key === " "){
      setTogglePosters(prev => !prev);
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
      changePosterToggleTime(3000);
    }
    if (e.key === "y"){
      changePosterToggleTime(4000);
    }
  }

  function changePosterToggleTime(time){
    
    setPosterToggleTime(time);
    setDisplayMessage(time/1000 + 's');
  }

  function getMovieId(){
    console.log("getMovieId()");
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
        fetch(url)
          .then(responce => responce.json())
          .then(data => getPosterFromID(data["results"][index]));
      });
  }

  function getPosterFromID(movieData){
    //console.log("getPosterFromID(movieData)");
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
    console.log("Blacklist:" + currentPosterMovieData["title"]);
    setDisplayMessage("Blacklisting: " + currentPosterMovieData["title"]);
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
      
      
        <div className="Poster-Frame">
          <ControlPanel />
          <img id="poster1" className="PosterImage" src={posterImage1} style={{opacity: poster1opacity}} alt="poster1"></img>
          <img id="poster2" className="PosterImage" src={posterImage2} style={{opacity: poster2opacity}} alt="poster2"></img>
        </div>
      </header>
    </div>
  );
}


export default App;
