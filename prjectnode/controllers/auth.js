const e = require('express');
const mysql=require('mysql');
const bcrypt=require('bcrypt');
const jwt= require('jsonwebtoken');
const {promisify} = require('util')
var con=mysql.createConnection(
    {
        host: process.env.HOST,
        user: process.env.USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    }
);
details={
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
var search=(req,res)=>
{
details['invalidity']=false;
details['usernotfound']=false;
console.log(details);
if(!req.body['search'].length)
{
 details['invalidity']=true;
 return res.render('search',{details});
}
//else


con.query(`select * from userdetails where regno=${req.body['search']}`,function(err,result,fields)
{
if(err)
{
console.log('err');
}
else
{
console.log('success');
if(result.length>0)
{
details=result[0];
}
else
{
    details['usernotfound']=true;
}
res.render('search',{details});
}
}
);
}
const userpage= async (req,res)=>
{
    var hashedpassword=await bcrypt.hash(req.body['password'],8);
    console.log('User ',req.body);
    con.query(`update register set email="${req.body['email']}", password="${hashedpassword}" where id="${req.body['id']}"`);
    con.query(`update userdetails set email="${req.body['email']}", password="${req.body['password']}", fullname="${req.body['fullname']}",regno="${req.body['rgno']}",
    institute="${req.body['inst']}", year_of_studying="${req.body['yst']}",section="${req.body['sec']}", 
    stchapter="${req.body['stchapter']}", phone_number="${req.body['phn']}" where id="${req.body['id']}"`);
    message={
        fullname : req.body['fullname'],
        regno : req.body['rgno'],
        password : req.body['password'],
        institute : req.body['inst'],
        year_of_studying : req.body['yst'],
        section : req.body['sec'],
        stchapter : req.body['stchapter'],
        phone_number : req.body['phn'],
        email : req.body['email'],
        id : req.body['id']
    }
    res.status(200).render('userpage',message);
}
var register=(req,res)=>
{
    console.log(req.body);
    con.query(`select * from register where email="${req.body['email']}";`,async function(err,result,fields)
    {
        if(err)
        {
        console.log('err');
        }
        else
        {
     if( result.length>0 && result[0]['email']== req.body['email'])
     {
         return res.render('register',{message : "Mail already exits!"});
     }
     else if(req.body['password']!=req.body['cnfpassword'])
     {
        return res.render('register',{message : "Passwords do not match."});
     }
     var hashedpassword=await bcrypt.hash(req.body['password'],8);
     console.log(hashedpassword.length);
     con.query(`insert into register (email,password) values ("${req.body['email']}","${hashedpassword}")`,(err)=>
     {
      if(err)
      {
          console.log('reg err');
      }
      console.log('registered');
      res.render('register',{message: 'Registered Successfully.'});
      con.query(`select * from register where email= "${req.body['email']}"`,(err,result)=>
      {
        //console.log(result[0]);
        con.query(`insert into userdetails (fullname,email,password,phone_number,regno,id) values ("${req.body['fullname']}","${req.body['email']}","${req.body['password']}",
        "${req.body['phn']}","${req.body['regno']}","${result[0]['id']}") `,(err)=>
        {
         if(err)
         {
             console.log("error in userpage");
         }
        });
      });
     });
    }
}
    );
}
try
{
var login= async (req,res)=>
{
//console.log(req.body);
con.query(`select * from register where email = "${req.body['email']}";`,(err,result)=>
{
if(err)
{
    console.log("Error");
}
else
{
    //console.log(await bcrypt.compare(req.body['password'],result[0]['password']));
    if(result.length==0 || !(bcrypt.compareSync(req.body['password'],result[0]['password']))  )
    {
       return  res.status(401).render('login',{
            message : "Invalid credentials, Please try again"
        })

    }
   //console.log(result);
   const id=result[0]['id'];
   const token=jwt.sign({id},process.env.JWT_PASS,{
       expiresIn: "8d"
   });
con.query(`select * from userdetails where email = "${req.body['email']}";`,(errorr,reslt)=>
{
if(errorr)
{
    console.log("Erorr here");
}
const cookieOptions=
   {
       expires: new Date(Date.now()+ process.env.COOKIE_EXPIRATION*24*60*60), 
       httpOnly: true
   }
   res.cookie('Mycookie',token,cookieOptions);
  message={
    fullname : reslt[0]['fullname'],
    regno : reslt[0]['regno'],
    password : reslt[0]['password'],
    institute : reslt[0]['institute'],
    year_of_studying : reslt[0]['year_of_studying'],
    section : reslt[0]['section'],
    stchapter : reslt[0]['stchapter'],
    phone_number : reslt[0]['phone_number'],
    email : reslt[0]['email'],
    id : reslt[0]['id']
}
   res.status(200).render('userpage',message);
});
}
});
}
}
catch(error)
{
    console.log(error);
}
var Isloggedin= async (req,res,next)=>
{
    //console.log("fdv");
    if(req.cookies['Mycookie'])
    {
        //req.user="dgfdv";
        //next();
        try 
        {
            const decoded= await promisify(jwt.verify)(req.cookies['Mycookie'],process.env.JWT_PASS);
            console.log(decoded);
            con.query(`select * from register where id="${decoded['id']}"`,async (err,result,)=>{
             //console.log(result);
             if(!result)
             {
                 return next();
             }
             req.user=result[0];
             return next();
            });
        } catch (error) {
            console.log(error);
            return next();
        }
    }
    else
    next();
}
var logout= async (req,res)=>
{
    res.cookie('Mycookie','logout',{
        expires:new Date(Date.now() + 2*1000),
        httpOnly:true
    });
    res.status(200).redirect('/login');
}
const imageeupload= (req,res)=>
{
    console.log(req.body);
    con.query(`update set image=${req.body['filename']} where id=${req.body['id']}`);

}
module.exports ={search,register,login,Isloggedin,logout,userpage,imageeupload};