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
        

function TraineeGetID(req,res){
    const ID = req.params.id;
    
    const url = `SELECT * FROM trainee WHERE id =${ID}`
    try {
    con.connect(function(err) {
  
      if (err) throw err;
      con.query(url, function (err, result) {
        
          console.log("-------------------------------------------------------")
          console.log("-------------------------------------------------------")
          console.log("-------------------------------------------------------")
          console.log(result[0])
          res.send(JSON.stringify(result[0]));
        
        
      });
  
    });
    } 
    catch (error) {
      console.log(error)
    }}



function TraineeSet(req,res){

    console.log(req.body)
      
    const TraineeConstructor = req.body
        
    const url = `INSERT INTO \`trainee\` (\`id\`, \`cid\`, \`Name\`, \`Rating\`, \`Facility\`, \`Position\`, \`Mentor\`, \`Status\`, \`RemainingATCHours\`, \`RatingStart\`, \`SoloStart\` , \`comment\`) VALUES (NULL, '${TraineeConstructor.cid}', '${TraineeConstructor.Name}', '${TraineeConstructor.Rating}', '${TraineeConstructor.Facility}', '${TraineeConstructor.Position}', '${TraineeConstructor.Mentor}', '${TraineeConstructor.Status}', '${TraineeConstructor.RemainingATCHours}', '${TraineeConstructor.RatingStart}', '${TraineeConstructor.SoloStart}' , '${TraineeConstructor.Comment}')`;
        console.log(url)
        
        con.connect(function(err) {
          if (err) throw err;
          con.query(url, function (err, result) {
            if (err) throw err;
            res.send(result);
          });
        });
}
        


function TraineeDelete(req,res){
    const id = req.params.id;
  
    const query = `DELETE FROM trainee WHERE id = ${id}`;
  
    con.query(query, (err, result) => {
      if(err) throw err;
      
      res.redirect('http://127.0.0.1:3000/StaffDeleteTrainee'); 
    })
    }

module.exports = {
    TraineeGetCid,
    TraineeGetCidStats,
    TraineeGetALL,
    TraineeGetID,
    TraineeSet,
    TraineeDelete
};









  

  // *Get trainnee with id



    
//   //  * 
//   // 

//   // *Get Trainnee with CID
//   app.get('/GetTrainee/:cid', (req,res) => {
//     const CID = req.params.cid;
    
//     const url = `SELECT * FROM trainee WHERE cid =${CID}`
//     con.connect(function(err) {
//       if (err) throw err;
//       con.query(url, function (err, result) {
//         if (err) throw err;
//         res.send(result);
//       });
//     });
    
//   })
  

  










// app.get('/GetTraineeStats/:cid', (req,res) => {

//     const CID = req.params.cid;
//     fetch(`https://api.vatsim.net/v2/members/${CID}`)
//     .then( data => data.json())
//     .then( data => {
//       console.log(data)
//       res.send(JSON.stringify(data))
//     })
    
//    .catch(error =>console.log(error))
  
  
  
// })