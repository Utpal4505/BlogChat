// ReportBugUI.jsx - WITH STEPS TO REPRODUCE
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
  Wrench,
  Palette,
  Zap,
  Smartphone,
  Compass,
  UploadCloud,
  X,
  Image as ImageIcon,
  Video,
  CheckCircle2,
  Loader2,
  ChevronDown,
  AlertCircle,
  Check,
  Home,
  UserCircle,
  NotebookPen,
  CompassIcon,
  Settings,
  Plus,
  GripVertical,
  Trash2,
} from "lucide-react";
import { FaComment } from "react-icons/fa";
import { MdQuestionMark } from "react-icons/md";
import { UAParser } from "ua-parser-js";
import { consoleErrors } from "../src/main";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { AuthContext } from "../context/AuthContext";
import { uploadFilesToServer } from "../utils/UploadFileToServer";

const BUG_OPTIONS = [
  {
    value: "not-working",
    label: "Something isn't working",
    icon: Wrench,
    desc: "Feature broken or not responding",
  },
  {
    value: "visual-issue",
    label: "Something looks broken",
    icon: Palette,
    desc: "Visual glitch or layout issue",
  },
  {
    value: "performance",
    label: "It's too slow or laggy",
    icon: Zap,
    desc: "Performance problem",
  },
  {
    value: "device-specific",
    label: "Doesn't work on my device",
    icon: Smartphone,
    desc: "Mobile or browser specific",
  },
  {
    value: "confusion",
    label: "Can't find something",
    icon: Compass,
    desc: "Confusion or missing feature",
  },
];

const PAGE_OPTIONS = [
  { value: "homepage", label: "Homepage", icon: Home },
  { value: "profile", label: "My Profile", icon: UserCircle },
  { value: "editor", label: "Editor", icon: NotebookPen },
  { value: "comments", label: "Comments", icon: FaComment },
  { value: "explore", label: "Explore", icon: CompassIcon },
  { value: "settings", label: "Settings", icon: Settings },
  { value: "other", label: "Other", icon: MdQuestionMark },
];

const MOOD_OPTIONS = [
  { emoji: "🙂", label: "Minor issue" },
  { emoji: "😐", label: "Annoying" },
  { emoji: "😕", label: "Frustrating" },
  { emoji: "😡", label: "Very frustrating" },
  { emoji: "😤", label: "Can't use app" },
];

// Custom Dropdown Component with Framer Motion
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
    <div className="relative z-30" ref={dropdownRef}>
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
            className="absolute z-[9999] w-full mt-2 rounded-xl border border-bordercolor dark:border-dbordercolor bg-card dark:bg-dcard shadow-2xl overflow-hidden"
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
                    {opt.desc && (
                      <span className="hidden sm:block text-xs text-muted-text dark:text-dMuted-text truncate max-w-[120px]">
                        {opt.desc}
                      </span>
                    )}
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

export default function ReportBug() {
  const [bugType, setBugType] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [steps, setSteps] = useState([
    { id: 1, text: "" },
    { id: 2, text: "" },
  ]);
  const [pageContext, setPageContext] = useState("homepage");
  const [customPage, setCustomPage] = useState("");
  const [mood, setMood] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const fileInputRef = useRef(null);

  const parser = new UAParser();
  const User_Device = parser.getResult();

  const { executeRecaptcha } = useGoogleReCaptcha();
  const { create_Bug } = useContext(AuthContext);

  const metadata = {
    browser: User_Device.browser.name || "Unknown",
    browser_version: User_Device.browser.version || "Unknown",
    os: User_Device.os.name || "Unknown",
    os_version: User_Device.os.version || "Unknown",
    device_type: User_Device.device.type || "desktop",
    cpu_architecture: User_Device.cpu.architecture || "Unknown",
    user_agent: User_Device.ua || "Unknown",
    url: window.location.href,
    viewport: `${window.innerWidth}x${window.innerHeight}`,
    network_status: navigator.onLine ? "online" : "offline",
    timestamp: new Date().toISOString(),
    pageLoadTimeMs: performance.now(),
    Console_err: consoleErrors,
  };

  const resetForm = useCallback(() => {
    setBugType("");
    setTitle("");
    setDescription("");
    setSteps([
      { id: 1, text: "" },
      { id: 2, text: "" },
    ]);
    setPageContext("homepage");
    setCustomPage("");
    setMood("");
    setFiles([]);
    setSubmitted(false);
  }, []);

  // Steps to Reproduce handlers
  const addStep = () => {
    const newId =
      steps.length > 0 ? Math.max(...steps.map((s) => s.id)) + 1 : 1;
    setSteps([...steps, { id: newId, text: "" }]);
  };

  const removeStep = (id) => {
    if (steps.length > 1) {
      setSteps(steps.filter((step) => step.id !== id));
    }
  };

  const updateStep = (id, text) => {
    setSteps(steps.map((step) => (step.id === id ? { ...step, text } : step)));
  };

  function addMockFiles(list) {
    if (!list) return;
    const next = Array.from(list).map((f) => {
      const isVideo = f.type === "video/mp4";
      const isImage = f.type.startsWith("image/");
      const validType = isVideo || isImage;
      const validSize = f.size <= 10 * 1024 * 1024;
      return {
        file: f,
        name: f.name,
        sizeMB: (f.size / 1024 / 1024).toFixed(2),
        type: isVideo ? "video" : "image",
        error: !validType
          ? "Only images or .mp4 allowed"
          : !validSize
          ? "File must be under 10MB"
          : undefined,
      };
    });
    setFiles((prev) => [...prev, ...next]);
  }

  function removeFile(idx) {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
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

    const token = await executeRecaptcha("report_bug");

    if (!bugType) return toast.error("Please select what kind of issue it is");
    if (!title.trim()) return toast.error("Please add a title for the bug");
    if (title.trim().length < 5)
      return toast.error("Title should be at least 5 characters");
    if (!description.trim())
      return toast.error("Please describe what happened");
    if (description.trim().length < 20)
      return toast.error("Description should be at least 20 characters");

    setSubmitting(true);

    try {
      const uploadedUrls = await uploadFilesToServer(files);

      // Filter out empty steps
      const filledSteps = steps
        .filter((step) => step.text.trim())
        .map((step, index) => `${index + 1}. ${step.text}`);

      const BugPayload = {
        Bugtype: bugType,
        Title: title || bugType,
        Description: description,
        Steps_to_reproduce: filledSteps.length > 0 ? filledSteps : null,
        Page: pageContext,
        Custom_Page: customPage,
        Mood: mood,
        Attachments: uploadedUrls,
        Metadata: metadata,
      };

      const data = await create_Bug({
        bugPayload: BugPayload,
        recaptchaToken: token,
      });

      if (data) {
        toast.success("🐞 Bug reported successfully!");
        resetForm();
      }
    } catch (error) {
      console.error("Bug reporting error:", error.message);
      toast.error("Failed to report bug. Please try again later.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-bg dark:bg-dbg transition-colors duration-200">
      <div className="mx-auto max-w-4xl px-4 py-12">
        {/* Hero Section with subtle animation */}
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
            <AlertCircle
              className="text-primary dark:text-dPrimary"
              size={32}
            />
          </motion.div>
          <h1 className="text-3xl font-bold text-text dark:text-dText mb-2">
            Report a Bug
          </h1>
          <p className="text-muted-text dark:text-dMuted-text max-w-xl mx-auto">
            Hey 👋 noticed something off? Help us improve by sharing what went
            wrong. Your feedback makes a difference!
          </p>
        </motion.div>

        <form onSubmit={validateAndSubmit} className="space-y-6 relative">
          {/* Bug Type Dropdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="bg-card dark:bg-dcard rounded-2xl border border-bordercolor dark:border-dbordercolor p-6 shadow-sm backdrop-blur-sm relative z-20"
          >
            <div className="mb-4">
              <label className="block text-sm font-semibold text-text dark:text-dText mb-1">
                What kind of issue is it? <span className="text-danger">*</span>
              </label>
              <p className="text-xs text-muted-text dark:text-dMuted-text">
                Choose the category that best describes your problem
              </p>
            </div>

            <CustomDropdown
              options={BUG_OPTIONS}
              value={bugType}
              onChange={setBugType}
              placeholder="Select issue type..."
            />
          </motion.div>

          {/* Title Field */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="bg-card dark:bg-dcard rounded-2xl border border-bordercolor dark:border-dbordercolor p-6 shadow-sm backdrop-blur-sm relative z-10"
          >
            <label className="block text-sm font-semibold text-text dark:text-dText mb-1">
              Bug Title <span className="text-danger">*</span>
            </label>
            <p className="text-xs text-muted-text dark:text-dMuted-text mb-3">
              Give your bug a short, clear title
            </p>
            <input
              type="text"
              className="w-full rounded-xl border border-bordercolor dark:border-dbordercolor bg-bg dark:bg-dbg text-text dark:text-dText px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/50 dark:focus:ring-dPrimary/50 transition-all placeholder:text-muted-text dark:placeholder:text-dMuted-text"
              placeholder="Example: Login button not responding on mobile"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={100}
            />
            <div className="mt-2 flex items-center justify-between">
              <p className="text-xs text-muted-text dark:text-dMuted-text">
                Minimum 5 characters
              </p>
              <AnimatePresence mode="wait">
                <motion.p
                  key={title.trim().length >= 5 ? "valid" : "invalid"}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                  className={[
                    "text-xs",
                    title.trim().length >= 5
                      ? "text-green-600 dark:text-green-500"
                      : "text-muted-text dark:text-dMuted-text",
                  ].join(" ")}
                >
                  {title.trim().length} / 100
                </motion.p>
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="bg-card dark:bg-dcard rounded-2xl border border-bordercolor dark:border-dbordercolor p-6 shadow-sm backdrop-blur-sm relative z-10"
          >
            <label className="block text-sm font-semibold text-text dark:text-dText mb-1">
              What happened? <span className="text-danger">*</span>
            </label>
            <p className="text-xs text-muted-text dark:text-dMuted-text mb-3">
              Describe the issue in detail - what did you expect vs what
              actually happened?
            </p>
            <textarea
              rows={6}
              className="w-full resize-none rounded-xl border border-bordercolor dark:border-dbordercolor bg-bg dark:bg-dbg text-text dark:text-dText px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/50 dark:focus:ring-dPrimary/50 transition-all placeholder:text-muted-text dark:placeholder:text-dMuted-text leading-relaxed"
              placeholder="Example: I clicked the 'Publish' button on my post, but nothing happened. The button just kept loading forever. I expected the post to be published and get a success message. I tried twice but same issue both times."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <div className="mt-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <p className="text-xs text-muted-text dark:text-dMuted-text">
                  Minimum 20 characters
                </p>
                <AnimatePresence>
                  {description.length >= 20 && (
                    <motion.span
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0 }}
                      className="inline-flex items-center gap-1 text-xs text-green-600 dark:text-green-500"
                    >
                      <CheckCircle2 size={12} />
                      Good
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
              <p
                className={[
                  "text-xs font-medium",
                  description.length >= 20
                    ? "text-green-600 dark:text-green-500"
                    : "text-muted-text dark:text-dMuted-text",
                ].join(" ")}
              >
                {description.length} characters
              </p>
            </div>
          </motion.div>

          {/* Steps to Reproduce - NEW SECTION */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.35 }}
            className="bg-card dark:bg-dcard rounded-2xl border border-bordercolor dark:border-dbordercolor p-6 shadow-sm backdrop-blur-sm relative z-10"
          >
            <div className="mb-4">
              <label className="block text-sm font-semibold text-text dark:text-dText mb-1">
                Steps to Reproduce (optional)
              </label>
              <p className="text-xs text-muted-text dark:text-dMuted-text">
                Describe the steps to reproduce the issue. The more details you
                provide, the easier it will be for us to fix it.
              </p>
            </div>

            <div className="space-y-3">
              <AnimatePresence mode="popLayout">
                {steps.map((step, index) => (
                  <motion.div
                    key={step.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-start gap-3 group"
                  >
                    <div className="flex-shrink-0 flex items-center gap-2 mt-3">
                      <GripVertical
                        size={16}
                        className="text-muted-text/30 dark:text-dMuted-text/30 cursor-grab"
                      />
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 dark:bg-dPrimary/10 text-primary dark:text-dPrimary text-xs font-semibold">
                        {index + 1}
                      </span>
                    </div>
                    <input
                      type="text"
                      value={step.text}
                      onChange={(e) => updateStep(step.id, e.target.value)}
                      placeholder={`Step ${index + 1}...`}
                      className="flex-1 rounded-xl border border-bordercolor dark:border-dbordercolor bg-bg dark:bg-dbg text-text dark:text-dText px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/50 dark:focus:ring-dPrimary/50 transition-all placeholder:text-muted-text/50 dark:placeholder:text-dMuted-text/50"
                    />
                    {steps.length > 1 && (
                      <motion.button
                        type="button"
                        onClick={() => removeStep(step.id)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="flex-shrink-0 mt-1 p-2 items-center rounded-lg text-danger hover:bg-danger/10 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 size={16} />
                      </motion.button>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <motion.button
              type="button"
              onClick={addStep}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="mt-4 w-full flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-bordercolor dark:border-dbordercolor hover:border-primary/50 dark:hover:border-dPrimary/50 hover:bg-primary/5 dark:hover:bg-dPrimary/5 text-muted-text dark:text-dMuted-text hover:text-primary dark:hover:text-dPrimary px-4 py-3 text-sm font-medium transition-all"
            >
              <Plus size={16} />
              Add Step
            </motion.button>
          </motion.div>

          {/* Two Column Layout */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            {/* Where it happened */}
            <div className="bg-card dark:bg-dcard rounded-2xl border border-bordercolor dark:border-dbordercolor p-6 shadow-sm backdrop-blur-sm relative z-15">
              <label className="block text-sm font-semibold text-text dark:text-dText mb-1">
                Where did this happen?
              </label>
              <p className="text-xs text-muted-text dark:text-dMuted-text mb-3">
                Which page or screen?
              </p>

              <CustomDropdown
                options={PAGE_OPTIONS}
                value={pageContext}
                onChange={setPageContext}
                placeholder="Select page..."
              />

              <AnimatePresence>
                {pageContext === "other" && (
                  <motion.input
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    type="text"
                    className="mt-3 w-full rounded-xl border border-bordercolor dark:border-dbordercolor bg-bg dark:bg-dbg text-text dark:text-dText px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/50 dark:focus:ring-dPrimary/50 transition-all placeholder:text-muted-text dark:placeholder:text-dMuted-text"
                    placeholder="Enter page name or URL"
                    value={customPage}
                    onChange={(e) => setCustomPage(e.target.value)}
                  />
                )}
              </AnimatePresence>
            </div>

            {/* Mood */}
            <div className="bg-card dark:bg-dcard rounded-2xl border border-bordercolor dark:border-dbordercolor p-6 shadow-sm backdrop-blur-sm relative z-10">
              <label className="block text-sm font-semibold text-text dark:text-dText mb-1">
                How frustrating was this?
              </label>
              <p className="text-xs text-muted-text dark:text-dMuted-text mb-3">
                Optional but helps us prioritize
              </p>

              <div className="flex gap-2">
                {MOOD_OPTIONS.map(({ emoji, label }) => {
                  const selected = mood === emoji;
                  return (
                    <motion.button
                      key={emoji}
                      type="button"
                      onClick={() => setMood(selected ? "" : emoji)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={[
                        "group relative flex-1 flex flex-col items-center gap-1.5 rounded-xl border-2 p-3 transition-all",
                        selected
                          ? "border-primary dark:border-dPrimary bg-primary/10 dark:bg-dPrimary/10 shadow-md"
                          : "border-bordercolor dark:border-dbordercolor hover:border-primary/50 dark:hover:border-dPrimary/50 hover:bg-primary/5 dark:hover:bg-dPrimary/5",
                      ].join(" ")}
                      title={label}
                    >
                      <span className="text-2xl">{emoji}</span>
                      <span
                        className={[
                          "text-[10px] text-center leading-tight",
                          selected
                            ? "text-primary dark:text-dPrimary font-medium"
                            : "text-muted-text dark:text-dMuted-text",
                        ].join(" ")}
                      >
                        {label.split(" ")[0]}
                      </span>
                      <AnimatePresence>
                        {selected && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary dark:bg-dPrimary flex items-center justify-center"
                          >
                            <Check size={12} className="text-white" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Attachments */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
            className="bg-card dark:bg-dcard rounded-2xl border border-bordercolor dark:border-dbordercolor p-6 shadow-sm backdrop-blur-sm relative z-5"
          >
            <label className="block text-sm font-semibold text-text dark:text-dText mb-1">
              Add screenshots or video (optional)
            </label>
            <p className="text-xs text-muted-text dark:text-dMuted-text mb-4">
              Visual evidence helps us fix bugs faster • Max 10MB per file
            </p>

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
                borderColor: dragActive
                  ? "var(--color-accent)"
                  : "var(--color-bordercolor)",
              }}
              className={[
                "relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-10 transition-colors cursor-pointer group",
                dragActive
                  ? "bg-accent/10 dark:bg-daccent/10"
                  : "border-bordercolor dark:border-dbordercolor hover:bg-accent/5 dark:hover:bg-daccent/5",
              ].join(" ")}
              onClick={() => fileInputRef.current?.click()}
            >
              <motion.div
                animate={{
                  scale: dragActive ? 1.1 : 1,
                }}
                className={[
                  "w-14 h-14 rounded-full flex items-center justify-center mb-3 transition-all",
                  dragActive
                    ? "bg-accent/20 dark:bg-daccent/20"
                    : "bg-accent/10 dark:bg-daccent/10 group-hover:scale-110",
                ].join(" ")}
              >
                <UploadCloud
                  className="text-accent dark:text-daccent"
                  size={26}
                />
              </motion.div>
              <p className="text-sm text-text dark:text-dText font-medium mb-1">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-muted-text dark:text-dMuted-text">
                PNG, JPG, GIF or MP4 video
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/mp4"
                multiple
                className="hidden"
                onChange={(e) => addMockFiles(e.target.files)}
              />
            </motion.div>

            <AnimatePresence>
              {files.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 overflow-hidden"
                >
                  {files.map((item, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ delay: idx * 0.05 }}
                      className="group relative rounded-xl border border-bordercolor dark:border-dbordercolor p-3 bg-bg dark:bg-dbg hover:border-primary/50 dark:hover:border-dPrimary/50 transition-all"
                    >
                      <motion.button
                        type="button"
                        onClick={() => removeFile(idx)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="absolute -top-2 -right-2 rounded-full p-1.5 bg-danger text-white shadow-lg hover:bg-danger/90 transition-all opacity-0 group-hover:opacity-100 z-10"
                      >
                        <X size={14} />
                      </motion.button>
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 dark:bg-dPrimary/10 flex items-center justify-center">
                          {item.type === "video" ? (
                            <Video
                              className="text-primary dark:text-dPrimary"
                              size={18}
                            />
                          ) : (
                            <ImageIcon
                              className="text-primary dark:text-dPrimary"
                              size={18}
                            />
                          )}
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
          </motion.div>

          {/* Submit Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.6 }}
            className="flex items-center justify-between pt-4 relative z-5"
          >
            <p className="text-xs text-muted-text dark:text-dMuted-text">
              <span className="text-danger">*</span> Required fields
            </p>

            <motion.button
              type="submit"
              disabled={submitting || submitted}
              whileHover={{ scale: submitting || submitted ? 1 : 1.05 }}
              whileTap={{ scale: submitting || submitted ? 1 : 0.95 }}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-accent dark:from-dPrimary dark:to-daccent text-white px-8 py-3 text-sm font-semibold hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed transition-all shadow-md"
            >
              {submitting ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  Submitting...
                </>
              ) : submitted ? (
                <>
                  <CheckCircle2 size={18} />
                  Submitted!
                </>
              ) : (
                <>Submit Report</>
              )}
            </motion.button>
          </motion.div>
        </form>
      </div>
    </div>
  );
}
