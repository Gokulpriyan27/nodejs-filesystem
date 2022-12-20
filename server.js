//Dependencies ------------------
const express =require("express");
const app=express();
const dotenv = require("dotenv");
const fs = require("fs");
const moment = require("moment");
const path = require("path");

dotenv.config();

//Declarations -------------------

let d = new Date();

const directory = "./time_logs";

const dirPath = path.join(__dirname,directory);

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const data = {
    "date":d.getDate(),
    "month":months[d.getMonth()],
    "year":d.getFullYear(),
    "hour":d.getHours(),
    "minutes":d.getMinutes(),
    "seconds":d.getSeconds()
}

let filename = data.date+"-"+data.year+"-"+data.month+"-"+data.hour+"-"+data.minutes+"-"+data.seconds+".txt"
let content = String(moment().format('MMMM Do YYYY, h:mm:ss a'));

//Get request - createFiles ---------------

app.get("/create",(req,res)=>{

     function program(){
        fs.writeFileSync(`${dirPath}/${filename}`,content,(err)=>{
            if(err){
                return console.log(err)
            }
        })
    }
    try {
         if(!fs.existsSync(directory)){
            console.log("came to if block")
            fs.mkdirSync(directory);
            program();
            res.status(200).send({message:"Folder, File Created & Process Finished"})
        }else{
            fs.writeFileSync(`${dirPath}/${filename}`,content,(err)=>{
                if(err){
                    return console.log(err)
                }
            })
            res.status(200).send({message:"Created only file. Process Finished"})
        }
            
    } catch (error) {
        console.log(error)
        res.status(500).send({message:"Internal Server Error"})
    }
   
})

//Get request - readFiles ------------------

app.get("/read",(req,res)=>{
    try {
        const count = []
        fs.readdir(dirPath,(err,files)=>{
            files.map((file)=>{
                count.push(file);
            })
            res.status(200).send({message:`Total number of files ${count.length}`,count})
        })
    } catch (error) {
        res.status(500).send({message:"Internal Server Error"})
    }

})

const PORT = process.env.PORT;

app.listen(PORT,()=>{
    console.log(`Application running in ${PORT}`)
})

