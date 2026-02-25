import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import Navbar from './components/Navbar.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import Home from './pages/Home.jsx';
import ArticleDetail from './pages/ArticleDetail.jsx';
import ArticleForm from './pages/ArticleForm.jsx';
import MyArticles from './pages/MyArticles.jsx';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <main className="container animate-fade-in" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/article/:id" element={<ArticleDetail />} />
            <Route path="/new-article" element={<ArticleForm />} />
            <Route path="/edit-article/:id" element={<ArticleForm />} />
            <Route path="/my-articles" element={<MyArticles />} />
          </Routes>
        </main>
      </Router>
    </AuthProvider>
  );
}

export default App;
