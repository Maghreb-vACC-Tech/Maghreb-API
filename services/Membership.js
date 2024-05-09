
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



// const query = `INSERT INTO members (CID, Name, Email, Location, Rating, lastratingchange, Approved, Privileges) VALUES (${member.id}, '${member.name_first} ${member.name_last}', '${member.email}', '${member.countystate}(${member.country})', '${ratingMap[member.rating]}', '${member.lastratingchange}', '', '')`;




function MembershipDBRefresh(req, res){
  fetch("http://127.0.0.1:1000/members")
  .then(response => response.json())
  .then(response => {
    response.forEach(member => {

      const ratingMap = {
        '-1': 'INA',
        1: 'OBS',
        2: 'S1',
        3: 'S2',
        4: 'S3',
        5: 'C1',
        6: 'C2',
        7: 'C3',
        8: 'I1',
        9: 'I2',
        10: 'I3',
        11: 'SUP',
        12: 'ADM',
      };

      

    db.all(`Delete from members`, [], (err, rows) => {
      if (err) {
        console.log(err);
      }
      
    });

    let sql = `
    INSERT INTO members 
    (CID, Name, Email, Location, Rating, lastratingchange, Approved, Privileges)
     VALUES (${member.id}, '${member.name_first} ${member.name_last}', '${member.email}', '${member.countystate}(${member.country})', '${ratingMap[member.rating]}', '${member.lastratingchange}', '', '');
    `;

    db.all(sql, [], (err, rows) => {
      if (err) {
        console.log(err);
      }
      
    });




    });
    res.send("Membership Db is refreshed")
  })
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
      console.log(err);
    }
    // console.log('Membership Table created successfully!');
    rows.forEach((row) => {
      console.log("-------------------------------------------------------")
      console.log("-------------------------------------------------------")
      console.log("-------------------------------------------------------")
      console.log(result)
      res.send(result);
    });
  });




    
  // const url = `SELECT * FROM members`
  // try {
  // con.connect(function(err) {

  //   if (err) throw err;
  //   con.query(url, function (err, result) {
      
  //       console.log("-------------------------------------------------------")
  //       console.log("-------------------------------------------------------")
  //       console.log("-------------------------------------------------------")
  //       console.log(result)
  //       res.send(result);
      
      
  //   });

  // });
  // } 
  // catch (error) {
  //   console.log(error)
  // }

  // console.err
}




function MemberHistory(req, res){
  const id = req.params.id; 
  console.log(id)
  fetch(`https://api.vatsim.net/v2/members/${id}/atc`)
  .then(data => data.json())
  .then(data => 
    {
      console.log("----------------------------- MEMBER LOGS -----------")
      console.log(data)
      res.send(data.items)
    })

} 

module.exports = {
    MembersGet,
    MembershipDBRefresh,
    MembersGetDB,
    MemberHistory
};
