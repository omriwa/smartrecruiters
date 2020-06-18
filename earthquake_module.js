
const axios = require('axios');
const moment = require('moment');

const removeDuplicateEQ = earthquakes => {
    for (let i = 0; i < earthquakes.length - 1; i++){
        for (let j = i + 1; j < earthquakes.length; j++){
            const { coordinates: firstCoordinates } = earthquakes[i].geometry; 
            const { coordinates: secondCoordinates } = earthquakes[j].geometry; 

            if (firstCoordinates[0] === secondCoordinates[0] && firstCoordinates[1] === secondCoordinates[1]) {
                earthquakes.splice(j, 1);
            }
        } 
    }

    return earthquakes;
}

const calcEQDistFromLatLon = (eq, lat, lon) => {
    const { coordinates } = eq.geometry;

    return Math.sqrt(Math.pow(coordinates[0] - lat,2) + Math.pow(coordinates[1] - lon,2));
};

const printEQDetails = (eq, distance) => console.log(eq.properties.title + ' || ' + distance);

const getMinDistance = (earthquakes, lat, lon) => {
    let minDistance = Infinity;
    let minEQ;
    let minEQIndex;

    earthquakes.forEach((eq,eqIndex) => {
        const distance = calcEQDistFromLatLon(eq, lat, lon);

        if (distance < minDistance) {
            minDistance = distance;
            minEQ = eq;
            minEQIndex = eqIndex;
        }
    });

    return {
        minEQ,
        minEQIndex
    }
}

const getEQNumOfShortDist = (earthquakes, numberOfEQ, lat,lon) => {
    const shortestDistEQ = [];

    for (let i = 0; i < numberOfEQ; i++){
        const { minEQ, minEQIndex } = getMinDistance(earthquakes, lat, lon);

        shortestDistEQ.push(minEQ);

        earthquakes.splice(minEQIndex, 1); // remove current minEQ
    }

    return shortestDistEQ;
}

const getApiUrl = (lat, lon) => {
    // set url parameters
    const baseUrl = 'https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&';
    const startTime = moment().toISOString()
    const endTime = moment().subtract(30, 'days').toISOString();

    // return baseUrl + 'starttime=' + startTime + '&endtime=' + endTime;
    return baseUrl + 'starttime=2020-05-01&endtime=2020-05-29';
}

const getEarthquakeData = (lat, lon) => {
    axios.get(getApiUrl())
    .then(result => result.data)
    .then(data => {
        if (data.metadata.status === 200)
            return data.features;
        else
            throw new Error('Could not fetch data from api');
    })
        .then(earthquakes => removeDuplicateEQ(earthquakes))
        .then(earthquakes => {
            console.log('lengthggg', earthquakes.length)
        earthquakes.forEach(eq => {
            const distance = calcEQDistFromLatLon(eq, lat, lon);
            
            printEQDetails(eq, distance);
            
        });
            const shortestEQ = getEQNumOfShortDist(earthquakes, 10, lat, lon);

            console.log('\n10 shortest distance earthquakes:\n');
            shortestEQ.forEach(eq => {
                const distance = calcEQDistFromLatLon(eq, lat, lon);

                printEQDetails(eq, distance);
            });
            
    })
    .catch(e => console.log(e))
}

module.exports = { getEarthquakeData };