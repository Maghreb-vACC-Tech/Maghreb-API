

function BookingGetFunction( req , res){
      fetch("https://atc-bookings.vatsim.net/api/booking")
      .then(data => data.json())
      .then(data => {
        
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
          // console.log(item);
        }
  
        res.send(BookingArray);
      })
      .catch( err => {
        console.log(`Handled Error : ${err}`)
      })      
    }

function BookingSet(req , res ){
  const bookingData = req.body.Data;
  const bookingToken = "04c332fb707d9c6e2172c04f92fa33fb";
  // const bookingApiUrl = 'https://booking.api.url';
  const url = 'https://atc-bookings.vatsim.net/api/booking';
  fetch(url, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${bookingToken}`
    },
    body: JSON.stringify(bookingData)
  
    })
    
  .then(data => data.json())
  .then(data => {
    // console.log(`${JSON.stringify(data)}`)
    // console.log(`--------------------------------------------`)
    // console.log(`${JSON.stringify(bookingData)}`)
    if(data === bookingData) {
      // console.log("Booking Logged");
      res.send(data);
    } 
    else {  
      // console.log("Booking Logging Error");
      res.send(data);
    }
    }  
  )  
}

    
function BookingDelete(req, res) {
      
      const postData = req.body;
      const url = `https://atc-bookings.vatsim.net/api/booking/${JSON.stringify(postData.id)}`; // Replace with your API endpoint URL

    
      // console.log(`Delete ${JSON.stringify(postData)}`)
      
      fetch(url, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer 04c332fb707d9c6e2172c04f92fa33fb`
        },
        body: JSON.stringify(postData)
        })

        // console.log("Delete")
    }



module.exports = {
    BookingGetFunction,
    BookingSet,
    BookingDelete
};  