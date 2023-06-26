import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Components/Login/Login";
import Signup from "./Components/Signup/Signup";
import Product from "./Components/Products/Product";
import CurrProduct from "./Components/CurrProduct/CurrProduct";
import Profile from "./Components/Profile/Profile";
import Pass from "./Components/PasswordUpdate/Pass";
import ProductCart from "./Components/Cart/ProductCart";
import Add from "./Components/AdminHome/AddProducts/Add";
import UserOrders from "./Components/UserOrders/UserOrders";
import AdminScreen from "./Components/AdminHome/AdminScreen/AdminScreen";
import UserDB from "./Components/UserDB/UserDB";
import OrdersDB from "./Components/OrdersDB/OrdersDB";
import EditUser from "./Components/UserDB/EditUser-Admin/EditUser";
import ProductsDB from "./Components/ProductsDB/ProductsDB";
import OrderProduct from "./Components/OrdersDB/OrderProduct/OrderProduct";
import EditProducts from "./Components/ProductsDB/EditProducts-Admin/EditProducts";

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
        <Route exact path="/productsdb/:id" Component={ProductsDB} />
        <Route exact path="/cart" Component={ProductCart} />
        <Route exact path="/add" Component={Add} />
        <Route exact path="/orders/:id" Component={UserOrders} />
        <Route exact path="/adminscreen/:id" Component={AdminScreen} />
        <Route exact path="/usersdb/:id" Component={UserDB} />
        <Route exact path="/ordersdb/:id" Component={OrdersDB} />
        <Route exact path="/editadmin/:id" Component={EditUser} />
        <Route exact path="/order/:id" Component={OrderProduct} />
        <Route exact path="/edit/product/:id" Component={EditProducts} />
      </Routes>
    </div>
  );
}

export default App;
