#!/bin/sh -e

apt-get -y update
DEBIAN_FRONTEND=noninteractive apt-get -y -o Dpkg::Options::='--force-confdef' -o Dpkg::Options::='--force-confold' dist-upgrade
DEBIAN_FRONTEND=noninteractive apt-get -y install build-essential curl bash-completion python3-pip python3-dev default-jre-headless ruby2.1 ruby2.1-dev apt-transport-https
curl -s https://deb.nodesource.com/gpgkey/nodesource.gpg.key | apt-key add -
echo 'deb https://deb.nodesource.com/node_6.x jessie main' > /etc/apt/sources.list.d/nodesource.list
echo 'deb-src https://deb.nodesource.com/node_6.x jessie main' >> /etc/apt/sources.list.d/nodesource.list
apt-get -y update
apt-get -y install nodejs

npm install -g grunt-cli
cd /vagrant
pip3 install -r requirements.txt
cd grunt
mkdir -p node_modules
npm install || npm install || npm install || npm install || npm install || npm install

gem2.1 install sass compass
su -m vagrant -c 'ln -s /vagrant /home/vagrant/checkout'
