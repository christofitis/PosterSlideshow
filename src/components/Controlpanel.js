import React, { useState } from 'react';

function ControlPanel(props) {
   
    


    const handleToggleTime = (time) => {
        props.setPosterToggleTime(time);
    }

    const handleOpacity = (val) => {
        props.setOpacity(val);
    }



 
    
    return ( 
        
        <div className="controlPanel" >
          
            <button onClick={() => handleOpacity(0)}>X</button>
            <label>Brightness:</label>
            <input type="button" value="-" onClick="change_brightness('-');"/>
            <input type="button" value="+" onClick="change_brightness('+');"/>
            <br/>
            <label>Slideshow Speed:</label>
            <input type="button" value="5s" onClick={() => handleToggleTime(5000)}/>
            <input type="button" value="10s" onClick={() => handleToggleTime(10000)}/>
            <input type="button" value="20s" onClick={() => handleToggleTime(20000)}/>
            <input type="button" value="50s" onClick={() => handleToggleTime(50000)}/>
            <br/>
            <label>Adjust Screen Size</label>
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
            <br/>
            <label>Year Range</label>
            <input type="number" id="start_year_input"/>
            <input type="number" id="end_year_input"/>
            <input type="button" value="SET" onClick={() => console.log("YEAR")}/>
            <br/>
            <label>Must involve (Cast): </label>
            <input type="text" id="actor_input" value="" placeholder="cast member"/>
            
            <input type="button" value="SET" onClick="set_cast_member()"/>
            <br/>
            <label>Keyword: </label>
            <input type="text" id="keyword_input" placeholder="keyword" />
            
            <input type="button" value="SET" onClick="set_keyword()" />

            <br/>
            <input type="button" value="RANDOM" onClick="clear_cast_member(); clear_keyword();"/>
            <br/>
            <label>Page Max:</label>
            <input type="number" id="page_max_num"/>
            <input type="button" value="SET" onClick="set_page_max_num()"/>
            <br/>
            <label>MOVIE ID:</label>
            <input type="text" id="specific_movie_id"/>
            <input type="button" value="SET ID" onClick="set_movie_id()"/>
            <br/>
            <input type="button" value="Star Wars" onClick="set_starwars()"/>
            <input type="button" value="Indiana Jones" onClick="set_indianajones()"/>
            <br/>
            <input type="button" value="AllPosters On" onClick="setAllPosters(true)"/>
            <input type="button" value="AllPosters Off" onClick="setAllPosters(false)"/>
        </div>
    )
    
}

export default ControlPanel;