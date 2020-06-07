const express = require('express');
const app = express();
const path = require('path');
const session = require('express-session');


//settings
app.set('port',3000);
app.set('views',path.join(__dirname,'views'));
app.engine('html',require('ejs').renderFile);
app.set('view engine','ejs');

//middlewares
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(session({
	secret: 'mysecretkey',
	resave: false,
	saveUninitialized: true
}));

//routes
app.use(require('./routes/index'));

//static files
app.use(express.static(path.join(__dirname,'public')));



//listening the server
app.listen(app.get('port'),() => {
	console.log('Server on port ',3000);
});