

let previousCallsigns = [];

function fetchVatsimData(req, res) {
    try {

        fetch('https://data.vatsim.net/v3/vatsim-data.json', { timeout: 5000 }) // fetch data from vatsim api
          .then(data => data.json())
          .then(response => {
            if (response.controllers)
            {

              // Filter the positions according to the airport list
              const filteredResponse = response.controllers.filter(item =>
                 /^(DAAA|DAAD|DAAE|DAAG|DAAJ|DAAK|DAAP|DAAS|DAAT|DAAV|DABB|DABC|DABS|DABT|DAOB|DAOF|DAOI|DAOL|DAON|DAOO|DAOR|DAOV|DAOY|DATG|DATM|DAUA|DAUB|DAUE|DAUG|DAUH|DAUI|DAUK|DAUO|DAUT|DAUU|DAUZ|DTKA|DTMB|DTNH|DTTA|DTTB|DTTF|DTTG|DTTI|DTTJ|DTTX|DTTZ|GMMM|GMAC|GMAD|GMAG|GMAT|GMAZ|GMFB|GMFF|GMFI|GMFK|GMFM|GMFO|GMFZ|GMMA|GMMB|GMMD|GMME|GMMH|GMMI|GMML|GMMN|GMMT|GMMW|GMMX|GMMZ|GMTA|GMTN|GMTT)/.test(item.callsign)

                )

              // Map the Api response to the currentcallsign object 
              const currentCallsigns = filteredResponse.map(item => ({
                callsigned: item.callsign,
                cid: item.cid,
                time: item.logon_time,
                frequency: item.frequency,
                user: item.name
              }));
    
              const onlineCallsigns = currentCallsigns.filter(
                current => !previousCallsigns.some(
                  prev => prev.callsigned === current.callsigned && prev.cid === current.cid
                  )
                );

              if (onlineCallsigns != "" ){
                res.send(onlineCallsigns)
              }
              
              else{
                let nores =["No controllers"]
                res.send(nores)
              }

                  
            }
          })
          .catch(error => {
            console.error(error);
          });
      } catch (error) {
          setInterval(() => {
            fetch('https://data.vatsim.net/v3/vatsim-data.json', { timeout: 5000 }) // fetch data from vatsim api
            .then(data => data.json())
            .then(response => {

              
              if (response.controllers)// Check if response.controllers exist to execute code   
              {

                // Filter the positions according to the airport list
                const filteredResponse = response.controllers.filter(item =>
                  /^(DAAA|DAAD|DAAE|DAAG|DAAJ|DAAK|DAAP|DAAS|DAAT|DAAV|DABB|DABC|DABS|DABT|DAOB|DAOF|DAOI|DAOL|DAON|DAOO|DAOR|DAOV|DAOY|DATG|DATM|DAUA|DAUB|DAUE|DAUG|DAUH|DAUI|DAUK|DAUO|DAUT|DAUU|DAUZ|DTKA|DTMB|DTNH|DTTA|DTTB|DTTF|DTTG|DTTI|DTTJ|DTTX|DTTZ|GMMM|GMAC|GMAD|GMAG|GMAT|GMAZ|GMFB|GMFF|GMFI|GMFK|GMFM|GMFO|GMFZ|GMMA|GMMB|GMMD|GMME|GMMH|GMMI|GMML|GMMN|GMMT|GMMW|GMMX|GMMZ|GMTA|GMTN|GMTT)/.test(item.callsign)
                )

                // Map the Api response to the currentcallsign object 
                const currentCallsigns = filteredResponse.map(item => ({
                  callsigned: item.callsign,
                  cid: item.cid,
                  time: item.logon_time,
                  frequency: item.frequency,
                  user: item.name
                }));
      
                const onlineCallsigns = currentCallsigns.filter(
                  current => !previousCallsigns.some(
                    prev => prev.callsigned === current.callsigned && prev.cid === current.cid)
                    );
                if (onlineCallsigns != "" ){
                  res.send(onlineCallsigns)
                }
                else{
                  res.send("No controllers")
                }

                    
              }
            })
            .catch(error => {
              console.error(error);
            });
          }, 10000);
      }
}

module.exports = {
    fetchVatsimData
};