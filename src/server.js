const express = require('express'); // Express Framework
const app = express(); // Express Instance
const path = require('path');
const port = 80; 

// Paths

const staticPath = path.join(__dirname, "../public");

// Middlewares
app.use(express.static(staticPath));




// App Listen

app.listen(port, function(){
    console.log(`Node Server is running, listening on port ${port} `)
})

