import { Route, Routes } from "react-router-dom";
import Shell from "./components/Shell";
import Agents from "./pages/Agents";
import Auth from "./pages/Auth";
import Catalog from "./pages/Catalog";
import Certificates from "./pages/Certificates";
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
        <Route path="/tracks/:slug" element={<Track />} />
        <Route path="/learn/:slug/:module" element={<Lesson />} />
        <Route path="/lab" element={<Lab />} />
        <Route path="/studio" element={<DeveloperStudio />} />
        <Route path="/agents" element={<Agents />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/certificates" element={<Certificates />} />
        <Route path="/signin" element={<Auth />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
