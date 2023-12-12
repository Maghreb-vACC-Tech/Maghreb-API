




function LastFlightPlan(req,res){
  
  const Name = req.params.Name;
  fetch(`https://www.simbrief.com/api/xml.fetcher.php?username=${Name}&json=1`)
  .then(data => data.json())
  .then(data => res.send(data))
}
  module.exports = {
    LastFlightPlan
};
