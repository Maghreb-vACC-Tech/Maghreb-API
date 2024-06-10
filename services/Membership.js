
const sqlite3 = require('sqlite3').verbose();
//const mysql = require('mysql2')
/*
var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "maghreb"
  });
  */

let db = new sqlite3.Database('maghreb.db');






function MembershipDBRefresh(req, res){
  
 
}

async function MembersGet(req, res) {
    
    return fetch('https://api.vatsim.net/v2/orgs/subdivision/MAG?limit=1000', {
      headers: {
        'X-API-Key': 'd8128629-921e-4c20-9ab1-b4517e8b77d2'
      }
    })
    .then(data =>data.json())
    .then(data => res.send(data.items))

}

function MembersGetDB(req, res) {

  sql = `
  SELECT * FROM members;
  `;

  db.all(sql, [], (err, rows) => {
    if (err) {
      console.log(`Handled Error : ${err}`);
      res.status(500).send("An error occurred");
      return;
    }

    const data = rows.map(row => row); // Collect all rows in an array
    
    // console.log("-------------------------------------------------------")
    // console.log("-------------------------------------------------------")
    // console.log("-------------------------------------------------------")
    // console.log(data)
    
    res.send(data); // Send the entire array as the response
  });
  
}

function MemberHistory(req, res){
  const id = req.params.id; 
  // console.log(id)
  fetch(`https://api.vatsim.net/v2/members/${id}/atc`)
  .then(data => data.json())
  .then(data => 
    {
      console.log("----------------------------- MEMBER LOGS -----------")
      // console.log(data)
      res.send(data.items)
    })

} 

module.exports = {
    MembersGet,
    MembershipDBRefresh,
    MembersGetDB,
    MemberHistory
};
