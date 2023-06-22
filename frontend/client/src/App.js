import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Components/Login/Login";
import Signup from "./Components/Signup/Signup";
import Product from "./Components/Products/Product";
import CurrProduct from "./Components/CurrProduct/CurrProduct";
import Profile from "./Components/Profile/Profile";
import Pass from "./Components/PasswordUpdate/Pass";
import AdminHome from "./Components/AdminHome/AdminHome";
import ProductCart from "./Components/Cart/ProductCart";
import Add from "./Components/AdminHome/AddProducts/Add";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route exact path="/" Component={Signup}></Route>
        <Route exact path="/Login" Component={Login}></Route>
        <Route exact path="/products/:id" Component={Product} />
        <Route exact path="/product/:id" Component={CurrProduct} />
        <Route exact path="/profile/:id" Component={Profile} />
        <Route exact path="/pass/:id" Component={Pass} />
        <Route exact path="/admin/:id" Component={AdminHome} />
        <Route exact path="/cart" Component={ProductCart} />
        <Route exact path="/add" Component={Add} />
      </Routes>
    </div>
  );
}

export default App;
