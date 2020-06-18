const prompt = require('prompt');
const validator = /^-?\d*(\.\d+)?$/;
const latitudeString = 'latitude';
const longtitudeString = 'longtitude';
const properties = [
    {
        name: latitudeString,
        message: latitudeString + ':',
        validator,
        warning: 'Latitude should be float'
    },
    {
        name: longtitudeString,
        message: longtitudeString,
        validator,
        warning: 'Longtitude should be float'
    }
];
const { getEarthquakeData } = require('./earthquake_module');

// listenning to input
console.log('Enter Latitude and Longtitude');
prompt.start();
// get input
prompt.get(properties, (e, result) => {
    if (e) {
        console.log(e);

        return 1;
    } 
    else {
        const { latitude, longtitude } = result;
        const lat = parseFloat(latitude);
        const lon = parseFloat(longtitude);
            
        getEarthquakeData(lat,lon);

        return 0;
    }
});

