const mysql = require('mysql2')

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "maghreb"
  });

//! //////////////////////////////////// Maghreb Event //////////////////

function FilterEventFromAirport(RawEventResponse){

  return filteredResponse = RawEventResponse.filter(event => {
    return event.airports.some(airport => {
      return /^(DAAA|DAAD|DAAE|DAAG|DAAJ|DAAK|DAAP|DAAS|DAAT|DAAV|DABB|DABC|DABS|DABT|DAOB|DAOF|DAOI|DAOL|DAON|DAOO|DAOR|DAOV|DAOY|DATG|DATM|DAUA|DAUB|DAUE|DAUG|DAUH|DAUI|DAUK|DAUO|DAUT|DAUU|DAUZ|DTKA|DTMB|DTNH|DTTA|DTTB|DTTF|DTTG|DTTI|DTTJ|DTTX|DTTZ|GMMM|GMAC|GMAD|GMAG|GMAT|GMAZ|GMFB|GMFF|GMFI|GMFK|GMFM|GMFO|GMFZ|GMMA|GMMB|GMMD|GMME|GMMH|GMMI|GMML|GMMN|GMMT|GMMW|GMMX|GMMZ|GMTA|GMTN|GMTT)/.test(airport.icao);
    });
  })

}

function SaveEventsinDB(FilteredeventResponse){
  
  const sql = "INSERT INTO MagEvents (id, name, link, organisers, banner ,description) VALUES (?, ?, ?, ?, ?, ?)";
  
  con.connect(function(err) {

    if (err) {
      throw err;
    }

    FilteredeventResponse.forEach(Event => {
        
      const values = [Event.id, Event.name, Event.link, JSON.stringify(Event.organisers), Event.banner , Event.description];
      

        
        con.query(sql, values, function(err, result) {
          // if (err.errno === 1062) {
          //   console.log("Event Database Duplicate Error");
          // }
          // else{
          //   console.log(err);
          // }
          if(err)
            console.log(err)
          });
 
      })

    });
    
  
}
function ClearDbBeforeArchive(){
  const sql = "DELETE FROM MagEvents";
  
  con.connect(function(err) {

    if (err) {
      throw err;
    }

    con.query(sql, function(err, result) {
      if (err) {
        console.log(`Delete DB Before Archiving Step . Error : ${err}`);
      }
      
      });
 

    });
}

function MaghrebEvent(req, res){

  fetch("https://my.vatsim.net/api/v1/events/all")

  .then(data => {
      if(data.headers.get('content-type').includes('application/json')) { return data.json() } 
      else {
        console.log("Response is not JSON"); 
        res.send("Response is not JSON")
      }
    })//* Check if JSON

  .then( data => {
    const RawEventResponse = data.data;//* store Raw data for use
    const FilteredeventResponse = FilterEventFromAirport(RawEventResponse) //* Filter
    ClearDbBeforeArchive()
    SaveEventsinDB(FilteredeventResponse) //* Archive
    res.send(FilteredeventResponse); //* Send
  })


  .catch(err => console.log(`This is the MaghrebEvent() ; error : ${err}`))

}
  

//! //////////////////////////////// Maghreb Event END//////////////////////



//! //////////////////////////////////// Vatsim Event //////////////////
function VatsimEvent(req, res){

  fetch("https://my.vatsim.net/api/v1/events/all")
  .then(data => data.json())
  .then( data => res.send(data.data))  
  .catch(err => console.log(`This is the VatsimEvent() ; error : ${err}`))

}
//! /////////////////////////////////// Vatsim Event END ///////////////////

function importEventFromDB(req , res){
    
  const sql = "SELECT * FROM MagEvents";
  
  con.connect(function(err) {

    if (err) {
      throw err;
    }

        
    con.query(sql, function(err, result) {

      if (err) {
        throw err
      }

      res.send(result);

      });

  })

    
}

module.exports = {
  MaghrebEvent,
  VatsimEvent,
  importEventFromDB
};