const { Schema, model } = require("mongoose")

const schema = new Schema({
    Chanel: String
})

const scdl = model("scdl", schema)

module.exports = scdl