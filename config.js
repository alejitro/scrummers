/*var nconf = require('nconf');

nconf.argv()
    .env()
    .file({ file: 'config/config.json' });
*/

const conf = {
  URLS3:process.env.URLS3,
  JWT_SECRET:process.env.JWT_SECRET
}

module.exports = conf;
