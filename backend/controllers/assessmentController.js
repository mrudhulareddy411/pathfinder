const mongoose = require("mongoose");
const AssessmentBank = require("../models/AssessmentBank");
const Question = require("../models/Question");
const AssessmentAttempt = require("../models/AssessmentAttempt");
const SkillScore = require("../models/SkillScore");
const User = require("../models/User");

const defaultCatalog = [
  {
    _id: "asm_programming_1",
    id: "asm_programming_1",
    title: "Programming Core Competency Test",
    description: "Evaluates fundamental programming concepts, syntax, scope, functions, and OOP logic.",
    category: "Programming",
    durationMinutes: 15,
    difficulty: "Medium",
    topics: ["Variables", "Functions", "OOP", "Control Flow"],
  },
  {
    _id: "asm_dsa_1",
    id: "asm_dsa_1",
    title: "Data Structures & Algorithms Evaluation",
    description: "Evaluates knowledge of arrays, linked lists, stacks, trees, graphs, sorting, and Big-O notation.",
    category: "Data Structures",
    durationMinutes: 20,
    difficulty: "Medium",
    topics: ["Arrays", "Trees", "Sorting", "Complexity"],
  },
  {
    _id: "asm_dbms_1",
    id: "asm_dbms_1",
    title: "Database Systems & SQL Assessment",
    description: "Evaluates relational schema design, SQL JOINs, indexing, normalization, and ACID properties.",
    category: "DBMS",
    durationMinutes: 15,
    difficulty: "Easy",
    topics: ["SQL Queries", "JOINs", "Normalization", "Indexes"],
  },
  {
    _id: "asm_webdev_1",
    id: "asm_webdev_1",
    title: "Full Stack Web Development Test",
    description: "Evaluates HTML5, CSS layout, JavaScript ES6+, React state management, and RESTful APIs.",
    category: "Web Development",
    durationMinutes: 20,
    difficulty: "Medium",
    topics: ["React", "JavaScript", "HTML/CSS", "APIs"],
  },
  {
    _id: "asm_ml_1",
    id: "asm_ml_1",
    title: "Machine Learning & Data Science Basics",
    description: "Evaluates supervised learning models, statistics, pandas, scikit-learn, and model metrics.",
    category: "Machine Learning",
    durationMinutes: 20,
    difficulty: "Hard",
    topics: ["Supervised Learning", "Metrics", "Python", "Scikit-Learn"],
  },
  {
    _id: "asm_software_dev_1",
    id: "asm_software_dev_1",
    title: "Software Developer Job Readiness Test",
    description: "Comprehensive assessment covering Programming, DSA, SQL, Web engineering, and Git.",
    category: "Software Developer",
    durationMinutes: 25,
    difficulty: "Medium",
    topics: ["Programming", "DSA", "SQL", "Web Dev", "Git"],
  },
  {
    _id: "asm_dynamic_skills",
    id: "asm_dynamic_skills",
    title: "AI-Powered Skill Based Assessment",
    description: "A dynamic assessment that adapts to your profile and tests a mix of ML, Programming, SQL, and other key skills based on dataset insights.",
    category: "Skill Based",
    durationMinutes: 30,
    difficulty: "Adaptive",
    topics: ["Machine Learning", "Programming", "SQL", "Data Structures", "Dynamic"],
  },
];

const defaultQuestionsMap = {
  Programming: [
    { _id: "q_p1", question: "What is the primary characteristic of Object-Oriented Programming?", options: ["Encapsulation", "Global Variables", "Procedural Execution", "No Functions"], correctAnswer: "Encapsulation" },
    { _id: "q_p2", question: "Which data structure uses LIFO (Last In First Out) ordering?", options: ["Queue", "Stack", "Array", "Linked List"], correctAnswer: "Stack" },
    { _id: "q_p3", question: "What is the time complexity of searching in a balanced Binary Search Tree?", options: ["O(1)", "O(N)", "O(log N)", "O(N^2)"], correctAnswer: "O(log N)" },
  ],
  DBMS: [
    { _id: "q_db1", question: "Which SQL command is used to remove all records from a table without logging individual row deletions?", options: ["DELETE", "TRUNCATE", "DROP", "REMOVE"], correctAnswer: "TRUNCATE" },
    { _id: "q_db2", question: "What does ACID stand for in Database Systems?", options: ["Atomicity, Consistency, Isolation, Durability", "Access, Control, Index, Data", "Array, Class, Instance, Directory", "Automatic, Concurrent, Isolated, Distributed"], correctAnswer: "Atomicity, Consistency, Isolation, Durability" },
  ],
  Default: [
    { _id: "q_gen1", question: "Which data structure uses FIFO (First In First Out) ordering?", options: ["Stack", "Queue", "Tree", "Graph"], correctAnswer: "Queue", difficulty: "Easy" },
    { _id: "q_gen2", question: "What is the average time complexity of Quick Sort?", options: ["O(N log N)", "O(N^2)", "O(N)", "O(1)"], correctAnswer: "O(N log N)", difficulty: "Medium" },
    { _id: "q_gen3", question: "In relational databases, what is a Primary Key?", options: ["A key that allows duplicate values", "A unique identifier for each record in a table", "A foreign key reference", "An index for full text search"], correctAnswer: "A unique identifier for each record in a table", difficulty: "Easy" },
    { _id: "q_gen4", question: "What does the 'volatile' keyword signify in programming?", options: ["Variables that change randomly", "Memory may be modified by concurrent threads", "Variables are stored on disk", "Prevents compilation errors"], correctAnswer: "Memory may be modified by concurrent threads", difficulty: "Hard" },
    { _id: "q_gen5", question: "Which algorithmic paradigm is Dijkstra's algorithm based on?", options: ["Divide and Conquer", "Dynamic Programming", "Greedy Approach", "Backtracking"], correctAnswer: "Greedy Approach", difficulty: "Medium" },
  ],
};

/**
 * GET /api/assessments
 * Returns available skill assessments catalog
 */
const getAssessments = async (req, res) => {
  try {
    let formatted = [];
    
      try {
        const assessments = await AssessmentBank.find().sort({ createdAt: -1 }).lean();
        formatted = assessments.map((a) => ({
          _id: a._id,
          id: a._id,
          title: a.title,
          description: a.description,
          category: a.category,
          durationMinutes: a.durationMinutes || 15,
          difficulty: a.difficulty,
          questionCount: a.questionIds ? a.questionIds.length : 10,
          topics: a.topics || [],
        }));
      } catch (e) {}
    

    if (!formatted || formatted.length === 0) {
      formatted = defaultCatalog;
    }

    return res.status(200).json({ success: true, count: formatted.length, assessments: formatted });
  } catch (error) {
    console.error("Get Assessments Error:", error);
    return res.status(500).json({ success: false, message: "Error fetching assessments.", details: error.message });
  }
};

/**
 * POST /api/assessments (Admin)
 * Creates a new assessment in AssessmentBank
 */
const createAssessment = async (req, res) => {
  try {
    const { title, description, category, durationMinutes, difficulty, topics, questionIds } = req.body;
    if (!title || !category) {
      return res.status(400).json({ success: false, message: "Assessment title and category are required." });
    }

    const payload = {
      title: title.trim(),
      description: description ? description.trim() : "",
      category: category.trim(),
      durationMinutes: Number(durationMinutes) || 15,
      difficulty: difficulty || "Medium",
      topics: Array.isArray(topics) ? topics : [],
      questionIds: Array.isArray(questionIds) ? questionIds : [],
    };

    let newAsm = null;
    
      try {
        newAsm = await AssessmentBank.create(payload);
      } catch (e) {}
    

    return res.status(201).json({ success: true, message: "Assessment created.", assessment: newAsm || { _id: `asm_${Date.now()}`, ...payload } });
  } catch (error) {
    console.error("Create Assessment Error:", error);
    return res.status(500).json({ success: false, message: "Error creating assessment." });
  }
};

/**
 * GET /api/assessments/:id/take
 * Returns test questions WITHOUT correctAnswer field for client security
 */
const getAssessmentForTake = async (req, res) => {
  try {
    const { id } = req.params;
    const { level } = req.query; // e.g. Easy, Medium, Hard
    let questions = [];
    let title = "Skill Assessment";
    let category = "General";

    if (id === "asm_dynamic_skills") {
      title = "AI-Powered Skill Based Assessment";
      category = "Skill Based";
      const allDefaults = [
        ...(defaultQuestionsMap.Programming || []),
        ...(defaultQuestionsMap.DBMS || []),
        ...(defaultQuestionsMap.Default || [])
      ];
      questions = allDefaults.sort(() => 0.5 - Math.random()).slice(0, 10);
    } else {
      try {
        let asm = await AssessmentBank.findById(id).lean();
        if (!asm) {
          asm = await AssessmentBank.findOne({ category: new RegExp(id, "i") }).lean();
        }
        if (asm) {
          title = asm.title;
          category = asm.category;
          
          if (level) {
             const randomQs = await Question.aggregate([
               { $match: { category: category, difficulty: level } },
               { $sample: { size: 10 } }
             ]);
             if (randomQs && randomQs.length > 0) {
               questions = randomQs;
             }
          }
          
          if (questions.length === 0 && asm.questionIds && asm.questionIds.length > 0) {
             questions = await Question.find({ _id: { $in: asm.questionIds } }).lean();
          }
        }
      } catch (e) {}

      if (!questions || questions.length === 0) {
        let qList = defaultQuestionsMap[id] || defaultQuestionsMap[category] || defaultQuestionsMap.Default;
        if (level) {
          const filtered = qList.filter(q => q.difficulty === level);
          if (filtered.length > 0) qList = filtered;
        }
        // Shuffle questions
        questions = qList.sort(() => 0.5 - Math.random()).slice(0, 10);
        title = `${id} Assessment`;
        category = id;
      }
    }

    // Strip correctAnswer for test taker security
    const sanitizedQuestions = questions.map((q) => ({
      _id: q._id,
      questionId: q._id,
      question: q.question,
      options: q.options,
      category: q.category,
      topic: q.topic,
    }));

    return res.status(200).json({
      success: true,
      assessment: {
        id,
        title,
        category,
        questions: sanitizedQuestions,
      },
    });
  } catch (error) {
    console.error("Get Assessment For Take Error:", error);
    return res.status(500).json({ success: false, message: "Error initializing test session." });
  }
};

/**
 * POST /api/assessments/:id/submit
 * Evaluates student test submission against answer keys on the backend
 */
const submitAssessment = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;
    const { id } = req.params;
    const { answers, assessmentTitle } = req.body; // answers = { [questionId]: "selectedOptionText" }

    if (!answers || typeof answers !== "object") {
      return res.status(400).json({ success: false, message: "Answers object required." });
    }

    let questions = [];
    let category = id || "General";

    
      try {
        let asm = await AssessmentBank.findById(id).lean();
        if (!asm) {
          asm = await AssessmentBank.findOne({ category: new RegExp(id, "i") }).lean();
        }
        if (asm) {
          category = asm.category;
          const submittedIds = Object.keys(answers).filter(k => mongoose.Types.ObjectId.isValid(k));
          questions = await Question.find({ _id: { $in: submittedIds } }).lean();
        }
      } catch (e) {}
    

    if (!questions || questions.length === 0) {
      // Fallback search through all maps
      const allDefaults = [
        ...(defaultQuestionsMap[id] || []),
        ...(defaultQuestionsMap[category] || []),
        ...defaultQuestionsMap.Default,
        ...(defaultQuestionsMap.Programming || []),
        ...(defaultQuestionsMap.DBMS || [])
      ];
      const submittedKeys = Object.keys(answers);
      questions = allDefaults.filter(q => submittedKeys.includes(q._id));
    }

    let correctCount = 0;
    const totalQuestions = questions.length;
    const questionResults = [];
    const skillScoresAccumulator = {};

    questions.forEach((q) => {
      const qId = q._id ? q._id.toString() : q.questionId;
      const userSelected = answers[qId] || answers[q.questionId] || "";
      const isCorrect = userSelected.trim().toLowerCase() === String(q.correctAnswer).trim().toLowerCase();

      if (isCorrect) correctCount += 1;

      const skillName = q.category || q.topic || category;
      if (!skillScoresAccumulator[skillName]) {
        skillScoresAccumulator[skillName] = { correct: 0, total: 0 };
      }
      skillScoresAccumulator[skillName].total += 1;
      if (isCorrect) skillScoresAccumulator[skillName].correct += 1;

      questionResults.push({
        questionId: qId,
        userAnswer: userSelected,
        isCorrect,
      });
    });

    const percentage = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

    const skillPercentages = {};
    Object.entries(skillScoresAccumulator).forEach(([sk, stat]) => {
      skillPercentages[sk] = Math.round((stat.correct / stat.total) * 100);
    });

    const attemptData = {
      userId,
      assessmentId: id,
      assessmentTitle: assessmentTitle || `${category} Assessment`,
      category,
      score: correctCount,
      totalQuestions,
      percentage,
      questionResults,
      skillScores: skillPercentages,
      completedAt: new Date(),
    };

    
      try {
        await AssessmentAttempt.create(attemptData);
        let skillDoc = await SkillScore.findOne({ userId });
        if (!skillDoc) {
          skillDoc = new SkillScore({ userId, skills: new Map() });
        }
        Object.entries(skillPercentages).forEach(([sk, pct]) => {
          skillDoc.skills.set(sk, pct);
        });
        await skillDoc.save();
      } catch (e) {}
    

    return res.status(200).json({
      success: true,
      result: {
        score: correctCount,
        totalQuestions,
        percentage,
        skillScores: skillPercentages,
        message: percentage >= 70 ? "Great job! Skill competency benchmark achieved." : "Assessment completed. Focus on recommended learning topics.",
      },
    });
  } catch (error) {
    console.error("Submit Assessment Error:", error);
    return res.status(500).json({ success: false, message: "Error evaluating assessment answers." });
  }
};

module.exports = {
  getAssessments,
  createAssessment,
  getAssessmentForTake,
  submitAssessment,
};
