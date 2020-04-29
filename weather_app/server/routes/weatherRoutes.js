const express = require('express');
const router = express.Router();
const weather = require('../controllers/weatherController');
const axios = require('axios');
var cors = require("cors");

const app = express();

app.use(cors);

router.get('/saved', weather.getSavedWeathers);


router.get('/:id', weather.getWeather);
router.post('/', weather.saveWeather);

router.post('/edit', weather.editWeather);

router.post('/delete', weather.deleteWeather);

module.exports = router;