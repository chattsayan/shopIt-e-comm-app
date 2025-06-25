import "./App.css";
import Header from "./components/Layout/Header";
import Footer from "./components/Layout/Footer";
import { BrowserRouter as Router, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import useUserRoutes from "./components/routes/userRoutes";
import useAdminRoutes from "./components/routes/adminRoutes";

function App() {
  const userRoutes = useUserRoutes();
  const adminRoutes = useAdminRoutes();

  return (
    <Router>
      <div className="App">
        <Header />
        <Toaster position="top-right" />
        <main>
          <Routes>
            {userRoutes}
            {adminRoutes}
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
