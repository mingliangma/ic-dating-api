const bcrypt = require('bcrypt');

exports.cryptPassword = password => bcrypt.hash(password, 5);

exports.cryptPasswordSync = password => bcrypt.hashSync(password, 5);

exports.comparePassword = (hashPassword, password) => bcrypt.compare(password, hashPassword);
