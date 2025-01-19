const { faker } = require('@faker-js/faker');//it is the package which generates fake data randomly.
const express=require("express");
const app=express();
const port=8080;



// let createRandomUser= ()=> {
//     return {
//       userId: faker.string.uuid(),
//       username: faker.internet.username(), // before version 9.1.0, use userName()
//       email: faker.internet.email(),
//       avatar: faker.image.avatar(),
//       password: faker.internet.password(),
//       birthdate: faker.date.birthdate(),
//       registeredAt: faker.date.past(),
//     };
// }

//console.log(createRandomUser());

// let getRandomUser= ()=> {
//     return {
//       id: faker.string.uuid(),
//       username: faker.internet.username(), 
//       email: faker.internet.email(),
//       password: faker.internet.password(),
//     };
// }


   
//Building connection of node with database with the help of mysql2 package
const mysql = require('mysql2');
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'delta_app',
    password:'#Sanket1410'
  });


// let q="SHOW TABLES";
// try{
//     connection.query(q,(err,result)=>{//query method is use to run the query on database
//         if(err) throw err;
//         console.log(result); // result contains rows returned by server and it is a array
//     });
// }
// catch(err){
//     console.log(err);
// }
// connection.end();//to close connection of node with database



//Data insertion  in table-single row at a time

// let q="INSERT INTO user (id,username,email,password) VALUES (?,?,?,?)";
// let user=["123","123_newuser","abc@gmail.com","abc"];
// try{
//     connection.query(q,user,(err,result)=>{
//         if(err) throw err;
//         console.log(result); 
//     });
// }
// catch(err){
//     console.log(err);
// }



//Data insertion  in table-two or more rows at a time

// let q="INSERT INTO user (id,username,email,password) VALUES ?";
// let users=[["123_b","123_newuser_b","abc@gmail.com_b","abc_b"],
//             ["123_c","123_newuser_c","abc@gmail.com_c","abc_c"]];
// try{
//     connection.query(q,[users],(err,result)=>{
//         if(err) throw err;
//         console.log(result); 
//     });
// }
// catch(err){
//     console.log(err);
// }



//Data insertion in bulk
// let getRandomUser= ()=> {
//     return [
//         faker.string.uuid(),
//         faker.internet.username(), 
//         faker.internet.email(),
//         faker.internet.password()
      
//     ];    
// }

// let q="INSERT INTO user (id,username,email,password) VALUES ?";
// let users=[];
// for(let i=1;i<=100;i++){
//     users.push(getRandomUser());//100 fake users data generating randomly
// }
// try{
//     connection.query(q,[users],(err,result)=>{
//         if(err) throw err;
//         console.log(result); 
//     });
// }
// catch(err){
//     console.log(err);
// }
// connection.end();



app.listen(port,()=>{
    console.log(`App is listening on port ${port}`);
});


app.set("view engine","ejs");
const path=require("path");
app.set("views",path.join(__dirname,"/views"));

app.use(express.urlencoded({extended:true}));
app.use(express.json());


//Get total no of users -home route
app.get("/",(req,res)=>{
    let q=`SELECT count(*) FROM user`;
    try{
        connection.query(q,(err,result)=>{
            if(err) throw err;
            let count=result[0]["count(*)"];//HERE result=[{"count(*):103"}]
            res.render("home.ejs",{count});
        });
    }
    catch(err){
        res.send("Some error in Database");
    }
});

//To show all user's data -show route
app.get("/user",(req,res)=>{
    let q=`SELECT * FROM user`;
    try{
        connection.query(q,(err,result)=>{
            if(err) throw err;
            
            res.render("showusers.ejs",{result});
        });
    }
    catch(err){
        res.send("Some error in Database");
    }
});

//To Edit Username-edit route
app.get("/user/:id/edit",(req,res)=>{
    let {id}=req.params;
    let q=`SELECT * FROM user WHERE id='${id}'`;
    try{
        connection.query(q,(err,result)=>{
            if(err) throw err;
            let user=result[0];//result is array and user is object.
            res.render("edit.ejs",{user});
        });
    }
    catch(err){
        res.send("Some error in Database");
    }
});

const methodOverride=require("method-override");
app.use(methodOverride("_method")); 

app.patch("/user/:id",(req,res)=>{
    let {id}=req.params;
    let {password:pass,username:newUsername}=req.body;
    let q=`SELECT * FROM user WHERE id='${id}'`;
    try{
        connection.query(q,(err,result)=>{
            if(err) throw err;
            let user=result[0];
            if(pass==user.password){   
                let q2=`UPDATE user SET username='${newUsername}' WHERE id='${id}'`;
                try{
                    connection.query(q2,(err,result)=>{
                        if(err) throw err;
                        res.redirect("/user");
                    });
                }
                catch(err){
                    res.send("Some error in Database");
                }
            }
            else{
                res.send("Incorrect password!");
            }
        });
    }
    catch(err){
        res.send("Some error in Database");
    }
});

//To add new user -add route
app.get("/user/new",(req,res)=>{ //to get the form
    res.render("adduser.ejs");
});

const {v4:uuidv4}=require("uuid");

app.post("/user",(req,res)=>{
    let id=uuidv4();
    let {username,email,password}=req.body;
    let q=`INSERT INTO user (id,username,email,password) VALUES ('${id}','${username}','${email}','${password}')`;
    try{
        connection.query(q,(err,result)=>{
            if(err) throw err;
            
            res.redirect("/user");
        });
    }
    catch(err){
        res.send("Some error in Database");
    }
});

//delete a user
app.get("/user/:id/delete",(req,res)=>{
    let {id}=req.params;
    let q=`SELECT * FROM user WHERE id='${id}'`;
    try{
        connection.query(q,(err,result)=>{
            if(err) throw err;
            let user=result[0];
            res.render("deleteuser.ejs",{user});
        });
    }
    catch(err){
        res.send("Some error in Database");
    }
})

app.delete("/user/:id",(req,res)=>{
    let {id}=req.params;
    let {email:formemail,password:formpass}=req.body;
    let q=`SELECT * FROM user WHERE id='${id}'`;
    try{
        connection.query(q,(err,result)=>{
            if(err) throw err;
            let user=result[0];
            if(formemail==user.email && formpass==user.password){
                let q2=`DELETE FROM user WHERE id='${id}'`;
                try{
                    connection.query(q2,(err,result)=>{
                        if(err) throw err;
                        res.redirect("/user");
                    })
                }                
                catch(err){
                    res.send("Some error in Database");
                }
            }
            else{
                res.send("Incorrect Details");
            }
        });
    }
    catch(err){
        res.send("Some error in Database");
    }
}); 