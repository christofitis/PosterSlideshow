import './App.css';
import React, { useRef, useEffect, useState } from "react";
import Data from "./config.json"
import Blacklist from "./blacklist.json"
import ControlPanel from './components/Controlpanel';

function App() {
  const posterTimer = useRef();
  const displayMessageTimer = useRef();
  const getMovieIdTimer = useRef();
  const ws = useRef(null);
  const [posterImages, setPosterImages] = useState([{"title": "loading1", "poster":"https://media3.giphy.com/media/KDKEMEQvCFsUpbckhT/200.gif"},
                                          {"title": "loading2","poster":"https://c.tenor.com/zR0U2MKElXYAAAAC/paramount-feature-presentation-logo.gif"}]);
  const [posterVisible, setPosterVisible] = useState(0);
  const [startYear, setStartYear] = useState(1977);
  const [endYear, setEndYear] = useState(1977);
  const [controlPanelVisibility, setControlPanelVisibility] = useState(0);
  const [movieInfoVisibility, setMovieInfoVisibility] = useState(0);
  const [posterFrameOpacity, setPosterFrameOpacity] = useState(1);
  const [pageLimit, setPageLimit] = useState(1); //0 = all posible pages
  const [displayMessage, setDisplayMessage] = useState("");
  const [posterToggleTime, setPosterToggleTime] = useState(4000);
  const [displayMessageTimeout, setDisplayMessageTimeout] = useState(2000);
  const [togglePosters, setTogglePosters] = useState(true);
  const [showSpecificMovie, setShowSpecificMovie] = useState(false);
  const [specificMovieId, setSpecificMovieId] = useState(438631);
  const [movieOrTv, setMovieOrTv] = useState("movie");

  const [blacklistIds, setBlacklistIds] = useState([]);
  
  const [posterHistory, setPosterHistory] = useState([]);
  const [posterHistoryIndex, setPosterHistoryIndex] = useState(0);

  const [cyears, setCyears] = useState([]);
  const [cpages, setCpages] = useState([]);
  const [cindexes, setCindexes] = useState([]);


  

  useEffect(() => {
    setBlacklistIds(Blacklist["ids"]);
  },[blacklistIds]);
  
  useEffect(() => {
    if (!controlPanelVisibility){
      window.addEventListener("keydown", handleKeyPress);
    }
    else {
      window.removeEventListener("keydown", handleKeyPress);
    }
    return () => window.removeEventListener("keydown", handleKeyPress);
  },[posterImages, posterVisible, controlPanelVisibility, posterFrameOpacity, posterHistory, posterHistoryIndex])

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
          if (posterHistory.length >= 56){
                  setPosterHistory(prevArray => prevArray.slice(1));
              }
       }
  }, [posterVisible]);

  useEffect(() => {
    setPosterHistoryIndex(posterHistory.length-1);
  }, [posterHistory]);

  useEffect(() => {
    if (!togglePosters){
      let poster = posterHistory[posterHistoryIndex];
      posterVisible ? setPosterImages(oldArray => [oldArray[0], poster]) : setPosterImages(oldArray => [poster, oldArray[1]]);
    }
  }, [posterHistoryIndex]);

  useEffect(() => {
    clearInterval(posterTimer.current);
    posterTimer.current = setInterval(() => {
      if (togglePosters){
        setPosterVisible(prev => (prev+1)%2);
        setTimeout(() => getMovieId(), 2000);
      }
    }, posterToggleTime);
    return () => {clearInterval(posterTimer.current); clearTimeout(getMovieIdTimer.current)};
  }, [posterToggleTime, togglePosters, posterVisible, specificMovieId, showSpecificMovie, posterImages, cyears, cpages, cindexes, pageLimit, startYear, endYear]); 
    
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
    if (e.key === "ArrowLeft"){
      setTogglePosters(false);
      setPosterHistoryIndex(p => Math.max(0, p-1));
    }
    if (e.key === "ArrowRight"){
      setPosterHistoryIndex(p => Math.min(posterHistory.length-1, p+1));
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

  useEffect(() => {
     console.log("Empty Arrays");
       setCyears([]);
       setCpages([]);
       setCindexes([]);
   
  }, [startYear, endYear, pageLimit]);
 

  function getMovieId(){
    let years = cyears;
    let pages = cpages;
    let indexes = cindexes;
      //initialize years array

    if (years.filter(y => y.exhausted === false).length <= 0){
      years = [];
      console.log("Year Initialization");
      for (let y = 0; y <= endYear - startYear; y++) {
          years.push(
              {
              year: startYear + y,
              hasPages: false,
              exhausted: false
              }
          );
      }
      pages = [];
      indexes = [];
  }
    //pick year
    let nonExhaustedYears = years.filter(y => y.exhausted === false);  //make new array of years that have not all been seen (pages and indexes)
    let tempYearInd = Math.floor(Math.random()*nonExhaustedYears.length);
    let tempChosenYear = nonExhaustedYears[tempYearInd].year;
    let chosenYearIndex = years.findIndex(y => y.year === tempChosenYear);
    let movie_year = years[chosenYearIndex].year;

    let maxPage = 1;
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
      "&region=US&language=en-US&sort_by=popularity.desc&without_keywords=210024|12990|233";

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


        if (!years[chosenYearIndex].hasPages) {
          for (let p = 1; p <= maxPage; p++) {
              pages.push(
                  {
                      year: movie_year,
                      page: p,
                      hasIndex: false,
                      exhausted: false
                  }
                  );
              }
          }
      
      years[chosenYearIndex].hasPages = true; //set the year to be flagged that we have gotten the pages for that year
      let tempPages = pages.filter((p) => (p.year === movie_year && p.exhausted === false)); //makes array of pages with chosen year
      let tempPageInd = Math.floor(Math.random()*tempPages.length); //grabs random page from temp array
      let pageInd = pages.findIndex((p) => (p.year === movie_year && p.page === tempPages[tempPageInd].page));
      let page = pages[pageInd].page;
      discoverUrl = discoverUrl + "&page=" + page;
      
      fetch(discoverUrl)
        .then(responce => responce.json())
        .then(data => {
          //index = getRandInt(0, data.results.length-1);

          if (!pages[pageInd].hasIndex){
            for (let i = 0; i <= data.results.length-1; i++){
                indexes.push(
                    {
                        year: movie_year, 
                        page: page,
                        index: i,
                        exhausted: false
                    }
                );
            }
        }
        pages[pageInd].hasIndex = true;
        //pick index from page
        let tempIndexes = indexes.filter((i) => (i.year === movie_year && i.page === page && i.exhausted === false));
        let tempIndexInd = Math.floor(Math.random()*tempIndexes.length); //grabs random page from temp array
        let indexInd = indexes.findIndex((p) => (p.year === movie_year && p.page === page && p.index === tempIndexes[tempIndexInd].index));
        let index = indexes[indexInd].index;
        indexes[indexInd].exhausted = true;
    
        //if all pages in year are exhausted, then mark year as exhausted
        if (indexes.filter(i => (i.year === movie_year && i.page === page && i.exhausted === false)).length <= 0){
            pages[pageInd].exhausted = true;
        }
        if (pages.filter(p => (p.year === movie_year && p.exhausted === false)).length <= 0){
            years[chosenYearIndex].exhausted = true;
        }

        if (blacklistIds.indexOf(Number(data["results"][index]["id"])) === -1){
          getPosterFromID(data["results"][index]);
        }
        else{
          console.log("Blacklist found: " + data["results"][index]["title"]);
        }
      })
        .catch(error => console.error(error));
    });
    }
    setCyears(years);
    setCpages(pages);
    setCindexes(indexes);
    //console.log(years.length + " " + pages.length + " " + indexes.length);
    //console.log(cyears.length + " " + cpages.length + " " + cindexes.length);
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
      setDisplayMessage("Showing " + received_json["title"]);
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
