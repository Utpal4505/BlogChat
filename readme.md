# 📝 BlogChat

> A modern, feature-rich blogging platform with real-time chat, AI-powered tag generation, and social interactions.

[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
[![Node.js](https://img.shields.io/badge/Node.js-v18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19.1.1-blue.svg)](https://reactjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Latest-blue.svg)](https://www.postgresql.org/)

---

## 🌟 Overview

**BlogChat** is a full-stack blogging application that combines powerful content creation tools with social networking features. Built with modern technologies, it offers a seamless writing experience with rich text editing, AI-powered content analysis, real-time messaging, and comprehensive user interactions.

### ✨ Key Highlights

- 🎨 **Rich Text Editor** powered by TipTap with code highlighting
- 🤖 **AI-Powered Features** using Ollama for automatic tag generation
- 💬 **Real-time Messaging** between users
- 🔐 **Multiple Authentication** methods (Email/Password + Google OAuth)
- 📊 **Advanced Analytics** with user dashboard
- 🎯 **Social Features** including likes, comments, follows, and bookmarks
- 🐛 **Built-in Bug Reporting** with GitHub integration
- 📱 **Responsive Design** with Tailwind CSS v4
- ⚡ **Job Queue System** with BullMQ and Redis
- 🔒 **Security First** with Helmet, rate limiting, and sanitization

---

## 🏗️ Architecture

### Project Structure

```
BlogChat/
├── backend/                 # Node.js Express Backend
│   ├── config/             # Configuration files (DB, Passport, etc.)
│   ├── controllers/        # Request handlers
│   ├── middlewares/        # Custom middleware (auth, rate limiting)
│   ├── prisma/            # Database schema & migrations
│   ├── queue/             # BullMQ job queues
│   ├── routes/            # API route definitions
│   ├── service/           # Business logic layer
│   ├── utils/             # Helper functions
│   ├── workers/           # Background job processors
│   └── app.js             # Express app configuration
│
└── Frontend/               # React Frontend
    ├── components/         # Reusable UI components
    ├── context/           # React Context providers
    ├── hooks/             # Custom React hooks
    ├── pages/             # Page components
    ├── src/               # Main application code
    ├── utils/             # Frontend utilities
    └── public/            # Static assets
```

---

## 🛠️ Tech Stack

### Backend

| Technology | Purpose |
|-----------|---------|
| **Node.js** + **Express** | Server framework |
| **PostgreSQL** | Primary database |
| **Prisma ORM** | Database management |
| **Redis** + **BullMQ** | Job queue & caching |
| **Passport.js** | Authentication (Google OAuth) |
| **JWT** | Token-based auth |
| **Bcrypt** | Password hashing |
| **Cloudinary** | Image uploads |
| **Ollama** | Local AI for tag generation |
| **Nodemailer** + **Resend** | Email services |
| **Helmet** | Security headers |
| **Express Rate Limit** | API rate limiting |

### Frontend

| Technology | Purpose |
|-----------|---------|
| **React 19** | UI library |
| **Vite** | Build tool |
| **Tailwind CSS v4** | Styling |
| **TipTap** | Rich text editor |
| **Framer Motion** | Animations |
| **React Router v7** | Routing |
| **Axios** | HTTP client |
| **React Hot Toast** | Notifications |
| **Lucide React** | Icons |
| **Highlight.js** | Code syntax highlighting |

---

## 🚀 Features

### Content Management
- ✍️ **Rich Text Editor** with formatting, tables, images, code blocks
- 📷 **Image Upload** to Cloudinary
- 🏷️ **AI-Powered Auto-Tagging** using Ollama
- 📝 **Draft System** with publish/unpublish
- 🔍 **Advanced Search** functionality
- 🔖 **Bookmarks** to save favorite posts
- 👁️ **Public/Private** post visibility

### User Features
- 👤 **User Profiles** with bio, avatar, and customization
- ✉️ **Email Verification** with OTP
- 🔑 **Password Reset** flow
- 🌐 **Google OAuth** integration
- 👥 **Follow System** 
- 💬 **Direct Messaging** between users
- 🔔 **Notifications** for likes, comments, follows
- 🎨 **Onboarding Flow** for new users

### Social Interactions
- ❤️ **Like Posts** with count tracking
- 💭 **Comments** with real-time updates
- 📤 **Share** posts
- 👥 **User Mentions** and interactions

### Admin & Moderation
- 🐛 **Bug Report System** with GitHub Issues integration
- 📊 **User Feedback** collection with mood tracking
- 🚨 **Automated Bug Reports** with console error capture
- 🔧 **Verification Scoring** for bug reports

### Developer Experience
- 🔄 **Database Seeding** with Faker.js
- 📋 **Comprehensive API** with RESTful design
- 🎯 **Error Handling** middleware
- 🛡️ **Input Sanitization** with sanitize-html
- ⚡ **Background Jobs** for heavy operations
- 🔐 **CORS** configuration
- 📝 **Type Safety** with Prisma

---

## 📋 Prerequisites

Before running this project, ensure you have:

- **Node.js** v18 or higher
- **PostgreSQL** database
- **Redis** server (for job queues)
- **Cloudinary** account (for image uploads)
- **Google OAuth** credentials (optional, for social login)
- **Ollama** installed locally (for AI features)

---

## ⚙️ Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd BlogChat
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Configure your .env file with:
# - DATABASE_URL (PostgreSQL connection string)
# - JWT_SECRET
# - REDIS_HOST, REDIS_PORT
# - CLOUDINARY credentials
# - GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET
# - EMAIL service credentials
# - CORS_ORIGIN

# Run Prisma migrations
npx prisma migrate dev

# Seed the database (optional)
npm run seed

# Start the development server
npm run dev
```

The backend will run on `http://localhost:3000` (or your configured port).

### 3. Frontend Setup

```bash
cd Frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Configure your .env file with:
# - VITE_API_URL (Backend API URL)
# - VITE_GOOGLE_CLIENT_ID
# - Other frontend-specific variables

# Start the development server
npm run dev
```

The frontend will run on `http://localhost:5173`.

### 4. Start Redis (Required for Job Queues)

```bash
# Using Docker
docker run -d -p 6379:6379 redis

# Or install Redis locally
redis-server
```

### 5. Start Ollama (Required for AI Features)

```bash
# Install Ollama from https://ollama.ai
# Pull a model
ollama pull llama2

# Start Ollama service
ollama serve
```

---

## 🎯 Available Scripts

### Backend

| Command | Description |
|---------|-------------|
| `npm start` | Start production server |
| `npm run dev` | Start development server with nodemon |
| `npm run seed` | Seed database with sample data |
| `npx prisma studio` | Open Prisma Studio (DB GUI) |
| `npx prisma migrate dev` | Create and apply migrations |

### Frontend

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

---

## 📡 API Endpoints

### Authentication
- `POST /api/v1/users/register` - Register new user
- `POST /api/v1/users/login` - Login user
- `POST /api/v1/users/logout` - Logout user
- `POST /api/v1/users/verify-email` - Verify email with OTP
- `GET /api/v1/auth/google` - Google OAuth login
- `GET /api/v1/auth/google/callback` - Google OAuth callback

### Posts
- `GET /api/v1/posts` - Get all posts
- `GET /api/v1/posts/:slug` - Get single post
- `POST /api/v1/posts` - Create new post
- `PATCH /api/v1/posts/:id` - Update post
- `DELETE /api/v1/posts/:id` - Delete post
- `POST /api/v1/posts/:id/like` - Like/unlike post
- `POST /api/v1/posts/:id/comment` - Add comment
- `POST /api/v1/posts/:id/bookmark` - Bookmark post

### Users
- `GET /api/v1/users/profile/:username` - Get user profile
- `PATCH /api/v1/users/profile` - Update profile
- `POST /api/v1/users/follow/:userId` - Follow/unfollow user
- `GET /api/v1/users/followers` - Get followers
- `GET /api/v1/users/following` - Get following

### Bug Reports & Feedback
- `POST /api/v1/report-bug` - Submit bug report
- `POST /api/v1/feedback` - Submit feedback

### File Upload
- `POST /api/v1/upload-file` - Upload image to Cloudinary

---

## 🗄️ Database Schema

The application uses PostgreSQL with Prisma ORM. Key models include:

- **User** - User accounts with OAuth support
- **Post** - Blog posts with tags and metadata
- **Comment** - Post comments
- **PostLike** - Post likes tracking
- **Follow** - User follow relationships
- **Message** - Direct messages between users
- **Notification** - User notifications
- **Tag** - Post tags
- **PostTag** - Many-to-many post-tag relationship
- **BookmarkPost** - User bookmarks
- **BugReport** - Bug reports with GitHub integration
- **Feedback** - User feedback submissions
- **Token** - Authentication tokens
- **EmailVerification** - Email verification OTPs

View the complete schema in `backend/prisma/schema.prisma`.

---

## 🔐 Environment Variables

### Backend (.env)

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/blogchat"

# Server
PORT=3000
CORS_ORIGIN="http://localhost:5173"

# JWT
JWT_SECRET="your-secret-key"
JWT_EXPIRES_IN="7d"

# Redis
REDIS_HOST="localhost"
REDIS_PORT=6379

# Cloudinary
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GOOGLE_CALLBACK_URL="http://localhost:3000/api/v1/auth/google/callback"

# Email
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT=587
EMAIL_USER="your-email@gmail.com"
EMAIL_PASSWORD="your-app-password"

# Ollama
OLLAMA_API_URL="http://localhost:11434"

# GitHub (for bug reports)
GITHUB_TOKEN="your-github-token"
GITHUB_REPO_OWNER="your-username"
GITHUB_REPO_NAME="your-repo"
```

### Frontend (.env)

```env
VITE_API_URL="http://localhost:3000/api/v1"
VITE_GOOGLE_CLIENT_ID="your-google-client-id"
```

---

## 🎨 Pages & Routes

### Frontend Pages

- **/** - Home/Dashboard with post feed
- **/login** - User login
- **/signup** - New user registration
- **/verify-email** - Email verification
- **/onboarding** - New user onboarding
- **/write** - Create/edit blog post
- **/post/:slug** - View single post
- **/profile/:username** - User profile
- **/settings** - User settings
- **/search** - Search results
- **/feedback** - Submit feedback
- **/report-bug** - Report a bug
- **/forgot-password** - Password reset request
- **/reset-password** - Password reset form

---

## 🔧 Background Jobs

The application uses BullMQ for handling background tasks:

- 🏷️ **Tag Generation** - AI-powered tag generation for posts
- 🐛 **Bug Report Processing** - Creating GitHub issues
- 📧 **Email Sending** - Verification and notification emails
- 🔔 **Notifications** - User notification delivery

---

## 🛡️ Security Features

- 🔒 **Helmet.js** for security headers
- 🚦 **Rate Limiting** on all API endpoints
- 🧹 **Input Sanitization** with sanitize-html
- 🔐 **Password Hashing** with bcrypt
- 🎫 **JWT Authentication** with secure cookies
- 🔑 **OAuth 2.0** with Google
- ✅ **Email Verification** required
- 🛑 **CORS** configuration
- 🔍 **SQL Injection Protection** via Prisma

---

## 📱 Responsive Design

The application is fully responsive and optimized for:
- 📱 Mobile devices (320px+)
- 📱 Tablets (768px+)
- 💻 Desktops (1024px+)
- 🖥️ Large screens (1440px+)

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 🐛 Bug Reports

Found a bug? Use the built-in bug reporting feature in the app or open an issue on GitHub.

---

## 📄 License

This project is licensed under the ISC License.

---

## 👨‍💻 Author

**Utpal**

---

## 🙏 Acknowledgments

- [Prisma](https://www.prisma.io/) for amazing ORM
- [TipTap](https://tiptap.dev/) for the rich text editor
- [Ollama](https://ollama.ai/) for local AI capabilities
- [Cloudinary](https://cloudinary.com/) for image hosting
- All open-source contributors

---

## 📞 Support

For support, email uk9507855135@gmail.com or join our community chat.

---

## 🔮 Future Enhancements

- [ ] Real-time collaborative editing
- [ ] Mobile apps (React Native)
- [ ] Advanced analytics dashboard
- [ ] Post scheduling
- [ ] Content recommendation engine
- [ ] Multi-language support
- [ ] Export posts to PDF/Markdown
- [ ] Integration with more OAuth providers
- [ ] WebSocket-based real-time features

---

<div align="center">

Made with ❤️ by Utpal

**[⬆ Back to Top](#-blogchat)**

</div>
