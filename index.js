// const http = require('http')

// const hostname = '127.0.0.1'
// const port = 3000

// const server = http.createServer((req, res) => {
//   res.statusCode = 200
//   res.setHeader('Content-Type', 'text/plain')
//   res.end('Hello World!')
// })

// server.listen(port, hostname, () => {
//   console.log(`Server running at http://${hostname}:${port}/`)
// })


const express = require('express') 
const app = express()
const port = 3000
// Use JSON parser
app.use(express.json())
// create logger
const logger = (request, response, next) => {
  const date = new Date()
  const lDate = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`
  const log = `Example app listening on port 3000\n ${lDate}: ${request.method} ${request.url}\n`
  console.log(log)
  const fs = require('fs')
  const counterfile ='./lokitieto.txt'
  fs.writeFile(counterfile, log, (error) => {
        if (error) console.error(error)
    })
  next()
}

// use own made logger middleware in express app
app.use(logger)

let users = 
[
  { 'id':'1', 'name':'Kirsi Kernel' },
  { 'id':'2', 'name':'Matti Mainio' }
]
// get all users
app.get('/users', (request, response) => {
  response.json(users)
})

// get one user
app.get('/users/:id', (request, response) => {
  //const id = request.params.id // note how you can do this in different ways!
  const { id } = request.params
  const user = users.find(user => user.id === id)
  // check if user exists or return 404
  if (user) response.json(user)
  else response.status(404).end()
  
})

// delete one user
app.delete('/users/:id', (request, response) => {
  //const id = request.params.id
  const { id } = request.params
  users = users.filter(user => user.id !== id)
  // Just send "204 no content" status code back
  response.status(204).end()
})

// create a new user
app.post('/users/', (request, response) => {
  const maxId = Math.max(...users.map(user => user.id), 0)
  const user = request.body
  user.id = (maxId+1).toString() 
  users = users.concat(user) 
  response.json(user)
})

// update user data
app.put('/users/:id', (request, response) => {
  //const id = request.params.id
  const { id } = request.params
  // const name = request.query.name
  const { name } = request.query
  const user = users.find(user => user.id === id)
  if (user) {
    user.name = name
    response.status(200).end()
  } else {
    response.status(204).end()
  }
})

// define endpoint
app.get('/', (request, response) => {
    response.send('Hello from server side!')
  })

app.get('/hello', (request, response) => {
    response.send('Hello Express!')
  })

  // define some data as a JSON format
let testPerson = {'name':'Kirsi Kernel'}

app.get('/person', (request, response) => {
  response.json(testPerson)
})

app.post('/person', (request, response) => {
    // get request body with JSON
    const body = request.body
    console.log(body.name)
    console.log(body.age)
    console.log(body.email)
    response.send('POST HTTP received!')
  
  })
  
app.listen(port, () => {
  console.log('Example app listening on port 3000')
})