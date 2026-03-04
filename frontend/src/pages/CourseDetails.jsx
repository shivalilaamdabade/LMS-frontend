import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { coursesAPI, enrollmentsAPI } from '../services/api';
import './CourseDetails.css';

const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrollmentId, setEnrollmentId] = useState(null);

  useEffect(() => {
    fetchCourseDetails();
    checkEnrollment();
  }, [id]);

  const fetchCourseDetails = async () => {
    try {
      const response = await coursesAPI.getById(id);
      setCourse(response.data.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching course:', err);
      setError('Failed to load course details');
      setLoading(false);
    }
  };

  const checkEnrollment = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await enrollmentsAPI.checkStatus(id);
      if (response.data.data.isEnrolled) {
        setIsEnrolled(true);
        setEnrollmentId(response.data.data.enrollment?.id);
      }
    } catch (err) {
      console.log('Not enrolled or error checking status');
    }
  };

  const handleEnroll = async () => {
    try {
      await enrollmentsAPI.enroll(id);
      setIsEnrolled(true);
      alert('Successfully enrolled! Starting the course...');
      navigate(`/learn/${id}`);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to enroll');
    }
  };

  if (loading) {
    return <div className="loading">Loading course details...</div>;
  }

  if (error || !course) {
    return (
      <div className="error-container">
        <h2>{error || 'Course not found'}</h2>
        <Link to="/courses" className="btn-back">← Back to Courses</Link>
      </div>
    );
  }

  const totalLessons = course.sections?.reduce((acc, section) => acc + (section.lessons?.length || 0), 0) || 0;

  return (
    <div className="course-details-page">
      <div className="course-hero">
        <div className="course-hero-overlay">
          <div className="container">
            <h1>{course.title}</h1>
            <p className="course-description-large">{course.description}</p>
            <div className="course-meta-info">
              <span>👨‍🏫 {course.instructor_name}</span>
              <span>📚 {totalLessons} Lessons</span>
              <span>📖 {course.category}</span>
            </div>
            {!isEnrolled ? (
              <button className="btn-enroll-now" onClick={handleEnroll}>
                Enroll Now - Free
              </button>
            ) : (
              <button className="btn-continue" onClick={() => navigate(`/learn/${id}`)}>
                Continue Learning →
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="container course-content-section">
        <h2>What You'll Learn</h2>
        <div className="learning-outcomes">
          <ul>
            <li>Master fundamental concepts and advanced topics</li>
            <li>Hands-on practical examples and projects</li>
            <li>Learn at your own pace with video lessons</li>
            <li>Track your progress and earn completion certificate</li>
          </ul>
        </div>

        <h2>Course Content</h2>
        <div className="course-sections">
          {course.sections?.map((section, idx) => (
            <div key={section.id} className="section-item">
              <div className="section-header">
                <h3>Section {idx + 1}: {section.title}</h3>
                <span>{section.lessons?.length || 0} lessons</span>
              </div>
              <div className="section-lessons">
                {section.lessons?.map((lesson) => (
                  <div key={lesson.id} className="lesson-item">
                    <span>▶</span>
                    <span>{lesson.title}</span>
                    {lesson.duration && <span className="lesson-duration">{lesson.duration}</span>}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
