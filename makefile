# makefile for marketapi
#
NODE_RECOMMENDED=v8.10.0
NODE_INSTALLED := $(shell node --version)
OS_PLATFORM := $(shell uname -s)


## default
noop:
	@echo "No action specified!" &2> /dev/null 


## install
install_dev:
ifneq ($(NODE_INSTALLED),$(NODE_RECOMMENDED))
	@echo "Node version should be $(NODE_RECOMMENDED), you have ==>" $(NODE_INSTALLED)
	@echo "nvm might be useful, https://www.sitepoint.com/quick-tip-multiple-versions-node-nvm/"
endif
	npm run install-dev


install_prod:
ifneq ($(NODE_INSTALLED),$(NODE_RECOMMENDED))
	@echo "Node version should be $(NODE_RECOMMENDED), you have ==>" $(NODE_INSTALLED)
	@echo "nvm might be useful, https://www.sitepoint.com/quick-tip-multiple-versions-node-nvm/"
endif
	npm run install-prod


## build
buildzip_on_macos:
	npm run buildzip-macos

buildzip_on_linux:
	npm run buildzip-linux


## deploy
deployfrom_macos: install_prod buildzip_on_macos
	sam package --template-file template-aws.yaml --s3-bucket jordanjr --output-template-file packaged.yaml
	sam deploy --template-file ./packaged.yaml --stack-name mystack --capabilities CAPABILITY_IAM

deployfrom_linux: install_prod buildzip_on_linux
	sam package --template-file template-aws.yaml --s3-bucket jordanjr --output-template-file packaged.yaml
	sam deploy --template-file ./packaged.yaml --stack-name mystack --capabilities CAPABILITY_IAM


## testing
test_setup:
	npm run test-setup

test_macos:
	@echo "Setting up & running test environment for Darwin (macOS) ==>" $(OS_PLATFORM)
	npm run test-macos

test_linux:
	@echo "Setting up & running test environment for Linux (AWS Linux) ==>" $(OS_PLATFORM)
	npm run test-linux
