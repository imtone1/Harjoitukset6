//buttoneita ei linkkejä
//url jälkeen ?-merkki, vaikka kaikki muuten toimii >mahdollisesti siitä, ettei täydellinen verkkosivu, mutten osannut määrittää sivua. Vaatisi eri kansion luomista ja sivun renderöintiä kyseiselle html-sivulle.


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

app.use(express.urlencoded({ extended: true }))
// use own made logger middleware in express app
app.use(logger)

let users = 
[
  { 'id':'1', 'name':'Kirsi Kernel' },
  { 'id':'2', 'name':'Matti Mainio' }
]
// get all users
app.get('/users', (request, response) => {
  // response.json(users)
  response.send(listaus())
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
// app.post('/users/', (request, response) => {
//   const maxId = Math.max(...users.map(user => user.id), 0)
//   const user = request.body
//   user.id = (maxId+1).toString() 
//   users = users.concat(user) 
//   response.json(user)
// })

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
  htmlform = `<div style="display: flex">
  <form action="/users" method="GET">
    <button>List users</button>
</form> <form action="/" method="POST">
<button>Add user</button>
</form> </div>
  <form action="/" method="POST">
  Add a new user: <input type=text name="nimi"><br>
  <input type=submit value="add user">
  </form>
`;
response.send(htmlform)
   
  })

  app.post('/', (request, response) => {
    const maxId = Math.max(...users.map(user => user.id), 0)
    const user = request.body
//otetaan nimi input kentästä
    user.name=user.nimi
  
    user.id = (maxId+1).toString() 
    users = users.concat(user) 
   lisays=`<form action="/" method="POST">
   Add a new user: <input type=text name="nimi"><br>
   <input type=submit value="add user">
   </form>`

    response.send(listaus().concat(lisays))
  
})

//funktio jolla listataan users sisällön
function listaus(){
  let yhteensateksti=""
    users.forEach(usir => { 
      
     htmlposti = `
        <tr> <td>${usir.id}</td>
         <td>${usir.name}</td></tr>
         
  `;
yhteensateksti=yhteensateksti+htmlposti; 
      })
    
return teksti=`
<div style="display: flex"> <form action="/users" method="GET">
    <button>List users</button>
</form> <form action="/" method="GET">
<button>Add user</button>
</form> </div>

<table style="border:1px solid black">
     <tr >
       <th>ID</th>
       <th>Name</th>
       </tr>
       
       ${yhteensateksti}
      
         </table>`

}


app.listen(port, () => {
  console.log('Example app listening on port 3000')
})