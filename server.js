const app = require('express')();
const UserDAO = require('./services/UserDAO')
const session = require('express-session');
const { request } = require('express');
const MongoDBStore = require('connect-mongodb-session')(session);

const port = 3000;
const userDAO = new UserDAO()

app.use(require('express').static(__dirname + '/CERIGame'));
app.use(session({
    secret: 'password',
    saveUninitialized: false,
    resave: false,
    store: new MongoDBStore({
        uri: 'mongodb://alexuser:alexpwd@localhost:27017/alexdb?authSource=admin',
        collection: 'mySessions',
        touchAfter: 24*3600,

    }),
    cookie: {maxAge:24*3600*1000}
}))

app.get('/login', (req, result) => {
    if (req.query.username && req.query.password) {
        userDAO.verifyUser(req.query.username, req.query.password).then((res) => {
            if (res) {
                req.session.isConnected = true;
                req.session.username = req.query.username;
                console.log(`${req.session.id} expire le ${req.session.cookie.maxAge}`);
            } else {
                console.log('Bad credentials')
            }
            result.sendFile(__dirname + '/CERIGame/index.html');

        }).catch((e) => {
            console.log(e)
        })
    } else {
        result.sendFile(__dirname + '/CERIGame/index.html');
    }
})

app.listen(port, () => {
    console.log(`Server launch on port ${port}`);
})