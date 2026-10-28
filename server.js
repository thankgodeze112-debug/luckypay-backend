const express = require('express');
const app = express();
const PORT = process.env.PORT || 10000;
const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY || 'not-set';

app.use(express.json());

// FIX CORS - Allow Netlify frontend
app.use((req,res,next)=>{
  res.header("Access-Control-Allow-Origin","*");
  res.header("Access-Control-Allow-Headers","Content-Type, Authorization");
  res.header("Access-Control-Allow-Methods","GET,POST,OPTIONS");
  if(req.method==='OPTIONS') return res.sendStatus(200);
  next();
});

app.get('/', (req,res)=>res.json({status:"LuckyPay FIXED", secret_set: PAYSTACK_SECRET !== 'not-set', endpoints:["/api/verify","/api/webhook/paystack"]}));

// NEW - For your Netlify to verify payment
app.post('/api/verify', async (req,res)=>{
  try{
    const {reference}=req.body;
    if(!reference) return res.json({status:false, error:"No reference"});
    const r = await fetch(`https://api.paystack.co/transaction/verify/${reference}`,{
      headers:{Authorization:`Bearer ${PAYSTACK_SECRET}`}
    });
    const d = await r.json();
    console.log('Verify result:', d.data?.status);
    if(d.data && d.data.status==='success') res.json({status:true, amount:d.data.amount/100});
    else res.json({status:false, data:d});
  }catch(e){ res.status(500).json({error:e.message}); }
});

app.post('/api/webhook/paystack', (req,res)=>{
  console.log('Paystack Event:', req.body.event);
  if(req.body.event==='charge.success'){
    console.log(`MONEY RECEIVED: N${req.body.data.amount/100} - Send to OPay 7040431972`);
  }
  res.status(200).send('OK');
});

app.listen(PORT, ()=>console.log(`FIXED AND LIVE on ${PORT}`));
