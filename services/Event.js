function Event(app){
    
    this.GetMaghrebEvent = () => {
        
        return fetch("https://my.vatsim.net/api/v1/events/all")
            .then( data => data.json())
            .then( data => {
            console.log(data)
            return data
            })

            
      }

    
    this.GetVatmenaEvent = () => {

          return fetch('https://my.vatsim.net/api/v1/events/all')
          .then(response => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            return response.json();
          })
          .then(data => {
            const eventArray = data.data;
            const eventResponse = [];
    
            for (let i = 0; i < eventArray.length; i++) {
              try {
                if (eventArray[i].organisers[0].division === 'MENA') {
                  eventResponse.push(eventArray[i]);
                }
              } catch (error) {
                // Handle error if the necessary property is missing in the event object
              }
            }
    
            const sortedEvents = eventResponse.sort((a, b) => {
              return new Date(a.start_time) - new Date(b.start_time); 
            });
    
            console.log(sortedEvents);
            res.send(sortedEvents);
          })
          .catch(error => {
            console.error('Error:', error);
          });
        
    }

    

}


module.exports = Event;