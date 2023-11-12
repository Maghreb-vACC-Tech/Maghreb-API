async function MembersGet(req, res) {
    
    return fetch('https://api.vatsim.net/v2/orgs/subdivision/MAG', {
      headers: {
        'X-API-Key': 'd8128629-921e-4c20-9ab1-b4517e8b77d2'
      }
    })
    .then(data =>data.json())
    .then(data => res.send(data.items))

    // console.err
}

module.exports = {
    MembersGet
};