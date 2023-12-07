




function LastFlightPlan(req,res){
  
  const CID = req.body;
  fetch(`https://api.vatsim.net/v2/members/${CID.cid}/flightplans`)
  .then(data => data.json())
  .then(data => res.send(data[0]))
}
  module.exports = {
    LastFlightPlan
};
