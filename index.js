const express = require('express')
const morgan = require ('morgan')
const cors = require('cors')
const dotenv = require('dotenv')
dotenv.config();

const Contact = require('./models/contact')
const app = express()

morgan.token('body', (req, res) => JSON.stringify(req.body))

app.use(express.static('dist'))
app.use(express.json())
app.use(cors())
app.use(morgan(':method :url :status :response-time ms :res[content-length] - :body'))

app.get('/info', (request, response) => {
  Contact.find({}).then(contacts => {
    response.send(
        `<p>Phonebook has info for ${contacts.length} people</p>
        <p>${new Date()}</p>`
    )
  })
})

app.get('/api/contacts', (request, response) => {
  Contact.find({}).then(contacts => {
    response.json(contacts)
  })
})

app.get('/api/contacts/:id', (request, response, next) => {
  Contact.findById(request.params.id)
    .then(contact => {
      if (contact) {
        response.json(contact)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => {next(error)})
})

app.post('/api/contacts', (request, response, next) => {
  const body = request.body
  if (!body.name) {
    return response.status(400).json({error: 'name missing'})
  }  
  if (!body.number) {
    return response.status(400).json({error: 'number missing'})
  }
  /*
  if (Contact.find({name: body.name}).name) {
    return response. status(409).json({error: 'name already exists'})
  }
  */
  const contact = new Contact({
    name: body.name,
    number: body.number,
  })

  contact.save()
      .then(savedNote => {
      response.json(savedNote)
      })
      .catch(error => next(error))
})

app.delete('/api/contacts/:id', (request, response, next) => {
  Contact.findByIdAndDelete(request.params.id)
    .then(contact => {
      response.json(contact)
    })
    .catch(error => next(error))
})

app.put('/api/contacts/:id', (request, response, next) => {
  const body = request.body

  const contact = {
    id: body.id,
    name: body.name,
    number: body.number
  }
  
  Contact.findByIdAndUpdate(request.params.id, contact, {new: true, runValidators: true, context: 'query'})
    .then(updatedNote => {
      response.json(updatedNote)
    })
    .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({error: "Unknown endpoint"})
}
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({error: error.message})
  } 

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})