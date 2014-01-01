var express = require('express');
var app = express();

var databaseUrl = "mydb"; // "username:password@example.com/mydb"
var collections = ["todo"]
var db = require("mongojs").connect(databaseUrl, collections);


// var todolist = db.todo.find({}, {"_id": 0, "tache": 1});
// console.log(todolist);

var todolist = [];
db.todo.find({}, {"tache": 1}, function(err, tasks) {
    if( err || !tasks) console.log("Aucune tâche trouvée");
      else tasks.forEach(function(task) {
        todolist.push(task);
        // console.log(task);
      });
});

app.use(express.cookieParser())
.use(express.session({secret: 'todotopsecret'}))
.use(express.bodyParser())

.use(function(req, res, next){
    if (typeof(req.session.todolist) == 'undefined') {
        req.session.todolist = [];
    }
    next();
})

.get('/todo', function(req, res) {
    res.render('index.ejs', {todolist: todolist});//req.session.todolist});
})
.post('/todo/ajouter/', function(req, res) {
	if (req.body.newtodo != '') {
        req.session.todolist.push(req.body.newtodo);
        db.todo.insert({tache: req.body.newtodo});
        db.todo.find({}, {"tache": 1}, function(err, tasks) {
            todolist = [];
            console.log("coucou");
            if( err || !tasks) console.log("Aucune tâche trouvée");
              else tasks.forEach(function(task) {
                todolist.push(task);
                // console.log(task);
              });
        });
    }
    res.redirect('/todo');
})
.get('/todo/supprimer/:tache', function(req, res) {
	if (req.params.tache != '') {
        console.log(req.params.tache);
        // req.session.todolist.splice(req.params.tache, 1);
        db.todo.remove({ tache: req.params.tache });
        db.todo.find({}, {"tache": 1}, function(err, tasks) {
            todolist = [];
            console.log("coucou");
            if( err || !tasks) console.log("Aucune tâche trouvée");
              else tasks.forEach(function(task) {
                todolist.push(task);
                // console.log(task);
              });
        });
    }
    res.redirect('/todo');
})
.use(function(req, res, next){
    res.setHeader('Content-Type', 'text/plain');
    res.redirect('/todo');
})

.listen(8080);