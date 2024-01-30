function GetTAF(req , res){

    const Airport = req.params.airport;
    fetch(`https://aviationweather.gov/api/data/taf/?ids=${Airport}`)
    .then( data => data.text())
    .then( data => res.send(data))
    .catch(err => {
        console.log(err)
        res.send("Error Check API Logs")
      })
}


module.exports = {
    GetTAF,
};