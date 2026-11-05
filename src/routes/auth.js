const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const router = express.Router();
const tokenFor = user => jwt.sign({ email: user.email }, process.env.JWT_SECRET, { subject: String(user.id), expiresIn: '7d' });
router.post('/register', async (req,res,next) => {
 try {
  const {name,email,password}=req.body;
  if (!name || !email || !password) return res.status(400).json({error:'Name, email and password are required.'});
  if (String(password).length < 8) return res.status(400).json({error:'Password must be at least 8 characters.'});
  const hash=await bcrypt.hash(password,12);
  const result=await db.query('INSERT INTO users(name,email,password_hash) VALUES($1,$2,$3) RETURNING id,name,email',[String(name).trim(),String(email).trim().toLowerCase(),hash]);
  const user=result.rows[0]; res.status(201).json({user,token:tokenFor(user)});
 } catch(err) { if(err.code==='23505') return res.status(409).json({error:'An account with this email already exists.'}); next(err); }
});
router.post('/login', async (req,res,next) => {
 try {
  const {email,password}=req.body;
  if(!email||!password) return res.status(400).json({error:'Email and password are required.'});
  const result=await db.query('SELECT id,name,email,password_hash FROM users WHERE email=$1',[String(email).trim().toLowerCase()]);
  const user=result.rows[0];
  if(!user || !(await bcrypt.compare(password,user.password_hash))) return res.status(401).json({error:'Email or password is incorrect.'});
  res.json({user:{id:user.id,name:user.name,email:user.email},token:tokenFor(user)});
 } catch(err){next(err);}
});
module.exports=router;
