import sha3 from 'crypto-js/sha3';

import { APIGatewayProxyEvent } from 'aws-lambda';

/**
 * Checks if the given string is a url.
 * https://stackoverflow.com/questions/8667070/javascript-regular-expression-to-validate-url
 * 
 * @method isUrl
 * @param {String} url  The given URL address.
 * @returns {Boolean}
 */
const isUrl = function (url: string): boolean {
  return /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(url);
};

/**
 * Check for an empty event object.
 * 
 * @param {APIGatewayProxyEvent} event  The event to check.
 * @param {string} param                The object on event to check.
 * @param {string} prop                 The property on the object on the event to check.
 * @returns {Boolean}
 */
const isEventEmpty = function (event: APIGatewayProxyEvent, obj?: string, prop?: string): boolean {
  // Check for undefined event
  if (typeof event === 'undefined') {
    return true;
  }

  // Check for undefined object
  if (obj && typeof event[obj] === 'undefined') {
    return true;
  }
  
  // Check for undefined prop
  if (obj && prop && typeof event[obj][prop] === 'undefined') {
    return true;
  }

  return false;
};

/**
 * Checks if the given string is an address.
 * https://ethereum.stackexchange.com/questions/1374/how-can-i-check-if-an-ethereum-address-is-valid
 * 
 * @method isAddress
 * @param {String} address the given HEX adress
 * @returns {Boolean}
 */
const isAddress = function (address: string): boolean {
  if (!/^(0x)?[0-9a-f]{40}$/i.test(address)) {
      // check if it has the basic requirements of an address
      return false;
  } else if (/^(0x)?[0-9a-f]{40}$/.test(address) || /^(0x)?[0-9A-F]{40}$/.test(address)) {
      // If it's all small caps or all all caps, return true
      return true;
  } else {
      // Otherwise check each case
      return isChecksumAddress(address);
  }
};

/**
 * Checks if the given string is a checksummed address
 *
 * @method isChecksumAddress
 * @param {String} address the given HEX adress
 * @returns {Boolean}
 */
const isChecksumAddress = function (address: string): boolean {
  // Check each case
  address = address.replace('0x', '');
  let addressHash = sha3(address.toLowerCase());
  for (let i = 0; i < 40; i++ ) {
      // the nth letter should be uppercase if the nth digit of casemap is 1
      if ((parseInt(addressHash[i], 16) > 7 && address[i].toUpperCase() !== address[i]) || (parseInt(addressHash[i], 16) <= 7 && address[i].toLowerCase() !== address[i])) {
          return false;
      }
  }
  return true;
};

export { isAddress, isChecksumAddress, isEventEmpty, isUrl };