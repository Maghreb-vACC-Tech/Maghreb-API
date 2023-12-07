// *Training Involves my SQL

const mysql = require('mysql2')
var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "maghreb"
  });


function TraineeGetCid(req , res ){
    const cid = req.params.cid
    const url = "SELECT * FROM trainee WHERE cid = '" + cid + "'"
  
    con.connect(function(err) {
      if (err) throw err;
      con.query(url, function (err, result) {
        if (err) throw err;
        res.send(result);
      });
    });
}
  
function TraineeGetCidStats( req , res ){
    const Data = req.params.cid;
  
    const url = `https://api.vatsim.net/v2/members/${Data}/stats`
    console.log(url)
    fetch(url)
      .then(data => data.json())
      .then(data => res.json(data))
}


function TraineeGetALL(req,res){
    const url = "SELECT * FROM trainee"
    con.connect(function(err) {
        if (err) throw err;
          con.query(url, function (err, result) {
            if (err) throw err;
            res.send(result);
          });
    });}
        

function TraineeGetCID(req,res){
    const CID = req.params.cid;
    
    const url = `SELECT * FROM trainee WHERE cid =${CID}`

    try {
    con.connect(function(err) {
  
      if (err) throw err;
      con.query(url, function (err, result) {
        
          console.log("-------------------------------------------------------")
          res.send(result[0]);
        
      });
    });
    } 
    catch (error) {
      console.log(error)
    }
  
  }



function TraineeSet(req,res){

    console.log(req.body)
      
    const TraineeConstructor = req.body
        
    const url = `INSERT INTO \`trainee\` (\`cid\`, \`Name\`, \`Rating\`, \`Facility\`, \`Position\`, \`Mentor\`, \`Status\`, \`comment\`) VALUES ('${TraineeConstructor.cid}', '${TraineeConstructor.Name}', '${TraineeConstructor.Rating}', '${TraineeConstructor.Facility}', '${TraineeConstructor.Position}', '${TraineeConstructor.Mentor}', '${TraineeConstructor.Status}' , '${TraineeConstructor.Comment}')`;
        console.log(url)
        
        con.connect(function(err) {
          if (err) throw err;
          con.query(url, function (err, result) {
            if (err) throw err;
            res.send(result);
          });
        });
}
        


function TraineeAlter(req , res){
  
  const TraineeConstructor = req.body
  
  console.log(TraineeConstructor)
  
  const query = `UPDATE trainee SET Rating = '${TraineeConstructor.Rating}' , Facility = '${TraineeConstructor.Facility}' , Position = '${TraineeConstructor.Position}' , Mentor = '${TraineeConstructor.Mentor}' , Status = '${TraineeConstructor.Status}' , comment = '${TraineeConstructor.Comment}' WHERE cid = ${TraineeConstructor.CID}`
  
  console.log(query)
   con.connect(function(err) {
    if (err) throw err;
    con.query(query, function (err, result) {
      if (err) throw err;
      console.log(result.affectedRows + " record(s) updated");
      res.redirect('http://localhost:3000/StaffTraining'); 
    });
  });
}


function TraineeDelete(req,res){
    const cid = req.params.cid;
  
    const query = `DELETE FROM trainee WHERE cid = ${cid}`;
  
    console.log(query)
    con.query(query, (err, result) => {
      if(err) throw err;
      
      res.redirect('http://127.0.0.1:3000/StaffDeleteTrainee'); 
    })
    }

module.exports = {
    TraineeGetCid,
    TraineeGetCidStats,
    TraineeGetALL,
    TraineeGetCID,
    TraineeSet,
    TraineeAlter,
    TraineeDelete
};

