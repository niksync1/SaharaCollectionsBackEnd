const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const shortid = require('shortid');

var orderSchema = new Schema(
  {
        id: {
              type: String,
              default: shortid.generate,
                  },
        email: {
                type: String,
                required: true
                  },
        Customer: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: 'User'
              },
        address: {
                type: String,
                    },
        total: {
                type: Number,
                required: true
                    },
        completed:{
          type: Boolean,
          default: false
                     }, 
        cartItems: [
                      {
                        id: String,
                        user: {
                          type: mongoose.Schema.Types.ObjectId,
                          required: true,
                          ref: 'User'
                            },
                        title: String,                       
                        description: {
                          type: String,
                          required: true
                            },
                        image: String,
                        price: {
                          type: Number,
                          required: true
                              },
                        count: {
                          type: Number,
                          required: true
                              },
                      }
                    ],
      },
      {
        timestamps: true,
      }
    );
  
    var Orders = mongoose.model('Order', orderSchema);
    module.exports = Orders;