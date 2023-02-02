//npm init -y
//npm install express -s

const { urlencoded, application } = require("express");
const { report } = require("process");
var expressKuch = require("express");
var path = require("path");
var app = expressKuch();
var fileuploader = require("express-fileupload");
var mysql = require("mysql");
const { addAbortSignal } = require("stream");
app.use(expressKuch.urlencoded('extended:true'));//converts binary to object

app.use(fileuploader());

//used to serve .js and .css files from public folder
app.use(expressKuch.static("public"));

app.listen(2003, function () {
    console.log("Server Started");
})

var dbConfiguration = {
    host: "localhost",//fixed
    user: "root",//fixed
    password: "",
    database: "table",//database table in XAMPP
}

var refDB = mysql.createConnection(dbConfiguration);
refDB.connect(function (err) {
    if (err) {
        console.log(err);
    }
    else {
        console.log("Database connected successfully");
    }
})

app.get("/index",function(req,resp){
    
    var purapath = process.cwd()+"/public/index.html";
    console.log(purapath);
    resp.sendFile(purapath);
    })

app.get("/donor",function(req,resp){
    
    var purapath = process.cwd()+"/public/dash-donor.html";
    console.log(purapath);
    resp.sendFile(purapath);
    })

app.get("/needy",function(req,resp){
    var purapath = process.cwd()+"/public/dash-needy.html";
    resp.sendFile(purapath);
    })

app.get("/profile",function(req,resp){
    var purapath = process.cwd()+"/public/profile-donor.html";
    resp.sendFile(purapath);
 })

app.get("/avail-medicine",function(req,resp){
    var purapath = process.cwd()+"/public/avail-medicine.html";
    resp.sendFile(purapath);
})

app.get("/admin-panel",function(req,resp){
    var purapath = process.cwd()+"/public/admin-panel.html";
    resp.sendFile(purapath);
})

app.get("/admin-block-user",function(req,resp){
    var purapath = process.cwd()+"/public/admin-block-user.html";
    resp.sendFile(purapath);
})

app.get("/admin-all-donor",function(req,resp){
    var purapath = process.cwd()+"/public/admin-all-donor.html";
    resp.sendFile(purapath);
})

app.get("/admin-all-needy",function(req,resp){
    var purapath = process.cwd()+"/public/admin-all-needy.html";
    resp.sendFile(purapath);
})

app.get("/donor-med-manager",function(req,resp){
    var purapath = process.cwd()+"/public/donor-med-manager.html";
    resp.sendFile(purapath);
})

//Avail-Med
app.post("/avail-med-process",function(req,resp){

    console.log("Post Chal gya");

    var fname=req.body.medicine+"-"+req.files.pic.name;
    var des=process.cwd()+"/public/upload/"+fname;
    req.files.pic.mv(des,function(err){
        if(err)
            console.log(err)
        else
            console.log("Got Pic");
    })

    var dataAry3=[req.body.email, req.body.medicine, req.body.packing, req.body.quantity, req.body.expiry, req.body.company, fname, req.body.description];
    refDB.query("insert into medicine values(?,?,?,?,?,?,?,current_date(),?)",dataAry3,function(err,result){
        if(err)
          resp.send(err);
        else
          resp.send("Inserted Successfully");
    })
})

//Admin-Block-User
app.get("/doBlock",function(req,resp){
    // console.log("Button is Working");
    refDB.query("update user set status='0' where email=?",req.query.email,function(err,result){
        if(err)
            resp.send(err);

        else
            resp.send("Updated");
          
    })
})

app.get("/doResume",function(req,resp){
    // console.log("Button is Working");
    refDB.query("update user set status='1' where email=?",req.query.email,function(err,result){
        if(err)
            resp.send(err);

        else
           resp.send("Updated"); 
    })
})

//Profile
app.post("/profile-process",function(req,resp){

    console.log("Post Chal gya");

      var iname=req.body.inputEmail+"-"+req.files.inputidpic.name;
      var des1=process.cwd()+"/public/upload/"+iname;
      req.files.inputidpic.mv(des1,function(err){
              if(err)
                  console.log(err);
              else
                  console.log("Got ID");
      })

      var pname=req.body.inputEmail+"="+req.files.inputProfilePic.name;
      var des2=process.cwd()+"/public/upload/"+pname;
      req.files.inputProfilePic.mv(des2,function(err){
              if(err)
                  console.log(err);
              else
                  console.log("Got Pic");
      })

      var dataAryPro=[req.body.inputEmail, req.body.inputName, req.body.inputPhone, req.body.inputAddress, req.body.inputCity, req.body.inputId, req.body.inputTime, iname, pname];
      refDB.query("insert into dprofile values(?,?,?,?,?,?,?,?,?)",dataAryPro,function(err,result){
        if(err)
          resp.send(err);
        else
          resp.send("Inserted Successfully");
      })
})

//Sign Up
app.get("/chkEmailKuch", function(req,res){
    var dataAry = [req.query.email, req.query.password, req.query.user];
    refDB.query("insert into user values(?,?,?,1)", dataAry, function(err,arrayresult)
    {
        if(err)
        res.send(err);
        else if(arrayresult.length == 0)
        res.send("Available! Inserted!");
        else
        res.send("Inserted Successfully!");
        console.log("Inserted!");
    })
})


//Update
app.get("/update",function(req,resp)
{ 
   var dataAry=[req.query.email,req.query.password,req.query.new_password];

   var dataAry2=[req.query.new_password,req.query.email];

   refDB.query("select * from user where email=? and pwd=?",dataAry,function(err,result)
   {
    if(err)
    resp.send("Invaild Credenctial");
    else if(result.length==1)
    {
            refDB.query("update user set pwd=? where email=?", dataAry2,function(err,result)
            {
                if(err)
                  resp.send("Error!");
                else
                  resp.send("Password Updated Successfully");
            })
        }
        else
        resp.send("Invalid Old Passowrd!");
    })
   })

//------AJAX------

app.get("/chkEmail",function(req,resp)
{
    refDB.query("select * from user where email=?",[req.query.email],function(err,resultAryOfObjects){
        if(err)
            resp.send(err);

        else
            if(resultAryOfObjects==0)
            resp.send("Available");

            else
            resp.send("Already Occupied");
    })
})

//=================Angular APIs===================

app.all("/fetchAllRecords",function(req,resp){

    refDB.query("select * from user", function(err,resultAryOfObjects){
        if(err)
          resp.send(err);
        else
          resp.send(resultAryOfObjects);  
    })
})

app.all("/fetchAllDonor",function(req,resp)
{
    refDB.query("select * from user where utype='Donor'",function(err,resultAryOfObjects)
    {
         if(err)
             resp.send(err);
            
         else
             resp.send(resultAryOfObjects);
    })

})

app.all("/fetchAllNeedy",function(req,resp)
{
    refDB.query("select * from user where utype='Needy'",function(err,resultAryOfObjects)
    {
         if(err)
             resp.send(err);
            
         else
             resp.send(resultAryOfObjects);
    })

})

app.get("/fetchAllMedicine",function(req,resp)
{
    console.log("hello");
    refDB.query("select * from medicine where emailid=?",[req.query.emailid],function(err,resultAryOfObjects)
    {
         if(err)
             resp.send(err);
            
         else
             resp.send(resultAryOfObjects);
    })

})

app.get("/profile_delete",function(req,res)
{             
    console.log("Profile_Delete");                   //table col name
    refDB.query("delete from medicine where emailid=?",[req.query.emailid],function(err,result){
        console.log("delete");
            if(err)
                res.send(err);
            else
                res.send(result);
    })
})

app.get("/doDelete",function(req,res)
{             
    console.log("Deleted");   
    console.log(req.query.emailid);                //table col name
    refDB.query("delete from user where email=?",[req.query.emailid],function(err,result){
        
            if(err)
                res.send(err);
            else
                res.send(result);
    })
})
