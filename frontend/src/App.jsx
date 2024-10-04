import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import "./App.css";
import { Toaster } from "react-hot-toast";
import { useUserStore } from "./stores/useUserStore";

function App() {
  const { user } = useUserStore();
  console.log(user);
  return (
    <div>
      <div>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/login" element={user ? <HomePage /> : <LoginPage />} />
        </Routes>
      </div>
      <Toaster />
    </div>
  );
}

export default App;
