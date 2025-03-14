import "./App.css";
import "./Reset.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import NoPage from "./pages/NoPage/NoPage";
import Layout from "./Navigation/Layout";
import Library from "./pages/Library/Library";
import Search from "./pages/Search/Search";
import Create from "./pages/Create/Create";
import Account from "./pages/Account/Account";
import Contest from "./pages/Contest/Contest";
import Quiz from "./pages/Quiz/Quiz";
import { useEffect } from "react";

function App() {
  useEffect(() => {
    document.documentElement.style.setProperty("color-scheme", "dark");
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/Quiz" element={<Quiz />}>
          <Route path=":quizId" element={<Quiz />} />
        </Route>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="home" element={<Home />} />
          <Route path="library" element={<Library />} />
          <Route path="search" element={<Search />} />
          <Route path="create" element={<Create />} />
          <Route path="account" element={<Account />} />
          <Route path="contest" element={<Contest />} />
          <Route path="*" element={<NoPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
