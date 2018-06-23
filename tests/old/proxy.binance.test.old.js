const chai = require('chai');
const expect = require('chai').expect;

require('dotenv').config();

const proxyAll = require('../src/proxy').proxyAll;

let context;
let event = {
  pathParameters: {
      entity: "binance",
      proxy: "api/v3/ticker/price",
  },
  queryStringParameters: {
    a : "1", 
    b : "2", 
    c : "3"
  }
};

describe('Get Binance exchange info', () => {
  it('should return a valid exchange object', async () => {
    const callback = (error, result) => {
      if (process.env.DEBUG) {
        console.log(result);
        console.log(JSON.parse(result.body));
      }

      expect(result).to.be.a('object');
      expect(result).to.have.property('statusCode');
      expect(result).to.have.property('headers');
      expect(result).to.have.property('body');
      expect(result).to.have.property('isBase64Encoded');
      expect(result.isBase64Encoded).to.be.a('boolean');
      if (result.statusCode == 200) {
        expect(result.body).to.be.a('string');
        expect(JSON.parse(result.body)).to.be.an('object');
      } else {
        expect(result.statusCode).to.equal(502);
        expect(result.body).to.be.a('string');
      }
    };
    await proxyAll(event, context, callback);
  });
});
