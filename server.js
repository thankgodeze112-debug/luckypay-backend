const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();
app.use(cors()); 
app.use(express.json());

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY;
const PORT = process.env.PORT || 10000;

app.get('/', (req,res)=>{
  res.json({
    message: "LuckyPay FINAL - REAL TITAN DVA - FIXED",
    secret_set: !!PAYSTACK_SECRET,
    dva_accounts: [
      { bank: "Paystack-Titan", account_number: "9628801917", account_name: "EZE THANKGOD", created: "Oct 23, 2026", status: "ACTIVE", type: "REAL DVA" },
      { bank: "Wema Bank", account_number: "9818647669", account_name: "EZE THANKGOD", created: "Oct 23, 2026", status: "ACTIVE", type: "REAL DVA" }
    ],
    settlement: "TITAN TRUST 9628801917 - EZE THANKGOD",
    bn: "9958196 VERIFIED",
    customer_emails: ["thankgodeze112@gmail.com","luckypaysupport9@gmail.com"],
    paystack_id: "2065094",
    live: true
  });
});

app.post('/api/verify', (req,res)=> res.json({status:true, live:true, settlement:"TITAN 9628801917"}));

app.post('/api/create-dva', async (req,res)=>{
  try{
    const { email, first_name, last_name, phone } = req.body;
    const response = await axios.post('https://api.paystack.co/dedicated_account',
      { email, first_name: first_name||"ThankGod", last_name: last_name||"EZE", phone: phone||"09020076398", preferred_bank: "titan-bank", country: "NG" },
      { headers: { Authorization: `Bearer ${PAYSTACK_SECRET}`, 'Content-Type':'application/json' } }
    );
    res.json({status:true, data: response.data.data});
  }catch(err){
    res.status(500).json({error: err.response?.data || err.message, hint: "Ensure PAYSTACK_SECRET_KEY is set and Titan DVA enabled"});
  }
});

app.get('/api/dva-list', async (req,res)=>{
  try{
    const response = await axios.get('https://api.paystack.co/dedicated_account?perPage=50',
      { headers: { Authorization: `Bearer ${PAYSTACK_SECRET}` } }
    );
    res.json(response.data);
  }catch(err){ res.status(500).json({error: err.message}); }
});

app.listen(PORT, ()=> console.log(`FINAL LuckyPay REAL DVA on ${PORT}`));
