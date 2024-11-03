import express from 'express'
import SSH from 'simple-ssh'
var app = express();
app.use(express.json());

import fs from 'fs'
import needle from 'needle'
import {htmlToText} from 'html-to-text'
import _Tail from  'tail'
import axios from 'axios'
import * as cheerio from 'cheerio'
import emailit from 'gqemail'

var Tail=_Tail.Tail;
import stripAnsi from 'strip-ansi'
var port=3000;

const newspapers = [
    {
        name: 'usatoday',
        address: 'https://eu.usatoday.com/tech/'
    },
    {
        name: 'nytimes',
        address: 'https://www.nytimes.com/section/technology'
    },
    //{
    //    name: 'reuters',
    //    address: 'https://www.reuters.com/technology'
    //},
    {
        name: 'cnn',
        address: 'https://edition.cnn.com/business/tech'
    },
    {
        name: 'guardian',
        address: 'https://www.theguardian.com/technology'
    },
    {
        name: 'arstechnica',
        address: 'https://arstechnica.com/'
    },
    {
        name: 'techcrunch',
        address: 'https://techcrunch.com/'
    },
    {
        name: 'mashable',
        address: 'https://mashable.com/tech/'
    }
];

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

app.get('/sources', (req, res) => {
    const sources = newspapers.map((newspaper) => newspaper.name);
    res.json(sources);
});

app.get('/search', async (req, res) => {
    const keyword = req.query.keyword;
    try {
        const articles = [];

        await Promise.all(
            newspapers.map(async (newspaper) => {
		try{
                const response = await axios.get(newspaper.address);
                const html = response.data;
                const $ = cheerio.load(html);

                let selector = '';
                let titleSelector = '';
                let textSelector = '';

                switch (newspaper.name) {
                    case 'nytimes':
                        selector = 'ol li article';
                        titleSelector = 'div h3';
                        textSelector = 'div p';
                        break;
                    case 'reuters':
                        selector = 'ul li';
                        titleSelector = 'div div a';
                        textSelector = 'div div a';
                        break;
                    default:
                        break;
                }

                $(selector).each(function () {
                    //console.log($(this).text())
                    const title = $(this).find(titleSelector).text();
                    const url = $(this).find(titleSelector).attr('href');
                    const imageUrl = $(this).find('img').attr('src');
                    const articleText = $(this).find(textSelector).text();

                    if (articleText.toLowerCase().includes(keyword.toLowerCase()) || title.toLowerCase().includes(keyword.toLowerCase())) {
                        articles.push({
                            title,
                            url,
                            imageUrl,
                            source: newspaper.name
                        });
                    }
                });
		}
		catch(e){
                  console.log(e);
                }
            })
        );

        res.json(articles);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred' });
    }
});

app.get('/email', function(req,res){
  emailit({to:req.param("to"),text:req.param("text")},function(e,r){
    res.status(200);
    res.send("OK");
  })
})

app.get('/news2', async (req, res) => {
    console.log("/news2")
    try {
        const articles = [];

        await Promise.all(
            newspapers.map(async (newspaper) => {
 		try{
                const response = await axios.get(newspaper.address);
                const html = response.data;
                const $ = cheerio.load(html);

                if (newspaper.name === 'nytimes') {
                    $('ol li article').each(function() {
                        const title = $(this).find('h3').text();
                        const url = 'https://www.nytimes.com' + $(this).find('a').attr('href');
                        const imageUrl = $(this).find('img').attr('src');

			if(title){
                        articles.push({
                            title,
                            url,
                            imageUrl,
                            source: newspaper.name
                        });
			}
                    });
                } else if (newspaper.name === 'reuters') {
                    $('ul li').each(function() {
                        const title = $(this).find('div div a').text();
                        const url = 'https://www.reuters.com' + $(this).find('div div a').attr('href');
                        const imageUrl = $(this).find('img').attr('src');
                        const date = $(this).find('div div time').text();

			if(title){
                        articles.push({
                            title,
                            url,
                            imageUrl,
                            date,
                            source: newspaper.name
                        });
			}
                    });
                } else if (newspaper.name === 'cnn') {
                    $('div.card.container__item.container__item--type-section').each(function() {
                        const title = $(this).find('span[data-editable="headline"]').text();
                        const url = 'https://edition.cnn.com' + $(this).find('a').attr('href');
                        const imageUrl = $(this).find('img').attr('data-url');

                        if(title){
                        articles.push({
                            title,
                            url,
                            imageUrl,
                            source: newspaper.name
                        });
			}
                    });
                } else {
                    $('.gnt_m_flm_a').each(function() {
                        const title = $(this).text();
                        const url = newspaper.address+$(this).attr('href');

                        if(title){
			articles.push({
                            title,
                            url,
                            source: newspaper.name
                        });
			}
                    });
                    $('main section div ul li div div a').parent().each(function() {
                        const title = $(this).find('h3').text();
                        const url = newspaper.address+$(this).find('a').attr('href');

                        if(title){
			articles.push({
                            title,
                            url,
                            source: newspaper.name
                        });
			}
                    });

                }
		}
		catch(e){console.log(e);}
            })
        );

	var result=[];
        articles.forEach((art)=>{
            result.push(art.title+" - "+art.source)
        })
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred' });
    }
});

app.get('/movie', async (req, res) => {
    console.log("/movie")
    try {
        const articles = [];

 		try{
                const response = await axios.get("https://www.cineplex.com/");
                const html = response.data;
                const $ = cheerio.load(html);
                    $('#homepage_movie_grid div').each(function() {
                        const title = $(this).find('div div pre p').text();
                        const url = 'https://www.cineplex.com' + $(this).find('div a').attr('href');
                        const imageUrl = $(this).find('img').attr('src');

			if(title){
                        articles.push({
                            title,
                            url,
                            imageUrl,
                            source: "cineplex"
                        });
			}
                    });
                    $('#homepage_event_cinema div').each(function() {
                        const title = $(this).find('div div pre p').text();
                        const url = 'https://www.cineplex.com' + $(this).find('div a').attr('href');
                        const imageUrl = $(this).find('img').attr('src');

			if(title){
                        articles.push({
                            title,
                            url,
                            imageUrl,
                            source: "cineplex"
                        });
			}
                    });
                    $('#homepage_store div').each(function() {
                        const title = $(this).find('div div pre p').text();
                        const url = 'https://www.cineplex.com' + $(this).find('div a').attr('href');
                        const imageUrl = $(this).find('img').attr('src');

			if(title){
                        articles.push({
                            title,
                            url,
                            imageUrl,
                            source: "cineplex"
                        });
			}
                    });
		}
		catch(e){console.log(e);}

 		if(false){
		try{
                const response = await axios.get("https://www.google.com/search?q=movies+in+theeater+now");
                const html = response.data;
                const $ = cheerio.load(html);
			console.log(html)
                    $('#main #appbar').find('a').each(function() {
                        const title = $(this).text();
			console.log(title)
                        const url = 'https://www.google.com' + $(this).find('a').attr('href');
                        const imageUrl = $(this).find('img').attr('src');

			if(title){
                        articles.push({
                            title,
                            url,
                            imageUrl,
                            source: "google.com"
                        });
			}
                    });
		}
		catch(e){console.log(e);}
		}

 		try{
                const response = await axios.get("https://www.rottentomatoes.com/browse/movies_in_theaters/sort:popular");
                const html = response.data;
                const $ = cheerio.load(html);
                    $('.discovery-grids-container .flex-container').each(function() {
                        const title = $(this).find('a .p--small').text().trim();
                        const url = 'https://www.rottentomatoes.com' + $(this).find('a').attr('href');
                        const imageUrl = $(this).find('.posterImage').attr('src');

			if(title){
                        articles.push({
                            title,
                            url,
                            imageUrl,
                            source: "rottentomatoes.com"
                        });
			}
                    });
		}
		catch(e){console.log(e);}

	var result=[];
        articles.forEach((art)=>{
          if(req.param("field")){
            var content=art[req.param("field")]
            if(req.param("dedup")&&!Object.values(result).includes(content))
            {
              result.push(content)
            }
            else if(!req.param("dedup"))
            {
              result.push(content)
            }
          }
          else{
            result.push(art)
          }
        })
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred' });
    }
});

app.get('/google',function(req,res){
  var headersct = {
    "User-Agent": "Mozilla/5.0 (Windows NT 6.3; Win64; x64)   AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.84 Safari/537.36 Viewer/96.9.4688.89"
  }
  var articles=[];
  needle.get('https://www.google.com/search?q='+req.param('query')+'&num=200&gl=us&hl=en',{"headers":headersct},function(error,response){
    if (!error){
      const $ = cheerio.load(response.body)
      try{
        $('#rso a').each(function() {
          const title = $(this).find('h3').text().trim();
          const url = $(this).attr('href');
          const imageUrl = $(this).find('img').attr('src');
		
          if(title){
          articles.push({
            title,
            url,
            imageUrl,
            source: "google"
          })
          }
	})
      }
      catch(e){console.log(e);}
      res.json(articles)
      console.log()
    }
    else{
      console.log(error)
      res.send(404,"An error occured!")
    }
  })
});


app.get('/www',function(req,res){
 needle.get(req.param("url"),html_option, function(error, response) {
  if (!error){
    res.send(htmlToText(response.body, {preserveNewlines:true}));
    console.log()
  }
 });
});

app.get('/json',function(req,res){
 needle.get(req.param("url"),html_option, function(error, response) {
  if (!error){
    res.json(response.body);
    console.log()
  }
 });
});

app.get('/wiki',function(req,res){
 needle.get("https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro=&explaintext=&titles="+req.param("query"),html_option, function(error, response) {
  if (!error){
    res.json(response.body);
    console.log();
  }
  else {
    console.log(error);
  }
 });
});

app.get('/news',function(req,res){
 var apiKey="bdc3ada53fbb4fd4ba585c03b0c7e21d"
 // get your key from:  https://newsapi.org/docs/endpoints/top-headlines
 var localurl="https://newsapi.org/v2/top-headlines?country="+req.param("country")+"&apiKey="+apiKey
 needle.get(localurl,html_option, function(error, response) {
  if (!error){
    var text = response.body;
    var entry=[];
    text.articles.forEach((element)=>{
      try{
        entry.push(element.title+" - "+"google");
      }
      catch(e){}
    });
    res.json(entry);
    console.log();
  }
  else {
    console.log(error);
  }
 });
});

app.get('/yahoo',function(req,res){
 var localurl="http://news.yahoo.com/rss/"+req.param("country")+"?format=json";
 needle.get(localurl,html_option, function(error, response) {
  if (!error){
    var text = response.body;
    var entry=[];
    text.children[0].children.forEach((element)=>{
      try{
        entry.push(element.children[0].value+" - "+"yahoo")
      }
      catch(e){}
    });
    res.json(entry);
    console.log();
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

