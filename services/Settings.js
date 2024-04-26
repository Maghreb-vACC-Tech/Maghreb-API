
const mysql = require('mysql2')
var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "maghreb"
  });

function GetSettingCID(req , res ){
    const cid = req.params.CID
    const url = "SELECT * FROM settings WHERE CID = '" + cid + "'"
    console.log(url)
    con.connect(function(err) {
        if (err) throw err;
        con.query(url, function (err, result) {
                if (err) throw err;
                res.send(result);
            });
    });
}


function SetSettingCID(req , res ){

    console.log(req.body)
        
    const Settings = req.body
        
    const url = `INSERT INTO \`settings\` (\`CID\`, \`SimbriefId\`, \`AccentColor\`, \`Background\`) VALUES (${Settings.CID}, '${Settings.SimbriefID}', '${Settings.AccentColor}', ${Settings.BGIndex})`;
    // console.log(url)
    
    con.connect(function(err) {
        if (err) throw err;
        con.query(url, function (err, result) {
            if (err) throw err;
            res.send(result);
        });
    });

            
}

module.exports = {GetSettingCID , SetSettingCID};

