import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';

// Pages
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Courses from './pages/Courses';
import CourseDetails from './pages/CourseDetails';
import LearningPage from './pages/LearningPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <Navbar />
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={
              <PrivateRoute requireAuth={false}>
                <Login />
              </PrivateRoute>
            } />
            <Route path="/signup" element={
              <PrivateRoute requireAuth={false}>
                <Signup />
              </PrivateRoute>
            } />
            
            {/* Protected Routes */}
            <Route path="/dashboard" element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } />
            <Route path="/courses" element={
              <PrivateRoute>
                <Courses />
              </PrivateRoute>
            } />
            <Route path="/course/:id" element={
              <PrivateRoute>
                <CourseDetails />
              </PrivateRoute>
            } />
            <Route path="/learn/:courseId" element={
              <PrivateRoute>
                <LearningPage />
              </PrivateRoute>
            } />

            {/* Default redirect */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
