const mongoose = require("mongoose");
const locationSchema = require("../models/weatherModel");

const Location = mongoose.model('Locations', locationSchema);

// DB Connection


mongoose.connect("mongodb+srv://dbWeather:Weather123456@cluster0-8q3nj.mongodb.net/test?retryWrites=true&w=majority", { useNewUrlParser: true })
  .then(() => console.log('MongoDB Connected...'))
  .catch((err) => console.log(err));

const connection = mongoose.connection;

connection.once('open', function () {
  console.log('Mongose database connection succeeded');
})

const axios = require("axios");
const api = {
  key: "0c53097df64de3f955a9789a45cf2303",
  base: "https://api.openweathermap.org/data/2.5/"
};


exports.getSavedWeathers = (req, res) => {

  Location.find().select({ city: 1 })
    .then(resp => {
      let location_data_array = [];

      let result = resp;
      let location_array = [];
      for (let i = 0; i < result.length; i++) {
        location_array.push(result[i].city);
      }

      res.send(location_array);
      console.log('Location Array', location_array);
      // Now lets get the weather for each location in the array: 
      location_array.map(location => {

        let query = location;
        let uri = `${api.base}weather ? q = ${query} & units=imperial & APPID=${api.key}`;

        const url = uri.replace(/ /g, '');
        console.log('URL', url);
        axios.get(url)
          .then(resp => {
            const result = {
              "temp": resp.data.main.temp,
              "pressure": resp.data.main.pressure,
              "humidity": resp.data.main.humidity,
              "city": resp.data.name,
              "country": resp.data.sys.country
            }
            location_data_array.push(JSON.stringify(result));
            console.log(location_data_array);

          })
          .catch(err => console.log(err));
        console.log(location_data_array);

      })


    })
    .catch(err => { console.log(err) });

  // res.send(JSON.parse(location_data_array));


}


exports.getWeather = (req, res) => {


  let query = (req.params.id);
  console.log('Query:', query);
  let uri = `${api.base}weather ? q = ${query} & units=imperial & APPID=${api.key}`;

  const url = uri.replace(/ /g, '');
  console.log('URL', url);

  axios.get(url)
    .then(resp => {
      const result = {
        "temp": resp.data.main.temp,
        "pressure": resp.data.main.pressure,
        "humidity": resp.data.main.humidity,
        "city": resp.data.name,
        "country": resp.data.sys.country
      }


      console.log('Get Weather', result);
      res.send(result);
    })

    .catch(err => console.log(err));
}


exports.saveWeather = (req, res) => {
  let location = req.body.location;

  let query = location;
  let uri = `${api.base}weather ? q = ${query} & units=imperial & APPID=${api.key}`;

  const url = uri.replace(/ /g, '');
  console.log('URL', url);
  // Check if the location exists on REST API 
  axios.get(url)
    .then(resp => {

      const location_check = resp.data.name;
      if (location_check) {
        let location_to_save = location_check;

        // console.log('Location to save:', location_to_save);


        let location = new Location({
          city: location_to_save
        });
        location.save()
          .then(location => {
            res.status(200).json({ 'todo': `${location} Added Succesfully` });
            console.log('Location Saved to DB', location);
          })
          .catch(err => {
            res.status(400).send('adding new location failed', err);
            console.log('Location Saved FAILED', err);
            res.send('Location Saved FAILED', err);
          });
      }
    })

    .catch(err => {
      // console.log(err);

      console.log('CODE:', err.isAxiosError);
      const error = err.isAxiosError;
      if (error) {
        console.log('Location Not Found: Check Spelling')
        res.send('Location Not Found: Check Spelling');
      }

    });
}

exports.editWeather = (req, res) => {

  let location = req.body.location;
  let replacement = req.body.replacement;
  console.log(location);
  // res.send('loc', location);
  // Location.find({location})
  Location.update({ 'city': location }, { $set: { "city": replacement } }, { upsert: true }, function (err, doc) {
    if (err) {
      console.log(err);
    }
    if (doc) {
      console.log(doc);
    }
  });
}


exports.deleteWeather = (req, res) => {
  let location = req.body.data;
  console.log('Value', location);

  Location.deleteMany({ 'city': location }, (err, doc) => {
    if (err) console.log("There was an error", err);
    else {
      res.send("Deleted Succesful")
    }
  })

}
