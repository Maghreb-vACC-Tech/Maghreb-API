function MaghrebEvent(req, res){

  fetch("https://my.vatsim.net/api/v1/events/all")
  .then(data => {
    if(data.headers.get('content-type').includes('application/json')) {
      return data.json();
    } else {
      // throw new Error("Response is not JSON"); 
    }
  })
    .then( data => {
      const eventArray = data.data;
        const eventResponse = [];
  
        for (let i = 0; i < eventArray.length; i++) {
          try {
            if (eventArray[i].organisers[0].division === "MENA") {
              eventResponse.push(eventArray[i]);
            }
          } catch (error) {
            // Handle error if the necessary property is missing in the event object
            if (!response.ok) {
                  console.log('API request Not OK');
                }
            else{
              console.log(error)
            }

          
        }
      }


      // const filteredResponse = eventResponse.filter(item =>
      //   .test(eventResponse[0].airports[0].icao)

      //  )

      
      const filteredResponse = eventResponse.filter(event => {
        return event.airports.some(airport => {
          return /^(DAAA|DAAD|DAAE|DAAG|DAAJ|DAAK|DAAP|DAAS|DAAT|DAAV|DABB|DABC|DABS|DABT|DAOB|DAOF|DAOI|DAOL|DAON|DAOO|DAOR|DAOV|DAOY|DATG|DATM|DAUA|DAUB|DAUE|DAUG|DAUH|DAUI|DAUK|DAUO|DAUT|DAUU|DAUZ|DTKA|DTMB|DTNH|DTTA|DTTB|DTTF|DTTG|DTTI|DTTJ|DTTX|DTTZ|GMMM|GMAC|GMAD|GMAG|GMAT|GMAZ|GMFB|GMFF|GMFI|GMFK|GMFM|GMFO|GMFZ|GMMA|GMMB|GMMD|GMME|GMMH|GMMI|GMML|GMMN|GMMT|GMMW|GMMX|GMMZ|GMTA|GMTN|GMTT)/.test(airport.icao);
        });
      });

      res.send(filteredResponse);
    })
}


module.exports = {
  MaghrebEvent
};