const mongoose = require("mongoose");
const Career = require("../models/Career");
const localDb = require("../config/localDbService");
const { getOnetCareerDetails } = require("../services/onetDatasetService");

const getCareers = async (req, res) => {
  try {
    let careers = [];
    if (mongoose.connection.readyState === 1) {
      careers = await Career.find({});
    } else {
      careers = await localDb.getCareers();
    }

    if (!careers || careers.length === 0) {
      return res.status(200).json({ message: "Verified information unavailable.", careers: [] });
    }
    return res.json(careers);
  } catch (error) {
    console.error("Get Careers Error:", error);
    return res.status(500).json({ message: "Unable to retrieve career data. Please try again." });
  }
};

const getCareerById = async (req, res) => {
  try {
    const { id } = req.params;
    const details = getOnetCareerDetails(id);

    if (details) {
      return res.json(details);
    }

    let career = null;
    if (mongoose.connection.readyState === 1) {
      career = await Career.findById(id);
    } else {
      const careers = await localDb.getCareers();
      career = careers.find((c) => c._id === id || c.id === id || c.title === id || c.onetCode === id);
    }

    if (!career) {
      return res.status(404).json({ message: "Verified career information unavailable for this ID." });
    }
    return res.json(career);
  } catch (error) {
    console.error("Get Career By Id Error:", error);
    return res.status(500).json({ message: "Unable to retrieve career details." });
  }
};

module.exports = { getCareers, getCareerById };
