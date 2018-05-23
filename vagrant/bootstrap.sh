#!/usr/bin/env bash

## bash script to configure Amazon AMI for dev

## Functions ---------------

## Update packages
sudo yum check-update -y
sudo yum update -y

## Install packages
sudo yum install -y nfs-utils jq git docker gcc-c++ make

## Configure docker
sudo usermod -aG docker vagrant
sudo chkconfig docker on
sudo service docker start

## Set timezone to Mountain
#sudo cp /usr/share/zoneinfo/US/Mountain /etc/localtime

## Configure AWS access
mkdir -p /home/vagrant/.aws
tee /home/vagrant/.aws/config <<-'ENDOFCONF'
[default]
output = json
region = us-east-1
ENDOFCONF
tee /home/vagrant/.aws/credentials <<-'ENDOFCONF'
[default]
aws_access_key_id = 
aws_secret_access_key = 
ENDOFCONF
chmod 0600 /home/vagrant/.aws/config 
chmod 0600 /home/vagrant/.aws/credentials

## Install AWS SAM CLI
cd /home/vagrant
git clone https://github.com/awslabs/aws-sam-cli.git
cd aws-sam-cli/
sudo pip install -e .

## Install node
cd /home/vagrant
curl -s -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh 2>/dev/null | bash
source ~/.bashrc
nvm install v8.10.0 2> /dev/null

## Install the code
cd /home/vagrant
mkdir market-api && cd market-api
git clone https://github.com/MARKETProtocol/market-api.git .
git checkout develop
export PATH=$PATH:/home/vagrant/.nvm/versions/node/v8.10.0/bin
make test_setup
make install_dev
