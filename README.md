# MCTERM
Using computer craft mod is sweet as you can have computers in minecraft. But don't you want to have a ssh connection between computers inside minecraft and real world computers? Wait no more, mcterm is such a server that allows you to communicate between minecraft computer and real world computer through ssh connection.

## Installation
1. minecraft server:
 * install [computer craft mod](http://www.curse.com/mc-mods/minecraft/computercraft) in both server and client
 * ensure http is enabled on server
 * enable whitelist on server if open to public

2. node server:
 * currently working with node.js v22
 * git clone https://github.com/glidev5/mcterm.git
 * npm run-script install
 * npm start

3. computer inside minecraft:
### use this line to download a working pastebin
 * name it as pastebinget
```
local r = http.get("https://pastebin.com/raw/jCfCfBPn"); local f = fs.open( shell.resolve( "pastebin" ), "w" ); f.write( r.readAll() ); f.close(); r.close()
```
 * pastebin get EmKWkD17 curl
 * pastebin get 2CkJVtRz wget

### To get started, use curl to get information from node server
### It is assuming your server is ran on ubvm as domain
### Server by default use port 3000

## Usage
### type these command in minecraft computer with curl/wget command
#### note: wget will output to wget.out file, edit it to see results
### 1. curl http://www.google.com/
#### note: http:// is not omittable, but trailing / is omittable
### 2. curl http://ubvm:3000/wiki?query=minecraft
#### note: sometimes query return no result at all if wiki has no entry. This is intended.
### 3. curl http://ubvm:3000/cmd?cmd=whoami
#### note: this command is ran on specified ssh target. You will need to setup ssh-key so it does not require a password.
### 4. curl http://ubvm:3000/news?country=ca
### 5. curl http://ubvm:3000/yahoo?country=ca
#### note: country is not omittable
### 6. curl http://ubvm:3000/news2
#### note: this is my second try to write a news engine, WIP
### 7. curl http://ubvm:3000/www?url=www.google.com
#### note: www route only return text() content

## History
 * 0.0.1  git init
 * 2.0.0  complete rewrite to include /mcterm folder and /root folder
 * 2.1.0  updated web.js to support newest version of node.js
 * 2.1.1  updated web.js to include /news2 route with a better news engine
 * 2.1.2  updated readme

## Credits
 * Thanks to Node.js for awesome modules.

## License
 * [Apache License](http://www.apache.org/licenses/LICENSE-2.0)
