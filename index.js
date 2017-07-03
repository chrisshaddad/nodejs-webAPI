const express = require('express');
const app = express();
const common = require('./common.js');
const fs = require("fs");
const cors = require('cors');

app.use(cors());

function loadFile(){
  fs.readFile("tasksFile.json", 'utf8', function (err, data) {
    if (err) throw err;
    common.setTaskList(data);
  });
}

function saveFile(done){
    var str = common.toStr();
    fs.writeFile("tasksFile.json", str, {
      encoding: 'utf8'
    },done);
}

loadFile();

app.get('/',function (req,res ){

    res.send(common.toStr());

});

app.get('/add', function (req, res) {
    common.addTask(req.query.task);
    const done = onDone(res)
    saveFile(done);
});

app.get('/deleteDone',function (req,res ){
    common.deleteTaskDone(req.query.id);
    const done = onDone(res)
    saveFile(done);
});

app.get('/deleteUndone',function (req,res ){
    common.deleteTaskUndone(req.query.id);
    const done = onDone(res)
    saveFile(done);
});

app.get('/done',function (req,res ){
    common.done(req.query.id);
    const done = onDone(res)
    saveFile(done);
});

app.get('/undone',function (req,res ){
    common.undone(req.query.id);
    const done = onDone(res)
    saveFile(done);
});

app.get('/edit',function (req,res ){
    common.editTask(req.query.id,req.query.task);
    const done = onDone(res)
    saveFile(done);
});

app.get('/clear',function (req,res ){
    common.emptyTasks();
    const done = onDone(res)
    saveFile(done);
});


function onDone(res){
    return function done(err){ 
        if(err){
            console.log(err)
            res.send("error!"+err.message)
        }else{
            res.send(common.toStr());
        }    
    }
}



app.listen(3000);