const prompt = require('prompt');
const validator = /^-?\d*(\.\d+)?$/;
const properties = [
    {
        name: 'latitude',
        validator,
        warning: 'Latitude should be float'
    },
    {
        name: 'longtitude',
        validator,
        warning: 'Longtitude should be float'
    }
]

