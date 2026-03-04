# Learning Management System (LMS) Platform

A full-stack web application built with React.js (frontend) and Node.js/Express (backend) where students can browse courses, enroll, and watch lessons delivered through embedded YouTube videos.

## 🚀 Features

### Student Features
- Browse and search available courses
- Enroll in courses with one click
- Watch video lessons via YouTube embeds
- Track learning progress with percentage indicators
- Resume from last watched lesson
- Mark lessons as complete
- Navigate between lessons easily

### Course Structure
- Courses organized into sections
- Each section contains multiple lessons
- Lessons include title, order number, and YouTube URL
- Progress tracking per lesson

### Technical Features
- JWT-based authentication
- Role-based access control (Student/Instructor/Admin)
- RESTful API architecture
- Responsive UI design
- Real-time progress tracking
- Protected routes

## 📁 Project Structure

```
LMS/
├── backend/
│   ├── config/
│   │   └── database.js           # MySQL connection & schema initialization
│   ├── controllers/
│   │   ├── authController.js     # Authentication logic
│   │   ├── courseController.js   # Course management
│   │   ├── enrollmentController.js
│   │   └── progressController.js
│   ├── middleware/
│   │   ├── auth.js               # JWT verification
│   │   └── roleCheck.js          # Role-based access
│   ├── models/
│   │   ├── User.js
│   │   ├── Course.js
│   │   ├── Section.js
│   │   ├── Lesson.js
│   │   ├── Enrollment.js
│   │   └── Progress.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── courses.js
│   │   ├── enrollments.js
│   │   └── progress.js
│   ├── seeds/
│   │   └── seed.js               # Database seeding script
│   ├── .env                      # Environment variables
│   ├── server.js                 # Main entry point
│   └── setup-db.js               # Database setup utility
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── CourseCard.jsx
    │   │   ├── VideoPlayer.jsx
    │   │   └── PrivateRoute.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx   # Authentication state management
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── Signup.jsx
    │   │   ├── Dashboard.jsx
    │   │   ├── Courses.jsx
    │   │   ├── CourseDetails.jsx
    │   │   └── LearningPage.jsx
    │   ├── services/
    │   │   └── api.js            # API service layer
    │   ├── App.jsx               # Main app with routing
    │   └── index.css             # Global styles
    └── package.json
```

## 🛠️ Tech Stack

### Frontend
- **React.js** - UI library
- **React Router** - Navigation
- **Axios** - HTTP client
- **CSS3** - Styling

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **MySQL** - Database (Aiven cloud)
- **JWT** - Authentication
- **bcryptjs** - Password hashing

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Access to Aiven MySQL database (credentials provided)

## 🔧 Installation & Setup

### 1. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Configure environment variables
# The .env file is already configured with your Aiven database credentials

# Initialize database schema (optional - it auto-initializes on first run)
node setup-db.js

# Seed the database with sample data
npm run seed

# Start the backend server
npm run dev
```

The backend will start on `http://localhost:5000`

### 2. Frontend Setup

Open a new terminal:

```bash
cd frontend

# Install dependencies (already done during creation)
npm install

# Start the development server
npm run dev
```

The frontend will start on `http://localhost:5173`

## 👤 Demo Credentials

After running the seed script, you can login with:

**Student Account:**
- Email: `student@lms.com`
- Password: `password123`

**Instructor Account:**
- Email: `instructor@lms.com`
- Password: `password123`

**Admin Account:**
- Email: `admin@lms.com`
- Password: `password123`

## 📚 Sample Data

The seed script creates:
- 3 users (1 student, 1 instructor, 1 admin)
- 3 courses (Java, Web Development, Python)
- 5 sections across all courses
- 15 lessons with YouTube URLs
- 2 sample enrollments
- 3 progress records

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile

### Courses
- `GET /api/courses` - Get all courses
- `GET /api/courses/:id` - Get course details with sections & lessons
- `POST /api/courses` - Create course (instructor/admin only)
- `PUT /api/courses/:id` - Update course
- `DELETE /api/courses/:id` - Delete course

### Enrollments
- `POST /api/enrollments/:courseId/enroll` - Enroll in course
- `GET /api/enrollments/my-courses` - Get enrolled courses
- `GET /api/enrollments/course/:courseId/status` - Check enrollment status

### Progress
- `POST /api/progress/lesson/complete` - Mark lesson as complete
- `GET /api/progress/:courseId` - Get course progress
- `GET /api/progress/:courseId/percentage` - Get progress percentage
- `GET /api/progress/:courseId/last-watched` - Get last watched lesson

## 🎯 How It Works

### Student Workflow

1. **Login/Signup**: Student creates account or logs in
2. **Browse Courses**: View all available courses on the platform
3. **View Details**: Click on a course to see full details, sections, and lessons
4. **Enroll**: Click "Enroll Now" button to enroll in a course
5. **Start Learning**: Automatically redirected to the learning page
6. **Watch Videos**: YouTube videos are embedded using iframe
7. **Track Progress**: Mark lessons as complete, see progress percentage
8. **Navigate**: Use Previous/Next buttons to navigate between lessons
9. **Resume**: System remembers last watched lesson

### Progress Tracking Flow

When a student marks a lesson as complete:
1. Frontend sends POST request to `/api/progress/lesson/complete`
2. Backend stores completion in `progress` table with `user_id`, `course_id`, `lesson_id`
3. Progress percentage calculated: `(completed_lessons / total_lessons) * 100`
4. Frontend updates progress bar and completed count
5. Auto-advances to next lesson

## 🗄️ Database Schema

### Tables Created

**users** - User accounts with roles
**courses** - Course information
**sections** - Course sections/modules
**lessons** - Individual lessons with YouTube URLs
**enrollments** - Student-course enrollments
**progress** - Lesson completion tracking

All tables are automatically created when you run the backend for the first time or execute `node setup-db.js`.

## 🎨 UI Components

### Key Pages

1. **Login/Signup**: Clean authentication forms
2. **Dashboard**: Shows enrolled courses and quick stats
3. **Courses Page**: Grid of available courses with filters
4. **Course Details**: Full course information with syllabus
5. **Learning Page**: Video player with lesson sidebar and progress tracking

### Responsive Design

All pages are responsive and work on:
- Desktop (1920px+)
- Laptop (1024px - 1919px)
- Tablet (768px - 1023px)
- Mobile (< 768px)

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token authentication
- Token expiration (7 days)
- Role-based access control
- Protected API routes
- Input validation
- SQL injection prevention

## 🐛 Troubleshooting

### Database Connection Issues

If you see connection errors:
1. Check your internet connection
2. Verify Aiven database credentials in `.env`
3. Ensure SSL is enabled for Aiven connection
4. Run `node setup-db.js` to test connection

### Frontend Not Connecting to Backend

1. Ensure backend is running on port 5000
2. Check CORS settings in `server.js`
3. Verify API base URL in `frontend/src/services/api.js`

### Port Already in Use

Backend: Change `PORT` in `.env` file
Frontend: Vite will automatically use next available port

## 📝 Notes

- Videos are not stored locally; only YouTube URLs are used
- YouTube videos are embedded via iframe
- All passwords in seed data are hashed
- The system supports manual entry of YouTube URLs from your Excel file

## 🚀 Next Steps

To add your actual YouTube video URLs:

1. Manually insert into database using MySQL client
2. Or build an admin interface for course management
3. Update the seed file with your actual YouTube URLs

## 📞 Support

For issues or questions, check:
- Backend logs in terminal
- Browser console for frontend errors
- Network tab in browser DevTools for API calls

---

**Built with ❤️ using React, Node.js, Express, and MySQL**
