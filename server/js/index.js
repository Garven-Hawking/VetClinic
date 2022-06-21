const express = require('express')
const path = require('path')

const app = express()
const port = 8000

app.use(express.static(path.join(__dirname, "..", "..", "client/styles")))

app.listen(port, function () {
    console.log("started")
})

app.get('/', (req, res) =>{
    res.sendFile(path.join(__dirname, "..", "..", "/client/html/index.html"))
})