var express=require('express');
var app=express();
const cookieparser=require('cookie-parser');
var dotenv=require('dotenv');
dotenv.config({path:'./db.env'});
app.use(cookieparser());
app.use(express.static(__dirname));
app.set('view engine','ejs');
const mysql=require('mysql');
const bodyParser=require('body-parser');
var bodyparserEncoder=bodyParser.urlencoded({ extended: false });
var con=mysql.createConnection(
    {
        host: process.env.HOST,
        user: process.env.USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    }
);
temp={
    fullname:'',
    regno:'',
    institute:'',
    year_of_studying:'',
    section:'',
    stchapter:'',
    phone_number:'',
    email:'',
    usernotfound:false
}
con.connect(function(err)
{
    if(err) 
    {
        throw err;
    }
    console.log("Connected.");
})
app.use(bodyparserEncoder);
app.use(bodyParser.json());
app.use('/',require('./routes/pages'));
app.use('/',require('./routes/auth'));
//app.use('/',require('./routes/register'));
//To activate css code
/*app.use((req,res)=>{
    res.sendFile('/pub/404.html',{root:__dirname});
    });*/
console.log(__filename);
app.listen(3000,'localhost',()=>(console.log(`listening on port 3k`)));
//debug('i am working');
