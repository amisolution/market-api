const chai = require('chai');
const expect = require('chai').expect;

require('dotenv').config();

const whitelist = require('../src/whitelist');

let event, context;

describe('Get whitelist address', () => {
  it('should return whitelist or a proper error object', async () => {
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
        expect(JSON.parse(result.body)).to.be.an('array');
      } else {
        expect(result.statusCode).to.equal(502);
        expect(result.body).to.be.a('string');
      }
    };
    const result = await whitelist.get(event, context, callback);
  });
});
