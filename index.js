// Environement
// const Data = require("./MaghrebSetup.json")

const express = require('express')
const cors = require('cors');
const bodyParser = require('body-parser');

//SSL
const https = require('https');
const fs = require('fs');


const sqlite3 = require('sqlite3').verbose();
const path = require('path');


// Import Modules
const vatsimController = require('./services/ATCActivity');
const Metar = require('./services/Metar');
const Events = require('./services/Event')
const Auth2 = require('./services/Authentication')
const Booking = require('./services/Booking')
const Membership = require('./services/Membership')
const Dashboard = require('./services/Dashboard')
const Stats = require('./services/Stats')
const Weather = require('./services/Weather')
const AviationGov = require('./services/AviationGov')
const Notams = require('./services/Notams')
const ARPInfo = require('./services/AirportInfo/AirportInfo')
// const Settings = require('./services/Settings')


//Connexion Base de donnees

// Create a new SQLite database file
const dbPath = path.resolve(__dirname, 'maghreb.db');


// Connect to the database
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error creating database:', err);
    return;
  }
  console.log('Database created successfully!');
});


let sql = `
  CREATE TABLE members (
    CID int(11) NOT NULL,
    Name varchar(255) NOT NULL,
    Email varchar(255) NOT NULL,
    Location varchar(255) NOT NULL,
    Rating varchar(255) NOT NULL,
    lastratingchange varchar(255) NOT NULL,
    Approved varchar(255) NOT NULL,
    Privileges varchar(255) NOT NULL
  )
`;


db.all(sql, [], (err, rows) => {
  if (err) {
    console.log("------------message:'members table exist'------------ ");
    
  }
  else{
    console.log('("------------Membership Table created successfully!------------');
  }
});



require('dotenv').config()


var app = express();

console.log(process.env.APP_ENV)


// Configure body-parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Configure CORS
// app.use(cors());
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));
// app.use(cors({
//   origin: 'http://localhost:3000'
// }));
// This responds with "Hello World" on the homepage
let options = {};

if(process.env.APP_ENV == "PROD"){

  options = {
    key: fs.readFileSync('/etc/letsencrypt/live/api.vatsim.ma/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/api.vatsim.ma/fullchain.pem'),
  };

}


// Notam
app.get('/Notams/:airport' , Notams.GetNotam)


// AiportInformation
app.get('/GetARPInfo/:airport' , ARPInfo.getAirportInfo)


app.get('/AtcActivity', vatsimController.fetchVatsimData);

// Weather
app.get('/GetTAF/:airport' , Weather.GetTAF)


// Maghreb Events

app.get('/MaghrebEvents', Events.MaghrebEvent);
app.get('/VatsimEvents', Events.VatsimEvent);

// metarLookup
app.get('/metarLookup/:airport', Metar.Metar);

// OAuth2.0
app.get('/authcode' , (req,res)=>{
  let accessToken = '';

  // GET AUTHORIZATION CODE
  const code = req.query.code;

  let data
  
  if(process.env.APP_ENV == "DEV"){
    data = {
      "grant_type": "authorization_code",
      "client_id": 619,
      "client_secret": "ZK9lA32BOoEq4BxpYCjtHrnz0KM9MwOetHWbRtxE",
      "redirect_uri": "http://localhost:1000/authcode",
      code,
    };
  }
  else{
    data = {
      "grant_type": "authorization_code",
      "client_id": 1284,
      "client_secret": "yqbhSRb13MMg5lQltuOLtapENJiTHpJiIjPylvS4",
      "redirect_uri": "https://api.vatsim.ma/authcode",
      code,
    };
  }

  let authURL = (process.env.APP_ENV=="DEV") ? "https://auth-dev.vatsim.net/oauth/token" : "https://auth.vatsim.net/oauth/token"
  
  fetch(authURL, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  .then(res => res.json())
  .then(tokenData => {

    if (!tokenData || !tokenData.access_token) {
      throw new Error('Invalid token data');
    }

    accessToken = tokenData.access_token.toString();

    // FETCH DATA
    
    let APIUSERURL = (process.env.APP_ENV=="DEV") ? "https://auth-dev.vatsim.net/api/user" : "https://auth.vatsim.net/api/user"
    return fetch(APIUSERURL, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json'
      },
    });
  })
  .then(res => res.json())
  .then(userData => {
    // Use user data
    let Data = JSON.stringify(userData);
    const encodedData = encodeURIComponent(JSON.stringify(Data));

    if(process.env.APP_ENV=="DEV"){
      res.redirect(`http://localhost:3000/extractor?data=${encodedData}`);
    }
    else{
      res.redirect(`http://api.vatsim.ma:3000/extractor?data=${encodedData}`);
    }
  })
  .catch(error => {
    // Handle any errors
    console.error(error);
    res.status(500).send('Internal Server Error');
  });


})

// Booking
app.get('/MaghrebBooking' , Booking.BookingGetFunction)
app.post('/AddMaghrebBooking', Booking.BookingSet)
app.delete('/DeleteMaghrebBooking',Booking.BookingDelete)

// Membership
app.get('/members', Membership.MembersGet)
app.get('/MembershipDBRefresh' , (req,res)=>{

  db.all(`Delete from members`, [], (err, rows) => {
    if (err) {
      console.log(`Handled Error : ${err}`);
    }
    
  });

  
  fetch((process.env.APP_ENV=="DEV") ? "http://localhost:1000/members" : "https://api.vatsim.ma/members")
  .then(response => response.json())
  .then(response => {
    response.forEach(member => {

      const ratingMap = {
        '-1': 'INA',
        1: 'OBS',
        2: 'S1',
        3: 'S2',
        4: 'S3',
        5: 'C1',
        6: 'C2',
        7: 'C3',
        8: 'I1',
        9: 'I2',
        10: 'I3',
        11: 'SUP',
        12: 'ADM',
      };

      


    let sql = `
    INSERT INTO members 
    (CID, Name, Email, Location, Rating, lastratingchange, Approved, Privileges)
     VALUES (${member.id}, '${member.name_first} ${member.name_last}', '${member.email}', '${member.countystate}(${member.country})', '${ratingMap[member.rating]}', '${member.lastratingchange}', '', '');
    `;

    db.all(sql, [], (err, rows) => {
      if (err) {
        console.log(`Handled Error : ${err}`);
      }
      
    });




    });
    res.send("Membership Db is refreshed")
  })
})
app.get('/MembersGetDB' , Membership.MembersGetDB)
app.get('/MembersGetConnectionLog/:id' ,Membership.MemberHistory )

// Dashboard
app.get('/LastFlightPlan/:Name' , Dashboard.LastFlightPlan)
app.get('/GetWeather/:airport' , Dashboard.GetWeather)
app.get('/GetLastAnnouncement' , Dashboard.LastAnnouncement)

// Stats
app.post('/stats', Stats.Stats)
app.post('/LastFlightTime' , Stats.LastFlightTime)
app.post('/ATC' , Stats.ATC)
app.post('/ATClastposition' , Stats.ATClastposition)
app.post('/Pilot' , Stats.PILOT)

// Aviation.gov
app.get('/AGMetar/:airport' , AviationGov.GetMetar)
app.get('/AGTAF/:airport' , AviationGov.GetTAF)


// Settings
app.get('/GetSetting/:CID' , (req,res)=>{
    
  let SQLCreateQuery=`CREATE TABLE "Settings" (
  "CID"	INTEGER NOT NULL UNIQUE,
  "SimbriefAlias"	TEXT,
  PRIMARY KEY("CID"))`

  db.all(SQLCreateQuery, [], (err, rows) => {
      if (err) {
        console.log("------------message:'Settings table exists'------------ ");
        
      }
      else{
        console.log('("------------Settings Table created successfully!------------');
      }
    });

    
  const CID = req.params.CID

  let SQLGetQuery=`SELECT * FROM Settings WHERE CID=${CID}`
  
  console.log(SQLGetQuery)
    db.all(SQLGetQuery, [], (err, rows) => {
      if (err) {
        console.log(err);
      }
      else{
        res.send(rows);
      }
    });




  })



app.post('/SetSettings' , (req,res)=>{
  
  const Settings = req.body;

  let SQLSetQuery=`INSERT INTO Settings (CID , SimbriefAlias) Values(${Settings.CID},'${Settings.SimbriefAlias}')`


  db.all(SQLSetQuery, [], (err, rows) => {
      if (err) {
        console.log(`----------- ${Settings.CID} Created their settings------------- `);
        
      }
      else{
        console.log('("------------Settings Table created successfully!------------');
      }
    });
  

})
app.put('/UpdateSettings' , (req , res)=>{
  const Settings = req.body;

  console.table(Settings)
  
  let SQLUpdateQuery = `
  UPDATE Settings
  SET SimbriefAlias = '${Settings.SimbriefAlias}'
  WHERE CID = ${Settings.CID}
  `;


  db.all(SQLUpdateQuery, [], (err, rows) => {
    if (err) {
      console.log(`----------- ${Settings.CID} Updated their settings------------- `);
      
    }
    else{
      console.log('("------------Settings Table created successfully!------------');
    }
  });

})

app.post('/Log', (req, res) => {
  
  res.set('Access-Control-Allow-Origin', '*');
  const content = JSON.stringify(req.body);
  fs.appendFile('./Log', '\n' + content, (err) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error logging data');
    } else {
      res.send('Logged correctly');
    }
  });
});






if(process.env.APP_ENV == "DEV") {
  var server = app.listen(1000, function () {
    var host = server.address().address
    var port = server.address().port
    
    console.log("Example app listening at http://127.0.0.1:1000/ ")
 })

} else{
 
 const server = https.createServer(options, app);

 server.listen(443, () => {
   console.log('Server running on port 443');
 });
}
