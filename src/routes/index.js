const express = require('express');
//const router = express.Router();
const router = require('express').Router();
const dbConnection = require('../config/dbConnection.js');
const app = express();
const connection = dbConnection();



router.get('/', function(req, res) {  

    // Running database queries
    connection.query('SELECT * FROM video', function(err, rows, fields) {
        if (!err) {

            res.render('index.html', {
                title: 'Videos de Youtube',
                datos: rows, // this will work!!!
                info: req.session.mivariable
            });
        }
        if (err) {
            console.log('Error performing database query.');
        }
    });
});

router.get('/cuenta', function(req, res) {  

    // Running database queries
    connection.query('SELECT * FROM video where usuario = "'+req.session.mivariable+'"', function(err, rows, fields) {
        if (!err) {

            res.render('pagina.html', {
                title: 'sesion',
                datos: rows, // this will work!!!
                info: req.session.mivariable
            });
        }
        if (err) {
            console.log('Error performing database query.');
        }
    });
});

router.get('/update/:id',function(req,res) {
    const {id} = req.params;
    connection.query('SELECT * FROM video where id='+id, function(err, rows, fields) {
        if (!err) {

            res.render('edicion.html', {
                title: 'Edicion',
                datos: rows, // this will work!!!
                info: req.session.mivariable
            });
        }
        if (err) {
            console.log('Error performing database query.');
        }
    });

});

//Inicio de sesion 
router.post('/sesion',function(req,res) {
    var campos = req.body;
    connection.query("select count(*) as numero from usuario where nombre='"+campos.usuario+"' and pass = '"+campos.pass+"'", function(err, rows, fields) {
        if(rows[0].numero==1)
        {
            req.session.mivariable = campos.usuario;
            console.log('Sesion iniciada');
            res.redirect('/cuenta');
            
        }
        else
        {
            console.log('Sesion no iniciada');
            res.send('No iniciado');
        }
    });
});

router.get('/cerrar',function(req,res){
    req.session.destroy();
    res.redirect('/cuenta');
});

//Actualización de registro
router.post('/update/:id',function(req,res) {
    const {id} = req.params;
    var campos = req.body;
    connection.query("update video set nombre='"+campos.nombre+"' , codigo='"+campos.html+"' where id="+id, function(err, rows, fields) {
        res.send('Registro actualizado');
        console.log(campos.html);
    });

});

router.get('/delete/:id',function(req,res) {
    const {id} = req.params;
    connection.query('delete FROM video where id='+id, function(err, rows, fields) {
       res.redirect('/cuenta');
    });
});

router.post('/add', function(req, res){
    var data = req.body;
    connection.query('insert into usuario values(null,"'+data.nombre+'","'+data.pass+'","'+data.email+'")', function(err, rows, fields) {
        if (!err) {
        	console.log(data);
            res.send('Usuario registrado con exito, entre al apartado de sesión');
        }
        if (err) {
            console.log('Error performing database query.');
        }
    });
});

router.post('/video', function(req, res){
    var data = req.body;
    connection.query("insert into video values(null,'"+data.nombre+"','"+data.codigo+"','5','"+req.session.mivariable+"')", function(err, rows, fields) {
        if (!err) {
            console.log(data);
            res.redirect('/cuenta');
        }
        if (err) {
            console.log('Error performing database query.');
        }
    });
});

router.get('/',(req,res) => {
	res.render('index.html',{
        title: 'Sesion',
        as: req.session.mivariable
    });
});

router.get('/registro',(req,res) => {
	res.render('registro.html',{title: 'Contact Page'});
});

router.get('/cuenta',(req,res) => {
    res.render('pagina.html',{title: 'Contact Page'});
});







module.exports = router;