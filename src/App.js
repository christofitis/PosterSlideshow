import './App.css';
import React, { useEffect, useState } from "react";
import Data from "./config.json"

function App() {
  const [posterImage1, setPosterImage1] = useState("https://www.themoviedb.org/t/p/original/6FfCtAuVAW8XJjZ7eWeLibRLWTw.jpg");
  const [posterImage2, setPosterImage2] = useState("https://www.themoviedb.org/t/p/original/nx9EtxO7OuOgwmrQdHVgCpBthkw.jpg");
  const [poster1opacity, setPoster1opacity] = useState(1);
  const [poster2opacity, setPoster2opacity] = useState(0);
  const [messageText, setMessageText] = useState("");
  const [startYear, setStartYear] = useState(1970);
  const [endYear, setEndYear] = useState(new Date().getFullYear + 2);
  const [pageLimit, setPageLimit] = useState(1);


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
    //showPoster1 ? console.log("Showing Poster 1") : console.log("Showing Poster 2");
  }


  function handleKeyPress(e) {
    console.log(e);
    if (e.key === " "){
      displayMessage("Pause", 2000);
      togglePosters = !togglePosters;
    }
    if (e.key === "g"){
      getMovieId();
    }
  }

  function displayMessage(message, time){
    setMessageText(message);
    setTimeout(() => {setMessageText("")}, time)
  }

  function getMovieId(){
    console.log("Getting new poster");
    //let movie_year = getRandInt(startYear, endYear);
    let movie_year = 2021;
    let maxPage = 1;
    let index = getRandInt(0, 19); //each page has 20 results
    //console.log("getting movie id");
    let url = "https://api.themoviedb.org/3/discover/movie?api_key="
    + Data['themoviedb-apikey'] +
    "&certification_country=US&include_adult=false&certification.gte=PG13&primary_release_year="
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
      })
      .then(() => {
        let page = getRandInt(1, maxPage);
        //console.log("Page: " + page)
        url = url + "&page=" + page;

        fetch(url)
          .then(responce => responce.json())
          .then(data => getPosterFromID(data["results"][index]["id"]));
      
      });
  }

  function getPosterFromID(movieId){
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
        console.log("movie: " + movieId + " num of posters: " + data["posters"].length + " getting: " + posterIndex);
        if (data["posters"].length > 0){
          posterImage = "https://image.tmdb.org/t/p/original/" + data["posters"][posterIndex]["file_path"];
          showPoster1 ? setPosterImage2(posterImage) : setPosterImage1(posterImage);
        }
      })
      .catch(error => console.log(error))
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


// function GetNewPoster(){
//   let newPoster = "https://www.themoviedb.org/t/p/original/456FcvyTujRwzgoMoKKoheeCOlU.jpg";
//   //showPoster1 ? setPosterImage2(newPoster) : setPosterImage1(newPoster);
//   }
  
}



export default App;
