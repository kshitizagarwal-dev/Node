var express = require("express");
const db = require('..');
const router = express.Router();

router.get("/login", (req, res) => {
  res.render("student/studentlogin");
});


router.post('/login', (req, res) => {
  const {rollno, name} = req.body;
  console.log(rollno, name);
  //connect to db
  db.getConnection((err, connection) => {
      if(err) throw err;
      console.log('Connected to ID ' + connection.threadId);
      
      //result the connection
      connection.query('select * from results where rollno=? and name=?', [rollno, name], (err,rows) => {
          //When done with the connection, release it
          connection.release();
          if(!err){
            if(rows.length != 0){
              res.render('student/viewresult', { rows, login: "Login successful"});
            }else{
              res.render('student/studentlogin', {alert1: "Enter the correct Roll no and Name"});
              console.log("Enter the correct Roll no and Name");
            }   
          }else{
              console.log(err);
          }
          console.log('The data from result table: \n', rows)
      })
  });
})

module.exports = router;