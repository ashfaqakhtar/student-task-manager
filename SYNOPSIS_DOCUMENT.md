# Smart Study Planner

## 1. Project Title
Smart Study Planner: An Intelligent Academic Task and Study Management System

## 2. Project Overview
Smart Study Planner is a web-based academic productivity platform designed for students to manage coursework, deadlines, study routines, exam preparation, and focus sessions in a single system. The project combines task management, calendar planning, Kanban workflow, Pomodoro-based focus tracking, syllabus management, class routine planning, exam routine planning, and admin oversight.

The system is built as a full-stack JavaScript application using Next.js, React, MongoDB, Mongoose, Zustand, JWT authentication, and Nodemailer-based OTP verification.

## 3. Problem Statement
Students often use multiple disconnected tools for managing assignments, revision plans, class schedules, and exam preparation. This leads to:

- missed deadlines
- poor workload visibility
- weak study consistency
- no single place for task tracking and syllabus coverage
- limited performance insight into study progress

This project solves the problem by providing a centralized academic planning platform with both management and analytical features.

## 4. Aim
To develop an intelligent student productivity and academic planning system that helps students organize tasks, track study progress, plan routines, monitor deadlines, and improve focus and completion behavior.

## 5. Objectives
- To provide secure student authentication with email OTP verification
- To allow users to create, update, delete, and organize academic tasks
- To support academic planning using overview, board, today, and calendar views
- To provide focus support through a Pomodoro timer and session logging
- To manage recurring study tasks automatically
- To support regular syllabus and exam syllabus tracking
- To allow adding class routine and exam routine templates directly from the dashboard
- To generate simple study analytics and recommendation insights
- To provide an admin panel for user and task monitoring

## 6. Scope of the Project
The system is intended for:

- college and university students
- self-managed coursework planning
- revision and exam preparation
- academic routine organization
- student productivity tracking

The current version supports single-user academic planning with admin monitoring. It can be extended later with collaboration, notifications, and advanced reporting.

## 7. Current Technology Stack

### Frontend
- Next.js 16
- React 19
- Custom CSS
- Zustand for client-side state management

### Backend
- Next.js App Router API routes
- Node.js runtime inside Next.js server routes

### Database
- MongoDB Atlas
- Mongoose ODM

### Authentication and Security
- JWT (`jsonwebtoken`)
- HTTP-only cookie-based sessions
- `bcryptjs` for password hashing
- OTP email verification

### Utilities and Libraries
- `date-fns` for date calculations
- `nanoid` for task public IDs
- `nodemailer` for SMTP email sending

### Development Tools
- ESLint
- npm scripts for dev, build, and start

## 8. Actual Dependencies
From `package.json`:

- `next`
- `react`
- `react-dom`
- `mongoose`
- `bcryptjs`
- `jsonwebtoken`
- `nanoid`
- `nodemailer`
- `zustand`
- `date-fns`
- `eslint`
- `eslint-config-next`

## 9. Project Architecture
The project follows a modular full-stack structure:

- `app/` contains the Next.js pages and API routes
- `src/components/` contains UI and feature components
- `src/store/` contains global application state with Zustand
- `src/hooks/` contains reusable business logic hooks
- `src/auth/` contains database, model, mail, and authentication logic
- `src/utils/` contains ranking, analytics, date, and API helper functions

Architecture style:

- component-based frontend
- API-driven backend
- MongoDB document database
- cookie-based authenticated session management

## 10. Main Functional Modules

### 10.1 Authentication Module
Features:

- user registration
- email OTP verification
- login
- logout
- session validation
- password change
- role support: `user`, `admin`

Important routes:

- `/api/auth/register`
- `/api/auth/verify-otp`
- `/api/auth/login`
- `/api/auth/logout`
- `/api/auth/me`
- `/api/auth/change-password`

### 10.2 Task Management Module
Features:

- create task
- edit task
- delete task
- change status
- reorder tasks across workflow columns
- add notes, links, subtasks, and recurrence
- assign subject, priority, type, effort, deadline, and schedule

Important routes:

- `/api/tasks`
- `/api/tasks/[id]`
- `/api/tasks/reorder`

### 10.3 Overview Dashboard Module
Features:

- overview metrics
- deadline timeline
- smart filtering and sorting
- saved search/filter views
- planner quick actions
- study intelligence analytics

Planner quick actions currently include:

- add syllabus
- add class routine
- add exam routine

### 10.4 Today View Module
Features:

- recommended next tasks
- quick wins
- due today tasks
- planned today tasks
- in-progress tasks
- recommendation reasons

### 10.5 Kanban Board Module
Features:

- backlog
- this week
- in progress
- completed
- drag-and-drop movement
- quick add into columns

### 10.6 Calendar Module
Features:

- monthly calendar view
- workload mapping
- day-based task lookup
- navigation between months

### 10.7 Focus Module
Features:

- Pomodoro timer
- focus modal
- session logging
- note-taking during focus
- subtask tracking during a session

### 10.8 Syllabus and Routine Planning Module
Features:

- regular syllabus planning
- exam syllabus planning
- exam date support
- syllabus topic checklist
- coverage notes
- class routine template creation
- exam routine template creation

### 10.9 Admin Module
Features:

- admin dashboard
- total users
- indexed tasks
- verified users count
- role switching between user/admin
- recent task monitoring
- admin task deletion

Important routes:

- `/api/admin/overview`
- `/api/admin/users/[id]/role`
- `/api/admin/tasks/[id]`

## 11. Database Design

### 11.1 User Collection
Model: `User`

Fields:

- `_id`
- `name`
- `email`
- `password`
- `role`
- `otp`
- `otpExpiry`
- `isVerified`
- `createdAt`
- `updatedAt`

Purpose:

- stores registered users
- stores hashed password
- stores temporary OTP and verification state
- supports role-based access

### 11.2 Task Collection
Model: `Task`

Fields:

- `_id`
- `publicId`
- `userId`
- `title`
- `subject`
- `type`
- `priority`
- `status`
- `estimatedMinutes`
- `deadline`
- `scheduledDate`
- `effort`
- `notes`
- `links`
- `subtasks[]`
- `syllabus`
- `sessions[]`
- `recurring`
- `completedAt`
- `createdAt`
- `updatedAt`

#### Embedded Subtask Structure
- `id`
- `text`
- `done`

#### Embedded Focus Session Structure
- `startedAt`
- `endedAt`
- `durationMinutes`

#### Embedded Syllabus Structure
- `mode`
- `title`
- `examDate`
- `coverageNotes`
- `topics[]`

#### Embedded Syllabus Topic Structure
- `id`
- `text`
- `done`

#### Embedded Recurring Task Structure
- `frequency`
- `dayOfWeek`

## 12. Key Algorithms and Logic Used

### 12.1 Smart Recommendation Logic
The application ranks tasks using multiple factors:

- deadline urgency
- priority
- effort level
- in-progress status
- short task detection
- scheduled date proximity
- partial subtask completion

This logic is implemented in `src/utils/taskRanking.js`.

### 12.2 Study Intelligence Analytics
The analytics module calculates:

- planning health score
- risk labels
- overdue count
- due soon count
- unscheduled count
- high-priority backlog count
- completion rate
- focus hours logged
- average active task size
- weekly study forecast
- subject-wise workload distribution

This logic is implemented in `src/utils/analytics.js`.

### 12.3 Recurring Task Automation
Recurring tasks automatically create the next version of a task when:

- the current recurring task is completed
- or the system detects a missing recurring instance during task loading

This is implemented in `src/auth/utils/tasks.js`.

### 12.4 Authentication Logic
Authentication flow:

1. user registers with name, email, password
2. system generates OTP
3. OTP is sent by email using SMTP
4. user verifies OTP
5. JWT is issued and stored in HTTP-only cookie
6. authorized routes read cookie and validate session

## 13. Environment Variables Used
Current environment requirements:

- `JWT_SECRET`
- `NODE_ENV`
- `MONGODB_URI`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`
- `EMAIL_HOST`
- `EMAIL_PORT`
- `EMAIL_SECURE`
- `EMAIL_USER`
- `EMAIL_PASS`
- `EMAIL_FROM`

Note:
- `CLOUDINARY_*` variables exist in the sample environment, but Cloudinary is not part of the active current task workflow.
- `NEXTAUTH_*` variables exist, but the current project uses custom JWT + cookie auth instead of a full NextAuth implementation.

## 14. User Interface Features
- responsive layout
- light and dark theme support
- sidebar navigation
- keyboard shortcuts
- modal-based task creation/editing
- dashboard cards and analytics panels
- focus modal with timer
- filter toolbar with saved views

Keyboard shortcuts:

- `N` new task
- `/` search
- `T` today
- `B` board
- `O` overview
- `C` calendar
- `F` focus
- `Esc` close open modal

## 15. Major Project Features Summary
- user registration with OTP verification
- secure login/logout
- password change
- role-based admin access
- task CRUD
- subject-based organization
- priority and deadline tracking
- smart sorting and recommendations
- overview dashboard
- today dashboard
- Kanban board
- calendar view
- Pomodoro focus mode
- session logging
- recurring tasks
- saved filter views
- syllabus planning
- exam planning
- class routine creation
- exam routine creation
- admin monitoring dashboard

## 16. Non-Functional Characteristics
- modular code structure
- readable component-based UI
- persistent session management
- database-backed storage
- responsive design
- reusable hooks and utilities
- scalable document structure for future feature expansion

## 17. Limitations of Current Version
- no push or browser notifications yet
- no collaboration or group study sharing
- no chart library-based visual graphs yet
- no attendance or marks integration
- no offline sync support
- no file upload workflow in active use
- some legacy files from older backend experiments are still present in the repository but not part of the active main app flow

## 18. Future Scope
- AI-based schedule generation
- overload prediction
- attendance tracking
- marks/GPA tracking
- exam timetable auto-generation
- browser/email reminders
- group project collaboration
- file attachments and notes repository
- visual charts and exportable reports
- mobile app version

## 19. Why This Project Is Final-Year Level
This project goes beyond simple CRUD because it combines:

- secure authentication
- full-stack integration
- database design
- academic workflow design
- recommendation logic
- analytics
- routine and syllabus planning
- admin management
- productivity tracking

It is not only a task manager, but a student productivity and academic planning system.

## 20. Suggested Synopsis Abstract
Smart Study Planner is a full-stack web application developed to improve student productivity, academic planning, and study consistency. The system enables students to manage assignments, projects, exams, routines, and syllabus coverage through an integrated dashboard, Kanban board, calendar view, and focus timer. It includes secure OTP-based authentication, JWT session management, MongoDB-based data storage, recurring task automation, and subject-wise planning. The application also provides study intelligence features such as smart task recommendations, planning health insights, workload forecasting, and subject-level analysis. An admin module is included for role management and task monitoring. The project demonstrates the practical use of modern web technologies to solve real academic planning problems in a structured, scalable, and user-friendly way.

## 21. Suggested Software/Hardware Requirements

### Software Requirements
- Windows / Linux / macOS
- Node.js
- npm
- MongoDB Atlas account or MongoDB server
- Modern browser
- Code editor such as VS Code

### Hardware Requirements
- minimum 4 GB RAM
- dual-core processor or above
- stable internet connection

## 22. Suggested Viva/Presentation Line
Smart Study Planner is an intelligent academic management platform that combines task tracking, syllabus planning, study routines, focus monitoring, and analytics into one secure system for students and administrators.
