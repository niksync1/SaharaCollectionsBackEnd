const Product= require('../models/products');
const User = require('../models/User')

// @desc Get all products 
// @route GET /products
// @access Public
const getAllProducts = async (req, res) => {
      // Get all products from MongoDB
    const products = await Product.find();

     // If no products 
     if (!products?.length) {
      return res.status(400).json({ message: 'No products found' })
  }

    // Add username to each products before sending the response 
    // See Promise.all with map() here: 
    // You could also do this with a for...of loop
    const productsWithUser = await Promise.all(products.map(async (product) => {
      const user = await User.findById(product.user).lean().exec()
      return { ...product, username: user.username }
  }))
    res.send(productsWithUser);
  }

// @desc Create new product
// @route POST /product
// @access Private
const createNewProduct = async (req, res) => {
  const { user, title, description, image, price, tags } = req.body

  // Confirm data
  if (!user || !title || !description || !image || !price || !tags) {
      return res.status(400).json({ message: 'All fields are required' })
  }

  // Check for duplicate product
  const duplicate = await Product.findOne({ title }).collation({ locale: 'en', strength: 2 }).lean().exec()
  if (duplicate) {
      return res.status(409).json({ message: 'Duplicate product' })
  }

  const productObject = { user, title, description, image, price, tags}

  // Create and store new product 
  const product = await Product.create(productObject)

  if (product) { //created 
      res.status(201).json({ message: `New product ${title} created` })
  } else {
      res.status(400).json({ message: 'Invalid product data received' })
  }
}  

// @desc Update a product
// @route PATCH /product
// @access Private
const updateProduct = async (req, res) => {
  const { id, user, title, description, image, price, tags} = req.body

  // Confirm data
  if (!id || !user || !title || !description || !image || !price || !tags) {
      return res.status(400).json({ message: 'All fields are required' })
  }

  // Confirm product exists to update
  const product = await Product.findById(id).exec()

  if (!product) {
      return res.status(400).json({ message: 'Product not found' })
  }

  // Check for duplicate title
  const duplicate = await Product.findOne({ title }).collation({ locale: 'en', strength: 2 }).lean().exec()

  // Allow renaming of the original Product 
  if (duplicate && duplicate?._id.toString() !== id) {
      return res.status(409).json({ message: 'Duplicate Product title' })
  }

  product.user = user
  product.title = title
  product.description = description
  product.image = image
  product.price = price
  product.tags = tags

  const updatedProduct = await product.save()

  res.json(`'${updatedProduct.title}' updated`)
}

const deleteProduct = async (req, res) => {
  const { id } = req.body

  // Confirm data
  if (!id) {
      return res.status(400).json({ message: 'Product ID required' })
  }

  // Confirm product exists to delete 
  const product = await Product.findById(id).exec()

  if (!product) {
      return res.status(400).json({ message: 'Product not found' })
  }

  const result = await product.deleteOne()

  const reply = `Product '${result.title}' with ID ${result._id} deleted`

  res.json(reply)
}

module.exports = {
  getAllProducts,
  createNewProduct,
  updateProduct,
  deleteProduct
}