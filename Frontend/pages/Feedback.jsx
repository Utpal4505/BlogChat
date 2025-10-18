// FeedbackForm.jsx - FIXED VERSION
import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useContext,
} from "react";
import toast, { Toaster } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  UserCircle,
  NotebookPen,
  CompassIcon,
  Settings,
  CheckCircle2,
  Loader2,
  ChevronDown,
  AlertCircle,
  Check,
  UploadCloud,
  X,
  Image as ImageIcon,
  MessageSquare,
  Sparkles,
  ThumbsUp,
  Lightbulb,
  Bug,
  Target,
  MapPin,
  Smile,
  MessageCircle,
  Zap,
  Heart,
} from "lucide-react";
import { FaComment } from "react-icons/fa";
import { MdQuestionMark, MdDashboard } from "react-icons/md";
import { UAParser } from "ua-parser-js";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { AuthContext } from "../context/AuthContext";
import { uploadFilesToServer } from "../utils/UploadFileToServer";

const MOOD_OPTIONS = [
  { emoji: "☀️", label: "Amazing", value: "amazing" },
  { emoji: "🙂", label: "Good", value: "good" },
  { emoji: "😐", label: "Okay", value: "okay" },
  { emoji: "😕", label: "Frustrating", value: "frustrating" },
  { emoji: "😡", label: "Bad", value: "bad" },
];

const PAGE_OPTIONS = [
  { value: "dashboard", label: "Dashboard", icon: MdDashboard },
  { value: "profile", label: "Profile", icon: UserCircle },
  { value: "onboarding", label: "Onboarding", icon: Sparkles },
  { value: "editor", label: "Content Editor", icon: NotebookPen },
  { value: "comments", label: "Comments", icon: FaComment },
  { value: "explore", label: "Explore", icon: CompassIcon },
  { value: "settings", label: "Settings", icon: Settings },
  { value: "other", label: "Other", icon: MdQuestionMark },
];

// NPS Scale with emojis (1-10)
const NPS_SCALE = [
  { value: 1, emoji: "😤", label: "Not at all" },
  { value: 2, emoji: "😠", label: "Very unlikely" },
  { value: 3, emoji: "😟", label: "Unlikely" },
  { value: 4, emoji: "😕", label: "Somewhat unlikely" },
  { value: 5, emoji: "😐", label: "Neutral" },
  { value: 6, emoji: "🙂", label: "Somewhat likely" },
  { value: 7, emoji: "😊", label: "Likely" },
  { value: 8, emoji: "😃", label: "Very likely" },
  { value: 9, emoji: "😄", label: "Extremely likely" },
  { value: 10, emoji: "🤩", label: "Absolutely!" },
];

function CustomDropdown({ options, value, onChange, placeholder }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div className="relative" ref={dropdownRef}>
      <motion.button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        whileTap={{ scale: 0.98 }}
        className="w-full flex items-center justify-between gap-3 rounded-xl border border-bordercolor dark:border-dbordercolor bg-bg dark:bg-dbg text-text dark:text-dText px-4 py-3 text-sm outline-none hover:border-primary/50 dark:hover:border-dPrimary/50 focus:ring-2 focus:ring-primary/20 dark:focus:ring-dPrimary/20 transition-all"
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {selectedOption ? (
            <>
              {selectedOption.icon &&
                (typeof selectedOption.icon === "string" ? (
                  <span className="flex-shrink-0">{selectedOption.icon}</span>
                ) : (
                  <selectedOption.icon
                    size={18}
                    className="text-primary dark:text-dPrimary flex-shrink-0"
                  />
                ))}
              <span className="truncate">{selectedOption.label}</span>
            </>
          ) : (
            <span className="text-muted-text dark:text-dMuted-text">
              {placeholder}
            </span>
          )}
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown
            size={18}
            className="text-muted-text dark:text-dMuted-text flex-shrink-0"
          />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute w-full mt-2 rounded-xl border border-bordercolor dark:border-dbordercolor bg-card dark:bg-dcard shadow-2xl overflow-hidden z-[100]"
          >
            <div className="max-h-64 overflow-y-auto py-2">
              {options.map((opt, index) => {
                const isSelected = value === opt.value;
                const OptionIcon = opt.icon;

                return (
                  <motion.button
                    key={opt.value}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.03, duration: 0.2 }}
                    type="button"
                    onClick={() => {
                      onChange(opt.value);
                      setIsOpen(false);
                    }}
                    whileHover={{ x: 4 }}
                    className={[
                      "w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors text-left",
                      isSelected
                        ? "bg-primary/10 dark:bg-dPrimary/10 text-primary dark:text-dPrimary font-medium"
                        : "text-text dark:text-dText hover:bg-primary/5 dark:hover:bg-dPrimary/5",
                    ].join(" ")}
                  >
                    {typeof OptionIcon === "string" ? (
                      <span>{OptionIcon}</span>
                    ) : OptionIcon ? (
                      <OptionIcon
                        size={18}
                        className={
                          isSelected
                            ? "text-primary dark:text-dPrimary"
                            : "text-muted-text dark:text-dMuted-text"
                        }
                      />
                    ) : null}
                    <span className="flex-1 text-left truncate">
                      {opt.label}
                    </span>
                    <AnimatePresence>
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                        >
                          <Check
                            size={16}
                            className="text-primary dark:text-dPrimary flex-shrink-0"
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FeedbackForm() {
  // Question 1: Overall experience mood
  const [experienceMood, setExperienceMood] = useState("");

  // Question 2: What you liked
  const [liked, setLiked] = useState("");

  // Question 3: What annoyed/confused (MERGED WITH LOCATION)
  const [issues, setIssues] = useState("");
  const [pageContext, setPageContext] = useState("");
  const [customPage, setCustomPage] = useState("");

  // Question 4: One thing to improve
  const [improvement, setImprovement] = useState("");

  // Question 5: Bug noticed
  const [hasBug, setHasBug] = useState(null);
  const [bugDescription, setBugDescription] = useState("");
  const [bugScreenshots, setBugScreenshots] = useState([]);
  const [dragActive, setDragActive] = useState(false);

  // Question 6: NPS Score
  const [npsScore, setNpsScore] = useState(null);

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const fileInputRef = useRef(null);

  const parser = new UAParser();
  const User_Device = parser.getResult();

  const { executeRecaptcha } = useGoogleReCaptcha();
  const { create_Feedback } = useContext(AuthContext);

  const metadata = {
    browser: User_Device.browser.name || "Unknown",
    browser_version: User_Device.browser.version || "Unknown",
    os: User_Device.os.name || "Unknown",
    os_version: User_Device.os.version || "Unknown",
    device_type: User_Device.device.type || "desktop",
    user_agent: User_Device.ua || "Unknown",
    url: window.location.href,
    viewport: `${window.innerWidth}x${window.innerHeight}`,
    timestamp: new Date().toISOString(),
  };

  const resetForm = useCallback(() => {
    setExperienceMood("");
    setLiked("");
    setIssues("");
    setPageContext("");
    setCustomPage("");
    setImprovement("");
    setHasBug(null);
    setBugDescription("");
    setBugScreenshots([]);
    setNpsScore(null);
    setSubmitted(false);
  }, []);

  // File handling
  function addMockFiles(list) {
    if (!list) return;
    const next = Array.from(list).map((f) => {
      const isImage = f.type.startsWith("image/");
      const validType = isImage;
      const validSize = f.size <= 10 * 1024 * 1024;
      return {
        file: f,
        name: f.name,
        sizeMB: (f.size / 1024 / 1024).toFixed(2),
        type: "image",
        error: !validType
          ? "Only images allowed"
          : !validSize
          ? "File must be under 10MB"
          : undefined,
      };
    });
    setBugScreenshots((prev) => [...prev, ...next]);
  }

  function removeFile(idx) {
    setBugScreenshots((prev) => prev.filter((_, i) => i !== idx));
  }

  function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    addMockFiles(e.dataTransfer.files);
  }

  async function validateAndSubmit(e) {
    e.preventDefault();

    if (!executeRecaptcha) return toast.error("Recaptcha not ready");

    const token = await executeRecaptcha("submit_feedback");

    // Required field validations
    if (!experienceMood)
      return toast.error("Please tell us about your experience today");
    if (!issues.trim())
      return toast.error("Please share what annoyed, confused, or didn't work");
    if (issues.trim().length < 10)
      return toast.error(
        "Please provide more details (at least 10 characters)"
      );
    if (!pageContext) return toast.error("Please tell us where this happened");
    if (pageContext === "other" && !customPage.trim())
      return toast.error("Please specify which page");
    if (!improvement.trim())
      return toast.error("Please share one thing you'd like us to improve");
    if (improvement.trim().length < 5)
      return toast.error("Please be more specific about the improvement");
    if (hasBug === true && !bugDescription.trim())
      return toast.error("Please describe the bug you noticed");
    if (npsScore === null)
      return toast.error("Please rate how likely you'd recommend us");

    setSubmitting(true);

    try {
      const uploadedUrls =
        hasBug && bugScreenshots.length > 0
          ? await uploadFilesToServer(bugScreenshots)
          : [];

      console.log(uploadedUrls.length > 0 ? uploadedUrls : null);

      const feedbackPayload = {
        experience_mood: experienceMood,
        liked: liked || null,
        issues: issues,
        page_context: pageContext === "other" ? customPage : pageContext,
        improvement_suggestion: improvement,
        has_bug: hasBug,
        bug_description: hasBug ? bugDescription : null,
        bug_screenshots: uploadedUrls.length > 0 ? uploadedUrls : null,
        nps_score: npsScore,
        metadata: metadata,
      };

      const data = await create_Feedback({
        feedbackPayload: feedbackPayload,
        recaptchaToken: token,
      });

      if (data) {
        toast.success("🎉 Thank you for your feedback!");
        setSubmitted(true);
        setTimeout(() => {
          resetForm();
        }, 4500);
      }
    } catch (error) {
      console.error("Feedback submission error:", error.message);
      toast.error("Failed to submit feedback. Please try again later.");
    } finally {
      setSubmitting(false);
    }
  }

  // Get NPS category
  const getNPSCategory = (score) => {
    if (score >= 9)
      return { label: "Promoter", color: "text-green-600 dark:text-green-500" };
    if (score >= 6)
      return {
        label: "Passive",
        color: "text-yellow-600 dark:text-yellow-500",
      };
    return { label: "Detractor", color: "text-red-600 dark:text-red-500" };
  };

  return (
    <div className="min-h-screen bg-bg dark:bg-dbg transition-colors duration-200">
      <div className="mx-auto max-w-4xl px-4 py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10 text-center"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 dark:from-dPrimary/20 dark:to-daccent/20 mb-4"
          >
            <MessageSquare
              className="text-primary dark:text-dPrimary"
              size={32}
            />
          </motion.div>
          <h1 className="text-3xl font-bold text-text dark:text-dText mb-2">
            Share Your Feedback
          </h1>
          <p className="text-muted-text dark:text-dMuted-text max-w-xl mx-auto">
            Your voice matters! Help us build a better experience by sharing
            your thoughts. This will only take ~2 minutes.
          </p>
        </motion.div>

        {submitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-br from-primary/10 to-accent/10 dark:from-dPrimary/10 dark:to-daccent/10 rounded-2xl border-2 border-primary/30 dark:border-dPrimary/30 p-12 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/20 dark:bg-dPrimary/20 flex items-center justify-center"
            >
              <CheckCircle2
                size={48}
                className="text-primary dark:text-dPrimary"
              />
            </motion.div>
            <h2 className="text-2xl font-bold text-text dark:text-dText mb-3">
              Thank You! 🎉
            </h2>
            <p className="text-muted-text dark:text-dMuted-text">
              Your feedback has been received and will help us improve your
              experience.
            </p>
          </motion.div>
        ) : (
          <form onSubmit={validateAndSubmit} className="space-y-6">
            {/* Question 1: Overall Experience */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="bg-card dark:bg-dcard rounded-2xl border border-bordercolor dark:border-dbordercolor p-6 shadow-sm backdrop-blur-sm"
            >
              <div className="mb-4 flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 dark:from-dPrimary/20 dark:to-daccent/20 flex items-center justify-center">
                  <Smile
                    size={20}
                    className="text-primary dark:text-dPrimary"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-semibold text-text dark:text-dText mb-1">
                    How's your experience with BlogChat today?{" "}
                    <span className="text-danger">*</span>
                  </label>
                  <p className="text-xs text-muted-text dark:text-dMuted-text">
                    Choose the emoji that best describes your feeling
                  </p>
                </div>
              </div>

              <div className="flex gap-2 flex-wrap">
                {MOOD_OPTIONS.map((mood) => {
                  const selected = experienceMood === mood.value;
                  return (
                    <motion.button
                      key={mood.value}
                      type="button"
                      onClick={() => setExperienceMood(mood.value)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={[
                        "group relative flex flex-col flex-1 items-center gap-2 rounded-xl border-2 p-3 transition-all",
                        selected
                          ? "border-primary dark:border-dPrimary bg-primary/10 dark:bg-dPrimary/10 shadow-md"
                          : "border-bordercolor dark:border-dbordercolor hover:border-primary/50 dark:hover:border-dPrimary/50 hover:bg-primary/5 dark:hover:bg-dPrimary/5",
                      ].join(" ")}
                    >
                      <span className="text-3xl">{mood.emoji}</span>
                      <span
                        className={[
                          "text-xs font-medium text-center whitespace-nowrap",
                          selected
                            ? "text-primary dark:text-dPrimary"
                            : "text-muted-text dark:text-dMuted-text",
                        ].join(" ")}
                      >
                        {mood.label}
                      </span>
                      <AnimatePresence>
                        {selected && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary dark:bg-dPrimary flex items-center justify-center shadow-lg"
                          >
                            <Check size={14} className="text-white" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>

            {/* Question 2: What you liked */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="bg-card dark:bg-dcard rounded-2xl border border-bordercolor dark:border-dbordercolor p-6 shadow-sm backdrop-blur-sm"
            >
              <div className="mb-4 flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 dark:from-green-400/20 dark:to-emerald-400/20 flex items-center justify-center">
                  <ThumbsUp
                    size={20}
                    className="text-green-600 dark:text-green-500"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-semibold text-text dark:text-dText mb-1">
                    What's one thing you genuinely liked or found helpful?
                  </label>
                  <p className="text-xs text-muted-text dark:text-dMuted-text">
                    Optional — but we'd love to know what's working well! 💚
                  </p>
                </div>
              </div>

              <input
                type="text"
                className="w-full rounded-xl border border-bordercolor dark:border-dbordercolor bg-bg dark:bg-dbg text-text dark:text-dText px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/50 dark:focus:ring-dPrimary/50 transition-all placeholder:text-muted-text dark:placeholder:text-dMuted-text"
                placeholder="Example: The editor is super smooth and easy to use"
                value={liked}
                onChange={(e) => setLiked(e.target.value)}
                maxLength={200}
              />
            </motion.div>

            {/* Question 3: Issues + Location (MERGED) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="bg-card dark:bg-dcard rounded-2xl border border-bordercolor dark:border-dbordercolor p-6 shadow-sm backdrop-blur-sm relative"
              style={{ zIndex: 1 }}
            >
              <div className="mb-4 flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500/20 to-red-500/20 dark:from-orange-400/20 dark:to-red-400/20 flex items-center justify-center">
                  <AlertCircle
                    size={20}
                    className="text-orange-600 dark:text-orange-500"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-semibold text-text dark:text-dText mb-1">
                    Anything that annoyed, confused, or didn't work as expected?{" "}
                    <span className="text-danger">*</span>
                  </label>
                  <p className="text-xs text-muted-text dark:text-dMuted-text">
                    Be honest — this helps us improve!
                  </p>
                </div>
              </div>

              <textarea
                rows={5}
                className="w-full resize-none rounded-xl border border-bordercolor dark:border-dbordercolor bg-bg dark:bg-dbg text-text dark:text-dText px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/50 dark:focus:ring-dPrimary/50 transition-all placeholder:text-muted-text dark:placeholder:text-dMuted-text leading-relaxed"
                placeholder="Example: The 'Publish' button didn't work / page loaded slow / UI felt confusing…"
                value={issues}
                onChange={(e) => setIssues(e.target.value)}
              />
              <div className="mt-2 flex items-center justify-between">
                <p className="text-xs text-muted-text dark:text-dMuted-text">
                  Minimum 10 characters
                </p>
                <AnimatePresence mode="wait">
                  <motion.p
                    key={issues.trim().length >= 10 ? "valid" : "invalid"}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                    className={[
                      "text-xs font-medium",
                      issues.trim().length >= 10
                        ? "text-green-600 dark:text-green-500"
                        : "text-muted-text dark:text-dMuted-text",
                    ].join(" ")}
                  >
                    {issues.length} characters
                  </motion.p>
                </AnimatePresence>
              </div>

              {/* INLINE FOLLOW-UP: Where did this happen? */}
              <AnimatePresence>
                {issues.trim().length >= 10 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, marginTop: 0 }}
                    animate={{ opacity: 1, height: "auto", marginTop: 16 }}
                    exit={{ opacity: 0, height: 0, marginTop: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="pt-4 border-t border-bordercolor dark:border-dbordercolor">
                      <div className="flex items-start gap-2 mb-3">
                        <MapPin
                          size={16}
                          className="text-primary dark:text-dPrimary flex-shrink-0 mt-0.5"
                        />
                        <div>
                          <label className="block text-sm font-medium text-text dark:text-dText mb-1">
                            Where did this happen?{" "}
                            <span className="text-danger">*</span>
                          </label>
                          <p className="text-xs text-muted-text dark:text-dMuted-text">
                            Which page or section?
                          </p>
                        </div>
                      </div>

                      <CustomDropdown
                        options={PAGE_OPTIONS}
                        value={pageContext}
                        onChange={setPageContext}
                        placeholder="Select page..."
                      />

                      {/* Show custom page input if "Other" is selected */}
                      <AnimatePresence>
                        {pageContext === "other" && (
                          <motion.input
                            initial={{ opacity: 0, height: 0, marginTop: 0 }}
                            animate={{
                              opacity: 1,
                              height: "auto",
                              marginTop: 12,
                            }}
                            exit={{ opacity: 0, height: 0, marginTop: 0 }}
                            transition={{ duration: 0.2 }}
                            type="text"
                            className="w-full rounded-xl border border-bordercolor dark:border-dbordercolor bg-bg dark:bg-dbg text-text dark:text-dText px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/50 dark:focus:ring-dPrimary/50 transition-all placeholder:text-muted-text dark:placeholder:text-dMuted-text overflow-hidden"
                            placeholder="Enter page name or URL"
                            value={customPage}
                            onChange={(e) => setCustomPage(e.target.value)}
                          />
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Question 4: One thing to improve */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="bg-card dark:bg-dcard rounded-2xl border border-bordercolor dark:border-dbordercolor p-6 shadow-sm backdrop-blur-sm"
            >
              <div className="mb-4 flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-500/20 to-amber-500/20 dark:from-yellow-400/20 dark:to-amber-400/20 flex items-center justify-center">
                  <Lightbulb
                    size={20}
                    className="text-yellow-600 dark:text-yellow-500"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-semibold text-text dark:text-dText mb-1">
                    If you could instantly improve one thing, what would it be?{" "}
                    <span className="text-danger">*</span>
                  </label>
                  <p className="text-xs text-muted-text dark:text-dMuted-text">
                    Dream big or small — we're listening!
                  </p>
                </div>
              </div>

              <input
                type="text"
                className="w-full rounded-xl border border-bordercolor dark:border-dbordercolor bg-bg dark:bg-dbg text-text dark:text-dText px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/50 dark:focus:ring-dPrimary/50 transition-all placeholder:text-muted-text dark:placeholder:text-dMuted-text"
                placeholder="Example: Add dark mode / make search faster / better mobile design"
                value={improvement}
                onChange={(e) => setImprovement(e.target.value)}
                maxLength={150}
              />
              <div className="mt-2 flex items-center justify-end">
                <p
                  className={[
                    "text-xs",
                    improvement.trim().length >= 5
                      ? "text-green-600 dark:text-green-500"
                      : "text-muted-text dark:text-dMuted-text",
                  ].join(" ")}
                >
                  {improvement.length} / 150
                </p>
              </div>
            </motion.div>

            {/* Question 5: Bug noticed */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.5 }}
              className="bg-card dark:bg-dcard rounded-2xl border border-bordercolor dark:border-dbordercolor p-6 shadow-sm backdrop-blur-sm"
            >
              <div className="mb-4 flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-red-500/20 to-pink-500/20 dark:from-red-400/20 dark:to-pink-400/20 flex items-center justify-center">
                  <Bug size={20} className="text-red-600 dark:text-red-500" />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-semibold text-text dark:text-dText mb-1">
                    Did you notice any bugs or weird behavior?
                  </label>
                  <p className="text-xs text-muted-text dark:text-dMuted-text">
                    Optional — but super helpful if you did!
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <motion.button
                  type="button"
                  onClick={() => setHasBug(true)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={[
                    "flex-1 flex items-center justify-center gap-2 rounded-xl border-2 px-6 py-4 font-medium text-sm transition-all",
                    hasBug === true
                      ? "border-primary dark:border-dPrimary bg-primary/10 dark:bg-dPrimary/10 text-primary dark:text-dPrimary"
                      : "border-bordercolor dark:border-dbordercolor text-text dark:text-dText hover:border-primary/50 dark:hover:border-dPrimary/50 hover:bg-primary/5 dark:hover:bg-dPrimary/5",
                  ].join(" ")}
                >
                  <Bug size={18} />
                  Yes, I found a bug
                </motion.button>
                <motion.button
                  type="button"
                  onClick={() => {
                    setHasBug(false);
                    setBugDescription("");
                    setBugScreenshots([]);
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={[
                    "flex-1 flex items-center justify-center gap-2 rounded-xl border-2 px-6 py-4 font-medium text-sm transition-all",
                    hasBug === false
                      ? "border-primary dark:border-dPrimary bg-primary/10 dark:bg-dPrimary/10 text-primary dark:text-dPrimary"
                      : "border-bordercolor dark:border-dbordercolor text-text dark:text-dText hover:border-primary/50 dark:hover:border-dPrimary/50 hover:bg-primary/5 dark:hover:bg-dPrimary/5",
                  ].join(" ")}
                >
                  <CheckCircle2 size={18} />
                  No bugs noticed
                </motion.button>
              </div>

              {/* Bug details - show if Yes */}
              <AnimatePresence>
                {hasBug === true && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-6 space-y-4 overflow-hidden"
                  >
                    <div>
                      <label className="block text-sm font-medium text-text dark:text-dText mb-2">
                        Describe it briefly{" "}
                        <span className="text-danger">*</span>
                      </label>
                      <textarea
                        rows={4}
                        className="w-full resize-none rounded-xl border border-bordercolor dark:border-dbordercolor bg-bg dark:bg-dbg text-text dark:text-dText px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-0 dark:focus:ring-dPrimary/50 transition-all placeholder:text-muted-text dark:placeholder:text-dMuted-text box-border"
                        placeholder="What happened? What did you expect to happen?"
                        value={bugDescription}
                        onChange={(e) => setBugDescription(e.target.value)}
                      />
                    </div>

                    {/* Screenshot upload */}
                    <div>
                      <label className="block text-sm font-medium text-text dark:text-dText mb-2">
                        Upload screenshot (optional)
                      </label>
                      <motion.div
                        onDragEnter={(e) => {
                          e.preventDefault();
                          setDragActive(true);
                        }}
                        onDragOver={(e) => {
                          e.preventDefault();
                          setDragActive(true);
                        }}
                        onDragLeave={(e) => {
                          e.preventDefault();
                          setDragActive(false);
                        }}
                        onDrop={handleDrop}
                        animate={{
                          scale: dragActive ? 1.02 : 1,
                        }}
                        className={[
                          "relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-8 transition-colors cursor-pointer",
                          dragActive
                            ? "bg-accent/10 dark:bg-daccent/10 border-accent dark:border-daccent"
                            : "border-bordercolor dark:border-dbordercolor hover:bg-accent/5 dark:hover:bg-daccent/5",
                        ].join(" ")}
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <UploadCloud
                          className="text-accent dark:text-daccent mb-2"
                          size={32}
                        />
                        <p className="text-sm text-text dark:text-dText font-medium">
                          Click to upload or drag and drop
                        </p>
                        <p className="text-xs text-muted-text dark:text-dMuted-text">
                          PNG, JPG • Max 10MB
                        </p>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          multiple
                          className="hidden"
                          onChange={(e) => addMockFiles(e.target.files)}
                        />
                      </motion.div>

                      <AnimatePresence>
                        {bugScreenshots.length > 0 && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-3 grid grid-cols-2 gap-3 overflow-hidden"
                          >
                            {bugScreenshots.map((item, idx) => (
                              <motion.div
                                key={idx}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                className="group relative rounded-xl border border-bordercolor dark:border-dbordercolor p-3 bg-bg dark:bg-dbg"
                              >
                                <motion.button
                                  type="button"
                                  onClick={() => removeFile(idx)}
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  className="absolute -top-2 -right-2 rounded-full p-1.5 bg-danger text-white shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <X size={14} />
                                </motion.button>
                                <div className="flex items-center gap-3">
                                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 dark:bg-dPrimary/10 flex items-center justify-center">
                                    <ImageIcon
                                      className="text-primary dark:text-dPrimary"
                                      size={18}
                                    />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm text-text dark:text-dText truncate font-medium">
                                      {item.name}
                                    </p>
                                    <p className="text-xs text-muted-text dark:text-dMuted-text">
                                      {item.sizeMB} MB
                                    </p>
                                  </div>
                                </div>
                                {item.error && (
                                  <p className="mt-2 text-xs text-danger flex items-center gap-1">
                                    <AlertCircle size={12} />
                                    {item.error}
                                  </p>
                                )}
                              </motion.div>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Question 6: NPS Score */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.6 }}
              className="bg-card dark:bg-dcard rounded-2xl border border-bordercolor dark:border-dbordercolor p-6 shadow-sm backdrop-blur-sm"
            >
              <div className="mb-4 flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 dark:from-purple-400/20 dark:to-pink-400/20 flex items-center justify-center">
                  <Heart
                    size={20}
                    className="text-purple-600 dark:text-purple-500"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-semibold text-text dark:text-dText mb-1">
                    How likely are you to recommend BlogChat to a friend or
                    teammate? <span className="text-danger">*</span>
                  </label>
                  <p className="text-xs text-muted-text dark:text-dMuted-text">
                    1 = Not at all likely • 10 = Extremely likely
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
                {NPS_SCALE.map((item) => {
                  const selected = npsScore === item.value;
                  return (
                    <motion.button
                      key={item.value}
                      type="button"
                      onClick={() => setNpsScore(item.value)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      title={item.label}
                      className={[
                        "relative flex flex-col items-center justify-center gap-1 rounded-xl border-2 p-3 transition-all",
                        selected
                          ? "border-primary dark:border-dPrimary bg-primary/10 dark:bg-dPrimary/10 shadow-md"
                          : "border-bordercolor dark:border-dbordercolor hover:border-primary/50 dark:hover:border-dPrimary/50 hover:bg-primary/5 dark:hover:bg-dPrimary/5",
                      ].join(" ")}
                    >
                      <span className="text-2xl">{item.emoji}</span>
                      <span
                        className={[
                          "text-xs font-bold",
                          selected
                            ? "text-primary dark:text-dPrimary"
                            : "text-muted-text dark:text-dMuted-text",
                        ].join(" ")}
                      >
                        {item.value}
                      </span>
                      <AnimatePresence>
                        {selected && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-primary dark:bg-dPrimary flex items-center justify-center shadow-lg"
                          >
                            <Check size={12} className="text-white" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.button>
                  );
                })}
              </div>

              {/* NPS Category indicator */}
              <AnimatePresence>
                {npsScore !== null && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mt-4 flex items-center justify-center gap-2"
                  >
                    <Target
                      size={16}
                      className={getNPSCategory(npsScore).color}
                    />
                    <p
                      className={`text-sm font-semibold ${
                        getNPSCategory(npsScore).color
                      }`}
                    >
                      You're a {getNPSCategory(npsScore).label}!
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Submit Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.7 }}
              className="flex items-center justify-between pt-4"
            >
              <p className="text-xs text-muted-text dark:text-dMuted-text">
                <span className="text-danger">*</span> Required fields
              </p>

              <motion.button
                type="submit"
                disabled={submitting}
                whileHover={{ scale: submitting ? 1 : 1.05 }}
                whileTap={{ scale: submitting ? 1 : 0.95 }}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-accent dark:from-dPrimary dark:to-daccent text-white px-8 py-3 text-sm font-semibold hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed transition-all shadow-md"
              >
                {submitting ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    Submitting...
                  </>
                ) : (
                  <>Submit Feedback</>
                )}
              </motion.button>
            </motion.div>
          </form>
        )}
      </div>
    </div>
  );
}
