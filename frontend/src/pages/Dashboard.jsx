import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { enrollmentsAPI, progressAPI } from '../services/api';
import CourseCard from '../components/CourseCard';
import './Dashboard.css';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [myCourses, setMyCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyCourses();
  }, []);

  const fetchMyCourses = async () => {
    try {
      const response = await enrollmentsAPI.getMyCourses();
      setMyCourses(response.data.data || []);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching courses:', err);
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-page">
      <nav className="dashboard-nav">
        <div className="nav-content">
          <h1>LMS Platform</h1>
          <div className="nav-links">
            <Link to="/courses">Browse Courses</Link>
            <span className="user-info">
              👤 {user?.name} ({user?.role})
            </span>
            <button onClick={logout} className="btn-logout">Logout</button>
          </div>
        </div>
      </nav>

      <div className="dashboard-content">
        <header className="dashboard-header">
          <h2>Welcome back, {user?.name}! 👋</h2>
          <p>Continue your learning journey</p>
        </header>

        <section className="dashboard-section">
          <h3>My Enrolled Courses</h3>
          {loading ? (
            <div className="loading">Loading your courses...</div>
          ) : myCourses.length === 0 ? (
            <div className="no-courses">
              <p>You haven't enrolled in any courses yet.</p>
              <Link to="/courses" className="btn-browse">Browse Available Courses →</Link>
            </div>
          ) : (
            <div className="courses-grid">
              {myCourses.map((enrollment) => (
                <Link 
                  key={enrollment.id} 
                  to={`/learn/${enrollment.course_id}`}
                  className="course-link"
                >
                  <CourseCard 
                    course={{
                      id: enrollment.course_id,
                      title: enrollment.title,
                      description: enrollment.description,
                      thumbnail_url: enrollment.thumbnail_url,
                      category: enrollment.category,
                      instructor_name: enrollment.instructor_name
                    }}
                    isEnrolled={true}
                  />
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
