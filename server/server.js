
const express = require('express')
const path = require('path')
const projectRoot = path.resolve()
const mongo = require('mongoose')
const clientController = require('./controllers/clientController')
const PropertiesReader = require('properties-reader')
const properties = PropertiesReader(path.resolve(projectRoot, 'server/config.properties'))

const app = express()
const clientHtmlPath = path.resolve(projectRoot, "client/html")


app.use("/styles", express.static(path.resolve(projectRoot, "client/styles")))
app.use("/images", express.static(path.resolve(projectRoot, "client/images")))
app.use("/fonts", express.static(path.resolve(projectRoot, "client/fonts")))
app.use("/src", express.static(path.resolve(projectRoot, "client/src")))

//app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.listen(properties.get("port"), function () {
    console.log("started")
})

mongo.connect('mongodb://localhost:27017/hospetal', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(res => {
    console.log("DB Connected!")
}).catch(err => {
    console.log(Error, err.message);
});

app.get('/', (req, res) =>{
    res.sendFile(path.resolve(clientHtmlPath, "index.html"))
})

app.post('/authorization', (req, res) =>{

    if(req.body.authorization_type === 'login'){
        clientController.login(req, res)
    }
    else if(req.body.authorization_type === 'signup'){
        clientController.signup(req, res)
    }

   // res.sendStatus(200)
})

app.get('/clientPage', (req, res) =>{
    console.log("somethong")
    res.sendFile(path.resolve(clientHtmlPath, "clientPage.html"))
})