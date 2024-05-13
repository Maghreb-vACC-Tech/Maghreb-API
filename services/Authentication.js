const Data = require("../MaghrebSetup.json")

function Auth(req, res){
    
  
  console.log("------------------------------------------------------");

  let accessToken = '';

  // GET AUTHORIZATION CODE
  const code = req.query.code;
  //const code = req
  console.log("code :", code);
  let data
  if(Data.dev){
    data = {
      "grant_type": "authorization_code",
      "client_id": 619,
      "client_secret": "ZK9lA32BOoEq4BxpYCjtHrnz0KM9MwOetHWbRtxE",
      "redirect_uri": "http://localhost:1000/authcode",
      code,
    };
  }
  else{
    data = {
      "grant_type": "authorization_code",
      "client_id": 1284,
      "client_secret": "yqbhSRb13MMg5lQltuOLtapENJiTHpJiIjPylvS4",
      "redirect_uri": "https://api.vatsim.ma/authcode",
      code,
    };
  }
  
  console.log("------------------------------------------------------");

  let authURL = (Data.dev) ? "https://auth-dev.vatsim.net/oauth/token" : "https://auth.vatsim.net/oauth/token"
  fetch(authURL, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  .then(res => res.json())
  .then(tokenData => {
    console.log('Token Response:', tokenData);

    if (!tokenData || !tokenData.access_token) {
      throw new Error('Invalid token data');
    }

    accessToken = tokenData.access_token.toString();
    console.log("Token Data:", tokenData);

    // FETCH DATA
    
    let APIUSERURL = (Data.dev) ? "https://auth-dev.vatsim.net/api/user" : "https://auth.vatsim.net/api/user"
    return fetch(APIUSERURL, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json'
      },
    });
  })
  .then(res => res.json())
  .then(userData => {
    // Use user data
    console.log('User Data:', userData);
    let Data = JSON.stringify(userData);
    const encodedData = encodeURIComponent(JSON.stringify(Data));
    if(Data.dev){
      res.redirect(`http://api.vatsim.ma:3000/extractor?data=${encodedData}`);
    }
    else{
      res.redirect(`http://localhost:3000/extractor?data=${encodedData}`);
    }
  })
  .catch(error => {
    // Handle any errors
    console.error(error);
    res.status(500).send('Internal Server Error');
  });




}
module.exports = {
    Auth
};
