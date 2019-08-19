const express = require('express');
const router = new express.Router();
const records = require('./handyorm');


function asyncHandler(cb){
    return async (req,res, next) => {
        try {
            await cb(req, res, next);
        } catch(err) {
            next(err);
        }
    }
}


router.get('/', (req, res) =>{
	const username = req.cookies.username;
	if (username){
	res.render('home', {username});
	}else{
	res.redirect('/hello');
	}
});

//poststatus
router.get('/poststatus', asyncHandler( async (req, res) =>{
	const username = req.cookies.username;
	const posts = await records.getQuotes();  
	if (username){
	res.render('check', {username: username, o: posts.records});
	}else{
	res.redirect('/hello')
	}		
}));

router.post('/goodbye', (req, res) =>{
	res.clearCookie('username');
	res.redirect('/');
});


router.get('/hello', (req, res) =>{
	const username = req.cookies.username;
	if(username){
	res.redirect('/');
	}else{
	res.render('hello');
	}
});

//PLANNIFICATION
router.get('/plan', (req, res) =>{
	const username = req.cookies.username;
	if(username){
	 res.render('plan');
	}else{
	res.render('hello');
	}
});

router.post('/planning', asyncHandler( async (req, res) =>{
	const username = req.cookies.username;
	if(username && req.body.password === "admin"){

		const maintenance = { 
			poste: req.body.poste,
			depart: req.body.depart, 
			date: req.body.date		
		};

		const quote = await records.createQuote(maintenance);
		res.status(201).redirect('/poststatus');
	
		}else{
		const err = new Error(`Le mot de passe saisi pour '${username}' est incorrect`);
		res.render('error', {error:err});
		}
}));


// Login Hello page
router.post('/hello', (req, res) =>{
	if(req.body.password === "admin"){
	// Setting the cookie
	res.cookie('username' , req.body.username);
	//res.render('hello', {username : req.body.username});
	res.redirect('/');
	}else{
	const err = new Error('Mot de passe incorrect!');
	res.render('error', {error:err});
	}
});


// bring data inoffice from here
const officestatus = require('../data/officestatus.json');
router.get('/employeestats', (req, res) =>{
	const username = req.cookies.username;
	if(username){
	res.render('officestats', {o: officestatus.people});
	}else{
	res.render('hello');
	}
});
 
// bring data team from here
const teamstatus = require('../data/teamstatus.json');
router.get('/teams', (req, res) =>{
	const username = req.cookies.username;
	if(username){
	res.render('teams', {o: teamstatus.teams});
	}else{
	res.render('hello');
	}
});



module.exports = router;