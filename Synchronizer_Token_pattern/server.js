const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

const csrfCtrl = require('./controllers/controller');
app.use('/',express.static(__dirname + '/view/Login'));
app.use('/app',express.static(__dirname + '/view/Form'));
app.use('/UserLogIn', csrfCtrl);

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/view/Login/login.html')
});
app.get('/app/Form', function (req, res) {
    res.sendFile(__dirname + '/view/Form/NewPage.html')
});
app.listen(3000, function () {
    console.log('Application running on port 3000!')
});

