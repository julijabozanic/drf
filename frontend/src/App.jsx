import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import IssueListPage from './pages/IssueListPage';
import IssueCreatePage from "./pages/IssueCreatePage";
import IssueDetailPage from './pages/IssueDetailPage';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  return (
    <AuthProvider>
      <Navbar />
      <main>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route element={<ProtectedRoute />}>
        <Route path="/" element={<IssueListPage />} />
        <Route path="/issues/new" element={<IssueCreatePage />} />
        <Route path="/issues/:id" element={<IssueDetailPage />} />
      </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      </main>
    </AuthProvider>
  );
}