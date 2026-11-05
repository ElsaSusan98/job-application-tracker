const express=require('express');
const db=require('../config/db');
const requireAuth=require('../middleware/auth');
const router=express.Router();
const STATUSES=['Saved','Applied','Interview','Offer','Rejected'];
function validate(body){
 if(!body.company||!body.job_title)return 'Company and job title are required.';
 if(body.status&&!STATUSES.includes(body.status))return 'Invalid application status.';
 if(body.job_url&&!/^https?:\/\//i.test(body.job_url))return 'Job URL must start with http:// or https://.';
 return null;
}
router.use(requireAuth);
router.get('/stats',async(req,res,next)=>{try{const r=await db.query(`SELECT COUNT(*)::int total,COUNT(*) FILTER(WHERE status='Applied')::int applied,COUNT(*) FILTER(WHERE status='Interview')::int interviews,COUNT(*) FILTER(WHERE status='Offer')::int offers,COUNT(*) FILTER(WHERE status='Rejected')::int rejected FROM applications WHERE user_id=$1`,[req.user.id]);res.json(r.rows[0]);}catch(e){next(e);}});
router.get('/',async(req,res,next)=>{try{
 const {status,search}=req.query;const values=[req.user.id];let where='WHERE user_id=$1';
 if(status&&STATUSES.includes(status)){values.push(status);where+=` AND status=$${values.length}`;}
 if(search){values.push(`%${String(search).trim()}%`);where+=` AND (company ILIKE $${values.length} OR job_title ILIKE $${values.length})`;}
 const r=await db.query(`SELECT id,company,job_title,location,job_url,status,applied_date,notes,created_at,updated_at FROM applications ${where} ORDER BY applied_date DESC,created_at DESC`,values);res.json(r.rows);
 }catch(e){next(e);}});
router.post('/',async(req,res,next)=>{try{
 const error=validate(req.body);if(error)return res.status(400).json({error});
 const {company,job_title,location,job_url,status,applied_date,notes}=req.body;
 const r=await db.query(`INSERT INTO applications(user_id,company,job_title,location,job_url,status,applied_date,notes) VALUES($1,$2,$3,$4,$5,$6,COALESCE($7::date,CURRENT_DATE),$8) RETURNING *`,[req.user.id,company.trim(),job_title.trim(),location||null,job_url||null,status||'Applied',applied_date||null,notes||null]);res.status(201).json(r.rows[0]);
 }catch(e){next(e);}});
router.put('/:id',async(req,res,next)=>{try{
 const error=validate(req.body);if(error)return res.status(400).json({error});
 const {company,job_title,location,job_url,status,applied_date,notes}=req.body;
 const r=await db.query(`UPDATE applications SET company=$1,job_title=$2,location=$3,job_url=$4,status=$5,applied_date=COALESCE($6::date,applied_date),notes=$7,updated_at=NOW() WHERE id=$8 AND user_id=$9 RETURNING *`,[company.trim(),job_title.trim(),location||null,job_url||null,status||'Applied',applied_date||null,notes||null,req.params.id,req.user.id]);
 if(!r.rowCount)return res.status(404).json({error:'Application not found.'});res.json(r.rows[0]);
 }catch(e){next(e);}});
router.delete('/:id',async(req,res,next)=>{try{const r=await db.query('DELETE FROM applications WHERE id=$1 AND user_id=$2 RETURNING id',[req.params.id,req.user.id]);if(!r.rowCount)return res.status(404).json({error:'Application not found.'});res.json({message:'Application deleted.'});}catch(e){next(e);}});
module.exports=router;
