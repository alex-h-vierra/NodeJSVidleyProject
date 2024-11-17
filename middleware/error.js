const winston = require('winston');
//logging level
    //error
    //warn
    //info
    //verbose
    //debug
    //silly
module.exports = function(err, req, res, next) {
    winston.error(err);
    res.status(500).send('Something Internally Failed');
}