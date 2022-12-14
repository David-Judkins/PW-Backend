const express = require("express");
const dbConnect = require("./db/conn");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Record = require("./models/record");
const auth = require("./middleware/auth");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;
require("dotenv").config({ path: "./config.env" });
app.use(cors());
app.use(express.json());

// get driver connection

app.listen(port, () => {
  // perform a database connection when server startsnpm 
  dbConnect();

  app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
    );
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, PATCH, OPTIONS"
    );
    next();
  });
  console.log(`Server is running on port: ${port}`);

});


app.post("/records/add",(request, response) =>  {
  
  bcrypt.hash(request.body.password, 10)
     .then((hashedPassword) => {
       const record = new Record({
         firstName: request.body.firstName,
         lastName: request.body.lastName,
         relationship: request.body.relationship,
         email: request.body.email,
         password: hashedPassword,
       });
       
       record.save().then((result) => {
        response.status(201).send({
          message: "User Created Successfully",
          result,
        });
      })
      .catch((error) => {
        response.status(500).send({
          message: "Error creating user",
          error,
        });
      });
     })
     .catch((e) => {
       response.status(500).send({
         message: "Password was not hashed successfully",
         e,
       });
     });
 
 });

app.post("/records/login", (request, response) =>  {
  console.log(request.body.email);
  Record.findOne({email: request.body.email})
  .then((record) => {
    bcrypt.compare(request.body.password, record.password)
    .then((passwordCheck) => {
   // check if password matches
      if(!passwordCheck) {
        return response.status(400).send({
          message: "Passwords does not match",
          error,
        });
      }

      const token = jwt.sign(
        {
          recordId: record._id,
          recordEmail: record.email,
        },
        "RANDOM-TOKEN",
        { expiresIn: "24h"}
      );

      response.status(200).send({
        message: "login Successful",
        email: record.email,
        token,
      })

    }).catch((error) => {
      response.status(400).send({
        message: "Passwords do not match",
        error,
      });
    })
  }).catch((error) => {
    console.log(error);
    response.status(404).send({
      message: "email not found",
      error,
    })
  })


})


// authentication endpoint
app.get("/auth-endpoint", auth, (request, response) => {
  response.json({ message: "You are authorized to access me" });
});