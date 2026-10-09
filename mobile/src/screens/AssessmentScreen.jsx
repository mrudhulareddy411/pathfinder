import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { theme, globalStyles } from "../theme";
import Header from "../components/Header";
import api from "../services/api";

export default function AssessmentScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = [
    "All", "Skill Based", "Programming", "Data Structures", "Algorithms", "DBMS", "SQL", "JavaScript", "Web Development", "Machine Learning"
  ];

  // Test mode state
  const [activeTest, setActiveTest] = useState(null);
  const [testQuestions, setTestQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [testLoading, setTestLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  const fetchCatalog = async () => {
    try {
      setLoading(true);
      const meRes = await api.get("/auth/me");
      if (meRes.data) setUser(meRes.data);

      const res = await api.get("/assessments");
      if (res.data?.assessments) setAssessments(res.data.assessments);
    } catch (err) {
      console.error("Fetch assessment catalog error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCatalog();
  }, []);

  const startTest = async (asm) => {
    try {
      setTestLoading(true);
      setErrorMsg("");
      setTestResult(null);
      setAnswers({});
      setCurrentIndex(0);

      const testId = asm._id || asm.id || asm.category;
      const res = await api.get(`/assessments/${testId}/take`);
      if (res.data?.assessment) {
        setActiveTest(res.data.assessment);
        setTestQuestions(res.data.assessment.questions || []);
      }
    } catch (err) {
      setErrorMsg("Could not load test questions.");
    } finally {
      setTestLoading(false);
    }
  };

  const selectOption = (qId, optionText) => {
    setAnswers((prev) => ({ ...prev, [qId]: optionText }));
  };

  const submitTest = async () => {
    if (!activeTest) return;
    try {
      setSubmitting(true);
      const testId = activeTest.id || activeTest.category;
      const res = await api.post(`/assessments/${testId}/submit`, {
        answers,
        assessmentTitle: activeTest.title,
      });

      if (res.data?.success) {
        setTestResult(res.data.result);
      }
    } catch (err) {
      setErrorMsg("Error evaluating test.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={globalStyles.container}>
      <Header user={user} navigation={navigation} />

      <ScrollView contentContainerStyle={globalStyles.scrollContent}>
        {/* TEST RESULT SCREEN */}
        {testResult ? (
          <View style={[globalStyles.card, { alignItems: "center", paddingVertical: 40 }]}>
            <Text style={{ fontSize: 50, marginBottom: 12 }}>🎉</Text>
            <View style={globalStyles.badgeGreen}>
              <Text style={globalStyles.badgeGreenText}>Assessment Completed</Text>
            </View>
            <Text style={[globalStyles.cardTitle, { marginTop: 16, textAlign: "center", fontSize: 22 }]}>
              {activeTest?.title || "Assessment Result"}
            </Text>
            <Text style={{ color: theme.colors.textMuted, textAlign: "center", marginBottom: 20 }}>
              Your test has been securely evaluated and saved to your profile.
            </Text>

            <View style={styles.scoreBoxLarge}>
              <Text style={styles.scoreLabelLarge}>YOUR FINAL SCORE</Text>
              <Text style={styles.scoreValLarge}>{testResult.percentage}%</Text>
              <Text style={styles.scoreSubLarge}>
                {testResult.score} out of {testResult.totalQuestions} Correct
              </Text>
            </View>

            {testResult.skillScores && Object.keys(testResult.skillScores).length > 0 && (
              <View style={{ width: "100%", marginTop: 24, marginBottom: 10 }}>
                <Text style={{ fontSize: 16, fontWeight: "800", color: theme.colors.textMain, marginBottom: 16 }}>
                  Skill Breakdown
                </Text>
                {Object.entries(testResult.skillScores).map(([sk, pct]) => (
                  <View key={sk} style={styles.skillBarCard}>
                    <View style={styles.skillBarHeader}>
                      <Text style={styles.skillBarTitle}>{sk}</Text>
                      <View style={globalStyles.badgeBlue}>
                        <Text style={globalStyles.badgeBlueText}>{pct}%</Text>
                      </View>
                    </View>
                    <View style={styles.progressBarTrack}>
                      <View style={[styles.progressBarFill, { width: `${pct}%` }]} />
                    </View>
                  </View>
                ))}
              </View>
            )}

            <View style={{ flexDirection: "row", gap: 10, marginTop: 20 }}>
              <TouchableOpacity
                style={globalStyles.btnOutline}
                onPress={() => {
                  setTestResult(null);
                  setActiveTest(null);
                }}
              >
                <Text style={globalStyles.btnOutlineText}>Take Another</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={globalStyles.btnPrimary}
                onPress={() => navigation.navigate("AcademicTracker")}
              >
                <Text style={globalStyles.btnPrimaryText}>Tracker ➔</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : activeTest ? (
          /* ACTIVE TEST TAKING VIEW */
          <View style={globalStyles.card}>
            <View style={styles.testHeaderRow}>
              <Text style={styles.testCategory}>{activeTest.category}</Text>
              <TouchableOpacity onPress={() => setActiveTest(null)}>
                <Text style={styles.exitText}>✕ Exit</Text>
              </TouchableOpacity>
            </View>
            <Text style={globalStyles.cardTitle}>{activeTest.title}</Text>

            {testQuestions.length > 0 ? (
              <View style={{ marginTop: 12 }}>
                {/* QUESTION COUNTER & PROGRESS */}
                <View style={styles.progressHeader}>
                  <Text style={styles.progressCount}>
                    Question {currentIndex + 1} of {testQuestions.length}
                  </Text>
                  <Text style={styles.progressPct}>
                    {Math.round(((currentIndex + 1) / testQuestions.length) * 100)}%
                  </Text>
                </View>

                <View style={styles.progressBarTrack}>
                  <View
                    style={[
                      styles.progressBarFill,
                      {
                        width: `${((currentIndex + 1) / testQuestions.length) * 100}%`,
                      },
                    ]}
                  />
                </View>

                {/* QUESTION CARD */}
                {(() => {
                  const q = testQuestions[currentIndex];
                  const qId = q._id || q.questionId || currentIndex;
                  const selectedOpt = answers[qId] || "";

                  return (
                    <View style={styles.qBox}>
                      <Text style={styles.qText}>
                        {currentIndex + 1}. {q.question}
                      </Text>

                      <View style={{ gap: 8 }}>
                        {q.options?.map((opt, idx) => {
                          const isSelected = selectedOpt === opt;
                          return (
                            <TouchableOpacity
                              key={idx}
                              style={[
                                styles.optionCard,
                                isSelected && styles.optionCardSelected,
                              ]}
                              onPress={() => selectOption(qId, opt)}
                              activeOpacity={0.7}
                            >
                              <View
                                style={[
                                  styles.optionBadge,
                                  isSelected && styles.optionBadgeSelected,
                                ]}
                              >
                                <Text
                                  style={[
                                    styles.optionLetter,
                                    isSelected && styles.optionLetterSelected,
                                  ]}
                                >
                                  {String.fromCharCode(65 + idx)}
                                </Text>
                              </View>
                              <Text
                                style={[
                                  styles.optionText,
                                  isSelected && styles.optionTextSelected,
                                ]}
                              >
                                {opt}
                              </Text>
                            </TouchableOpacity>
                          );
                        })}
                      </View>
                    </View>
                  );
                })()}

                {/* NAVIGATION BUTTONS */}
                <View style={styles.navBtnRow}>
                  <TouchableOpacity
                    style={[
                      globalStyles.btnOutline,
                      currentIndex === 0 && { opacity: 0.5 },
                    ]}
                    disabled={currentIndex === 0}
                    onPress={() => setCurrentIndex((prev) => prev - 1)}
                  >
                    <Text style={globalStyles.btnOutlineText}>← Prev</Text>
                  </TouchableOpacity>

                  {currentIndex < testQuestions.length - 1 ? (
                    <TouchableOpacity
                      style={globalStyles.btnPrimary}
                      onPress={() => setCurrentIndex((prev) => prev + 1)}
                    >
                      <Text style={globalStyles.btnPrimaryText}>Next →</Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      style={[
                        globalStyles.btnPrimary,
                        { backgroundColor: theme.colors.success },
                      ]}
                      onPress={submitTest}
                      disabled={submitting}
                    >
                      {submitting ? (
                        <ActivityIndicator color="#FFFFFF" />
                      ) : (
                        <Text style={globalStyles.btnPrimaryText}>✓ Submit</Text>
                      )}
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            ) : (
              <ActivityIndicator color={theme.colors.primary} style={{ marginVertical: 30 }} />
            )}
          </View>
        ) : (
          /* CATALOG VIEW */
          <View>
            <View style={styles.catalogBanner}>
              <View style={[globalStyles.badgeBlue, { alignSelf: "center", backgroundColor: "rgba(255,255,255,0.2)" }]}>
                <Text style={[globalStyles.badgeBlueText, { color: "#FFFFFF" }]}>⚡ Technical & Career Assessments</Text>
              </View>
              <Text style={styles.bannerTitle}>Skill Evaluation Center</Text>
              <Text style={styles.bannerSub}>
                Discover your strengths and identify growth areas. Take domain-specific assessments powered by our advanced intelligence engine.
              </Text>
            </View>

            <View style={{ marginBottom: 16 }}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 10 }}>
                {categories.map((cat) => {
                  const isSelected = selectedCategory === cat;
                  return (
                    <TouchableOpacity
                      key={cat}
                      onPress={() => setSelectedCategory(cat)}
                      style={[
                        styles.catPill,
                        isSelected ? styles.catPillSelected : null
                      ]}
                    >
                      <Text style={[
                        styles.catPillText,
                        isSelected ? styles.catPillTextSelected : null
                      ]}>
                        {cat}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>

            {loading ? (
              <ActivityIndicator color={theme.colors.primary} style={{ marginVertical: 30 }} />
            ) : (
              assessments
                .filter(asm => selectedCategory === "All" || asm.category === selectedCategory)
                .map((asm) => (
                <View key={asm._id || asm.id} style={globalStyles.card}>
                  <View style={styles.catHeader}>
                    <View style={globalStyles.badgeBlue}>
                      <Text style={globalStyles.badgeBlueText}>{asm.category}</Text>
                    </View>
                    <Text style={styles.durationText}>{asm.durationMinutes || 15} mins</Text>
                  </View>
                  <Text style={globalStyles.cardTitle}>{asm.title}</Text>
                  <Text style={globalStyles.cardSubtitle}>{asm.description}</Text>

                  <TouchableOpacity
                    style={globalStyles.btnPrimary}
                    onPress={() => startTest(asm)}
                  >
                    <Text style={globalStyles.btnPrimaryText}>⚡ Start Assessment</Text>
                  </TouchableOpacity>
                </View>
              ))
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  testHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  testCategory: {
    fontSize: 12,
    fontWeight: "700",
    color: theme.colors.primary,
  },
  exitText: {
    fontSize: 13,
    fontWeight: "700",
    color: theme.colors.danger,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  progressCount: {
    fontSize: 12,
    fontWeight: "600",
    color: theme.colors.textDark,
  },
  progressPct: {
    fontSize: 12,
    fontWeight: "700",
    color: theme.colors.primary,
  },
  progressBarTrack: {
    height: 6,
    backgroundColor: "#E2E8F0",
    borderRadius: 3,
    overflow: "hidden",
    marginBottom: 16,
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: theme.colors.primary,
    borderRadius: 3,
  },
  qBox: {
    backgroundColor: theme.colors.bg,
    borderRadius: 10,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  qText: {
    fontSize: 15,
    fontWeight: "700",
    color: theme.colors.textMain,
    marginBottom: 14,
  },
  optionCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
    minHeight: 48,
  },
  optionCardSelected: {
    backgroundColor: theme.colors.primaryLight,
    borderColor: theme.colors.primary,
  },
  optionBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  optionBadgeSelected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  optionLetter: {
    fontSize: 12,
    fontWeight: "700",
    color: theme.colors.textMuted,
  },
  optionLetterSelected: {
    color: "#FFFFFF",
  },
  optionText: {
    fontSize: 13,
    color: theme.colors.textDark,
    flex: 1,
  },
  optionTextSelected: {
    fontWeight: "700",
    color: theme.colors.primaryDark,
  },
  navBtnRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  catHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  durationText: {
    fontSize: 12,
    color: theme.colors.textMuted,
  },
  scoreBox: {
    backgroundColor: theme.colors.bg,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginVertical: 14,
    width: "100%",
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  scoreLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: theme.colors.textMuted,
  },
  scoreVal: {
    fontSize: 36,
    fontWeight: "800",
    color: theme.colors.primary,
    marginVertical: 2,
  },
  scoreSub: {
    fontSize: 13,
    fontWeight: "600",
    color: theme.colors.textDark,
  },
  catalogBanner: {
    backgroundColor: theme.colors.primary,
    padding: 24,
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 20,
    alignItems: "center",
  },
  bannerTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#FFFFFF",
    marginTop: 12,
    marginBottom: 8,
  },
  bannerSub: {
    fontSize: 14,
    color: "rgba(255,255,255,0.9)",
    textAlign: "center",
    lineHeight: 20,
  },
  catPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: "#FFFFFF",
  },
  catPillSelected: {
    backgroundColor: theme.colors.primaryLight,
    borderColor: theme.colors.primary,
  },
  catPillText: {
    fontSize: 13,
    fontWeight: "600",
    color: theme.colors.textMuted,
  },
  catPillTextSelected: {
    color: theme.colors.primaryDark,
  },
  scoreBoxLarge: {
    backgroundColor: theme.colors.primaryLight,
    borderColor: theme.colors.primary,
    borderWidth: 2,
    borderRadius: 16,
    padding: 30,
    alignItems: "center",
    width: "100%",
  },
  scoreLabelLarge: {
    fontSize: 12,
    fontWeight: "800",
    color: theme.colors.primary,
    letterSpacing: 1,
  },
  scoreValLarge: {
    fontSize: 60,
    fontWeight: "800",
    color: theme.colors.primaryDark,
    marginVertical: 4,
  },
  scoreSubLarge: {
    fontSize: 16,
    fontWeight: "700",
    color: theme.colors.textMain,
  },
  skillBarCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  skillBarHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  skillBarTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: theme.colors.textMain,
  }
});
