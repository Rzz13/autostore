const { Schema, model } = require("mongoose");

const schema = new Schema({
  GrowID: {
    type: String,
    required: true,
  },
  DiscordID: {
    type: String,
    required: true,
  },
});

const Bals = model("InfoPlayer", schema);

module.exports = Bals;