const express = require('express');
const crypto = require('crypto');
const app = express();
const PORT = process.env.PORT || 10000;
const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY || 'test';

app.use(express.json({ verify: (req,res,buf)=>{req.rawBody=buf} }));

app.get('/', (req,res)=>{
  res.json({status:'LuckyPay Engine LIVE', webhook:'/api/webhook/paystack', wema:'9818647669'});
});

app.post('/api/webhook/paystack', (req,res)=>{
  console.log('Paystack Event:', req.body.event);
  if(req.body.event==='charge.success'){
    const amount = req.body.data.amount/100;
    console.log(`MONEY RECEIVED: N${amount}`);
  }
  res.status(200).send('OK');
});

app.listen(PORT, ()=>console.log('LIVE'));
