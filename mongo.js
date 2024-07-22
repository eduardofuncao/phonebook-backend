const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('give password as argument')
    process.exit(1)
}


const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url =
    `mongodb+srv://eduardofuncao:${password}@cluster0.pjmmbnv.mongodb.net/phoneBook?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const contactSchema = new mongoose.Schema({
    name: String,
    number: Number,
})

const Contact = mongoose.model('Contact', contactSchema)

if (process.argv.length < 5) {
    Contact.find({}).then(result => {
        result.forEach(contact => {
            console.log(`${contact.name} ${contact.number}`)
        })
        mongoose.connection.close()
    })
} else {
    const contact = new Contact({
        name: name,
        number: number
    })

    contact.save().then(result => {
        console.log(`added ${name} number  ${number} to the phonebook`)
        mongoose.connection.close()
    }) 
}
