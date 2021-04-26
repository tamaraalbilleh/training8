'use strict';
const express =require ('express');
const server = express ();
require ('dotenv').config();
const PORT = process.env.PORT
server.set('view engine','ejs')
server.use ('/public',express.static('public'))
const superagent = require ('superagent');
const pg = require('pg');
const cors = require('cors');
server.use(cors());
server.use(express.urlencoded({ extended: true }));
const client = new pg.Client({ connectionString: process.env.DATABASE_URL,
       ssl: { rejectUnauthorized: false }
     });
const methodOverride = require('method-override')
server.use(methodOverride('_method'));


server.get ('/', homeHandler)
function homeHandler (req,res){
    let url = `https://official-joke-api.appspot.com/jokes/programming/ten`
    superagent.get(url).then(data=>{
        let d = data.body
        res.render('pages/index' , {data : d})

    })
}



server.post ('/fav', favAddHandler)
function favAddHandler (req,res){
    let sql = `INSERT INTO jokes (number, type, setup, punchline) VALUES ($1,$2,$3,$4) RETURNING *;`;
    let safe = req.body;
    let safeValues = [safe.number, safe.type, safe.setup, safe.punchline];
    client.query (sql,safeValues).then (()=>{
        res.redirect ('/favpage')
    })
}
server.get ('/favpage', favHandler)
function favHandler (req,res){
    let sql = `SELECT * FROM jokes;`;
    client.query(sql).then (result=>{
        res.render ('pages/Favorite Jokes' , {card : result.rows})
    })

}
server.get ('/details/:id', detailsHandler)
function detailsHandler (req,res){
    let sql = `SELECT * FROM jokes WHERE id=$1;`;
    let safe = [req.params.id]
    client.query (sql,safe).then (result=>{
        res.render ('pages/details', {data: result.rows[0]})
    })
}

server.put ('/details/:id' , updateHandler)
function updateHandler (req,res){
    let sql =`UPDATE jokes SET number=$1, type=$2, setup=$3, punchline=$4;`;
    let safe = req.body;
    let safeValues = [safe.number, safe.type, safe.setup, safe.punchline];
    client.query (sql, safeValues).then(()=>{
        res.redirect (`/details/${req.params.id}`);
    })
}

server.delete ('/details/:id', deleteHandler)
function deleteHandler (req,res){
    let sql =`DELETE FROM jokes WHERE id=$1;`;
    let safe =[req.params.id];
    client.query(sql,safe).then(()=>{
        res.redirect ('/favpage')
    })
}

server.get ('/random', randomHandler)
function randomHandler (req,res){
    let url = 'https://official-joke-api.appspot.com/jokes/programming/random';
    superagent.get(url).then(data=>{
        res.render ('pages/random',{data : data.body[0]})
    })
}






client.connect().then(()=>{
    server.listen (PORT,()=>{
        console.log (`listenings on PORT :${PORT}`)
    })
})
