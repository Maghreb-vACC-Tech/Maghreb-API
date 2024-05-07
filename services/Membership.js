
//const mysql = require('mysql2')
/*
var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "maghreb"
  });
  */


async function MembersGet(req, res) {
    
    return fetch('https://api.vatsim.net/v2/orgs/subdivision/MAG?limit=1000', {
      headers: {
        'X-API-Key': 'd8128629-921e-4c20-9ab1-b4517e8b77d2'
      }
    })
    .then(data =>data.json())
    .then(data => res.send(data.items))

}
/*
function MembersGetDB(req, res) {
    
    
  const url = `SELECT * FROM members`
  try {
  con.connect(function(err) {

    if (err) throw err;
    con.query(url, function (err, result) {
      
        console.log("-------------------------------------------------------")
        console.log("-------------------------------------------------------")
        console.log("-------------------------------------------------------")
        console.log(result)
        res.send(result);
      
      
    });

  });
  } 
  catch (error) {
    console.log(error)
  }

  // console.err
}
*/

/*
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

        const query = `INSERT INTO members (CID, Name, Email, Location, Rating, lastratingchange, Approved, Privileges) VALUES (${member.id}, '${member.name_first} ${member.name_last}', '${member.email}', '${member.countystate}(${member.country})', '${ratingMap[member.rating]}', '${member.lastratingchange}', '', '')`;
      
        console.log(query)

        con.connect(function(err) {
            if (err) throw err;
            try{
                con.query(query, function (err, result) {});
                console.log("Record Inserted");
              }
            catch{
              con.end();
              console.log("Erreur in SQL connexion");
              res.send(`there is a problem here : ${query} `)
            }
          });

      });
      res.send("Membership Db is refreshed")
    })
}
*/
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
    //MembersGet,
    //MembershipDBRefresh,
    //MembersGetDB,
    MemberHistory
};
