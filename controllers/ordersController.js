const Order= require('../models/orders');

// @desc Get all orders 
// @route GET /orders
// @access Public
const getAllOrders = async (req, res) => {
      // Get all orders from MongoDB
  const orders = await Order.find();
    res.send(orders);
  }

// @desc Create new order
// @route POST /order
// @access Private
const createNewOrders = async (req, res) => {
if (
      !req.body.name ||
      !req.body.email ||
      !req.body.address ||
      !req.body.total ||
      !req.body.cartItems
    ) {
      return res.send({ message: "Data is required." });
    }
    const order = await Order(req.body).save();
    res.send(order);
  }

// @desc Update a order
// @route PATCH /order
// @access Private
const updateOrder = async (req, res) => {
  const { id, email, name, address, price,total, completed, cartItems} = req.body

  // Confirm data
  if (!id || !email || !name || !address || !total || !completed || !cartItems) {
      return res.status(400).json({ message: 'All fields are required' })
  }

  // Confirm order exists to update
  const order = await Order.findById(id).exec()

  if (!order) {
      return res.status(400).json({ message: 'Order not found' })
  }

  // Check for duplicate title
  const duplicate = await Order.findOne({ title }).collation({ locale: 'en', strength: 2 }).lean().exec()

  // Allow renaming of the original Order 
  if (duplicate && duplicate?._id.toString() !== id) {
      return res.status(409).json({ message: 'Duplicate Order title' })
  }

  order.id = id
  order.email = email
  order.name = name
  order.address = address
  order.total = total
  order.completed = completed
  order.cartItems = cartItems
  
  const updatedOrder = await order.save()

  res.json(`'${updatedOrder.title}' updated`)
}


const deleteOrder = async (req, res) => {
    const { id } = req.body

    // Confirm data
    if (!id) {
      return res.status(400).json({ message: 'Order ID required' })
  }
    // Confirm order exists to delete 
  const order = await Order.findById(id).exec()

  if (!order) {
      return res.status(400).json({ message: 'Order not found' })
  }

  const result = await order.deleteOne()

  const reply = `Order '${result.title}' with ID ${result._id} deleted`

  res.json(reply)
}

module.exports = {
  getAllOrders,
  createNewOrders,
  updateOrder,
  deleteOrder
}
  