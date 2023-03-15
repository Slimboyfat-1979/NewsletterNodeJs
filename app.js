const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const app = express();
const https = require('https');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


app.listen(process.env.PORT || 3000, function(){
    console.log("Listening on port 3000");
})

app.get("/failure", function(req, res){
    res.sendFile(__dirname + "/failure.html");
})

app.get("/", function(req, res){
    res.sendFile(__dirname + "/signup.html");
})

app.post("/", function(req, res){
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;

    let data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };

    const url = "https://us21.api.mailchimp.com/3.0/lists/61d25555dc";
    const options = {
        method: "POST",
        auth: "dave1:b95358abba88455495618abc51ca3d39-us21"
    }

   var jsonData = JSON.stringify(data);
   const request =  https.request(url, options, function(response){

        if(response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html");
        }else{
            res.sendFile(__dirname + "/failure.html");
        }

        response.on("data", function(data){
            console.log(JSON.parse(data));
        })
    })

    request.write(jsonData);
    request.end();
})

app.post("/failure", function(req, res){
    res.redirect("/")
})


// API KEY
// b95358abba88455495618abc51ca3d39-us21

// Audience ID
// 61d25555dc