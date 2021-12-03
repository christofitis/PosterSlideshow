import React from 'react';

function ControlPanel(props) {

    const handleToggleTime = (time) => {
        props.setPosterToggleTime(time);
    }

    const handleOpacity = (val) => {
        props.setOpacity(val);
    }

    const handlePosterBrightness = (dir) => {
        props.adjustBrightness(dir);
    }

    const handleYearRangeChange = () => {
        props.setStartYear(Number(document.getElementById("start_year_input").value));
        props.setEndYear(Number(document.getElementById("end_year_input").value));
    }

    const hangleSetPageLimit = () => {
        props.setPageLimit(Number(document.getElementById("page_limit_input").value));
    }



 
    
    return ( 
        
        <div className="controlPanel" >
          
            <button onClick={() => handleOpacity(0)}>Close</button>
            <br/>
            <label>Brightness:</label>
            <input type="button" value="-" onClick={() => handlePosterBrightness("-")}/>
            <input type="button" value="+" onClick={() => handlePosterBrightness("+")}/>
            <br/>
            <label>Slideshow Speed:</label>
            <input type="button" value="5s" onClick={() => handleToggleTime(5000)}/>
            <input type="button" value="10s" onClick={() => handleToggleTime(10000)}/>
            <input type="button" value="20s" onClick={() => handleToggleTime(20000)}/>
            <input type="button" value="50s" onClick={() => handleToggleTime(50000)}/>
            <br/>
            {/* <label>Adjust Screen Size</label>
            <input type="button" value="SMALLER" onClick="scale_poster('Scale UP')"/>
            <input type="button" value="BIGGER" onClick="scale_poster('Scale Down')"/>
            <br/>
            <label>Adjust Screen Size</label>
            <input type="button" value="MOVE RIGHT" onClick="scale_poster('Move Right')"/>
            <input type="button" value="MOVE LEFT" onClick="scale_poster('Move Left')"/>
            <br/>
            <input type="button" value="MOVE UP" onClick="scale_poster('Move Up')"/>
            <br/>
            <input type="button" value="MOVE DOWN" onClick="scale_poster('Move Down')"/>
            <br/> */}
            <label>Year Range</label>
            <input type="number" placeholder={props.startYear} id="start_year_input"/>
            <input type="number" placeholder={props.endYear} id="end_year_input"/>
            <input type="button" value="SET" onClick={() => handleYearRangeChange()}/>
            <br/>
            {/* <label>Must involve (Cast): </label>
            <input type="text" id="actor_input" value="" placeholder="cast member"/>
            
            <input type="button" value="SET" onClick="set_cast_member()"/>
            <br/>
            <label>Keyword: </label>
            <input type="text" id="keyword_input" placeholder="keyword" />
            
            <input type="button" value="SET" onClick="set_keyword()" />

            <br/> */}
            <br/>
            <label>Page Max:</label>
            <input type="number" placeholder={props.pageLimit} id="page_limit_input"/>
            <input type="button" value="SET" onClick={() => hangleSetPageLimit()}/>
            <br/>
            {/* <label>MOVIE ID:</label>
            <input type="text" id="specific_movie_id"/>
            <input type="button" value="SET ID" onClick="set_movie_id()"/>
            <br/>
            <input type="button" value="Star Wars" onClick="set_starwars()"/>
            <input type="button" value="Indiana Jones" onClick="set_indianajones()"/>
        <br/> */}
            <input type="button" value="Show Random Posters" onClick="clear_cast_member(); clear_keyword();"/>
            <br/>
            <input type="button" value="US Only" onClick="setAllPosters(false)"/>
            <input type="button" value="AllPosters On" onClick="setAllPosters(true)"/>
        </div>
    )
    
}

export default ControlPanel;