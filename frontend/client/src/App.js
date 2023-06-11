import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Components/Login/Login";
import Signup from "./Components/Signup/Signup";
import Product from "./Components/Products/Product";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route exact path="/Signup" Component={Signup}></Route>
          <Route exact path="/Login" Component={Login}></Route>
          <Route exact path="/products" Component={Product} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
