import { BrowserRouter, Route, Routes } from "react-router-dom";
import AdminDashboard from "./admin/Dashboard";
import EditContentForm from "./admin/EditContentForm";
import Header from "./components/Header";
import ContentDetail from "./pages/ContentDetail";
import Home from "./pages/Home";
import Login from "./pages/Login";
import SearchResults from "./pages/SearchResults"; // ✅ Tambahkan ini

export default function App() {
    return (
        <BrowserRouter>
            <Header />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/edit/:id" element={<EditContentForm />} />
                <Route path="/content/:slug" element={<ContentDetail />} />
                <Route path="/search" element={<SearchResults />} />{" "}
                {/* ✅ Route pencarian */}
            </Routes>
        </BrowserRouter>
    );
}
