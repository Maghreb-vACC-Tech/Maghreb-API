
function GetWeather(req,res){
  const Airport = req.params.airport;
  fetch(`https://aviationweather.gov/api/data/metar/?ids=${Airport}&format=json`)
  .then(data => data.json())
  .then(data => res.send(data[0]))
  .catch(err => {
    console.log(err)
    res.send("Error Check API Logs")
  })
}



function LastFlightPlan(req,res){
  
  const Name = req.params.Name;
  fetch(`https://www.simbrief.com/api/xml.fetcher.php?username=${Name}&json=1`)
  .then(data => data.json())
  .then(data => res.send(data))
  .catch((err)=>{
    console.log(err)
    res.send("Error Check API Logs")
  })
  
}
  module.exports = {
    LastFlightPlan,
    GetWeather
};
