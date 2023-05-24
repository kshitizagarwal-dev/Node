
var express = require('express');
const db = require('..');
const router = express.Router();

router.get("/login", (req, res) => {
    res.render("teacher/teacherLogin");
});

router.post("/login", (req, res) => {
    if(req.body.password == "12345678"){
        res.render('teacher/viewall', {login: "login successful"});
        res.redirect("/teacher/viewall");
    }
    else{
        res.render("teacher/teacherLogin", {
            error : "Please Enter Correct Password !!"
        })
    }
});


router.get('/addresult', (req, res) =>{
    res.render('teacher/addresult');
})


router.post('/addresult', (req, res) => {
    const {name, dob, score} = req.body;
    db.getConnection((err, connection) => {
        if(err) throw err;
        console.log('Connected to ID ' + connection.threadId);
        //result the connection
        connection.query('INSERT INTO results SET name = ?, dob = ?, score = ?', [name, dob, score], (err,rows) => {
            //When done with the connection, release it
            connection.release();
            if(!err){
                res.render('teacher/addresult', {alert: 'User added successfully.'});
            }else{
                console.log(err);
            }
            console.log('The data from result table: \n', rows);
        })
    })
});


router.get('/viewall', (req, res) => {
    //connect to db
    db.getConnection((err, connection) => {
        if(err) throw err;
        console.log('Connected to ID ' + connection.threadId);
        //result the connection
        connection.query('select * from results', (err,rows) => {
            //When done with the connection, release it
            connection.release();
            if(!err){
                res.render('teacher/viewall', { rows});
            }else{
                console.log(err);
            }

            console.log('The data from result table: \n', rows)
        })
    });
});


router.get('/delete/:rollno', (req, res) => {
    console.log(req.params.rollno);
    db.getConnection((err, connection) => {
        if(err) throw err;
        console.log('Connected to ID ' + connection.threadId);  
        //result the connection
        connection.query('DELETE FROM results WHERE rollno = ?', [req.params.rollno], (err,rows) => {
            //When done with the connection, release it 
            if(err){
                console.log(err);
                throw err;
            }else{
                res.redirect('/teacher/viewall');                
            }
            console.log('The data from result table: \n', rows)
        })
        connection.release();
    });
})


router.get('/editresult/:rollno', (req, res) => {
    db.getConnection((err, connection) => {
        if(err) throw err;
        console.log('Connected to ID ' + connection.threadId);
        
        //result the connection
        connection.query('select * from results where rollno = ?', [req.params.rollno], (err,rows) => {
            //When done with the connection, release it
            connection.release();
            if(!err){
                res.render('teacher/editresult', { rows});
            }else{
                console.log(err);
            }
            console.log('The data from result table: \n', rows)
        })
    });
});


router.post('/editresult/:rollno', (req, res) => {
    const {name,dob, score} = req.body;
    console.log("..................inside the editting section...............");
    db.getConnection((err, connection) => {
        if(err) throw err;
        console.log('Connected to ID ' + connection.threadId);
        //result the connection
        connection.query('UPDATE results SET name = ?, dob = ?, score = ? where rollno = ?', [name, dob, score, req.params.rollno], (err,rows) => {
            //When done with the connection, release it
            connection.release();
            if(!err){
                db.getConnection((err, connection) => {
                    if(err) throw err;
                    console.log('Connected to ID ' + connection.threadId);
                    //result the connection
                    connection.query('select * from results where rollno = ?', [req.params.rollno], (err,rows) => {
                        //When done with the connection, release it
                        connection.release();
                        if(!err){
                            res.render('teacher/editresult', {rows, alert: `${name} has been updated successfully`});
                        }else{
                            console.log(err);
                        }
                        console.log('The data from result table: \n', rows)
                    })
                });
            }else{
                console.log(err);
            }
            console.log('The data from result table: \n', rows)
        })
    });
});


router.get('/viewresult/:rollno', (req, res) => {
    //connect to db
    db.getConnection((err, connection) => {
        if(err) throw err;
        console.log('Connected to ID ' + connection.threadId);
        //result the connection
        console.log("......................Inside the viewresult page.............");
        connection.query('select * from results where rollno=?', [req.params.rollno], (err,rows) => {
            //When done with the connection, release it
            connection.release();
            
            if(!err){
                res.render('teacher/viewresult', { rows});
            }else{
                console.log(err);
            }
            console.log('The data from result table: \n', rows)
        })
    });
});


module.exports = router;