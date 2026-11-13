import { Route, Routes } from "react-router-dom";
import CourseAccess from "./components/CourseAccess";
import Shell from "./components/Shell";
import Agents from "./pages/Agents";
import Auth from "./pages/Auth";
import Catalog from "./pages/Catalog";
import Certificates from "./pages/Certificates";
import Checkout from "./pages/Checkout";
import Dashboard from "./pages/Dashboard";
import DeveloperStudio from "./pages/DeveloperStudio";
import Home from "./pages/Home";
import Lab from "./pages/Lab";
import Lesson from "./pages/Lesson";
import NotFound from "./pages/NotFound";
import Track from "./pages/Track";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route element={<Shell />}>
        <Route path="/tracks" element={<Catalog />} />
        <Route path="/tracks/:slug" element={<CourseAccess><Track /></CourseAccess>} />
        <Route path="/learn/:slug/:module" element={<CourseAccess><Lesson /></CourseAccess>} />
        <Route path="/lab" element={<CourseAccess courseSlug="data-analytics"><Lab /></CourseAccess>} />
        <Route path="/studio" element={<DeveloperStudio />} />
        <Route path="/agents" element={<CourseAccess><Agents /></CourseAccess>} />
        <Route path="/dashboard" element={<CourseAccess><Dashboard /></CourseAccess>} />
        <Route path="/certificates" element={<CourseAccess><Certificates /></CourseAccess>} />
        <Route path="/signin" element={<Auth />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
