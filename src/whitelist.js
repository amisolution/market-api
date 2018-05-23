const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider(process.env.PROVIDER_URL));
const ABI = [{"constant":false,"inputs":[{"name":"contractAddress","type":"address"}],"name":"addAddressToWhiteList","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"anonymous":false,"inputs":[{"indexed":true,"name":"contractAddress","type":"address"}],"name":"AddressAddedToWhitelist","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"contractAddress","type":"address"}],"name":"AddressRemovedFromWhitelist","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"},{"indexed":true,"name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"constant":false,"inputs":[{"name":"contractAddress","type":"address"},{"name":"whiteListIndex","type":"uint256"}],"name":"removeContractFromWhiteList","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getAddressWhiteList","outputs":[{"name":"","type":"address[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"contractAddress","type":"address"}],"name":"isAddressWhiteListed","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"}];
const registry = new web3.eth.Contract(ABI, process.env.CONTRACT_ADDRESS);

const utils = require('./utils/address');

/**
 * With the Lambda proxy integration for API Gateway, Lambda is required to return an 
 * output of the following format. This applies to all statusCodes.
 */
const response = {
    "statusCode": 200,
    "headers": {
      "Content-Type": "text/plain; charset=utf-8",
      "Access-Control-Allow-Origin": "*"
    },
    "body": "",
    "isBase64Encoded": false
  };
  
/**
 * Get the all addresses in the whitelist
 *
 * @method get
 * @param {Object} event events published by the supported AWS service, 
 *   https://docs.aws.amazon.com/lambda/latest/dg/eventsources.html
 * @param {String} context AWS Lambda uses this parameter to provide details of your Lambda 
 *   function's execution, https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html
 * @param {Function} callback use it to explicitly return information back to the caller
 * @return {Function}
*/
exports.get = async (event, context, callback) => {
    try {
        const getAddressWhiteListResult = await registry.methods.getAddressWhiteList().call();
        response.headers["Content-Type"] = "application/json; charset=utf-8";
        response.body = JSON.stringify(getAddressWhiteListResult);
        
    } catch(error) {
        response.statusCode = 502;
        response.body = error.message;
    }

    callback(null, response);
};

/**
 * Add an addresses to the whitelist
 *
 * @method add
 * @param {Object} event events published by the supported AWS service, 
 *   https://docs.aws.amazon.com/lambda/latest/dg/eventsources.html
 * @param {String} context AWS Lambda uses this parameter to provide details of your Lambda 
 *   function's execution, https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html
 * @param {Function} callback use it to explicitly return information back to the caller
 * @return {Function}
*/
exports.add = async function (event, context, callback) {
    // get access to the POST body when running via the API Gateway
    let address;
    if (event.body && typeof event.body === 'string') {
        const body = JSON.parse(event.body);
        if (body.address) {
            address = body.address;
        }
    }

    if (!address) {
        response.statusCode = 400;
        response.body = "Data Validation: Address is missing.";
        callback(null, response);
        return;
    }

    // Check for a vaild address
    if (!utils.isAddress(address)) {
        response.statusCode = 400;
        response.body = `Data Validation: Not a valid address: ${address}`
        callback(null, response);
        return;
    }

    // @TODO is error checking needed here?
    const method = registry.methods.addAddressToWhiteList(address); 
    const tx = {
        from: process.env.OWNER_ADDRESS,
        to: process.env.CONTRACT_ADDRESS,
        gas: process.env.GAS_LIMIT,
        gasPrice: process.env.GAS_PRICE,
        data: method.encodeABI()
    };

    try {
        const signTransactionResult = await web3.eth.accounts.signTransaction(tx, process.env.OWNER_PRIVKEY, (error, result) => result);
        const sendSignedTransactionResult = await  web3.eth.sendSignedTransaction(signTransactionResult.rawTransaction, (error, result) => result);
        response.headers["Content-Type"] = "application/json; charset=utf-8";
        response.body = JSON.stringify(sendSignedTransactionResult);

    } catch(error) {
        response.statusCode = 502;
        response.body = error.message;
    }

    callback(null, response);
}
  