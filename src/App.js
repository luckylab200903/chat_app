import "./App.css";
import Home from "./Pages/Home";
import { Route, Routes } from "react-router-dom";
import Chat from "./Pages/Chat";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chat" element={<Chat />} />
      </Routes>
    </div>
  );
}

export default App;
