var i=0,j;
var s='';
for(i=0;i<5;i++)
{
for(j=0;j<5-i;j++)
{
    s+=String.fromCharCode(j + 65);
}
for(j=0;j<2*i;j++)
s+=(" ");
for(j=3-i+1;j>=0;j--)
{
    if(j==4)
    continue;
    s+=String.fromCharCode(j + 65);
}
s+='\n'
}
console.log(s);