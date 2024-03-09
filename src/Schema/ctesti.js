const { Schema, model } = require("mongoose")

const schema = new Schema({
    Chanel: String
})

const ctesti = model("ctesti", schema)

module.exports = ctesti