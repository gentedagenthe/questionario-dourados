import { BrowserRouter, Routes, Route } from "react-router-dom";
import QuestionarioCaptador from "./QuestionarioCaptador";
import AdminPanel from "./AdminPanel";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<QuestionarioCaptador />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </BrowserRouter>
  );
}
