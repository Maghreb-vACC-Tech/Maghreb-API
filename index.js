// Environement
const Data = require("./MaghrebSetup.json")

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
//const Settings = require('./services/Settings')


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



var app = express();


// Configure body-parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Configure CORS
app.use(cors());
app.use(cors({origin: '*'}));
// This responds with "Hello World" on the homepage
let options = {};

if(!Data.dev){

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
app.get('/authcode' , Auth2.Auth)

// Booking
app.get('/MaghrebBooking' , Booking.BookingGetFunction)
app.post('/AddMaghrebBooking', Booking.BookingSet)
app.delete('/DeleteMaghrebBooking',Booking.BookingDelete)

// Membership
app.get('/members', Membership.MembersGet)
app.get('/MembershipDBRefresh' , Membership.MembershipDBRefresh)
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
/*
app.get('/Setting/:CID' , Settings.GetSettingCID)

app.post('/SetSettings' , Settings.SetSettingCID)
*/


if(Data.dev) {
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
