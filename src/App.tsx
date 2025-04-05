import { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import { AuthProvider } from "./context/AuthContext";
import Layout from "./Navigation/Layout";
import Account from "./pages/Account/Account";
import Contest from "./pages/Contest/Contest";
import Create from "./pages/Create/Create";
import Home from "./pages/Home/Home";
import Library from "./pages/Library/Library";
import NoPage from "./pages/NoPage/NoPage";
import QuizPage from "./pages/QuizPage/QuizPage";
import Search from "./pages/Search/Search";
import "./Reset.css";

function App() {
  useEffect(() => {
    document.documentElement.style.setProperty("color-scheme", "dark");
  }, []);

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="home" element={<Home />} />
            <Route path="library" element={<Library />} />
            <Route path="search" element={<Search />} />
            <Route path="create" element={<Create />} />
            <Route path="account" element={<Account />} />
            <Route path="contest" element={<Contest />} />
            <Route path="/Quiz" element={<QuizPage />}>
              <Route path=":quizId" element={<QuizPage />} />
            </Route>
            <Route path="*" element={<NoPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
