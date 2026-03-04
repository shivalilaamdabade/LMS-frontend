import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { coursesAPI, enrollmentsAPI } from '../services/api';
import CourseCard from '../components/CourseCard';
import './Courses.css';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [enrolledCourseIds, setEnrolledCourseIds] = useState(new Set());
  const navigate = useNavigate();

  useEffect(() => {
    fetchCourses();
    fetchEnrolledCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await coursesAPI.getAll();
      setCourses(response.data.data || []);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching courses:', err);
      setError('Failed to load courses');
      setLoading(false);
    }
  };

  const fetchEnrolledCourses = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await enrollmentsAPI.getMyCourses();
      const enrolledIds = new Set(response.data.data.map(c => c.course_id));
      setEnrolledCourseIds(enrolledIds);
    } catch (err) {
      // User might not be logged in, that's okay
      console.log('Not logged in or error fetching enrollments');
    }
  };

  const handleEnroll = async (courseId) => {
    try {
      const confirmEnroll = window.confirm('Are you sure you want to enroll in this course?');
      if (!confirmEnroll) return;

      await enrollmentsAPI.enroll(courseId);
      
      setEnrolledCourseIds(prev => new Set([...prev, courseId]));
      alert('Successfully enrolled in the course!');
      
      // Navigate to the course page
      navigate(`/course/${courseId}`);
    } catch (err) {
      console.error('Enrollment error:', err);
      alert(err.response?.data?.message || 'Failed to enroll. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="courses-container">
        <div className="loading">Loading courses...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="courses-container">
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
    <div className="courses-page">
      <header className="courses-header">
        <h1>Explore Courses</h1>
        <p>Discover new skills and advance your career</p>
      </header>

      <div className="courses-grid">
        {courses.length === 0 ? (
          <div className="no-courses">
            <p>No courses available at the moment.</p>
          </div>
        ) : (
          courses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              onEnroll={handleEnroll}
              isEnrolled={enrolledCourseIds.has(course.id)}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Courses;
