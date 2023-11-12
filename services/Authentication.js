function Auth(req, res){
    
  
  console.log("------------------------------------------------------");

  let accessToken = '';

  // GET AUTHORIZATION CODE
  const code = req.query.code;
  console.log("code :", code);
  let data = {
    "grant_type": "authorization_code",
    "client_id": 619,
    "client_secret": "ZK9lA32BOoEq4BxpYCjtHrnz0KM9MwOetHWbRtxE",
    "redirect_uri": "http://localhost:1000/authcode",
    code,
  };
  console.log("------------------------------------------------------");




  // GET TOKEN
  fetch('https://auth-dev.vatsim.net/oauth/token', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
    .then(res => res.json())
    .then(tokenData => {
      accessToken = tokenData.access_token.toString();
      console.log("Token Data : " , tokenData);





    // FETCH DATA
    return fetch('https://auth-dev.vatsim.net/api/user', {
      method: 'GET',
      headers: {
        'Authorization':`Bearer ${accessToken}`,
        'Accept':'application/json'
      },
    });
    })

    .then(res => res.json())

    .then(userData => {
      // Use user data
      console.log(userData)
      let Data = JSON.stringify(userData)
      const encodedData = encodeURIComponent(JSON.stringify(Data));
      res.redirect(`http://localhost:3000/extractor?data=${encodedData}`);
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