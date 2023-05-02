const express = require('express')
const router = express.Router();
const axios = require('axios'); //axios is used to make HTTP requests in NodeJs with the API
const path = require('path')
const getRandomColor = require('../helpers/randomColor')



//? First Page  router


router.get('/', async (req, res) => {
    try {

        // Here we are requesting data related to tube, tram, elizabeth-line, dlr and overground seperately beacuse 
        // thats how their api is designed. After getting the data individually , we club hem and send it to front end as a single file for our convinience.
        // while sending we only took required data (not sending other details that we get from the api) 

        const data =[];  // we club all requested data in this array

        let url1 = 'https://api.tfl.gov.uk/Line/Mode/tube/Status'
        const response = await axios.get(url1);
        const tubeData = response.data;
        data.push(...tubeData) //pushing tube related data into data array

        let url2 = 'https://api.tfl.gov.uk/Line/Mode/dlr/Status'
        const response2 = await axios.get(url2);
        const dlrData = response2.data;
        data.push(...dlrData) //pushing dlr related data into data array


        let url3 = 'https://api.tfl.gov.uk/Line/Mode/elizabeth-line/Status'
        const response3 = await axios.get(url3);
        const elizaData = response3.data;
        data.push(...elizaData) //pushing elizabeth train related data into data array


        let url4 = 'https://api.tfl.gov.uk/Line/Mode/overground/Status'
        const response4 = await axios.get(url4);
        const overgroundData = response4.data;
        data.push(...overgroundData) //pushing overground rail related data into data array

        let url5 = 'https://api.tfl.gov.uk/Line/Mode/tram/Status'
        const response5 = await axios.get(url5);
        const tramData = response5.data;
        data.push(...tramData) //pushing tram related data into data array


        const lines = data.map(line => ({  // before sending data to front end we select the data we require, ignoring others.
            name: line.name,
            modeName:line.modeName,
            lineStatuses:line.lineStatuses,
            lineId: line.id
          
        }));
        res.render('index', { lines,getRandomColor }); // sending a function getRandom color to front end so that cards gets different color
    } catch (error) {
        console.error(error);
        res.status(500).send('Oops! Something went wrong.');
    }
});



//? Router to find a line status in a specific line

router.get('/status', async (req, res) => {
    try {
        let line = req.query.line;
        let url = `https://api.tfl.gov.uk/Line/${line}/Status`; //API taken from line (4rth one)

        const response = await axios.get(url)

        const data = response.data //? we just want the data from the API . so filtering out the meta data such as network status, contents etc...


        const disruption = data.map(line => ({  // before sending data to front end we select the data we require, ignoring others.
            lineId: line.id,
            name: line.name,
            modeName:line.modeName,
            statusSeverityDescription:line.lineStatuses[0].statusSeverityDescription,
          reason:line.lineStatuses[0]?.reason,
          additionalInfo:line.lineStatuses[0].disruption?.additionalInfo,
          from:line.lineStatuses[0].validityPeriods[0]?.fromDate,
          to:line.lineStatuses[0].validityPeriods[0]?.toDate

        }));

        console.log(disruption)
        res.render('status', { disruption });  //* returning only json data of disruption.


        


    } catch (error) { //! if any error happens inside try block,  this block will catch it and return value as error
        console.log(error)
        res.status(500).json({ error: 'Internal server error' })
    }
})


//?SignIn page
router.get('/log-in', async (req, res) => {
    try {

        res.render('signin');  //* returning only json data of disruption.


        


    } catch (error) { //! if any error happens inside try block,  this block will catch it and return value as error
        console.log(error)
        res.status(500).json({ error: 'Internal server error' })
    }
})

module.exports = router