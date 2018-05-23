#!/bin/bash

## bash script to configure the Amazon Lambda Execution Environment AMI

## Update packages
yum check-update -y
yum update -y

## Install packages
yum install -y nfs-utils jq git docker gcc-c++ make

## Configure docker
usermod -aG docker ec2-user
chkconfig docker on
service docker start

## Install AWS SAM CLI
sudo -H -u ec2-user bash -c 'cd /home/ec2-user; \
git clone https://github.com/awslabs/aws-sam-cli.git; \
cd aws-sam-cli/; \
sudo pip install -e .'

## Install node
sudo -H -u ec2-user bash -c 'cd /home/ec2-user; \
curl -s -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh 2>/dev/null | bash; \
source ~/.bashrc; \
nvm install v8.10.0 2> /dev/null'

## Install the code
sudo -H -u ec2-user bash -c 'cd /home/ec2-user; \
mkdir market-api && cd market-api; \
git clone https://github.com/MARKETProtocol/market-api.git .; \
git checkout develop; \
export PATH=$PATH:/home/ec2-user/.nvm/versions/node/v8.10.0/bin; \
make test_setup; \
make install_dev'
