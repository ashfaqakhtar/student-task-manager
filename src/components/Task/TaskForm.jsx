import { useEffect, useMemo, useRef, useState } from "react";
import { nanoid } from "nanoid";
import Button from "../UI/Button";
import Input from "../UI/Input";
import ModalFooter from "../UI/ModalFooter";
import Select from "../UI/Select";
import Toggle from "../UI/Toggle";
import FormSection from "./FormSection";

const EMPTY_FORM = {
  title: "",
  subject: "",
  type: "assignment",
  priority: "medium",
  status: "backlog",
  estimatedMinutes: 60,
  deadline: "",
  scheduledDate: "",
  effort: "medium",
  notes: "",
  links: [""],
  subtasks: [],
  syllabus: null,
  recurring: null,
};

function Segment({ label, active, onClick }) {
  return <button type="button" className={`segment ${active ? "is-active" : ""}`} onClick={onClick}>{label}</button>;
}

export default function TaskForm({ initialTask, defaultStatus, subjects, onSubmit, onClose, title }) {
  const [form, setForm] = useState(() => ({
    ...EMPTY_FORM,
    ...initialTask,
    status: initialTask?.status || defaultStatus || "backlog",
    deadline: initialTask?.deadline ? initialTask.deadline.slice(0, 10) : "",
    scheduledDate: initialTask?.scheduledDate ? initialTask.scheduledDate.slice(0, 10) : "",
    syllabus: initialTask?.syllabus
      ? {
          ...initialTask.syllabus,
          examDate: initialTask.syllabus.examDate
            ? initialTask.syllabus.examDate.slice(0, 10)
            : "",
          topics: initialTask.syllabus.topics || [],
        }
      : null,
  }));
  const [error, setError] = useState("");
  const titleRef = useRef(null);

  useEffect(() => titleRef.current?.focus(), []);

  const subjectList = useMemo(() => subjects.filter(Boolean), [subjects]);

  const updateForm = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const updateTaskType = (value) =>
    setForm((current) => ({
      ...current,
      type: value,
      syllabus:
        value === "exam" && current.syllabus
          ? { ...current.syllabus, mode: "exam" }
          : current.syllabus,
    }));

  return (
    <form
      className="task-form"
      onSubmit={(event) => {
        event.preventDefault();
        if (!form.title.trim()) return setError("Title is required.");
        onSubmit({
          ...form,
          id: initialTask?.id || nanoid(),
          deadline: form.deadline ? new Date(form.deadline).toISOString() : null,
          scheduledDate: form.scheduledDate
            ? new Date(form.scheduledDate).toISOString()
            : null,
          estimatedMinutes: Number(form.estimatedMinutes),
          links: form.links.filter(Boolean),
          subtasks: form.subtasks.filter((subtask) => subtask.text.trim()),
          syllabus: form.syllabus
            ? {
                ...form.syllabus,
                examDate: form.syllabus.examDate
                  ? new Date(form.syllabus.examDate).toISOString()
                  : null,
                topics: (form.syllabus.topics || []).filter((topic) => topic.text.trim()),
              }
            : null,
          sessions: initialTask?.sessions || [],
          createdAt: initialTask?.createdAt || new Date().toISOString(),
          completedAt: initialTask?.completedAt || null,
        });
      }}
    >
      <div className="modal-card__header modal-card__header--stacked">
        <div>
          <p className="modal-card__eyebrow">Task details</p>
          <h2>{title}</h2>
        </div>
        <Button type="button" variant="ghost" onClick={onClose}>Close</Button>
      </div>
      <div className="task-form__layout">
        <FormSection
          title="Core details"
          description="Capture the task clearly so it is easy to scan later."
        >
          <div className="form-grid">
            <label className="form-grid__full">
              <span>Title</span>
              <Input
                ref={titleRef}
                value={form.title}
                onChange={(event) => updateForm("title", event.target.value)}
                placeholder="Prepare midterm review sheet"
              />
            </label>
            <label>
              <span>Subject</span>
              <Input
                list="subjects-list"
                value={form.subject}
                onChange={(event) => updateForm("subject", event.target.value)}
                placeholder="Web Technology"
              />
              <datalist id="subjects-list">
                {subjectList.map((subject) => <option key={subject} value={subject} />)}
              </datalist>
            </label>
            <div>
              <span>Type</span>
              <div className="segment-row">
                {["assignment", "exam", "project", "revision", "lab"].map((item) => (
                  <Segment
                    key={item}
                    label={item}
                    active={form.type === item}
                    onClick={() => updateTaskType(item)}
                  />
                ))}
              </div>
            </div>
            <div>
              <span>Priority</span>
              <div className="segment-row">
                {["low", "medium", "high"].map((item) => (
                  <Segment
                    key={item}
                    label={item}
                    active={form.priority === item}
                    onClick={() => updateForm("priority", item)}
                  />
                ))}
              </div>
            </div>
          </div>
        </FormSection>
        <FormSection
          title="Planning"
          description="Set the timeline and how this work should behave."
        >
          <div className="form-grid">
            <label>
              <span>Status</span>
              <Select value={form.status} onChange={(event) => updateForm("status", event.target.value)}>
                <option value="backlog">Backlog</option>
                <option value="this-week">This Week</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </Select>
            </label>
            <label>
              <span>Est. time</span>
              <Input
                type="number"
                min="5"
                step="5"
                value={form.estimatedMinutes}
                onChange={(event) => updateForm("estimatedMinutes", event.target.value)}
              />
            </label>
            <label>
              <span>Deadline</span>
              <Input
                type="date"
                value={form.deadline}
                onChange={(event) => updateForm("deadline", event.target.value)}
              />
            </label>
            <label>
              <span>Scheduled for</span>
              <Input
                type="date"
                value={form.scheduledDate}
                onChange={(event) => updateForm("scheduledDate", event.target.value)}
              />
            </label>
            <div>
              <span>Effort</span>
              <div className="segment-row">
                {["light", "medium", "deep"].map((item) => (
                  <Segment
                    key={item}
                    label={item}
                    active={form.effort === item}
                    onClick={() => updateForm("effort", item)}
                  />
                ))}
              </div>
            </div>
            <div className="task-form__toggle-block">
              <Toggle
                checked={Boolean(form.recurring)}
                onChange={(checked) =>
                  updateForm("recurring", checked ? { frequency: "weekly" } : null)
                }
                label="Recurring task"
              />
              {form.recurring ? (
                <div className="segment-row">
                  {["daily", "weekly"].map((item) => (
                    <Segment
                      key={item}
                      label={item}
                      active={form.recurring?.frequency === item}
                      onClick={() => updateForm("recurring", { frequency: item })}
                    />
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </FormSection>
        <FormSection
          title="Execution"
          description="Break the work down into steps and attach useful resources."
        >
          <div className="form-grid">
            <div className="form-grid__full">
              <span>Subtasks</span>
              <div className="stack-list">
                {form.subtasks.map((subtask, index) => (
                  <div key={subtask.id} className="list-row">
                    <Input
                      value={subtask.text}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          subtasks: current.subtasks.map((item, itemIndex) =>
                            itemIndex === index ? { ...item, text: event.target.value } : item,
                          ),
                        }))
                      }
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() =>
                        setForm((current) => ({
                          ...current,
                          subtasks: current.subtasks.filter((_, itemIndex) => itemIndex !== index),
                        }))
                      }
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
              <Button
                type="button"
                variant="secondary"
                onClick={() =>
                  updateForm("subtasks", [
                    ...form.subtasks,
                    { id: nanoid(), text: "", done: false },
                  ])
                }
              >
                Add subtask
              </Button>
            </div>
            <div className="form-grid__full">
              <span>Links</span>
              <div className="stack-list">
                {form.links.map((link, index) => (
                  <div key={`${link}-${index}`} className="list-row">
                    <Input
                      value={link}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          links: current.links.map((item, itemIndex) =>
                            itemIndex === index ? event.target.value : item,
                          ),
                        }))
                      }
                      placeholder="https://"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() =>
                        setForm((current) => ({
                          ...current,
                          links: current.links.filter((_, itemIndex) => itemIndex !== index),
                        }))
                      }
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
              <Button
                type="button"
                variant="secondary"
                onClick={() => updateForm("links", [...form.links, ""])}
              >
                Add link
              </Button>
            </div>
          </div>
        </FormSection>
        <FormSection
          title="Syllabus planning"
          description="Track regular syllabus coverage or create an exam-focused syllabus checklist."
        >
          <div className="task-form__toggle-block">
            <Toggle
              checked={Boolean(form.syllabus)}
              onChange={(checked) =>
                updateForm(
                  "syllabus",
                  checked
                    ? {
                        mode: form.type === "exam" ? "exam" : "regular",
                        title: "",
                        examDate: "",
                        coverageNotes: "",
                        topics: [],
                      }
                    : null,
                )
              }
              label="Attach syllabus plan"
            />
          </div>
          {form.syllabus ? (
            <div className="form-grid">
              <div>
                <span>Syllabus mode</span>
                <div className="segment-row">
                  {["regular", "exam"].map((item) => (
                    <Segment
                      key={item}
                      label={item}
                      active={form.syllabus?.mode === item}
                      onClick={() =>
                        updateForm("syllabus", {
                          ...form.syllabus,
                          mode: item,
                        })
                      }
                    />
                  ))}
                </div>
              </div>
              <label>
                <span>{form.syllabus.mode === "exam" ? "Exam name" : "Syllabus title"}</span>
                <Input
                  value={form.syllabus.title}
                  onChange={(event) =>
                    updateForm("syllabus", {
                      ...form.syllabus,
                      title: event.target.value,
                    })
                  }
                  placeholder={
                    form.syllabus.mode === "exam"
                      ? "Semester final exam"
                      : "Unit 3: Database normalization"
                  }
                />
              </label>
              {form.syllabus.mode === "exam" ? (
                <label>
                  <span>Exam date</span>
                  <Input
                    type="date"
                    value={form.syllabus.examDate || ""}
                    onChange={(event) =>
                      updateForm("syllabus", {
                        ...form.syllabus,
                        examDate: event.target.value,
                      })
                    }
                  />
                </label>
              ) : (
                <div />
              )}
              <label className="form-grid__full task-form__notes">
                <span>
                  {form.syllabus.mode === "exam" ? "Exam syllabus scope" : "Coverage notes"}
                </span>
                <textarea
                  className="textarea"
                  rows="4"
                  value={form.syllabus.coverageNotes}
                  onChange={(event) =>
                    updateForm("syllabus", {
                      ...form.syllabus,
                      coverageNotes: event.target.value,
                    })
                  }
                  placeholder={
                    form.syllabus.mode === "exam"
                      ? "Units 1-5, important questions, practical topics, and revision focus."
                      : "Topic summary, classroom pace, chapter references, or reading targets."
                  }
                />
              </label>
              <div className="form-grid__full">
                <span>
                  {form.syllabus.mode === "exam" ? "Exam checklist topics" : "Regular syllabus topics"}
                </span>
                <div className="stack-list">
                  {form.syllabus.topics.map((topic, index) => (
                    <div key={topic.id} className="list-row">
                      <Input
                        value={topic.text}
                        onChange={(event) =>
                          updateForm("syllabus", {
                            ...form.syllabus,
                            topics: form.syllabus.topics.map((item, itemIndex) =>
                              itemIndex === index ? { ...item, text: event.target.value } : item,
                            ),
                          })
                        }
                        placeholder={
                          form.syllabus.mode === "exam"
                            ? "Long answer questions from Unit 2"
                            : "Complete Chapter 4 lecture notes"
                        }
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() =>
                          updateForm("syllabus", {
                            ...form.syllabus,
                            topics: form.syllabus.topics.filter((_, itemIndex) => itemIndex !== index),
                          })
                        }
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() =>
                    updateForm("syllabus", {
                      ...form.syllabus,
                      topics: [
                        ...form.syllabus.topics,
                        { id: nanoid(), text: "", done: false },
                      ],
                    })
                  }
                >
                  Add syllabus topic
                </Button>
              </div>
            </div>
          ) : null}
        </FormSection>
        <FormSection
          title="Context"
          description="Keep just enough reference so future you can pick this up quickly."
        >
          <label className="task-form__notes">
            <span>Notes</span>
            <textarea
              className="textarea"
              rows="5"
              value={form.notes}
              onChange={(event) => updateForm("notes", event.target.value)}
              placeholder="Add prompts, constraints, reading references, or the next step."
            />
          </label>
        </FormSection>
      </div>
      {error ? <p className="form-error">{error}</p> : null}
      <ModalFooter onCancel={onClose} submitLabel="Save task" />
    </form>
  );
}
