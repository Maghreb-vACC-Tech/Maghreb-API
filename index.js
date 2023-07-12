const express = require('express')

var app = express();


// This responds with "Hello World" on the homepage

// This responds a POST request for the homepage

// AtcActivity
  app.get('/AtcActivity', function (req, res) {

      let previousCallsigns = [];


        try {

          fetch('https://data.vatsim.net/v3/vatsim-data.json', { timeout: 5000 }) // fetch data from vatsim api
            .then(data => data.json())
            .then(response => {

              
              if (response.controllers)// Check if response.controllers exist to execute code   
              {

                // Filter the positions according to the airport list
                const filteredResponse = response.controllers.filter(item =>
                  /^(DAAA|DAAD|DAAE|DAAG|DAAJ|DAAK|DAAP|DAAS|DAAT|DAAV|DABB|DABC|DABS|DABT|DAOB|DAOF|DAOI|DAOL|DAON|DAOO|DAOR|DAOV|DAOY|DATG|DATM|DAUA|DAUB|DAUE|DAUG|DAUH|DAUI|DAUK|DAUO|DAUT|DAUU|DAUZ|DTTC|DTKA|DTMB|DTNH|DTTA|DTTB|DTTF|DTTG|DTTI|DTTJ|DTTX|DTTZ|GMMM|GMAC|GMAD|GMAG|GMAT|GMAZ|GMFB|GMFF|GMFI|GMFK|GMFM|GMFO|GMFZ|GMMA|GMMB|GMMD|GMME|GMMH|GMMI|GMML|GMMN|GMMT|GMMW|GMMX|GMMZ|GMTA|GMTN|GMTT)/.test(item.callsign)
                )

                // Map the Api response to the currentcallsign object 
                const currentCallsigns = filteredResponse.map(item => ({
                  callsigned: item.callsign,
                  cid: item.cid,
                  time: item.logon_time,
                  frequency: item.frequency,
                  user: item.name
                }));
      
                const onlineCallsigns = currentCallsigns.filter(
                  current => !previousCallsigns.some(
                    prev => prev.callsigned === current.callsigned && prev.cid === current.cid)
                    );
                if (onlineCallsigns != "" ){
                  res.send(onlineCallsigns)
                }
                else{
                  res.send("No controllers")
                }

                    
              }
            })
            .catch(error => {
              console.error(error);
            });
        } catch (error) {
          console.error(error);
        }


  })

// metarLookup
  app.get('/metarLookup/:airport', async function (req, res) {

    const airport = req.params.airport
    const url = `https://api.checkwx.com/metar/${airport}/decoded`;
    const apiKey = process.env.WX_API;

    const response = await fetch(url, {
      headers: {
        'X-API-Key': apiKey
      }
    });

    let data;
    try {
      data = await response.json();
    } catch (e) {
      // Handle JSON parsing errors here
      console.log('Error: could not parse JSON response:', e.message);
      return;
    }

    if (!data || !data.data || data.data.length === 0) {
      // Handle the error here
      console.log('Error: no METAR data found');
      return;
    }

    const airportName = data.data[0].station.name;
    const metar = data.data[0].raw_text;

    const d = new Date();
    const hour = d.getUTCHours().toString().padStart(2, '0');
    const minutes = d.getUTCMinutes().toString().padStart(2, '0');

    res.send(`METAR for ${airportName} (${airport}) at ${hour}:${minutes} UTC:\n${metar}`);
  });

// Lookup CID
  app.get('/LookupCid/:cid', function (req, res) {
    
      const cid = req.params.cid;

      fetch(`https://api.vatsim.net/api/ratings/${cid}`)
      .then(response => response.json()) 
      .then(response =>{
        res.send(response)
      })
    
  })

// Events Picker
  app.get('/VatmenaEvents' , function ( req , res ) // Vatmena
  {
    

    fetch("https://my.vatsim.net/api/v1/events/all")
    .then( response => response.json())
    .then( response => {

      const EventArray = response.data
      let EventResponse = []

      for( let i = 0 ; i <= EventArray.length ; i++ ){
        try {
          if (EventArray[i].organisers[0].division == "MENA"){
            EventResponse.push(EventArray[i])
          }
        } catch (error) {
          
        }

      }
      

      res.send(EventResponse)
    })

  })

  app.get('/MaghrebEvents' , function ( req , res ) {

    fetch("https://my.vatsim.net/api/v1/events/all")
    .then( response => response.json())
    .then( response => {
      
      
      const EventArray = response.data
      let EventResponse = []

      for( let i = 0 ; i <= EventArray.length ; i++ ){
        try {
          if (EventArray[i].organisers[0].division == "MENA" ){
            EventResponse.push(EventArray[i])
          }
        } catch (error) {
          
        }

      }
      

      res.send(EventResponse)
    })

    })

    

// Membership solution is to use the /LookupCid/:cid endpoint and fetch 
// users from the first one to the last one and check if there subdivision is MAG 



var server = app.listen(1000, function () {

   var host = server.address().address
   var port = server.address().port
   
   console.log("Example app listening at http://%s:%s", host, port)
})