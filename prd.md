# Project Overview

**BlogChat** is a personal/social blog platform combining traditional blogging with social features and real-time chat.  
Built by a solo developer as a long-term learning project for personal use and close friends. Users can create and read blog posts, comment and “like” posts, follow others to curate feeds, and receive in-app notifications. An integrated 1:1 chat feature enables direct messaging between users.

Tech stack: **React** (frontend), **Node.js + Express** (backend API), **PostgreSQL** (relational database). Development is phase-wise, starting with an MVP focused on core blogging + social features, and iterating on advanced functionality.

---

## Goals

### Learning Objectives
- Deepen full-stack skills: React (components, hooks, state), Node/Express (REST APIs), PostgreSQL (schema, queries).
- Practice security & engineering best practices (password hashing like bcrypt/Argon2id, parameterized queries to prevent SQL injection, modular code, RESTful design).
- Learn deployment, testing, and observability practices.

### Feature-Oriented Goals
Deliver a functional social blogging platform with:
- **Blog posts**: create, edit, publish, view, delete.
- **Comments & likes**: comment on posts; like/unlike posts.
- **Follow system**: follow/unfollow users; produce personalized feeds.
- **Notifications**: in-app alerts for followers, comments, likes.
- **1:1 chat**: real-time private messaging via WebSockets.
- **Auth & Authorization**: secure signup/login, session management (JWT or httpOnly cookies), role access (user/admin).

---

## Target Audience
- Initial users: the developer and a small circle of friends.  
- Audience profile: tech-savvy individuals who value a simple, clean blog interface with social interactions. Focus on usability and reliability for a small user base while keeping the system maintainable and extensible.

---

## Functional Requirements

> Organized into two phases: **MVP (Phase 1)** and **Phase 2 (Enhanced Features)**

### MVP (Phase 1 — Core Functionality)

**User Registration & Authentication**
- Register with unique username + email + password (store hashed).
- Login/logout; issue JWTs for protected routes.

**User Profiles**
- Profile: username, display name, bio, avatar.
- Users can view/edit their own profile.

**Blog Posts**
- Authenticated users can create posts (title, content, optional image or Markdown), edit/delete their posts.
- Post detail shows author, timestamp, like/comment counts.
- Public feed lists recent posts (sorted by date) — later personalized by follows.

**Comments**
- Logged-in users can add, edit, delete comments.
- Comments show author, content, timestamp.

**Likes**
- Users can like/unlike posts; like count updates (real-time preferred).

**Follow System**
- Follow/unfollow users; profile shows followers/following counts.

**Notifications (basic)**
- Notify on new comments, likes, and new followers (in-app bell icon).

**User Feed**
- Default: global feed of recent posts (Phase 2: followed-users feed).

All features must function end-to-end with a React frontend calling Express REST endpoints and data persisted in PostgreSQL. Implement input validation and consistent error handling.

### Phase 2 (Enhanced Features)
- Real-time push notifications (WebSockets/SSE).
- 1:1 private chat with history stored in DB (WebSockets, e.g. Socket.IO).
- Personalized feed (followed users only).
- Profile enrichment, privacy settings.
- Media embedding (images/videos), rich text/Markdown editor.
- Likes on comments, lists of likers, simple search.
- Admin moderation, basic analytics, CI/CD, Dockerized deployment.

---

## User Stories (examples)

**Authentication & Profile**
- *As a visitor, I want to register so I can use BlogChat.*
- *As a user, I want to log in securely so I can access my account.*
- *As a user, I want to edit my profile (bio/avatar) so I can customize my presence.*

**Blog Posts**
- *As a logged-in user, I want to create posts so I can share content.*
- *As an author, I want to edit/delete my posts.*
- *As a reader, I want to browse posts in a feed.*

**Comments & Likes**
- *As a reader, I want to comment on posts.*
- *As a user, I want to like/unlike posts.*

**Follow & Notifications**
- *As a user, I want to follow others to see their posts in my feed.*
- *As an author, I want notifications when my posts receive engagement.*

**Chat (Phase 2)**
- *As a user, I want private chat so I can message friends in real time.*

Each user story should later include acceptance criteria (e.g., “A user can only delete their own posts”, “Notifications marked read after viewing”).

---

## Technical Requirements

### Technology Stack
- **Frontend:** React (functional components + hooks)
- **Backend:** Node.js + Express (REST API)
- **Database:** PostgreSQL
- Optional: Redis for caching, WebSockets (Socket.IO) for realtime

### Architecture
- 3-tier: **React SPA** ⇄ **Express REST API** ⇄ **PostgreSQL**
- Backend: MVC-style separation — routes → controllers → services → models
- Start monolithic; keep code modular so components can be split later.

### Frontend Guidelines
- Use Context API or Redux for global state (auth, notifications).
- Responsive UI (mobile & desktop). Use a CSS framework or custom responsive styles.
- Pages: Home feed, Profile, Post detail, Create/Edit post, Chat, Notifications, Settings.
- Use React Router for navigation; axios or fetch for HTTP calls.
- Show loading states and friendly error messages.

## API Endpoints

| Method | Endpoint                       | Description |
|--------|--------------------------------|-------------|
| POST   | /auth/register                 | Register a new user account with username, email, and password |
| POST   | /auth/login                    | Log in a user and return a JWT for authentication |
| POST   | /auth/logout                   | Log out the user (invalidate token if stored server-side) |
| GET    | /users/:id                     | Get a user's profile information by ID |
| PUT    | /users/:id                     | Update a user's profile (bio, avatar, etc.) |
| POST   | /posts                         | Create a new blog post (title, content, optional media) |
| GET    | /posts                         | List all posts (pagination or filters optional) |
| GET    | /posts/:id                     | Retrieve a single post by ID, including comments and likes |
| PUT    | /posts/:id                     | Update a post (only by the author) |
| DELETE | /posts/:id                     | Delete a post (only by the author) |
| POST   | /posts/:id/comments            | Add a comment to a post |
| PUT    | /comments/:id                  | Edit a comment (only by the commenter) |
| DELETE | /comments/:id                  | Delete a comment (only by the commenter) |
| POST   | /posts/:id/like                | Like a post |
| DELETE | /posts/:id/like                | Unlike a post |
| POST   | /users/:id/follow              | Follow a user |
| DELETE | /users/:id/follow              | Unfollow a user |
| GET    | /notifications                 | Retrieve all notifications for the logged-in user |
| PUT    | /notifications/:id/read        | Mark a notification as read |
| WS     | /chat                          | WebSocket endpoint for real-time 1:1 chat (Phase 2) |


Use JWTs for stateless auth (validate tokens in middleware) or HTTP-only cookies if preferred.

### Database (PostgreSQL) — example schema ideas
**Tables**
- `users` (id, username, password_hash, email, bio, avatar_url, created_at)
- `posts` (id, author_id, title, content, created_at)
- `comments` (id, post_id, author_id, content, created_at)
- `likes` (id, post_id, user_id, created_at)
- `follows` (id, follower_id, followed_id, created_at)
- `notifications` (id, user_id, type, source_id, read_flag, created_at)
- `messages` (id, sender_id, receiver_id, content, created_at)

Use foreign keys, appropriate data types (TEXT, TIMESTAMP), and indexes on frequently queried columns (username, posts.created_at). Prefer parameterized queries or an ORM (Sequelize / Prisma / Knex).

**Design note:** don’t persist derived counters (likes/followers); compute via joins or use incremental aggregation/caching when needed.

---

## Authentication & Security
- Hash passwords using bcrypt or Argon2id; never store plaintext.
- Use HTTPS/TLS in production.
- Prevent SQL injection via parameterized queries/prepared statements.
- Sanitize/escape user-generated content to prevent XSS.
- Enforce authorization rules: users modify only their own resources.
- Use Helmet for secure headers, rate limiting on login endpoints, and proper CORS config.
- Store secrets in environment variables (never commit `.env`).

---

## API & Data Access
- Prefer ORM/query builder (Prisma, Sequelize, Knex) for migrations and safer queries.
- Keep API responses consistent (JSON + clear status codes).
- Document endpoints in the PRD or an internal API spec for maintainability.

---

## Real-time (WebSockets)
- Use Socket.IO or `ws` for chat and live notifications.
- Persist chat messages to the DB for history.
- Broadcast messages only to relevant clients (use namespaces/rooms).
- For initial small scale, a single server is fine; design with later horizontal scaling in mind.

---

## Development Practices
- Git with feature branches; frequent meaningful commits.
- Linting (ESLint) + formatting (Prettier).
- Unit tests for critical logic; integration tests for API endpoints.
- Use environment variables for config (DB URL, JWT secret).
- CI pipeline for tests and linting; consider Docker for reproducible environments.

---

## Non-Functional Requirements

**Performance**
- Pages should feel responsive (goal: <1–2s for small user base).
- WebSocket latency minimal (ideally <100ms).

**Scalability**
- Design DB & APIs to scale to hundreds/thousands of posts/users.
- Stateless API servers (JWT) to allow adding instances.

**Security**
- Protect user data; enforce hashing and input validation.

**Reliability & Availability**
- Robust error handling, retries for transient failures, DB backups, basic health checks.

**Usability**
- Clean, intuitive, mobile-friendly UI with form validation and helpful feedback.

**Maintainability**
- Modular code, good docs, README with setup steps.

**Portability**
- Support containerized deployment (Docker) and environment-based config for portability across hosts.

---

## Assumptions & Constraints
- **Solo developer**: limited time and bandwidth — focus on clarity and achievable milestones.
- **User base**: small initially (~personal + friends).
- **Budget**: minimal — prefer free tiers and OSS libraries.
- **Fixed tech choices**: React, Node (Express), PostgreSQL.
- **Third-party integrations** limited to basic services (SMTP, cloud storage).
- **Legal/compliance** out of scope for initial MVP.

---

## Optional Future Features
- Social Login (Google/GitHub OAuth)
- Group chat / channels
- Hashtags / categories
- Media galleries (albums/videos)
- Advanced feed ranking (trending/most liked)
- Offline / PWA support
- Mobile app (React Native / Electron)
- Full-text search (Elasticsearch / Postgres full-text)
- Dark mode
- Analytics dashboard

---

## Final note
Prioritize shipping a small, working MVP. Iterate based on feedback and gradually add Phase 2 features. Keep features small, testable, and well-documented so the project remains maintainable and you stay in learning flow.