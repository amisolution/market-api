<img src="https://github.com/MARKETProtocol/dApp/blob/master/src/img/MARKETProtocol-Light.png?raw=true" align="middle">

MARKET Protocol has been created to provide a secure, flexible, open source foundation for decentralized trading on the 
Ethereum blockchain. We provide the pieces necessary to create a decentralized exchange, including the requisite 
clearing and collateral pool infrastructure, enabling third parties to build applications for trading.

Join our [Discord Community](https://www.marketprotocol.io/discord) to interact with members of our dev staff and 
other contributors.

# MARKET API

## Background
This project uses the [Serverless Framework](https://serverless.com/). It's an open-source CLI for building serverless 
architectures. This is also a [TypeScript](https://github.com/Microsoft/TypeScript) project.

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
2. When creating a new API, you'll need to update `serverless.yml`. Look at the current configuration in the
   file to get an idea of how to add an API call.
3. Write unit tests to run locally.
4. Test your code locally using `serverless invoke local --function myFunction --path ../event.json`. You also have access 
   to a local webserver for debugging. This is provided by the `Serverless Offline Plugin`. The event data, 
   `--path ../event.json`, is optional.
5. Use `serverless deploy` only when you've made changes to `serverless.yml` and with CI/CD systems.
6. Use `serverless deploy function --function myFunction` to rapidly deploy changes when you are working on a specific 
   AWS Lambda Function.
7. Please note, in order to `deploy` to AWS, you'll need the appropriate credentials. You might need your own AWS
   account to develop and test. The infrastructure is very simple so the cost should be minimal.
8. If you want to stream the logs, open up a separate tab in your console and 
  use `serverless logs --function myFunction -t`.


## Running Serverless Locally
There are two ways to run your code locally.

1. Running `serverless invoke local` at the command line.
2. Using the built in webserver.

### Serverless Invoke Local
This runs your code locally by emulating the AWS Lambda environment. Please keep in mind, it's not a 100% perfect 
emulation, there may be some differences, but it works for the vast majority of users.

```
serverless invoke local --function functionName --path ../event.json
```

If you're not using API Gateway events, the `--path ../event.json` is optional when you test your functions.

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
Unit testing can be challenging with Lambda function patterns. The Serverless folks recommend a 
["wrapper" approach](https://serverless.com/framework/docs/providers/aws/guide/testing/).
We've taken a similar approach to make unit testing much easier when writing and debugging your functions.

The AWS handler functions implement the simplest logic possible. Testing of these functions happens just by running
them. The unit tests are focused on the classes that support the handler functions.

The testing framework used for this project is [Jest](https://jest-bot.github.io/jest/docs/getting-started.html) along 
with [Jest-Extended](https://github.com/jest-community/jest-extended). To run the unit tests, 

```
npm run test
```

Keep an eye on `constants.ts` since it contains static data used with the API and unit testing. You might need
to change some of these valued depending on how you are running the API and testing.

## HTTP methods

The following endpoints are available:

* Development: `https://dev.api.marketprotocol.io`
* Production: `https://api.marketprotocol.io`

### `/contracts/whitelist`
* Get the white list for the Market contracts, reference `MarketContractRegistry.sol`.
* Response: `200`, `500`, or `502`, along with additional data.
```
GET /contracts/whitelist HTTP/1.1
```

### `/orders/{address}/{quantity}`
* Returns signed buy and sell side orders for trading in the Simulated Exchange. An `{address}` of a Market
  contract is required. `{quantity}` allows you to specify the number of orders to return. This is an optional 
  parameter. If not included the default is five buy and sell orders.
* Please note, this response is cached for five seconds.
* Response: `200`, `400`, `500`, or `502`, along with additional data.
```
GET /proxy/binance/api/v3/ticker/price HTTP/1.1
```

### `/proxy/binance/{*}`
* Supports path and query parameter pass through for Binance.
* `{*}` would be replaced by `api/v3/ticker/price`. Query parameters are also supported. 
* Response: `200`, `400`, `500`, or `502`, along with additional data.
```
GET /proxy/binance/api/v3/ticker/price HTTP/1.1
```