import './App.css';
import React, { useRef, useEffect, useState } from "react";
import Data from "./config.json"
import ControlPanel from './components/Controlpanel';

function App() {
  const posterTimer = useRef();
  const displayMessageTimer = useRef();
  const getMovieIdTimer = useRef();
  const ws = useRef(null);
  const [posterImages, setPosterImages] = useState([{"title": "loading1", "poster":"https://media3.giphy.com/media/KDKEMEQvCFsUpbckhT/200.gif"},
                                          {"title": "loading2","poster":"https://c.tenor.com/zR0U2MKElXYAAAAC/paramount-feature-presentation-logo.gif"}]);
  const [posterVisible, setPosterVisible] = useState(0);
  const [startYear, setStartYear] = useState(1960);
  const [endYear, setEndYear] = useState(+(new Date().getFullYear()) + 2);
  const [controlPanelVisibility, setControlPanelVisibility] = useState(0);
  const [movieInfoVisibility, setMovieInfoVisibility] = useState(0);
  const [posterFrameOpacity, setPosterFrameOpacity] = useState(1);
  const [pageLimit, setPageLimit] = useState(1); //0 = all posible pages
  const [displayMessage, setDisplayMessage] = useState("");
  const [posterToggleTime, setPosterToggleTime] = useState(5000);
  const [displayMessageTimeout, setDisplayMessageTimeout] = useState(2000);
  const [togglePosters, setTogglePosters] = useState(true);
  const [showSpecificMovie, setShowSpecificMovie] = useState(false);
  const [specificMovieId, setSpecificMovieId] = useState(438631);
  const [movieOrTv, setMovieOrTv] = useState("movie");
  
  const [posterHistory, setPosterHistory] = useState([]);



  useEffect(() => {
    if (!controlPanelVisibility){
      window.addEventListener("keydown", handleKeyPress);
    }
    else {
      window.removeEventListener("keydown", handleKeyPress);
    }
    return () => window.removeEventListener("keydown", handleKeyPress);
  },[posterImages, posterVisible, controlPanelVisibility, posterFrameOpacity, posterHistory])

  useEffect(() => {
    if (togglePosters){
      setDisplayMessage("Play");
      
    }
    else{
      setDisplayMessage("Pause");
    }
  }, [togglePosters]);

  useEffect(() => {
        if (posterHistory.some(p => p.poster === posterImages[posterVisible].poster))
        {
          console.log("duplicate found")
        }
        else{
          setPosterHistory(prevArray => [...prevArray, posterImages[posterVisible]]);
          if (posterHistory.length >= 5){
                  setPosterHistory(prevArray => prevArray.slice(1));
              }
        }
      
     
  }, [posterVisible]);

  useEffect(() => {
    clearInterval(posterTimer.current);
    posterTimer.current = setInterval(() => {
      if (togglePosters){
        setPosterVisible(prev => (prev+1)%2);
       
        setTimeout(() => getMovieId(), 2000);
      }
    }, posterToggleTime);
    return () => {clearInterval(posterTimer.current); clearTimeout(getMovieIdTimer.current)};
  }, [posterToggleTime, togglePosters, posterVisible, specificMovieId, showSpecificMovie, posterImages]); 
    
  useEffect(() => {
    clearTimeout(displayMessageTimer.current);
    displayMessageTimer.current = setTimeout(() => setDisplayMessage(""), displayMessageTimeout);
    return () => clearTimeout(displayMessageTimer.current);
  }, [displayMessage, displayMessageTimeout, posterFrameOpacity]);

  function handleKeyPress(e) {
    //console.log(e);
    if (e.key === " "){
      setTogglePosters(prev => !prev);
    }
    if (e.key === "i"){
      setMovieInfoVisibility(prev => !prev);
    }
    if (e.key === "b"){
      setDisplayMessage("Blacklisting: " + posterImages[posterVisible]["title"]);
    }
    if (e.key === "m"){
      if (!controlPanelVisibility){
        setControlPanelVisibility(1);
      }
    }
    if (e.key === "-"){
      adjustBrightness("-");
    }
    if (e.key === "="){
      adjustBrightness("+");
    }
    if (e.key === "h"){
      console.log(posterHistory);
    }
    if (e.key === "ArrowLeft"){
      setTogglePosters(false);
      let index = Math.max(0, posterHistory.indexOf(posterImages[posterVisible])-1);
      showSpecificPoster(posterHistory[index]);
    }
    if (e.key === "ArrowRight"){
      let index = Math.min(posterHistory.length-1, posterHistory.indexOf(posterImages[posterVisible])+1);
      showSpecificPoster(posterHistory[index]);

    }
  }

  function changePosterToggleTime(time){
    setPosterToggleTime(Math.max(5000,time));
    setDisplayMessage(Math.max(5000,time)/1000 + 's');
  }

  function adjustBrightness(direction){
    if (direction === "+"){
      setPosterFrameOpacity(prev => parseFloat(Math.min(prev+0.1, 1).toFixed(1)));
      setDisplayMessage(posterFrameOpacity.toFixed(1));
    }
    if (direction === "-"){
      setPosterFrameOpacity(prev => parseFloat(Math.max(prev-0.1, 0).toFixed(1)));
      setDisplayMessage(posterFrameOpacity.toFixed(1));
    }
  }

  function getMovieId(){
    //console.log("getMovieId()");
    let movie_year = getRandInt(startYear, endYear); //add if year over current, remove rating
    let maxPage = 1;
    let index = 0;
    let cert = movie_year > new Date().getFullYear() ? "" : "&certification.gte=PG";
    
    if (showSpecificMovie){
      //get data from movie id
      let movielist = specificMovieId.split(",");
      let movie_id = movielist[Math.floor(Math.random() * movielist.length)];
      let specificUrl = "https://api.themoviedb.org/3/"
      + movieOrTv + "/"
      + movie_id + 
      "?api_key="
      + Data['themoviedb-apikey']
      + "&language=en";
      fetch(specificUrl)
      .then(responce => responce.json())
      .then(data => getPosterFromID(data))
      .catch(error => console.error(error));
    }
    else {
      let discoverUrl = "https://api.themoviedb.org/3/discover/movie?api_key="
      + Data['themoviedb-apikey'] +
      "&certification_country=US&include_adult=false"
      + cert +
      "&primary_release_year="
      + movie_year +
      "&region=US&language=en-US&sort_by=popularity.desc";

    fetch(discoverUrl)
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
        discoverUrl = discoverUrl + "&page=" + page;
        
        fetch(discoverUrl)
          .then(responce => responce.json())
          .then(data => {
          index = getRandInt(0, data.results.length-1);
          getPosterFromID(data["results"][index]);
        })
          .catch(error => console.error(error));
      });
    }
  }

  function getPosterFromID(movieData){
    let movieId = movieData["id"];
    let url = "https://api.themoviedb.org/3/"
    + movieOrTv + "/"
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
          let title = movieOrTv === "movie" ? movieData["title"] : movieData["name"];
          let movie = {"id": movieId, "title": title, "release_date": movieData["release_date"], "poster": posterImage};
          posterVisible ? setPosterImages(oldArray => [oldArray[0], movie]) :
            setPosterImages(oldArray => [movie, oldArray[1]]);
          
        }
      })
      .catch(error => console.error(error))
      
  }

  function showSpecificPoster(poster){
    //console.log(poster);
    posterVisible ? setPosterImages(oldArray => [oldArray[0], poster]) : setPosterImages(oldArray => [poster, oldArray[1]]);
            
            //setPosterVisible(prev => (prev+1)%2);
  }

  function getRandInt(min, max) {
    return Math.floor(Math.random() * (+max - +min + 1)) + +min;
  }

//******************WEBSOCKET******************** */
useEffect(() => {
  ws.current = new WebSocket('ws://' + Data["websocket_server"]);
  ws.current.onopen = () => {console.log('connected');}
  return () => ws.current.close();
}, []);

useEffect(() => {
  if (!ws.current) return;

  ws.current.onmessage = (event) => {
    let received_json = JSON.parse(event.data);
    if (received_json["movieids"]){
    if (received_json["show_type"] === "movie"){setMovieOrTv("movie")}
    if (received_json["show_type"] === "tv") {setMovieOrTv("tv")}
    if (received_json["movieids"] === "random"){
      setShowSpecificMovie(false);
      setDisplayMessage("Showing random posters");
    }
    else {
      setShowSpecificMovie(true);
      setSpecificMovieId(received_json["movieids"]);
      setDisplayMessage("Showing specific movie posters");
    }}

    if (received_json["brightness"] === "brighter"){
      adjustBrightness("+");
    }
    else if (received_json["brightness"] === "darker"){
      adjustBrightness("-");
    }

    if (received_json["interval"] > 2000){
      changePosterToggleTime(received_json["interval"]);
    }
  }
}, [displayMessage, posterToggleTime]);
//************************************************* */

  return (
    <div className="App">
      <header className="App-header">
      <h1 className="message_text">{displayMessage}</h1>
      {movieInfoVisibility ? 
        <div className="movieInfo">
          <h3>{posterImages[posterVisible]["title"]}</h3>
          <h3>{posterImages[posterVisible]["release_date"]}</h3>
        </div> 
        : null
      }
      {controlPanelVisibility ? 
        <ControlPanel 
          setPosterToggleTime={changePosterToggleTime} 
          setOpacity={setControlPanelVisibility}
          adjustBrightness={adjustBrightness}
          startYear={startYear}
          endYear={endYear}
          setStartYear={setStartYear}
          setEndYear={setEndYear}
          pageLimit={pageLimit}
          setPageLimit={setPageLimit}/>
        : null
      }
        <div className="Poster-Frame" style={{opacity: posterFrameOpacity}}>
          {posterImages.map((image, i) => {
            return (
              <img
                key={`poster${i}`}
                id={`poster${i}`}
                className="PosterImage"
                src={image["poster"]}
                style={{ opacity: Number(posterVisible === i) }}
                alt={`poster${i}`}
              />
            );
          })}
        </div>
      </header>
    </div>
  );
}


export default App;
