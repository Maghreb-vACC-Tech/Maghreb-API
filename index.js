const express = require('express')
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');
const mysql = require('mysql2')


// Import Modules
const vatsimController = require('./services/ATCActivity');
const Metar = require('./services/Metar');
const Events = require('./services/Event')
const Auth2 = require('./services/Authentication')
const Booking = require('./services/Booking')
const Membership = require('./services/Membership')
const Trainee = require('./services/Training')
const Dashboard = require('./services/Dashboard')

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

app.get('/AtcActivity', vatsimController.fetchVatsimData);

app.get('/MaghrebEvents', Events.MaghrebEvent);

// metarLookup
app.get('/metarLookup/:airport', Metar.Metar);

// OAuth2.0
app.get('/authcode' , Auth2.Auth)

// Booking
app.get('/MagBookTest' , Booking.BookingTestFunction)
app.get('/MaghrebBooking' , Booking.BookingGetFunction)
app.post('/AddMaghrebBooking', Booking.BookingSet)
app.delete('/DeleteMaghrebBooking',Booking.BookingDelete)

// Membership

app.get('/members', Membership.MembersGet);


// Trainee
app.get('/GetTrainee/:cid', Trainee.TraineeGetCid)
app.get('/GetTraineeATC/:cid' , Trainee.TraineeGetCidStats)
app.get('/GetTrainee', Trainee.TraineeGetALL)
app.get('/GetTraineeid/:id', Trainee.TraineeGetID)
app.post('/SetTrainee', Trainee.TraineeSet)
app.delete('/DeleteTrainee/:id', Trainee.TraineeDelete)

// Dashboard
app.post('/stats', Dashboard.Stats)
app.post('/LastFlightTime' , Dashboard.LastFlightTime)
app.post('/ATC' , Dashboard.ATC)
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





    

//* API FOR MEMBER ROSTER \\

// const ratingMap = {
//   '-1': 'INA',
//   1: 'OBS',
//   2: 'S1',
//   3: 'S2',
//   4: 'S3',
//   5: 'C1',
//   6: 'C2',
//   7: 'C3',
//   8: 'I1',
//   9: 'I2',
//   10: 'I3',
//   11: 'SUP',
//   12: 'ADM',
// };










// setInterval(()=>{

//   fetch("http://127.0.0.1:1000/members")
//   .then(res => res.json())
//   .then(res => {
    
//   })

//   const member = {
//     "CID":1761580,
//     "Name":"Amine",
//     "Email":"mabms12@hotmail.com",
//     "Location":"Casablanca (MA)",
//     "Rating":1,
//     "lastratingchange":"2023-10-29T17:53:50",
//     "Approved":"",
//     "Privileges":""
//   }
 
//   const query = `INSERT INTO members (CID, Name, Email, Location, Rating, lastratingchange, Approved, Privileges) VALUES (${member.CID}, '${member.Name}', '${member.Email}', '${member.Location}', ${member.Rating}, '${member.lastratingchange}', '${member.Approved}', '${member.Privileges}')`;
 
// })

var server = app.listen(1000, function () {

   var host = server.address().address
   var port = server.address().port
   
   console.log("Example app listening at http://127.0.0.1:1000/ ")
})