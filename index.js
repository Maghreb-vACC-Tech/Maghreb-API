const express = require('express')
const cors = require('cors');
const bodyParser = require('body-parser');

var app = express();

// Configure body-parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Configure CORS
app.use(cors());
app.use(cors({origin: '*'}));
// This responds with "Hello World" on the homepage

// This responds a POST request for the homepage

// GetStats
app.post('/stats', (req, res) => {
  const CID = req.body;

  const response = {
    atc: 0,
    pilot: 0
  };
  fetch(`https://api.vatsim.net/v2/members/${CID.cid}/stats`)
    .then(response => response.json())
    .then(data => {
      response.atc = data.atc;  
      response.pilot = data.pilot;

      res.json(response);
    })
    .catch(error => {
      console.error("Error:", error);
      res.status(500).json(response);
    });

});
app.post('/LastFlightTime' , (req , res) => {
  
  const response = {
    start: 0,
    end: 0
  };

  const CID = req.body;
  fetch(`https://api.vatsim.net/v2/members/${CID.cid}/history`)
    .then(data => data.json())
    .then(data => 
      {
        
      response.start = data.items[0].start;  
      response.end = data.items[0].end;

      res.json(response)

      })

  })
app.post('/ATC' , ( req , res ) => {
  // https://api.vatsim.net/v2/members/1674212/stats
  
  // const response = {
  //   start: 0,
  //   end: 0
  // };

  const CID = req.body;
  fetch(`https://api.vatsim.net/v2/members/${CID.cid}/atc`)
    .then(data => data.json())
    .then(data => res.json(data))

  })



// OAuth2.0
app.get('/authcode' , (req , res) => {
  
  console.log("------------------------------------------------------");

  let accessToken = '';

  // GET AUTHORIZATION CODE
  const code = req.query.code;
  console.log("code :", code);
  let data = {
    "grant_type": "authorization_code",
    "client_id": 619,
    "client_secret": "ZK9lA32BOoEq4BxpYCjtHrnz0KM9MwOetHWbRtxE",
    "redirect_uri": "http://localhost:1000/authcode",
    code,
  };
  console.log("------------------------------------------------------");




  // GET TOKEN
  fetch('https://auth-dev.vatsim.net/oauth/token', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
    .then(res => res.json())
    .then(tokenData => {
      accessToken = tokenData.access_token.toString();
      console.log("Token Data : " , tokenData);





    // FETCH DATA
    return fetch('https://auth-dev.vatsim.net/api/user', {
      method: 'GET',
      headers: {
        'Authorization':`Bearer ${accessToken}`,
        'Accept':'application/json'
      },
    });
    })

    .then(res => res.json())

    .then(userData => {
      // Use user data
      console.log(userData)
      let Data = JSON.stringify(userData)
      const encodedData = encodeURIComponent(JSON.stringify(Data));
      res.redirect(`http://localhost:3000/extractor?data=${encodedData}`);
    })

    .catch(error => {
      // Handle any errors
      console.error(error);
      res.status(500).send('Internal Server Error');
    });
  })

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
                   /^(DAAA|DAAD|DAAE|DAAG|DAAJ|DAAK|DAAP|DAAS|DAAT|DAAV|DABB|DABC|DABS|DABT|DAOB|DAOF|DAOI|DAOL|DAON|DAOO|DAOR|DAOV|DAOY|DATG|DATM|DAUA|DAUB|DAUE|DAUG|DAUH|DAUI|DAUK|DAUO|DAUT|DAUU|DAUZ|DTKA|DTMB|DTNH|DTTA|DTTB|DTTF|DTTG|DTTI|DTTJ|DTTX|DTTZ|GMMM|GMAC|GMAD|GMAG|GMAT|GMAZ|GMFB|GMFF|GMFI|GMFK|GMFM|GMFO|GMFZ|GMMA|GMMB|GMMD|GMME|GMMH|GMMI|GMML|GMMN|GMMT|GMMW|GMMX|GMMZ|GMTA|GMTN|GMTT)/.test(item.callsign)

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
                    prev => prev.callsigned === current.callsigned && prev.cid === current.cid
                    )
                  );

                if (onlineCallsigns != "" ){
                  res.send(onlineCallsigns)
                }
                
                else{
                  let nores =["No controllers"]
                  res.send(nores)
                }

                    
              }
            })
            .catch(error => {
              console.error(error);
            });
        } catch (error) {
            setInterval(() => {
              fetch('https://data.vatsim.net/v3/vatsim-data.json', { timeout: 5000 }) // fetch data from vatsim api
              .then(data => data.json())
              .then(response => {

                
                if (response.controllers)// Check if response.controllers exist to execute code   
                {

                  // Filter the positions according to the airport list
                  const filteredResponse = response.controllers.filter(item =>
                    /^(DAAA|DAAD|DAAE|DAAG|DAAJ|DAAK|DAAP|DAAS|DAAT|DAAV|DABB|DABC|DABS|DABT|DAOB|DAOF|DAOI|DAOL|DAON|DAOO|DAOR|DAOV|DAOY|DATG|DATM|DAUA|DAUB|DAUE|DAUG|DAUH|DAUI|DAUK|DAUO|DAUT|DAUU|DAUZ|DTKA|DTMB|DTNH|DTTA|DTTB|DTTF|DTTG|DTTI|DTTJ|DTTX|DTTZ|GMMM|GMAC|GMAD|GMAG|GMAT|GMAZ|GMFB|GMFF|GMFI|GMFK|GMFM|GMFO|GMFZ|GMMA|GMMB|GMMD|GMME|GMMH|GMMI|GMML|GMMN|GMMT|GMMW|GMMX|GMMZ|GMTA|GMTN|GMTT)/.test(item.callsign)
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
            }, 10000);
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
    
    
    fetch('https://my.vatsim.net/api/v1/events/all')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      const eventArray = data.data;
      const eventResponse = [];

      for (let i = 0; i < eventArray.length; i++) {
        try {
          if (eventArray[i].organisers[0].division === 'MENA') {
            eventResponse.push(eventArray[i]);
          }
        } catch (error) {
          // Handle error if the necessary property is missing in the event object
        }
      }

      console.log(eventResponse);
    })
    .catch(error => {
      console.error('Error:', error);
    });
 

  })

  app.get('/MaghrebEvents', function (req, res) {



    fetch("https://my.vatsim.net/api/v1/events/all")
    .then(data => {
      if(data.headers.get('content-type').includes('application/json')) {
        return data.json();
      } else {
        // throw new Error("Response is not JSON"); 
      }
    })
      .then( data => {
        const eventArray = data.data;
          const eventResponse = [];
    
          for (let i = 0; i < eventArray.length; i++) {
            try {
              if (eventArray[i].organisers[0].division === "MENA") {
                eventResponse.push(eventArray[i]);
              }
            } catch (error) {
              // Handle error if the necessary property is missing in the event object
              if (!response.ok) {
                    console.log('API request zbi');
                  }
              else{
                console.log(error)
              }

            
          }
        }


        // const filteredResponse = eventResponse.filter(item =>
        //   .test(eventResponse[0].airports[0].icao)

        //  )

        
        const filteredResponse = eventResponse.filter(event => {
          return event.airports.some(airport => {
            return /^(DAAA|DAAD|DAAE|DAAG|DAAJ|DAAK|DAAP|DAAS|DAAT|DAAV|DABB|DABC|DABS|DABT|DAOB|DAOF|DAOI|DAOL|DAON|DAOO|DAOR|DAOV|DAOY|DATG|DATM|DAUA|DAUB|DAUE|DAUG|DAUH|DAUI|DAUK|DAUO|DAUT|DAUU|DAUZ|DTKA|DTMB|DTNH|DTTA|DTTB|DTTF|DTTG|DTTI|DTTJ|DTTX|DTTZ|GMMM|GMAC|GMAD|GMAG|GMAT|GMAZ|GMFB|GMFF|GMFI|GMFK|GMFM|GMFO|GMFZ|GMMA|GMMB|GMMD|GMME|GMMH|GMMI|GMML|GMMN|GMMT|GMMW|GMMX|GMMZ|GMTA|GMTN|GMTT)/.test(airport.icao);
          });
        });

        res.send(filteredResponse);
      })

  });




    
// Booking
  app.get('/MaghrebBooking' , function ( req , res){
    fetch("https://atc-bookings.vatsim.net/api/booking")
    .then(data => data.json())
    .then(data => res.send(data))
  })
  
  app.post('/AddMaghrebBooking', function (req, res) {
    const url = 'https://atc-bookings.vatsim.net/api/booking'; // Replace with your API endpoint URL
    const token = '04c332fb707d9c6e2172c04f92fa33fb'; // Replace with your bearer token
  
    const postData = req.body;
  
    // console.log(postData);
  
    
    fetch(url, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(postData)
      })
    // Rest of your code here
  });

  app.delete('/DeleteMaghrebBooking', function (req, res) {
    const url = 'https://atc-bookings.vatsim.net/api/booking/18688'; // Replace with your API endpoint URL
    const token = '04c332fb707d9c6e2172c04f92fa33fb'; // Replace with your bearer token
  
    const postData = req.body;
  
    // console.log(postData);
  
    
    fetch(url, {
      method: 'DELETE',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(postData)
      })
    // Rest of your code here
  });
// Membership solution is to use the /LookupCid/:cid endpoint and fetch 
// users from the first one to the last one and check if there subdivision is MAG 



var server = app.listen(1000, function () {

   var host = server.address().address
   var port = server.address().port
   
   console.log("Example app listening at http://127.0.0.1:1000/ ")
})