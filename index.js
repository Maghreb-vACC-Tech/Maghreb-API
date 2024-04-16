const express = require('express')
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql2');


const dotenv = require("dotenv")
dotenv.config();

// Import Modules
const vatsimController = require('./services/ATCActivity');
const Metar = require('./services/Metar');
const Events = require('./services/Event')
const Auth2 = require('./services/Authentication')
const Booking = require('./services/Booking')
const Membership = require('./services/Membership')
const Trainee = require('./services/Training')
const Dashboard = require('./services/Dashboard')
const Stats = require('./services/Stats')
const Weather = require('./services/Weather')
const AviationGov = require('./services/AviationGov')
const Notams = require('./services/Notams')
const ARPInfo = require('./services/AirportInfo/AirportInfo')

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "maghreb"
});

var app = express();


// Configure body-parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Configure CORS
app.use(cors());
app.use(cors({origin: '*'}));
// This responds with "Hello World" on the homepage

// This responds a POST request for the homepage
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
app.get('/GetEventArchive', Events.importEventFromDB);

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
// Trainee
app.get('/GetTrainee/:cid', Trainee.TraineeGetCid)
app.get('/GetTraineeATC/:cid' , Trainee.TraineeGetCidStats)
app.get('/GetTrainee', Trainee.TraineeGetALL)
app.get('/GetTraineecid/:cid', Trainee.TraineeGetCID)
app.post('/SetTrainee', Trainee.TraineeSet)
app.put('/AlterTrainee' , Trainee.TraineeAlter )

app.delete('/DeleteTrainee/:cid', Trainee.TraineeDelete)

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


// Discord APP
app.get('/message', (req, res) => {
  fetch('http://localhost:5000/message')
  .then(response => {
    if(!response.ok) {
      throw new Error('Failed to fetch');
    }
    return response.json();
  })
  .then(data => {
    res.send(data);
  })
  .catch(error => {
    console.log(error); 
  });
})



// Lookup CID
app.get('/LookupCid/:cid', function (req, res) {
    
      const cid = req.params.cid;

      fetch(`https://api.vatsim.net/api/ratings/${cid}`)
      .then(response => response.json()) 
      .then(response =>{
        res.send(response)
      })
    
  })






  var server = app.listen(1000, function () {

   var host = server.address().address
   var port = server.address().port
   
   console.log("Example app listening at http://127.0.0.1:1000/ ")
})