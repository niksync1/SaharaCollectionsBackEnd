const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const shortid = require('shortid');

var productSchema = new Schema({
      id: { 
        type: String,
        default: shortid.generate 
      },
      user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
      title: {
        type: String,
        required: true
    },
      description: {
        type: String,
        required: true
    },
      image: String,
      price: Number,
      tags: [String],
    });

  var Products = mongoose.model('Product', productSchema);
  module.exports = Products;