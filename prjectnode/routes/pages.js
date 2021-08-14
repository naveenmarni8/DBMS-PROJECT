const express= require('express');
const router= express.Router();
const authController=require('../controllers/auth');
router.get('/',(req,res)=>
{
//res.sendFile('/pub/register.html',{root:__dirname});
//details=temp;
res.render('home');
});

router.get('/search',authController.Isloggedin,(req,res)=>
{
    if(req.user)
    {
    details=temp;
    res.render('search',details);
    }
    else
    res.redirect('/login');
    
});
message={
    fullname : "",
    regno : "",
    password : "",
    institute : "",
    year_of_studying : "",
    section : "",
    stchapter : "",
    phone_number : "",
    email : ""
}
router.get('/userpage',authController.Isloggedin,(req,res)=>
{
    //console.log(req.user);
    if(req.user)
    res.render('userpage',message);
    else
    res.redirect('/login');
});
router.get('/register',(req,res)=>
{
res.render('register',{message: ""});
});

router.get('/login',(req,res)=>
{
res.render('login',{message:""});
});

module.exports= router;