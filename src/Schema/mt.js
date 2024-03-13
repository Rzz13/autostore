const {Schema, model} = require('mongoose');

const schema = new Schema({
	Maintenance: Boolean
});

const mt = model('mt', schema);

module.exports = mt;
