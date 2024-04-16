function GetMetar(req,res){
  
    const Name = req.params.airport;

    console.log(Name)
    fetch(`https://aviationweather.gov/api/data/metar/?ids=${Name}&format=json`)
    .then(data => data.json())
    .then(data => res.send(data))
    .catch((err)=>{
        console.log(err)
        res.send("Error Check API Logs")
    })

}

function GetTAF(req,res){

    const Name = req.params.airport;

    // console.log(Name)
    fetch(`https://aviationweather.gov/api/data/taf/?ids=${Name}&format=json`)
    .then(data => data.json())
    .then(data => res.send(data[0]))
    .catch((err)=>{
        console.log(err)
        res.send("Error Check API Logs")
    })

}
module.exports = {
GetMetar,
GetTAF
};
