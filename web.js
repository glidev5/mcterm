import express from 'express'
import SSH from 'simple-ssh'
var app = express();
import fs from 'fs'
import needle from 'needle'
import htmlToText from 'html-to-text'
import _Tail from  'tail'
var Tail=_Tail.Tail;
import stripAnsi from 'strip-ansi'
var port=3000;

try{
var tailed="";
var tail = new Tail("/root/screenlog.0");
tail.on("line", function(data) {
  tailed+=data;
});

tail.on("error", function(error) {
  console.log('ERROR: ', error);
});
}catch(e){}

var html_option={
  compressed         : true,
  follow_max         : 5,
  rejectUnauthorized : false
};

app.get('/www',function(req,res){
 needle.get(req.param("url"),html_option, function(error, response) {
  if (!error){
    var text = htmlToText.fromString(response.body, {preserveNewlines:true});
    res.send(text);
    console.log()
  }
 });
});

app.get('/json',function(req,res){
 needle.get(req.param("url"),html_option, function(error, response) {
  if (!error){
    var text = JSON.stringify(JSON.parse(response.body),null,2);
    res.send(text);
    console.log()
  }
 });
});

app.get('/wiki',function(req,res){
 needle.get("https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro=&explaintext=&titles="+req.param("query"),html_option, function(error, response) {
  if (!error){
    var text = JSON.stringify(response.body,null,2);
    res.send(text);
  }
  else {
    console.log(error);
  }
 });
});

var key;
try{
  key=fs.readFileSync('/root/.ssh/id_rsa').toString();
}catch(e){}

var ssh_option={
    host: 'localhost',
    user: 'root',
    pass: '',
    key: key,
    agent: process.env.SSH_AUTH_SOCK,
    agentForward: true
  };

app.get('/cmd', function(req,res){
  var cmd=req.param('cmd');  

  function out(stdout) {
    console.log("cmd: "+cmd);
    console.log(stdout);
    res.send(stdout);
  }

  (new SSH(ssh_option)).exec(cmd, {out: out}).start();
});

app.get('/screen', function(req,res){
  var cmd="screen -S "+req.param("screen")+" -X stuff '"+req.param('cmd')+"'`echo -ne '\\015'`";

  function out(stdout) {
    console.log("screen: "+cmd);
    console.log(stdout);
    res.send("200 OK");
  }

  (new SSH(ssh_option)).exec(cmd, {out: out}).start();
});

app.get('/tail', function(req,res){
  tailed=stripAnsi(tailed);
  res.send(tailed);
  if(tailed.trim()){console.log(tailed);}
  tailed="";
});

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.listen(port, function () {
  console.log('mcterm server listening on port %d!',port);
});

