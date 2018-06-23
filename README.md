<img src="https://github.com/MARKETProtocol/dApp/blob/master/src/img/MARKETProtocol-Light.png?raw=true" align="middle">

MARKET Protocol has been created to provide a secure, flexible, open source foundation for decentralized trading on the 
Ethereum blockchain. We provide the pieces necessary to create a decentralized exchange, including the requisite 
clearing and collateral pool infrastructure, enabling third parties to build applications for trading.

Join our [Discord Community](https://www.marketprotocol.io/discord) to interact with members of our dev staff and 
other contributors.

# MARKET API

## Background
This project uses the [Serverless Framework](https://serverless.com/). It's an open-source CLI for building serverless 
architectures.

## Documentation
Your best source to learn the Serverless Framework is the 
[Serverless AWS Lambda Guide](https://serverless.com/framework/docs/providers/aws/guide/). Detailed information for
each topic below can be found in the documentation. It's worth reading!

## Creating the Development Environment

```
$ mkdir market-api && cd market-api
$ git clone https://github.com/MARKETProtocol/market-api.git .
$ npm install
```

## Development Workflow
Generally, you'll follow the follow steps:

1. Write your code using the standard patterns found in the existing code. Please review the code before working
   on this project.
2. When creating a new API, you'll need to update `serverless.yml`. Again, look at the current configuration in the
   file to get an idea of how to add an API call.
3. Write tests to run locally.
4. Test your code locally using `serverless invoke local --function myFunction`. You also have access to a local
   webserver for debugging.
5. Use `serverless deploy` only when you've made changes to `serverless.yml` and in CI/CD systems.
6. Use `serverless deploy function -f myFunction` to rapidly deploy changes when you are working on a specific 
   AWS Lambda Function.
7. Please note, in order to `deploy` to AWS, you'll need the appropriate credentials.
8. Open up a separate tab in your console and stream logs in there via `serverless logs -f myFunction -t`.


## Running Serverless Locally
There are two ways to run your code locally.

1. Running `serverless invoke local` at the command line.
2. Using the built in webserver.

### Serverless Invoke Local
This runs your code locally by emulating the AWS Lambda environment. Please keep in mind, it's not a 100% perfect 
emulation, there may be some differences, but it works for the vast majority of users.

```
serverless invoke local --function functionName
```

### Using the Built-in Webserver
There are two ways to run the built-in webserver.

1. `npm run start`: Run this command in a new terminal window to start the webserver locally.
2. `npm run debug`: Run this command when you want to run the webserver in debug mode. This will make is easy to 
   connect to your IDE's debugger.

## Building and Packaging
The `severless package` command packages your entire infrastructure into the `.serverless` directory by default and 
makes it ready for deployment. You can specify another packaging directory by passing the `--package option`.

```
serverless package
```

## Deployment
There are two options to deploy your functions to AWS.

1. `severless deploy`
2. `serverless deploy function`

### Serverless Deploy
The `serverless deploy` command deploys your entire service via CloudFormation. Run this command when you have made 
infrastructure changes (i.e., you edited `serverless.yml`).

### Serverless Deploy Function
The `serverless deploy function` command deploys an individual function without AWS CloudFormation. This command 
simply swaps out the zip file that your CloudFormation stack is pointing toward. This is a much faster way of 
deploying changes in code.

## Unit Testing
Depending upon your platform, use the following commands to test:

*** OUT OF DATE ***

Since we are using `scrypt` for `web3`, there are library specific files for macOS and AWS Linux.
When running unit tests, the Node scripts will install the correct files to run your tests. When you are using
the SAM CLI, you'll be using the `scrypt` files specifically for the Lamdba Execution Environment. This ensures compatibility once you upload your code to AWS Lambda.

## HTTP methods

*** OUT OF DATE ***

The following endpoints are available:

* Development: `https://dev.api.marketprotocol.io`
* Production: `https://api.marketprotocol.io`

### `/contracts/whitelist`
* Add to Whitelist, reference `MarketContractRegistry.sol`. The address is the contract to be whitelisted.
* Response: `200`, `400`, `500`, or `502`, along with additional data.
```
POST /contracts/whitelist HTTP/1.1
Content-Type: application/json

{
    address: "0x06e28E90107e015f12DAE5F2FE0C6750eF225620"
}
```

### `/contracts/whitelist`
* Get Whitelist, reference `MarketContractRegistry.sol`.
* Response: `200`, `500`, or `502`, along with additional data.
```
GET /contracts/whitelist HTTP/1.1
```

### `/proxy/binance/*`
* Supports path and query parameter pass through. In this case, `api/v3/ticker/price` is used to call Binance. 
* Response: `200`, `400`, `500`, or `502`, along with additional data.
```
GET /proxy/binance/api/v3/ticker/price HTTP/1.1
```