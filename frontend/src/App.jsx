import { BrowserRouter, Routes, Route } from "react-router-dom";
import Activitiy from "./Activity.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Activitiy />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;