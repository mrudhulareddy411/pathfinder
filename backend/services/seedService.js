const mongoose = require("mongoose");
const Career = require("../models/Career");
const Resource = require("../models/Resource");
const Question = require("../models/Question");
const AssessmentBank = require("../models/AssessmentBank");

const verifiedCareers = require("../data/verifiedCareerData.json");
const verifiedResources = require("../data/verifiedResourcesData.json");

const initialQuestions = [
  // Programming & DSA
  {
    question: "Which data structure follows the LIFO (Last In First Out) principle?",
    options: ["Queue", "Stack", "Linked List", "Binary Tree"],
    correctAnswer: "Stack",
    category: "Data Structures",
    topic: "Stack",
    difficulty: "Easy",
    skills: ["DSA", "Problem Solving"],
    careerPaths: ["Software Developer", "Backend Developer"],
  },
  {
    question: "What is the worst-case time complexity of Quick Sort?",
    options: ["O(n log n)", "O(n)", "O(n²)", "O(1)"],
    correctAnswer: "O(n²)",
    category: "Algorithms",
    topic: "Sorting Algorithms",
    difficulty: "Medium",
    skills: ["DSA", "Algorithms"],
    careerPaths: ["Software Developer", "Backend Developer"],
  },
  {
    question: "Which of the following is NOT an object-oriented programming concept?",
    options: ["Encapsulation", "Inheritance", "Compilation", "Polymorphism"],
    correctAnswer: "Compilation",
    category: "Programming",
    topic: "OOP",
    difficulty: "Easy",
    skills: ["Programming", "Software Engineering"],
    careerPaths: ["Software Developer", "Full Stack Developer"],
  },

  // DBMS & SQL
  {
    question: "Which SQL command is used to modify existing data in a database table?",
    options: ["INSERT", "UPDATE", "ALTER", "MODIFY"],
    correctAnswer: "UPDATE",
    category: "DBMS",
    topic: "SQL Commands",
    difficulty: "Easy",
    skills: ["SQL", "DBMS"],
    careerPaths: ["Backend Developer", "Data Analyst", "Software Developer"],
  },
  {
    question: "What does the ACID property 'I' stand for in database management?",
    options: ["Integrity", "Isolation", "Indexing", "Inheritance"],
    correctAnswer: "Isolation",
    category: "DBMS",
    topic: "ACID Properties",
    difficulty: "Medium",
    skills: ["SQL", "DBMS"],
    careerPaths: ["Backend Developer", "Database Administrator"],
  },

  // Python & Data Science / ML
  {
    question: "In Python, which built-in data type is immutable?",
    options: ["List", "Dictionary", "Tuple", "Set"],
    correctAnswer: "Tuple",
    category: "Python",
    topic: "Data Types",
    difficulty: "Easy",
    skills: ["Python", "Programming"],
    careerPaths: ["Data Scientist", "ML Engineer", "Software Developer"],
  },
  {
    question: "Which machine learning algorithm is supervised and commonly used for classification?",
    options: ["K-Means Clustering", "Random Forest", "PCA", "DBSCAN"],
    correctAnswer: "Random Forest",
    category: "Machine Learning",
    topic: "Classification",
    difficulty: "Medium",
    skills: ["Machine Learning", "Data Science"],
    careerPaths: ["ML Engineer", "Data Scientist"],
  },

  // Web Dev & JavaScript
  {
    question: "What keyword is used to declare a block-scoped variable in modern JavaScript?",
    options: ["var", "let", "define", "global"],
    correctAnswer: "let",
    category: "JavaScript",
    topic: "ES6 Variables",
    difficulty: "Easy",
    skills: ["JavaScript", "Web Development"],
    careerPaths: ["Frontend Developer", "Full Stack Developer"],
  },
  {
    question: "In React, what hook is used to manage component state?",
    options: ["useEffect", "useState", "useContext", "useReducer"],
    correctAnswer: "useState",
    category: "Web Development",
    topic: "React Hooks",
    difficulty: "Easy",
    skills: ["JavaScript", "React", "Web Development"],
    careerPaths: ["Frontend Developer", "Full Stack Developer"],
  },

  // OS & Networking
  {
    question: "Which OSI layer is responsible for routing packets across network boundaries?",
    options: ["Data Link Layer", "Network Layer", "Transport Layer", "Application Layer"],
    correctAnswer: "Network Layer",
    category: "Computer Networks",
    topic: "OSI Model",
    difficulty: "Medium",
    skills: ["Networking", "Operating Systems"],
    careerPaths: ["Cybersecurity", "DevOps", "Cloud"],
  },
  {
    question: "What condition occurs when two processes are permanently blocked waiting on resources held by each other?",
    options: ["Starvation", "Deadlock", "Paging", "Race Condition"],
    correctAnswer: "Deadlock",
    category: "Operating Systems",
    topic: "Process Synchronization",
    difficulty: "Medium",
    skills: ["Operating Systems", "Problem Solving"],
    careerPaths: ["Software Developer", "DevOps"],
  },
];

const seedVerifiedData = async () => {
  if (mongoose.connection.readyState !== 1) {
    console.log("ℹ️ Mongo connection offline: Skipping Mongoose seeding.");
    return;
  }

  try {
    const careerCount = await Career.countDocuments();
    if (careerCount === 0) {
      await Career.insertMany(verifiedCareers);
      console.log("✅ Seeded verified Career dataset successfully.");
    }

    const resourceCount = await Resource.countDocuments();
    if (resourceCount < verifiedResources.length) {
      await Resource.deleteMany({});
      await Resource.insertMany(verifiedResources);
      console.log(`✅ Seeded ${verifiedResources.length} verified Resource records.`);
    }

    // Seed Question Bank
    const qCount = await Question.countDocuments();
    if (qCount === 0) {
      const insertedQuestions = await Question.insertMany(initialQuestions);
      console.log(`✅ Seeded ${insertedQuestions.length} initial Questions into Question Bank.`);

      // Seed Initial Pre-built Assessment Bank items
      const qIds = insertedQuestions.map((q) => q._id);

      const dsaIds = insertedQuestions
        .filter((q) => q.category === "Data Structures" || q.category === "Algorithms")
        .map((q) => q._id);

      const webIds = insertedQuestions
        .filter((q) => q.category === "JavaScript" || q.category === "Web Development")
        .map((q) => q._id);

      const dbIds = insertedQuestions
        .filter((q) => q.category === "DBMS")
        .map((q) => q._id);

      const initialAssessments = [
        {
          title: "Full Stack Software Engineering Assessment",
          description: "Comprehensive assessment covering Programming, DSA, SQL, and Web Development fundamentals.",
          category: "Software Developer",
          durationMinutes: 20,
          difficulty: "Medium",
          topics: ["DSA", "SQL", "OOP", "JavaScript"],
          skillsCovered: ["Programming", "DSA", "SQL", "JavaScript"],
          careerPaths: ["Software Developer", "Full Stack Developer"],
          questionIds: qIds,
        },
        {
          title: "Data Structures & Algorithms Core Test",
          description: "Technical evaluation of Stack, Queue, Sorting algorithms, and Problem Solving.",
          category: "Data Structures",
          durationMinutes: 15,
          difficulty: "Medium",
          topics: ["Stack", "Sorting Algorithms"],
          skillsCovered: ["DSA", "Algorithms", "Problem Solving"],
          careerPaths: ["Software Developer", "Backend Developer"],
          questionIds: dsaIds.length > 0 ? dsaIds : qIds.slice(0, 3),
        },
        {
          title: "Database Management & SQL Fundamentals",
          description: "Assessment on relational queries, ACID properties, UPDATE statements, and indexing.",
          category: "DBMS",
          durationMinutes: 15,
          difficulty: "Easy",
          topics: ["SQL Commands", "ACID Properties"],
          skillsCovered: ["SQL", "DBMS"],
          careerPaths: ["Backend Developer", "Data Analyst"],
          questionIds: dbIds.length > 0 ? dbIds : qIds.slice(3, 5),
        },
        {
          title: "Modern Web Development & React Assessment",
          description: "Evaluate your frontend & fullstack skills in ES6 JavaScript, React hooks, and REST APIs.",
          category: "Web Development",
          durationMinutes: 15,
          difficulty: "Medium",
          topics: ["ES6 Variables", "React Hooks"],
          skillsCovered: ["JavaScript", "React", "Web Development"],
          careerPaths: ["Frontend Developer", "Full Stack Developer"],
          questionIds: webIds.length > 0 ? webIds : qIds.slice(7, 9),
        },
      ];

      await AssessmentBank.insertMany(initialAssessments);
      console.log(`✅ Seeded ${initialAssessments.length} initial Assessments in Assessment Bank.`);
    }
  } catch (error) {
    console.error("⚠️ Error seeding verified data:", error.message);
  }
};

module.exports = seedVerifiedData;
