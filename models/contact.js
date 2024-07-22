const mongoose = require('mongoose')

mongoose.set('strictQuery', false)
const url = process.env.MONGODB_URL
console.log("Connecting to ", url);

mongoose.connect(url)
    .then(reulst => {
        console.log("Connected to MongoDB")
    })
    .catch(error => {
        console.log("error connecting to MongoDB: ", error.message)
    })


const contactSchema = new mongoose.Schema({
    name: String,
    number: String,
})
contactSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Contact', contactSchema)