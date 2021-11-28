function ControlPanel(props) {
    return (
        <div className="controlPanel" style={{opacity: props.opacity}}>
          <button onclick="" >X</button>
          <label>Brightness:</label>
          <input type="button" value="-" onclick="change_brightness('-');"/>
          <input type="button" value="+" onclick="change_brightness('+');"/>
          <br/>
          <label>Slideshow Speed:</label>
          <input type="button" value="5s" onclick="set_fade_speed(5000);"/>
          <input type="button" value="10s" onclick="set_fade_speed(10000);"/>
          <input type="button" value="20s" onclick="set_fade_speed(20000);"/>
          <input type="button" value="50s" onclick="set_fade_speed(50000);"/>
          <br/>
          <label>Adjust Screen Size</label>
          <input type="button" value="SMALLER" onclick="scale_poster('Scale UP')"/>
          <input type="button" value="BIGGER" onclick="scale_poster('Scale Down')"/>
          <br/>
          <label>Adjust Screen Size</label>
          <input type="button" value="MOVE RIGHT" onclick="scale_poster('Move Right')"/>
          <input type="button" value="MOVE LEFT" onclick="scale_poster('Move Left')"/>
          <br/>
          <input type="button" value="MOVE UP" onclick="scale_poster('Move Up')"/>
          <br/>
          <input type="button" value="MOVE DOWN" onclick="scale_poster('Move Down')"/>
          <br/>
         <label>Year Range</label>
         <input type="number" id="start_year_input"/>
         <input type="number" id="end_year_input"/>
         <input type="button" value="SET" onclick="set_year()"/>
         <br/>
         <label>Must involve (Cast): </label>
         <input type="text" id="actor_input" value="" placeholder="cast member"/>
         
         <input type="button" value="SET" onclick="set_cast_member()"/>
         <br/>
         <label>Keyword: </label>
         <input type="text" id="keyword_input" value="" placeholder="keyword" />
         
         <input type="button" value="SET" onclick="set_keyword()" />

         <br/>
         <input type="button" value="RANDOM" onclick="clear_cast_member(); clear_keyword();"/>
        <br/>
        <label>Page Max:</label>
        <input type="number" id="page_max_num"/>
        <input type="button" value="SET" onclick="set_page_max_num()"/>
        <br/>
        <label>MOVIE ID:</label>
        <input type="text" id="specific_movie_id"/>
        <input type="button" value="SET ID" onclick="set_movie_id()"/>
        <br/>
        <input type="button" value="Star Wars" onclick="set_starwars()"/>
        <input type="button" value="Indiana Jones" onclick="set_indianajones()"/>
        <br/>
        <input type="button" value="AllPosters On" onclick="setAllPosters(true)"/>
        <input type="button" value="AllPosters Off" onclick="setAllPosters(false)"/>
        </div>
    );
}

export default ControlPanel;