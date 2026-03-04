import './CourseCard.css';

const CourseCard = ({ course, onEnroll, isEnrolled }) => {
  const truncateDescription = (text, maxLength) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div className="course-card">
      <div className="course-image">
        <img 
          src={course.thumbnail_url || 'https://via.placeholder.com/400x250?text=No+Image'} 
          alt={course.title}
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/400x250?text=No+Image';
          }}
        />
      </div>
      
      <div className="course-content">
        <h3 className="course-title">{course.title}</h3>
        
        <p className="course-instructor">
          By {course.instructor_name || 'Instructor'}
        </p>
        
        <p className="course-description">
          {truncateDescription(course.description, 120)}
        </p>
        
        <div className="course-meta">
          <span className="course-category">{course.category || 'General'}</span>
        </div>
        
        <button 
          className={`btn-enroll ${isEnrolled ? 'enrolled' : ''}`}
          onClick={() => onEnroll && onEnroll(course.id)}
          disabled={isEnrolled}
        >
          {isEnrolled ? '✓ Enrolled' : 'Enroll Now'}
        </button>
      </div>
    </div>
  );
};

export default CourseCard;
