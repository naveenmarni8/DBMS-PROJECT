//alert(document.getElementsByClassName('inp')[0].g);
//alert(document.getElementsByName('full-name')[0].value);
//a.value='Naveen';
function myfun()
{
    
   Validator(0);
   Validator(1);
   Validator(2);
   Validator(3);
   Validator(4);
}
function Validator(ind)
{
    var a=document.getElementsByClassName('inp')[ind].getElementsByTagName('input')[0]; 
    var f=document.getElementsByClassName('inp')[ind].getElementsByTagName('span')[0];
    f.style.color="white";
    if(a.value=='')
    {
        f.innerHTML="*Mandatory Field";
        
    }
    else if(ind==1)
    {
        var x=a.value.indexOf("@")+1;
        var y=a.value.slice(x,a.value.length)
        if(y!='gmail.com' || y!='yahoo.com' || y!='gitam.in' || y!='gitam.edu' )
        f.innerHTML="*Invalid mail Id";
    }
    else
    {
     f.innerHTML='';
    }
}