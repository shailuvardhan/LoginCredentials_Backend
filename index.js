const express=require("express");
var cors = require('cors')
const { v4: uuidv4 } = require('uuid');

const path=require("path")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const {open}=require("sqlite")
const sqlite3=require("sqlite3")

const dbPath=path.join(__dirname,'UsersData.db');

const app=express();
app.use(express.json());
app.use(cors())

const port=process.env.PORT || 3001

let db=null;

//Dummy Data's:- Array of objects of users and posts
const usersDetails=[
    {
        "id":uuidv4(),
        "name": "Rahul",
        "username": "rahul",
        "password":"rahul@2025",
        "gender": "Male",
        "location": "Bengalore"
    },
    {
        "id":uuidv4(),
        "name": "Hari prasad",
        "username": "hari",
        "password":"hari@1234",
        "gender": "Male",
        "location": "Vijayawada"
    },
    {
        "id":uuidv4(),
        "name": "Shailu vardhan",
        "username": "shailu",
        "password":"shailu@2025",
        "gender": "Male",
        "location": "Hyderabad"
    },
    {
        "id":uuidv4(),
        "name": "Pooja",
        "username": "pooja",
        "password":"pooja@1999",
        "gender": "Male",
        "location": "Vishakapatnam"
    }
  ]

const initializeDBandServer=async ()=>{
    try{
        db=await open({ filename:dbPath,driver:sqlite3.Database })

        await db.run(`
            CREATE TABLE IF NOT EXISTS Users (
              id TEXT NOT NULL PRIMARY KEY,
              name TEXT NOT NULL,
              username TEXT NOT NULL UNIQUE,
              password TEXT,
              gender TEXT NOT NULL,
              location TEXT NOT NULL
            );
          `);

        // Insert Dummy Users into a Users Table using for loop cant use map function because get db.run error cant use.
        for (const eachUser  of usersDetails) {
            const hashedPassword = await bcrypt.hash(eachUser.password, 10)
            const existingUserQuery = `SELECT * FROM Users WHERE username = ?`;
            const existingUser  = await db.get(existingUserQuery, [eachUser.username]);
            if (!existingUser){
            await db.run(`
                INSERT INTO Users (id,name,username,password,gender,location) 
                VALUES (?,?,?,?,?,?);
                `,[eachUser.id,eachUser.name,eachUser.username,hashedPassword,eachUser.gender,eachUser.location]
            );
            }
        }

        app.listen(port,()=>{
            console.log(`Server Running at http://localhost:${port}`)
        })

    }catch(err){
        console.log(`DB Error: ${e.message}`)
    process.exit(-1)
    }

}

initializeDBandServer()


app.get("/",(request,response)=>{
  response.send("Welcome to Backend Login Credentials")
})




// User Register API
app.post('/register/', async (request, response) => {
    const { name,username, password, gender, location} = request.body
    const hashedPassword = await bcrypt.hash(request.body.password, 10)
    const selectUserQuery = `SELECT * FROM Users WHERE username = '${username}'`
    const dbUser = await db.get(selectUserQuery)
    if (dbUser === undefined) {
      const createUserQuery = `
        INSERT INTO 
          Users (id, name, username, password, gender, location) 
        VALUES 
          (
            '${uuidv4()}'
            '${name}',
            '${username}', 
            '${hashedPassword}', 
            '${gender}',
            '${location}'
          )`
      await db.run(createUserQuery)
      response.send(`User created successfully`)
    } else {
      response.status(400)
      response.send('User already exists')
    }
  })
  
  // User Login API
  app.post('/login/', async (request, response) => {
    const {username, password} = request.body
    const selectUserQuery = `SELECT * FROM Users WHERE username = '${username}'`
    const dbUser = await db.get(selectUserQuery)
    if (dbUser === undefined) {
      response.status(400)
      response.send('Invalid User')
    } else {
  //  SYNTAX:- bcrypt.compare(plainPassword,newPassword)
      const isPasswordMatched = await bcrypt.compare(password, dbUser.password)
      if (isPasswordMatched === true) {
        const payload = {username: username,}
        const jwtToken = jwt.sign(payload, 'gsv_first_login')
        response.send({jwtToken})
      } else {
        response.status(400)
        response.send('Invalid Password')
      }
    }
  })
  
  