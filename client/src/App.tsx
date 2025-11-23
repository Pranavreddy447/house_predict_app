import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import PredictionForm from './components/PredictionForm';
import Login from './components/Login';
import Signup from './components/Signup';
import PrivateRoute from './components/PrivateRoute';
import ErrorBoundary from './components/ErrorBoundary';
import { logout } from './api';

const MainLayout = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans relative">
      <button
        onClick={handleLogout}
        className="absolute top-4 right-4 px-4 py-2 bg-white text-indigo-600 font-semibold rounded-lg shadow-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
      >
        Sign out
      </button>
      <div className="w-full max-w-4xl">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl mb-2">
            Dream Home <span className="text-indigo-600">Predictor</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Accurate house price estimates for Bengaluru based on machine learning.
          </p>
        </header>
        
        <main>
          <ErrorBoundary>
            <PredictionForm />
          </ErrorBoundary>
        </main>

        <footer className="mt-12 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} House Price Predictor. Powered by Django & React.</p>
        </footer>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <MainLayout />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
