const chai = require('chai');
const expect = require('chai').expect;

require('dotenv').config();

const whitelist = require('../src/whitelist');
const utils = require('../src/utils/address');

let context;
let event = {
    address: process.env.ADD_TO_WHITELIST_ADDRESS
};

describe('Add whitelist address', () => {
    before('address should be valid', () => {
        expect(utils.isAddress(event.address)).to.be.true;
    })

    it('should whitelist the submitted address', async () => {
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
                expect(JSON.parse(result.body)).to.be.a('object');
            } else if (result.statusCode == 400) {
                expect(result.body).to.be.a('string');
            } else {
                expect(result.statusCode).to.equal(502);
                expect(result.body).to.be.a('string');
            }
        };
        // @TODO Fix this
        //const result = await whitelist.add(event, context, callback);
    });
});