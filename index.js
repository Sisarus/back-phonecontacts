const express = require('express')
const app = express()

app.use(express.json())

app.use(express.static('public'))

app.set('view engine', 'ejs')

const morgan = require('morgan')

app.use(morgan('tiny'))

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
  res.json(persons)
})

app.get('/info', (req, res)=>{
  const today = new Date();
  console.log(today)

  const contacts = persons.length
  res.render('info', { contacts, today })
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
  console.log(id)
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

    const checkPerson = persons.find(person => person.name === body.name)
    
    if(checkPerson){
      return res.status(400).json({
        error: 'person is already added. name must be unique'
      })
    }

    const person = {
      name: body.name, 
      number: body.number,
      id: generateId(),
    }

    persons = persons.concat(person)

    res.json(person)
})

const PORT = 3001
app.listen(PORT,()=>{
    console.log(`Server running port ${PORT}`)
})