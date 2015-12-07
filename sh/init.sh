#!/usr/bin/env bash

curl -sL https://deb.nodesource.com/setup_5.x | sudo -E bash -  
sudo apt-get install -y nodejs  
sudo ln -s /usr/bin/nodejs /usr/bin/node  

sudo apt-get install -y git

sudo npm install gulp -g

npm install

npm rebuild node-sass