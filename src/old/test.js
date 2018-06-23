/**
 * Hello world Lambda test
 *
 * @method get
 * @param {Object} event events published by the supported AWS service, 
 *   https://docs.aws.amazon.com/lambda/latest/dg/eventsources.html
 * @param {String} context AWS Lambda uses this parameter to provide details of your Lambda 
 *   function's execution, https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html
 * @param {Function} callback use it to explicitly return information back to the caller
 * @return {Function}
*/
exports.hello = (event, context, callback) => {
    console.log('DEBUG: Name is ' + event.hello);
    callback(null, 'Hello ' + event.hello);
}