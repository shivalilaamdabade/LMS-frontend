import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { coursesAPI, progressAPI } from '../services/api';
import VideoPlayer from '../components/VideoPlayer';
import './LearningPage.css';

const LearningPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [completedLessons, setCompletedLessons] = useState(new Set());
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCourseData();
    loadProgress();
  }, [courseId]);

  const loadCourseData = async () => {
    try {
      const response = await coursesAPI.getById(courseId);
      const courseData = response.data.data;
      setCourse(courseData);

      // Set first lesson as current if available
      const allLessons = courseData.sections?.flatMap(s => s.lessons || []) || [];
      if (allLessons.length > 0 && !currentLesson) {
        setCurrentLesson(allLessons[0]);
      }
      setLoading(false);
    } catch (err) {
      console.error('Error loading course:', err);
      setLoading(false);
    }
  };

  const loadProgress = async () => {
    try {
      const response = await progressAPI.getCourseProgress(courseId);
      const completedIds = new Set(response.data.data.completedLessons);
      setCompletedLessons(completedIds);
      setProgress(response.data.data.percentage);

      // Load last watched lesson
      if (response.data.data.progress?.length > 0) {
        const lastWatched = await progressAPI.getLastWatched(courseId);
        if (lastWatched.data.data) {
          const allLessons = course?.sections?.flatMap(s => s.lessons || []) || [];
          const lesson = allLessons.find(l => l.id === lastWatched.data.data.lesson_id);
          if (lesson) setCurrentLesson(lesson);
        }
      }
    } catch (err) {
      console.log('No progress yet');
    }
  };

  const handleLessonChange = (lesson) => {
    setCurrentLesson(lesson);
  };

  const handleMarkComplete = async () => {
    if (!currentLesson) return;

    try {
      await progressAPI.markComplete(courseId, currentLesson.id);
      setCompletedLessons(prev => new Set([...prev, currentLesson.id]));
      
      // Update progress
      const response = await progressAPI.getProgressPercentage(courseId);
      setProgress(response.data.data.percentage);
      
      // Auto-advance to next lesson
      advanceToNextLesson();
    } catch (err) {
      alert('Failed to mark complete');
    }
  };

  const advanceToNextLesson = () => {
    const allLessons = course.sections?.flatMap(s => s.lessons || []) || [];
    const currentIndex = allLessons.findIndex(l => l.id === currentLesson?.id);
    if (currentIndex < allLessons.length - 1) {
      setCurrentLesson(allLessons[currentIndex + 1]);
    }
  };

  const goToPreviousLesson = () => {
    const allLessons = course.sections?.flatMap(s => s.lessons || []) || [];
    const currentIndex = allLessons.findIndex(l => l.id === currentLesson?.id);
    if (currentIndex > 0) {
      setCurrentLesson(allLessons[currentIndex - 1]);
    }
  };

  const goToNextLesson = () => {
    const allLessons = course.sections?.flatMap(s => s.lessons || []) || [];
    const currentIndex = allLessons.findIndex(l => l.id === currentLesson?.id);
    if (currentIndex < allLessons.length - 1) {
      setCurrentLesson(allLessons[currentIndex + 1]);
    }
  };

  if (loading) return <div className="loading">Loading course...</div>;
  if (!course) return <div className="error">Course not found</div>;

  const allLessonsList = course.sections?.flatMap(s => s.lessons || []) || [];
  const totalLessons = allLessonsList.length;
  const completedCount = completedLessons.size;

  return (
    <div className="learning-page">
      <div className="video-section">
        {currentLesson && (
          <>
            <VideoPlayer
              videoUrl={currentLesson.youtube_url}
              title={currentLesson.title}
            />
            <div className="lesson-controls">
              <button 
                className="btn-nav" 
                onClick={goToPreviousLesson}
                disabled={allLessonsList.indexOf(currentLesson) === 0}
              >
                ← Previous
              </button>
              
              <button 
                className={`btn-complete ${completedLessons.has(currentLesson.id) ? 'completed' : ''}`}
                onClick={handleMarkComplete}
              >
                {completedLessons.has(currentLesson.id) ? '✓ Completed' : 'Mark as Complete'}
              </button>
              
              <button 
                className="btn-nav" 
                onClick={goToNextLesson}
                disabled={allLessonsList.indexOf(currentLesson) === allLessonsList.length - 1}
              >
                Next →
              </button>
            </div>
          </>
        )}
      </div>

      <div className="sidebar-section">
        <div className="progress-header">
          <h2>{course.title}</h2>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="progress-text">{progress}% complete ({completedCount}/{totalLessons})</p>
        </div>

        <div className="lessons-sidebar">
          <h3>Course Content</h3>
          {course.sections?.map((section) => (
            <div key={section.id} className="sidebar-section-group">
              <h4>{section.title}</h4>
              {section.lessons?.map((lesson) => (
                <div
                  key={lesson.id}
                  className={`lesson-item ${currentLesson?.id === lesson.id ? 'active' : ''} ${completedLessons.has(lesson.id) ? 'completed' : ''}`}
                  onClick={() => handleLessonChange(lesson)}
                >
                  <span className="lesson-checkbox">
                    {completedLessons.has(lesson.id) ? '✓' : '○'}
                  </span>
                  <span className="lesson-title">{lesson.title}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LearningPage;
