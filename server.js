const app = require('express')()
const port = 3000

app.use(require('express').static(__dirname + '/CERIGame'))

app.get('/login', (req, res) => {
    console.log(`username: ${req.query.username}   password: ${req.query.password}`);
    res.sendFile(__dirname + '/CERIGame/index.html')
})

app.listen(port, () => {
    console.log(`Server launch on port ${port}`)
})