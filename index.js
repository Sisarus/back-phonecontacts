const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const morgan = require('morgan')

const Person = require('./models/person')

morgan.token('response', (req, res) => {
  return JSON.stringify(res.locals.data);
});

// morgan wont work with tiny :response. So we made put those together, if we want those to same line
const customTiny = ':method :url :status :res[content-length] - :response-time ms :response';

app.use(morgan(customTiny))
app.use(cors())
app.use(express.json())
app.use(express.static('build'))

app.use((req, res, next) => {
  res.data = req.body;
  next();
});

let persons = [
    { 
      name: "Arto Hellas", 
      number: "040-123456",
      id: 1
    },
    { 
      name: "Ada Lovelace", 
      number: "39-44-5323523",
      id: 2
    },
    { 
      name: "Dan Abramov", 
      number: "12-43-234345",
      id: 3
    },
    { 
      name: "Mary Poppendieck", 
      number: "39-23-6423122",
      id: 4
    }
]

app.get('/api/persons', (req, res)=>{
  Person.find({}).then(persons => {
    res.json(persons)
  })
})

app.get('/info', (req, res)=>{
  const today = new Date();
  console.log(today)

  const contacts = persons.length
  res.send(`<p>Phonebook has info for ${contacts} people</p><p>Hello World! ${today}</p>`);
})

app.get('/api/persons/:id', (req, res)=>{
  const id = Number(req.params.id)
  const person = persons.find(person => person.id === id)

  if(person){
    res.json(person)
  } else {
    res.status(404).end()
  }
})

app.delete('/api/persons/:id', (req, res)=>{
  const id = Number(req.params.id)
  persons = persons.filter(person => person.id !== id)

  res.status(204).end()
})

const generateId = () => {
  const maxId = persons.length > 0
    ? Math.max(...persons.map(n => n.id))
    : 0
  return Math.floor(Math.random() * (400000 - maxId + 1)) + maxId
}

app.post('/api/persons', (req, res)=>{
    const body = req.body

    if(!body.name || !body.number) {
      return res.status(400).json({
        error: 'content missing. Name of number'
      })
    }

    const person = new Person({
      name: body.name,
      number: body.number
    })

    person.save().then(savedPerson => {
      res.json(savedPerson)
    })
})

const PORT = process.env.PORT
app.listen(PORT,()=>{
    console.log(`Server running port ${PORT}`)
})