const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let loctionSchema = new Schema({
  city: {
    type: String, index: {
      unique: true,
      dropDups: true
    }
  },

});

module.exports = loctionSchema;