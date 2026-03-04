# LMS API Documentation

Base URL: `http://localhost:5000/api`

## Authentication Required

Most endpoints require authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer YOUR_JWT_TOKEN
```

---

## 🔐 Authentication Endpoints

### Register User
**POST** `/auth/register`

Register a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "student"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "student"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Login
**POST** `/auth/login`

Authenticate user and receive JWT token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "student"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Get Current User Profile
**GET** `/auth/me`

Get authenticated user's profile.

**Headers:** `Authorization: Bearer TOKEN`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student",
    "created_at": "2026-03-03T12:00:00.000Z"
  }
}
```

---

## 📚 Courses Endpoints

### Get All Courses
**GET** `/courses`

Retrieve all available courses.

**Response:**
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "id": 1,
      "title": "Complete Java Programming Masterclass",
      "description": "Learn Java from scratch...",
      "thumbnail_url": "https://...",
      "category": "Programming",
      "instructor_name": "John Instructor",
      "created_at": "2026-03-03T12:00:00.000Z"
    }
  ]
}
```

### Get Course Details
**GET** `/courses/:id`

Get detailed course information including sections and lessons.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Java Programming",
    "description": "...",
    "sections": [
      {
        "id": 1,
        "title": "Introduction to Java",
        "order_number": 1,
        "lessons": [
          {
            "id": 1,
            "title": "What is Java?",
            "youtube_url": "https://www.youtube.com/watch?v=...",
            "order_number": 1,
            "duration": "10:00"
          }
        ]
      }
    ]
  }
}
```

### Get Course Lessons
**GET** `/courses/:id/lessons`

Get all lessons for a specific course.

**Response:**
```json
{
  "success": true,
  "count": 15,
  "data": [
    {
      "id": 1,
      "title": "What is Java?",
      "youtube_url": "https://www.youtube.com/watch?v=...",
      "order_number": 1,
      "section_title": "Introduction to Java"
    }
  ]
}
```

### Create Course (Instructor/Admin Only)
**POST** `/courses`

Create a new course.

**Headers:** `Authorization: Bearer TOKEN`

**Request Body:**
```json
{
  "title": "Advanced React Patterns",
  "description": "Master advanced React concepts",
  "thumbnail_url": "https://...",
  "category": "Web Development"
}
```

---

## 📝 Enrollment Endpoints

### Enroll in Course
**POST** `/enrollments/:courseId/enroll`

Enroll the current user in a course.

**Headers:** `Authorization: Bearer TOKEN`

**Response:**
```json
{
  "success": true,
  "message": "Successfully enrolled in the course",
  "data": {
    "id": 1,
    "student_id": 2,
    "course_id": 1,
    "enrollment_date": "2026-03-03T12:00:00.000Z",
    "status": "active"
  }
}
```

### Get My Enrolled Courses
**GET** `/enrollments/my-courses`

Get all courses the current user is enrolled in.

**Headers:** `Authorization: Bearer TOKEN`

**Response:**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "id": 1,
      "student_id": 2,
      "course_id": 1,
      "title": "Java Programming",
      "description": "...",
      "thumbnail_url": "https://...",
      "category": "Programming",
      "instructor_name": "John Instructor",
      "enrollment_date": "2026-03-03T12:00:00.000Z",
      "status": "active"
    }
  ]
}
```

### Check Enrollment Status
**GET** `/enrollments/course/:courseId/status`

Check if user is enrolled in a specific course.

**Headers:** `Authorization: Bearer TOKEN`

**Response:**
```json
{
  "success": true,
  "data": {
    "isEnrolled": true,
    "enrollment": {
      "id": 1,
      "student_id": 2,
      "course_id": 1,
      "status": "active"
    }
  }
}
```

---

## 📊 Progress Tracking Endpoints

### Mark Lesson as Complete
**POST** `/progress/lesson/complete`

Mark a lesson as completed by the current user.

**Headers:** `Authorization: Bearer TOKEN`

**Request Body:**
```json
{
  "courseId": 1,
  "lessonId": 5
}
```

**Response:**
```json
{
  "success": true,
  "message": "Lesson marked as complete",
  "data": {
    "completed": true,
    "progressPercentage": 33
  }
}
```

### Get Course Progress
**GET** `/progress/:courseId`

Get detailed progress for a specific course.

**Headers:** `Authorization: Bearer TOKEN`

**Response:**
```json
{
  "success": true,
  "data": {
    "progress": [
      {
        "id": 1,
        "lesson_id": 1,
        "completed": true,
        "lesson_title": "What is Java?",
        "lesson_order": 1
      }
    ],
    "percentage": 33,
    "completedLessons": [1, 2, 3],
    "totalLessons": 9
  }
}
```

### Get Progress Percentage
**GET** `/progress/:courseId/percentage`

Get just the progress percentage for a course.

**Headers:** `Authorization: Bearer TOKEN`

**Response:**
```json
{
  "success": true,
  "data": {
    "percentage": 33
  }
}
```

### Get Last Watched Lesson
**GET** `/progress/:courseId/last-watched`

Get the last lesson the user watched.

**Headers:** `Authorization: Bearer TOKEN`

**Response:**
```json
{
  "success": true,
  "data": {
    "lesson_id": 3,
    "title": "Your First Java Program",
    "youtube_url": "https://www.youtube.com/watch?v=...",
    "order_number": 3,
    "last_watched_timestamp": "2026-03-03T14:30:00.000Z"
  }
}
```

### Update Progress
**PUT** `/progress/update`

Update progress for a lesson (partial completion).

**Headers:** `Authorization: Bearer TOKEN`

**Request Body:**
```json
{
  "courseId": 1,
  "lessonId": 5,
  "completed": false
}
```

---

## Error Responses

All endpoints return errors in this format:

```json
{
  "success": false,
  "message": "Error description here"
}
```

### Common HTTP Status Codes

- `200 OK` - Success
- `201 Created` - Resource created successfully
- `400 Bad Request` - Invalid input data
- `401 Unauthorized` - Missing or invalid token
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

---

## Example Usage with Fetch

### Login and Store Token
```javascript
const login = async (email, password) => {
  const response = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  });
  
  const data = await response.json();
  
  if (data.success) {
    localStorage.setItem('token', data.data.token);
    localStorage.setItem('user', JSON.stringify(data.data.user));
  }
  
  return data;
};
```

### Get Courses with Auth Token
```javascript
const getCourses = async () => {
  const token = localStorage.getItem('token');
  
  const response = await fetch('http://localhost:5000/api/courses', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  const data = await response.json();
  return data.data;
};
```

### Enroll in Course
```javascript
const enrollInCourse = async (courseId) => {
  const token = localStorage.getItem('token');
  
  const response = await fetch(`http://localhost:5000/api/enrollments/${courseId}/enroll`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  
  return await response.json();
};
```

---

## Rate Limiting

Currently, there are no rate limits implemented. In production, consider adding:
- Request throttling
- API key authentication for external services
- CORS restrictions

---

## Testing with Postman

1. Import this documentation into Postman
2. Create an environment variable `token` for JWT
3. Use pre-request scripts to automatically refresh tokens
4. Create collections for each endpoint group

---

**For more examples, check the frontend code in `frontend/src/services/api.js`**
