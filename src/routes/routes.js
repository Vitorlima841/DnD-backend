const express = require('express')
const app = express()

app.get('/teste', (req, res) => {
    console.log("aq")
    res.send('hello world')
})

module.exports = app;