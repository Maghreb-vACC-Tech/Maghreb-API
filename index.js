const express = require('express')

var app = express();

// This responds with "Hello World" on the homepage

// This responds a POST request for the homepage

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
              
              if (onlineCallsigns.lenght == 0){
                console.log(onlineCallsigns)
                res.send(onlineCallsigns)

              }
              else{
              res.send("No Callsign Found")
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

app.get('/LookupCid/:cid', function (req, res) {
  
    const cid = req.params.cid;

    fetch(`https://api.vatsim.net/api/ratings/${cid}`)
    .then(response => response.json()) 
    .then(response =>{
      res.send(response)
    })
  
})

// Membership solution is to use the /LookupCid/:cid endpoint and fetch 
// users from the first one to the last one and check if there subdivision is MAG 




var server = app.listen(8081, function () {

   var host = server.address().address
   var port = server.address().port
   
   console.log("Example app listening at http://%s:%s", host, port)
})