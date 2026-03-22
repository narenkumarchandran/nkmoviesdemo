const express = require("express");
const User = require("../models/user.js");
const auth = require("../middleware/authMiddleware.js");

const router = express.Router();

// Get favorites
router.get("/", auth, async (req, res) => {
  const user = await User.findById(req.user.id);
  if (user.favorites == null) res.send(null);
  res.json(user.favorites); 
});

// Add favorite
router.post("/", auth, async (req, res) => {
 
  const { movieId, title, posterPath } = req.body;
  const user = await User.findById(req.user.id);

  if (!user.favorites.find(fav => fav.movieId === movieId)) {
    user.favorites.push({ movieId, title, posterPath });
    await user.save();
  }
  res.json(user.favorites);

});

// Remove favorite
router.delete("/:movieId", auth, async (req, res) => {
  const user = await User.findById(req.user.id);
  user.favorites = user.favorites.filter(fav => fav.movieId !== req.params.movieId);
  await user.save();
  res.json(user.favorites);
});

module.exports = router;
