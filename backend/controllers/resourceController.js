const mongoose = require("mongoose");
const Resource = require("../models/Resource");
const localDb = require("../config/localDbService");

const getResources = async (req, res) => {
  try {
    const { skill, category } = req.query;
    let resources = [];

    if (mongoose.connection.readyState === 1) {
      const filter = {};
      if (skill) filter.skill = new RegExp(skill, "i");
      if (category) filter.category = category;
      resources = await Resource.find(filter);
    } else {
      resources = await localDb.getResources({ skill, category });
    }

    if (!resources || resources.length === 0) {
      return res.status(200).json({ message: "No verified resources available.", resources: [] });
    }
    return res.json(resources);
  } catch (error) {
    console.error("Get Resources Error:", error);
    return res.status(500).json({ message: "Unable to retrieve resource data." });
  }
};

module.exports = { getResources };
