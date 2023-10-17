function LookupCid(app){
    
    this.LookupCid = () => {
        
        return fetch(`https://api.vatsim.net/api/ratings/${cid}`)
        .then(response => response.json()) 
        .then(response =>{
          return response
        })
      }
}


module.exports = LookupCid;