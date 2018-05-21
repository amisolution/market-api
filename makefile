# makefile for marketapi
#
NODE_REQUIRED=v8.10.0
NODE_INSTALLED := $(shell node --version)
OS_PLATFORM := $(shell uname -s)


## default
noop:
	@echo "No action specified!" &2> /dev/null 


## install
install_dev:
ifneq ($(NODE_INSTALLED),$(NODE_REQUIRED))
	@echo "Node version should be v8.10.0, you have ==>" $(NODE_INSTALLED)
	@echo "nvm might be useful, https://www.sitepoint.com/quick-tip-multiple-versions-node-nvm/"
else
	npm run install-dev
endif

install_prod:
ifneq ($(NODE_INSTALLED),$(NODE_REQUIRED))
	@echo "Node version should be v8.10.0, you have ==>" $(NODE_INSTALLED)
	@echo "nvm might be useful, https://www.sitepoint.com/quick-tip-multiple-versions-node-nvm/"
else
	npm run install-prod
endif


## build
buildzip_on_macos:
	npm run buildzip-macos

buildzip_on_ubuntu:
	#npm run buildzip-ubuntu


## deploy
deployfrom_macos: install_prod buildzip_macos
	sam package --template-file template-aws.yaml --s3-bucket jordanjr --output-template-file packaged.yaml
	sam deploy --template-file ./packaged.yaml --stack-name mystack --capabilities CAPABILITY_IAM

deployfrom_ubuntu: install_prod buildzip_ubuntu
	#npm run buildzip-ubuntu
	#sam package --template-file template-aws.yaml --s3-bucket jordanjr --output-template-file packaged.yaml
	#sam deploy --template-file ./packaged.yaml --stack-name mystack --capabilities CAPABILITY_IAM


## testing
test_setup:
	npm run testsetup

test_macos:
	@echo "Setting up test environment for Darwin ===>" $(OS_PLATFORM)
	npm run test-macos

test_ubuntu:
	#@echo "Setting up test environment for Linux ===>" $(OS_PLATFORM)
	#npm run test-ubuntu
