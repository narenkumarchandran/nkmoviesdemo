const mongoose = require("mongoose");

const FavoriteSchema = new mongoose.Schema({
  movieId: { type: String, required: true },
  title: String,
  posterPath: String,
});

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  favorites: [FavoriteSchema],
});

module.exports = mongoose.model("User", UserSchema);
