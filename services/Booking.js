// Booking

function BookingTestFunction(req, res){
    fetch("https://atc-bookings.vatsim.net/api/booking")
    .then( data => data.json())
    .then( data => {
      console.log(data)
      res.send(data)
    })
}
function BookingGetFunction( req , res){
      fetch("https://atc-bookings.vatsim.net/api/booking")
      .then(data => data.json())
      .then(data => {
        // 
  
        // // console.log(data[0].subdivision)
        // if(data.subdivision?.includes("MAG")){
        // }
        
        const filteredData = data.filter(item => item.subdivision);
        const BookingArray = []
        filteredData.forEach(item => {
          if(item.subdivision.includes("MAG")) {
  
            handleMatch(item);
            BookingArray.push(item)
  
          }
        });
  
        function handleMatch(item) {
          // process matched item
          console.log("Match:", item);
        }
  
        res.send(BookingArray);
      })
  
      
    }
function BookingSet(req , res){
    const url = 'https://atc-bookings.vatsim.net/api/booking'; // Replace with your API endpoint URL
    const token = '04c332fb707d9c6e2172c04f92fa33fb'; // Replace with your bearer token
  
    // const postData = req.body.Data;
    const postData = req.body;
  
    console.log(postData.Data);
  
    
    fetch(url, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(postData.Data)
      })
    console.log("done")
}

  
function BookingDelete(req, res) {
      
      const postData = req.body;
      const url = `https://atc-bookings.vatsim.net/api/booking/${JSON.stringify(postData.id)}`; // Replace with your API endpoint URL
      const token = '04c332fb707d9c6e2172c04f92fa33fb'; // Replace with your bearer token
    
    
      console.log(url);
    
      
      fetch(url, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(postData)
        })
    }



module.exports = {
    BookingTestFunction,
    BookingGetFunction,
    BookingSet,
    BookingDelete
};