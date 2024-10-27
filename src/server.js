const express = require('express'); // Express Framework
const app = express(); // Express Instance
const port = 80;

// App Listen

app.listen(port, function(){
    console.log(`Node Server is running, listening on port ${port} `)
})

