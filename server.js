const app = require("express")();
const UserDAO = require("./services/UserDAO");
const session = require("express-session");
const { request } = require("express");
const MongoDBStore = require("connect-mongodb-session")(session);
const cors = require("cors");
const bodyParser = require("body-parser");

const userDAO = new UserDAO();

const prod = true;

if (prod) {
  const port = 3000;
  app.use(
    session({
      secret: "password",
      saveUninitialized: false,
      resave: false,
      store: new MongoDBStore({
        uri:
          "mongodb://alexuser:alexpwd@localhost:27017/alexdb?authSource=admin",
        collection: "mySessions",
        touchAfter: 24 * 3600,
      }),
      cookie: { maxAge: 24 * 3600 * 1000 },
    })
  );
} else {
  const port = 3057;
  app.use(
    session({
      secret: "password",
      saveUninitialized: false,
      resave: false,
      store: new MongoDBStore({
        uri: "mongodb://127.0.0.1:27017/new_york?authSource=admin",
        collection: "mySessions",
        touchAfter: 24 * 3600,
      }),
      cookie: { maxAge: 24 * 3600 * 1000 },
    })
  );
}

app.use(bodyParser.json());
app.use(cors({ origin: ["http://localhost:4200"], credentials: true }));
app.use(require("express").static(__dirname + "/CERIGame"));

app.post("/login", (req, result) => {
  if (req.body.username && req.body.password) {
    userDAO
      .verifyUser(req.body.username, req.body.password)
      .then((res) => {
        if (res) {
          req.session.isConnected = true;
          req.session.userId = res.id;
          console.log(
            `${req.session.id} expire le ${req.session.cookie.maxAge}`
          );
          req.session.save();
          result.status(200).send(res);
        } else {
          console.log("Bad credentials");
          result.status(401).send("Unauthorized");
        }
      })
      .catch((e) => {
        console.log(e);
        result.status(500).send("Internal Server Error");
      });
  } else {
    result.status(400).send("Bad Request");
  }
});

app.listen(port, () => {
  console.log(`Server launch on port ${port}`);
});
