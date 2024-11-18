const express = require('express'); // Express Framework
const app = express(); // Express Instance
const path = require('path');
const port = 80; 

// Paths
const staticPath = path.join(__dirname, "../public");

console.log("StaticPath ",staticPath)

// Middlewares
app.use(express.static(staticPath));

// View Engine
app.set('view engine','hbs')

// Routes

app.get("/", function(request,response){
    response.render("index")
})

// App Listen
app.listen(port, function(){
    console.log(`Node Server is running, listening on port ${port} `)
})

