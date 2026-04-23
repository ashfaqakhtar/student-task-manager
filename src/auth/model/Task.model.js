import mongoose from "mongoose";

const subtaskSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    text: { type: String, required: true, trim: true },
    done: { type: Boolean, default: false },
  },
  { _id: false },
);

const sessionSchema = new mongoose.Schema(
  {
    startedAt: { type: Date, required: true },
    endedAt: { type: Date, required: true },
    durationMinutes: { type: Number, required: true },
  },
  { _id: false },
);

const syllabusTopicSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    text: { type: String, required: true, trim: true },
    done: { type: Boolean, default: false },
  },
  { _id: false },
);

const syllabusSchema = new mongoose.Schema(
  {
    mode: {
      type: String,
      enum: ["regular", "exam"],
      required: true,
    },
    title: { type: String, default: "", trim: true },
    examDate: { type: Date, default: null },
    coverageNotes: { type: String, default: "", trim: true },
    topics: [syllabusTopicSchema],
  },
  { _id: false },
);

const recurringSchema = new mongoose.Schema(
  {
    frequency: {
      type: String,
      enum: ["daily", "weekly"],
      required: true,
    },
    dayOfWeek: {
      type: Number,
      min: 0,
      max: 6,
    },
  },
  { _id: false },
);

const taskSchema = new mongoose.Schema(
  {
    publicId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: { type: String, required: true, trim: true },
    subject: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: ["assignment", "exam", "project", "revision", "lab"],
      required: true,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    status: {
      type: String,
      enum: ["backlog", "this-week", "in-progress", "completed"],
      default: "backlog",
    },
    estimatedMinutes: { type: Number, default: 60 },
    deadline: { type: Date, default: null },
    scheduledDate: { type: Date, default: null },
    effort: {
      type: String,
      enum: ["light", "medium", "deep"],
      default: "medium",
    },
    notes: { type: String, default: "" },
    links: [{ type: String }],
    subtasks: [subtaskSchema],
    syllabus: { type: syllabusSchema, default: null },
    sessions: [sessionSchema],
    recurring: { type: recurringSchema, default: null },
    completedAt: { type: Date, default: null },
  },
  { timestamps: true },
);

const Task = mongoose.models.Task || mongoose.model("Task", taskSchema);

export default Task;
