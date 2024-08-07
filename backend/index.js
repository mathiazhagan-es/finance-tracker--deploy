const express = require("express")
const cors = require("cors")
const mysql = require("mysql")
const {sign} = require("jsonwebtoken")
const validatetoken =require("./middleware/Authmiddleware")



const app=express()
app.use(cors())
app.use(express.json())

const db=mysql.createConnection({
    host:"bsgnlxutztose4njkuvf-mysql.services.clever-cloud.com",
    user:"uptekonscgskwxy8",
    database:"bsgnlxutztose4njkuvf",
    password:"CLtIJyGPzEmZZXuSAtVO",
    port:3306
})

db.connect((err)=>{
    if(err){throw(err)}
    console.log("connected")
})


app.post("/signup",(req,res)=>{
    const {email,password,name}=req.body
    const value=[email,password,name]

    const q="select count(email) as count from users where email=?"
    db.query(q,[email],(err,data)=>{
        if(err){res.json(err)}
        else{
            const [val]=JSON.parse(JSON.stringify(data))
            if(val.count==1){
                res.json({error:"email already registered"})
            }
            else{
                const q="insert into users (`email`,`password`,`name`) VALUES (?)"
                db.query(q,[value],(err,data)=>{
                    if(err){res.json(err)}
                    else{
                        res.json("signup success")
                    }

            })
            }
        }
    })

})

app.post("/signin",(req,res)=>{
    const {email,password}=req.body
    const value=[email,password]

    const q="select userid from users where email = ? and password = ?"

    db.query(q,[...value],(err,data)=>{
        if(err){res.json(err)}
        else{
            if(data.length==0){res.json({error:"wrong password"})}
            else{
                const [val]=JSON.parse(JSON.stringify(data))
                const accesstoken=sign({userid:val.userid,email:email},"secret")
                res.json({token:accesstoken,userdata:{userid:val.userid,email:email}})
            }
        }
    })
})

app.get("/auth",validatetoken,(req,res)=>{

    const user=req.user
    const q="select userid,name,email from users where userid=?"
    db.query(q,[user.userid],(err,data)=>{
        if(err){  res.json(err)}
            else{ 

                const [val]=JSON.parse(JSON.stringify(data))
                res.json(val)
            
            }
    })

})

app.post("/table/:userid",(req,res)=>{
    const {userid}=req.params
    const q="SELECT * FROM transaction where userid=?"
    db.query(q,[userid],(err,data)=>{
        if(err){res.json(err)}
        else{
            const val=JSON.parse(JSON.stringify(data))
            res.json(val)
        }
    })
})

app.post("/addform/:userid",(req,res)=>{
    const{userid}=req.params
    const{desc,amount,trans}=req.body
    const t=(trans==1)? "cr":"db";

    const values=[desc,amount,t,userid]
    const q="insert into transaction(`desc`,`amount`,`trans`,`userid`) values (?)" 
    db.query(q,[values],(err,data)=>{
        if(err){res.json(err)
        }
        else{
            res.json("trans added successfully")
        }
    })
})

app.delete("/delete/:transid",(req,res)=>{
    const{transid}=req.params
    const q="delete from transaction where transid=?"
    db.query(q,[transid],(err,data)=>{
        if(err){res.json(err)
        }
        else{
            res.json("trans deleted successfully")
        }
    })

})

app.get("/update/:transid",(req,res)=>{
    const{transid}=req.params
    const q="select * from transaction where transid=?"
    db.query(q,[transid],(err,data)=>{
        if(err){res.json(err);console.log(err)
        }
        else{
            const[val]=JSON.parse(JSON.stringify(data))
            res.json(val)
        }

    })

})

app.put("/update/:transid",(req,res)=>{
    const{transid}=req.params
    const {desc,amount,trans}=req.body
    const values=[desc,amount,trans,transid]
    const q="update transaction set `desc` =? , `amount` = ? , `trans` = ? where transid= ?"
    db.query(q,[...values],(err,data)=>{
        if(err){res.json(err);console.log(err)
        }else{
    res.json("updated successfully")
        }
    })
})




app.listen(3000,(req,res)=>{
    console.log("server on 3000 port")
})