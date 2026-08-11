const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    resumeName: {
      type: String,
      required: true,
      default: "My Software Developer Resume",
    },
    template: {
      type: String,
      enum: ["CLASSIC", "MODERN", "FRESHER", "DEVELOPER", "ATS_MINIMAL", "CREATIVE", "TWO_COLUMN"],
      default: "MODERN",
    },
    personalInformation: {
      fullName: { type: String, default: "" },
      title: { type: String, default: "" },
      email: { type: String, default: "" },
      phone: { type: String, default: "" },
      location: { type: String, default: "" },
      linkedin: { type: String, default: "" },
      github: { type: String, default: "" },
      portfolio: { type: String, default: "" },
    },
    summary: {
      type: String,
      default: "",
    },
    education: [
      {
        degree: String,
        institution: String,
        university: String,
        branch: String,
        startYear: String,
        endYear: String,
        score: String,
      },
    ],
    skills: [
      {
        name: String,
        category: String,
        included: { type: Boolean, default: true },
      },
    ],
    projects: [
      {
        title: String,
        description: String,
        technologies: String,
        github: String,
        demo: String,
        included: { type: Boolean, default: true },
      },
    ],
    experience: [
      {
        company: String,
        role: String,
        location: String,
        startDate: String,
        endDate: String,
        description: String,
      },
    ],
    internships: [
      {
        company: String,
        role: String,
        duration: String,
        description: String,
        skillsUsed: String,
      },
    ],
    certifications: [
      {
        name: String,
        organization: String,
        issueDate: String,
        credentialUrl: String,
        included: { type: Boolean, default: true },
      },
    ],
    achievements: [
      {
        title: String,
        organization: String,
        date: String,
        description: String,
        included: { type: Boolean, default: true },
      },
    ],
    languages: [
      {
        language: String,
        proficiency: String,
      },
    ],
    additionalSections: [
      {
        sectionTitle: String,
        items: [String],
      },
    ],
    sectionOrder: {
      type: [String],
      default: ["personal", "summary", "skills", "projects", "education", "internships", "experience", "certifications", "achievements", "languages"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Resume", resumeSchema);
