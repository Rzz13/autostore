const { Schema, model } = require("mongoose")

const sche = new  Schema({
	code: String,
	name: String,
	role: String
})

const list = model("list", sche)

module.exports = list