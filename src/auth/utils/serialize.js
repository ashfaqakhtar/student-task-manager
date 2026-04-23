export function serializeUser(user) {
  if (!user) return null;

  return {
    id: user._id?.toString?.() || user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    isVerified: user.isVerified,
    createdAt: user.createdAt,
  };
}

export function serializeTask(task) {
  return {
    id: task.publicId,
    title: task.title,
    subject: task.subject,
    type: task.type,
    priority: task.priority,
    status: task.status,
    estimatedMinutes: task.estimatedMinutes,
    deadline: task.deadline ? task.deadline.toISOString() : null,
    scheduledDate: task.scheduledDate ? task.scheduledDate.toISOString() : null,
    effort: task.effort,
    notes: task.notes || "",
    links: task.links || [],
    subtasks: task.subtasks || [],
    syllabus: task.syllabus
      ? {
          mode: task.syllabus.mode,
          title: task.syllabus.title || "",
          examDate: task.syllabus.examDate ? new Date(task.syllabus.examDate).toISOString() : null,
          coverageNotes: task.syllabus.coverageNotes || "",
          topics: task.syllabus.topics || [],
        }
      : null,
    sessions: (task.sessions || []).map((session) => ({
      ...session,
      startedAt: new Date(session.startedAt).toISOString(),
      endedAt: new Date(session.endedAt).toISOString(),
    })),
    recurring: task.recurring || null,
    createdAt: task.createdAt ? task.createdAt.toISOString() : null,
    completedAt: task.completedAt ? task.completedAt.toISOString() : null,
  };
}
