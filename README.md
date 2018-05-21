<img src="https://github.com/MARKETProtocol/dApp/blob/master/src/img/MARKETProtocol-Light.png?raw=true" align="middle">

MARKET Protocol has been created to provide a secure, flexible, open source foundation for decentralized trading on the Ethereum blockchain. We provide the pieces necessary to create a decentralized exchange, including the requisite clearing and collateral pool infrastructure, enabling third parties to build applications for trading.

Join our [Discord Community](https://www.marketprotocol.io/discord) to interact with members of our dev staff and other contributors.

# MARKET API

## Background
This project used the [AWS Serverless Application Model (AWS SAM)](https://github.com/awslabs/serverless-application-model). SAM defines serverless applications using simple and clean syntax. GitHub link is the starting point for AWS SAM. It contains the SAM specification, the code that translates SAM templates into AWS CloudFormation stacks, general information about the model, and examples of common applications.

To create a serverless application using SAM, first, you create a SAM template: a JSON or YAML configuration file that describes your Lambda functions, API endpoints and the other resources in your application. Then, you test, upload, and deploy your application using the [SAM CLI](https://github.com/awslabs/aws-sam-cli). During deployment, SAM automatically translates your application’s specification into CloudFormation syntax, filling in default values for any unspecified properties and determining the appropriate mappings and invocation permissions to setup for any Lambda functions.

## AWS SAM CLI
You'll use the AWS SAM CLI to develop your application locally. The CLI has some great features:

- Develop and test your Lambda functions locally with SAM CLI and Docker
- Invoke functions from known event sources such as Amazon S3, Amazon DynamoDB, Amazon Kinesis, etc.
- Start local API Gateway from a SAM template, and quickly iterate over your functions with hot-reloading
- Validate SAM templates
- Get started with boilerplate Serverless Service in your chosen Lambda Runtime `sam init`

## Creating the Development Environment
The following steps need to be completed to have a fully functioning development environment.

1. Install Docker for your platform.
2. Clone and install this repo.
3. Install the AWS SAM CLI. 
4. Test the AWS SAM CLI.

### Install Docker

- macOS &mdash; [Docker for Mac](https://store.docker.com/editions/community/docker-ce-desktop-mac)
- Windows &mdash; [Docker Toolbox](https://download.docker.com/win/stable/DockerToolbox.exe)
- Linux &mdash; Check your distro’s package manager (e.g. yum install docker).

### Clone and install the repo

```
$ mkdir market-api && cd market-api
$ git clone https://github.com/MARKETProtocol/market-api.git .
$ make test_setup
$ make install_dev
```

`make test_setup` creates a `.env` file used for `process.env` variables inside your unit tests. Please update the placeholders in `.env` to use the correct variable values. Note, this file is not committed to Github so it's safe to use private values.

### Install the AWS SAM CLI
Detailed instructions are listed here, [SAM CLI](https://github.com/awslabs/aws-sam-cli). 

```
$ pip install aws-sam-cli
```

This will install the CLI globally at `/usr/local/bin`.

#### AWS SAM CLI Installation Troubleshooting

1. Install the CLI using [PIP](https://pip.pypa.io/en/stable/installing/). Please note, the [npm AWS SAM CLI](https://www.npmjs.com/package/aws-sam-local) only supports CLI version `0.2.11` and below of the CLI. You must use PIP to install CLI version `0.3.x`. To uninstall version `0.2.x`, `npm uninstall -g aws-sam-local`.
2. Check your default Python version. It should be `2.7.x`. The CLI installation is only compatible with Python2.
3. Try `sam --version` then `sam local --help`. If you get an error such as, `Unable to import 'samcli.commands.local.local'`, uninstall the CLI, `pip uninstall aws-sam-cli` then reinstall it using `pip2.7 install aws-sam-cli`. This forces the use of the `2.7.x` version of PIP.
4. At this point, `sam local --help` should work and give you the correct text.

### Test the AWS SAM CLI
Make sure docker is running.

```
$ docker ps
CONTAINER ID   IMAGE     COMMAND    CREATED    STATUS     PORTS       NAMES
...

$ sam local invoke -e event.json "HelloWorld"
...
"Hello MARKET"
```

If you see `"Hello MARKET"` at the bottom of the response, you're ready to go!


## Developer's Guide


## Deployment


## HTTP methods
The following endpoints are available:

* Endpoint (development): `https://dev.api.marketprotocol.io`
* Endpoint (production): `https://api.marketprotocol.io`

`/contracts/whitelist`
* Add to Whitelist, reference `MarketContractRegistry.sol`. The address is the contract to be whitelisted.
* Response: `200`, `400`, `500`, or `502`, along with additional data.
```
POST /contracts/whitelist HTTP/1.1
Content-Type: application/json

{
    address: "0x06e28E90107e015f12DAE5F2FE0C6750eF225620"
}
```

`/contracts/whitelist`
* Get Whitelist, reference `MarketContractRegistry.sol`.
* Response: `200`, `500`, or `502`, along with additional data.
```
GET /contracts/whitelist HTTP/1.1
```

`/proxy/binance/*`
* Supports path and query parameter pass through. In this case, `api/v3/ticker/price` is used to call Binance. 
* Response: `200`, `400`, `500`, or `502`, along with additional data.
```
GET /proxy/binance/api/v3/ticker/price HTTP/1.1
```