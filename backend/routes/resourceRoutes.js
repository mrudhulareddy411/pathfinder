const express = require("express");
const router = express.Router();
const { getResources } = require("../controllers/resourceController");

router.get("/", getResources);

module.exports = router;
