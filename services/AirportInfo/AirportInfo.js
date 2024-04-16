const airports = require('./airport.json');


function getAirportInfo(req, res) {

  // const name = req.params.airport;

  // const airport = airports.airports[name];

  // if(airport) {
  //   res.json(airport.runways); 
  // } else {
  //   res.status(404).send('Airport not found');
  // }
  
}

module.exports = {
  getAirportInfo
}