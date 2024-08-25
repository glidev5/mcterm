# MCTERM
Using computer craft mod is sweet as you can have computers in minecraft. But don't you want to have a ssh connection between computers inside minecraft and real world computers? Wait no more, mcterm is such a server that allows you to communicate between minecraft computer and real world computer through ssh connection.

## Installation
1. minecraft server:
 * install [computer craft mod](http://www.curse.com/mc-mods/minecraft/computercraft) in both server and client
 * ensure http is enabled on server
 * enable whitelist on server
 * make sure server is not run as root

2. node server:
 * currently working with node v22.7.0
 * git clone https://github.com/glidev5/mcterm.git
 * npm install --no-bin-links
 * if needed, try: npm audit fix --force --no-bin-links
 * npm start
 * make sure nodejs server is not run as root

3. computer inside minecraft:
 * [market link as ref](http://turtlescripts.cem/project/gjdi1k-mcterm)
 * get market
 * get update
 * run update

```
pastebin get w1RtfqFd market
market get gjdiao update y
update
```
pastebin get EmKWkD17 curl
```

## Usage
### 1. curl http://www.google.com/
### 2. curl http://ubvm:3000/wiki?query=minecraft
### 3. curl http://ubvm:3000/cmd?cmd=whoami
### 4. curl http://ubvm:3000/news?country=ca
### 5. curl http://ubvm:3000/yahoo?country=ca
### 6. curl http://ubvm:3000/www?url=www.google.com

## Contributing
1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## History
 * 0.0.1  git init

## Credits
 * Thanks to Node.js for awesome modules.

## License
 * [Apache License](http://www.apache.org/licenses/LICENSE-2.0)
