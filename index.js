const express = require('express')
const morgan = require ('morgan')

const app = express()

morgan.token('body', (req, res) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :response-time ms :res[content-length] - :body'))

app.use(express.json())

let contacts = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/info', (request, response) => {
    response.send(
        `<p>Phonebook has info for ${contacts.length}</p>
        <p>${new Date()}</p>`
    
    )
})

app.get('/api/contacts', (request, response) => {
  response.json(contacts)
})

app.get('/api/contacts/:id', (request, response) => {
    const id = request.params.id
    const contact = contacts.find(contact => contact.id === id)
    if (contact) {
        response.json(contact)
    } else {
        response.status(404).end()
    }
})

const generateId = () => {
  const maxId = contacts.length > 0
    ? Math.max(...contacts.map(n => Number(n.id)))
    : 0
  return String(maxId + 1)
}

app.post('/api/contacts', (request, response) => {
  const body = request.body
  if (!body.name) {
    return response.status(400).json({error: 'name missing'})
  }  
  if (!body.number) {
    return response.status(400).json({error: 'number missing'})
  }
  if (contacts.some(contact => contact.name === body.name)) {
    return response. status(409).json({error: 'name already exists'})
  }
  
  const contact = {
    name: body.name,
    number: body.number,
    id: generateId()
  }

  contacts = contacts.concat(contact)
  response.json(contact)
})

app.delete('/api/contacts/:id', (request, response) => {
    const id = request.params.id
    contacts = contacts.filter(contact => contact.id !== id)

    response.status(204).end()
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})