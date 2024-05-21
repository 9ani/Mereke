const express = require("express");
const router = express.Router();
const User = require("../auth/User");
const Event = require("../Events/Event");
const Categories = require("../Categories/Categories");

router.get("/", async (req, res) => {
  const options = {};
  const categories = await Categories.findOne({ key: req.query.category });
  if (categories) {
    options.category = categories._id;
    res.locals.category = req.query.category;
  }
  let page = 0;
  const limit = 3;

  if (req.query && req.query.page > 0) {
    page = req.query.page;
  }

  if (req.query.search && req.query.search.length > 0) {
    options.$or = [
      {
        title: new RegExp(req.query.search, "i"),
      },
    ];
    res.locals.search = req.query.seacrh;
  }
  const totalEvents = await Event.countDocuments(options);
  const allCategories = await Categories.find();
  const events = await Event.find(options)
    .skip(page * limit)
    .limit(limit)
    .populate("category");
  const user = req.user ? await User.findById(req.user._id) : {};

  res.render("index", {
    categories: allCategories,
    user,
    events,
    pages: Math.ceil(totalEvents / limit),
  });
});

router.get("/login", (req, res) => {
  res.render("login", { user: req.user ? req.user : {} });
});
router.get("/register", (req, res) => {
  res.render("register", { user: req.user ? req.user : {} });
});

router.get("/profile/:id", async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
        res.render("profile", { user: user , loginUser: req.user});
    } else {
        res.redirect('/not-found');
    }
});
router.get("/admin/:id", async (req, res) => {
    const allCategories = await Categories.find();
    const user = await User.findById(req.params.id);
  const events = await Event.find()
    .populate("category");

  res.render("adminProfile", {
    categories: allCategories,
    loginUser: req.user ? req.user : {},
    user: user,
    events: events,
  });
});

router.get("/new-event", async (req, res) => {
  const allCategories = await Categories.find();

  res.render("newEvent", {
    categories: allCategories,
    user: req.user ? req.user : {},
  });
});
router.get("/edit/:id", async (req, res) => {
  const allGenres = await Genres.find();
  const allCountries = await Country.find();
  const film = await Film.findById(req.params.id);

  res.render("editevent", {
    genres: allGenres,
    countries: allCountries,
    user: req.user ? req.user : {},
    film,
  });
});
router.get("/not-found", (req, res) => {
  res.render("notfound");
});

router.get("/detail/:id", async (req, res) => {
  const rates = await Rate.find({ filmId: req.params.id }).populate("authorId");
  let averageRate = 0;
  for (let i = 0; i < rates.length; i++) {
    averageRate += rates[i].rate;
  }
  const film = await Film.findById(req.params.id)
    .populate("country")
    .populate("genre");
  res.render("detail", {
    user: req.user ? req.user : {},
    film: film,
    rates: rates,
    averageRate: (averageRate / rates.length).toFixed(1),
  });
});

module.exports = router;