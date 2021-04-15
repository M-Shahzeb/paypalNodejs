require("dotenv").config();
const ejs = require('ejs');
const express = require('express');
const app = express();
const paypal = require('paypal-rest-sdk');
const sql  = require('./config/database.js');
const port = process.env.DB_PORT || 3000;
const bodyParser = require('body-parser');


app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    if (req.method === 'OPTIONS') {
      res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, OPTIONS');
      res.header('Access-Control-Max-Age', 120);
      return res.status(200).json({});
    }
    next();
  });



  //parser setting 
  // Parser Settings
app.use(express.json());
app.use(bodyParser.json({ type: 'application/*+json' }));
app.use(bodyParser.json({ limit: '50mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.set('view engine','ejs');
// app.use('/',(req,res)=>{res.send("It is working...");});

paypal.configure({
  'mode': 'sandbox', //sandbox or live
  'client_id': 'AS9Gl21VebA-sXpKU_XFX3thMwTZLPiWKRCn1U3zxOdJQNMXBvGqFrL3NMpSna1aVBDfMNiQUpjGnFEJ',
  'client_secret': 'ECo_81awoi3MQKK1Vnx66XeQlHYDhWmtNWIuldST5dZ7b7ai1MRO3gqVlntiV9zA8UhmcO5LNAEg0gHa'
});


app.get('/', (req, res) => res.sendFile(__dirname + "/index.html"));
// const login = require('./routes/auth');
// app.use('/login', login);
app.post('/pay', (req, res) => {
  const create_payment_json = {
    "intent": "sale",
    "payer": {
        "payment_method": "paypal"
    },
    "redirect_urls": {
        "return_url": "http://localhost:3000/success",
        "cancel_url": "http://localhost:3000/cancel"
    },
    "transactions": [{
        "item_list": {
            "items": [{
                "name": "Red Sox Hat",
                "sku": "001",
                "price": "5.00",
                "currency": "USD",
                "quantity": 1
            }]
        },
        "amount": {
            "currency": "USD",
            "total": "5.00"
        },
        "description": "Hat for the best team ever"
    }]
};

paypal.payment.create(create_payment_json, function (error, payment) {
  if (error) {
      throw error;
  } else {
      for(let i = 0;i < payment.links.length;i++){
        if(payment.links[i].rel === 'approval_url'){
          res.redirect(payment.links[i].href);
        }
      }
  }
});

});

app.get('/success', (req, res) => {
  const payerId = req.query.PayerID;
  const paymentId = req.query.paymentId;

  const execute_payment_json = {
    "payer_id": payerId,
    "transactions": [{
        "amount": {
            "currency": "USD",
            "total": "5.00"
        }
    }]
  };

  paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
    if (error) {
        console.log(error.response);
        throw error;
    } else {
        console.log(JSON.stringify(payment));
        res.send('Success');
    }
});
});

app.get('/cancel', (req, res) => res.send('Cancelled'));

app.listen (port, (req,res)=>{
    console.log("database Connected..");
});