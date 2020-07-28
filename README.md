# mern-youtube-backend
# Commands to deploy a Node/React app.

# instal nodejs
curl -sL https://deb.nodesource.com/setup_10.x -o nodesource_setup.sh

# run the bash script
sudo bash nodesource_setup.sh

# run this command to make sure node js is installed
sudo apt-get install -y nodejs

# Install nginx for the server
sudo apt-get install nginx

# setup for sites available
cd /etc/nginx/sites-available/

# setup the proxy
sudo vim default

# Bellow ’server_name _;’ paste this:

      location /api {
                proxy_pass http://localhost:5000;
                proxy_http_version 1.1;
                proxy_set_header Upgrade $http_upgrade;
                proxy_set_header Connection 'upgrade';
                proxy_set_header Host $host;
                proxy_cache_bypass $http_upgrade;
        }

        location / {
                proxy_pass http://localhost:3000;
                proxy_http_version 1.1;
                proxy_set_header Upgrade $http_upgrade;
                proxy_set_header Connection 'upgrade';
                proxy_set_header Host $host;
                proxy_cache_bypass $http_upgrade;
        }

# Test that nginx is running properly
sudo nginx -t

# Restart nginx system
sudo systemctl restart nginx

# Install pm2
sudo npm i pm2 -g

# install mongodb
sudo apt install -y mongodb

# check mongoldb status
sudo systemctl status mongodb

# Install the git projects in the server

# Chec .env file on backend
/127.0.0.1/ instead of localhost

# Check on frontend
Just leave “/api”

Server setup for the react file
# filename: server.js

const express = require('express');
const compression = require('compression');
const path = require('path');
const app = express();

app.use(compression());
app.use(express.static(path.join(__dirname, 'build')));
 
app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});
 
const PORT = process.env.PORT || 3000;
 
app.listen(PORT, () => {
    console.log(`App is running on port ${PORT}`);
});

#npm install both

#npm run build react prod

#pm2 both

#DONE
