const express = require('express');
const crypto = require('crypto');
const router = express.Router();
const app = express();
let salt = null;
let sesion_id = null;
let Token_Value = null;
router.post('/authenticating',(req,res) => {
    console.log("inside Ctrl");
    console.log('login body== ', req.body);
    if(req.body.username == "Yomali" && req.body.password == "Abc123"){
        sesion_id = getSessionID();
        salt = salting(14);
        Token_Value = GenerateTocken(sesion_id,salt);
        console.log("session id==",sesion_id);
        console.log("salt",salt);
        console.log("token",Token_Value);
        res.cookie('sesion_id', sesion_id, { maxAge: 900000, httpOnly: false });
        console.log("Successfully logged in");
        res.redirect('/app/Form');
    }
    else {
        res.json({ success: false, message: 'username or password is incorrect!!' });
    }
});
//passing the token
router.post("/getTheToken",(req,res) =>{
    var sesId = req.body.sesion_id;
    if (sesId === sesion_id)
    {
        res.json({ failed: false, CSRF: Token_Value });
    } else {
        res.json({ failed: true });
    }
});
//validating csrf token
router.post("/tokenValidation",(req,res)=> {
    var sessionId = req.cookies.sesion_id;
    var token = req.body.CSRFtoken;
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
    var hashingVal = crypto.createHmac('sha512', salt);
    hashingVal.update(sesion_id);
    return hashingVal.digest('hex');
}
//generate a session id
function getSessionID() {
    var sessionVal = crypto.createHash('sha256');
    sessionVal.update(Math.random().toString());
    return sessionVal.digest('hex');
}

module.exports = router;