require('dotenv').config();
const express=require('express');const path=require('path');const helmet=require('helmet');const cors=require('cors');const rateLimit=require('express-rate-limit');const db=require('./config/db');
const authRoutes=require('./routes/auth');const applicationRoutes=require('./routes/applications');
if(!process.env.DATABASE_URL||!process.env.JWT_SECRET){console.error('Missing DATABASE_URL or JWT_SECRET. Copy .env.example to .env and configure it.');process.exit(1);}
const app=express();app.use(helmet({contentSecurityPolicy:false}));app.use(cors());app.use(express.json({limit:'1mb'}));
app.use('/api/auth',rateLimit({windowMs:15*60*1000,limit:30}));app.use('/api/auth',authRoutes);app.use('/api/applications',applicationRoutes);
app.use(express.static(path.join(__dirname,'..','public')));
app.get('/api/health',async(req,res,next)=>{try{await db.query('SELECT 1');res.json({status:'ok',database:'connected'});}catch(e){next(e);}});
app.use((req,res)=>res.status(404).json({error:'Route not found.'}));
app.use((err,req,res,next)=>{console.error(err);res.status(500).json({error:process.env.NODE_ENV==='production'?'Something went wrong.':(err.message||'Internal server error.')});});
const port=process.env.PORT||3000;app.listen(port,()=>console.log(`Job Tracker running at http://localhost:${port}`));
