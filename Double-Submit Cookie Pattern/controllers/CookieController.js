const express = require('express');
const crypto = require('crypto');
const router = express.Router();
const app = express();
let salt = null;
let sesion_id = null;
let Token_Value = null;
router.post('/authenticating',(req,res) => {
    console.log('login body== ', req.body);
    if(req.body.username == "Yomali" && req.body.password == "Abc123"){
        sesion_id = getSessionID();
        salt = salting(14);
        Token_Value = GenerateTocken(sesion_id,salt);
        console.log("session id==",sesion_id);
        console.log("salt value",salt);
        console.log("token value",Token_Value);
        res.cookie('sesion_id', sesion_id, { maxAge: 900000, httpOnly: false });
        res.cookie('Token_Value', Token_Value, { maxAge: 900000, httpOnly: false });
        console.log("Successfully logged in");
        res.redirect('/app/Form');
    }
    else {
        res.json({ success: false, message: 'Login failed check your password and username!!' });
    }
});
//validating token
router.post("/ValidatingTocken",(req,res)=> {
    var sessionId = req.cookies.sesion_id;
    var token = req.body.CSRFtoken;
    var Cookietoken = req.cookies.Token_Value;
    if (sessionId == sesion_id &&  token == Token_Value){
        res.redirect('/app/Form?failed=false');
    }
    else{
        res.redirect('/app/Form?failed=true');
    }
});
//generate a salt
function salting(length) {
    return crypto.randomBytes(Math.ceil(length/2)).toString('hex').slice(0,length);
}
//generate a token
function GenerateTocken(sesion_id,salt) {
    var hashing = crypto.createHmac('sha512', salt);
    hashing.update(sesion_id);
    return hashing.digest('hex');
}
//generate a session id
function getSessionID() {
    var ab = crypto.createHash('sha256');
    ab.update(Math.random().toString());
    return ab.digest('hex');
}

module.exports = router;