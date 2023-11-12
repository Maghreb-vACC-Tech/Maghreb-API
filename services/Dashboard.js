

function Stats (req , res){
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
      });}
  
function LastFlightTime (req , res){
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
  }

function ATC (req , res){
    const CID = req.body;
    fetch(`https://api.vatsim.net/v2/members/${CID.cid}/atc`)
      .then(data => data.json())
      .then(data => res.json(data))
  }

  module.exports = {
    Stats,LastFlightTime,ATC
};
