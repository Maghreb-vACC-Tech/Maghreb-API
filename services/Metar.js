 function Metar (airport) {
    this.metarLookup = async (airport) => {
        console.log(airport)
        const url = `https://api.checkwx.com/metar/${airport}/decoded`;
        const apiKey = process.env.WX_API;

        const response = await fetch(url, {
        headers: {
            'X-API-Key': apiKey
        }
        });

        let data;
        try {
        data = await response.json();
        } catch (e) {
        // Handle JSON parsing errors here
        console.log('Error: could not parse JSON response:', e.message);
        return;
        }

        if (!data || !data.data || data.data.length === 0) {
        // Handle the error here
        console.log('Error: no METAR data found');
        return;
        }

        const airportName = data.data[0].station.name;
        const metar = data.data[0].raw_text;

        const d = new Date();
        const hour = d.getUTCHours().toString().padStart(2, '0');
        const minutes = d.getUTCMinutes().toString().padStart(2, '0');

        const res = `METAR for ${airportName} (${airport}) at ${hour}:${minutes} UTC:\n${metar}`

        return res
    }
    
}


module.exports = Metar;