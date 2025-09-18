import { StrictMode } from 'react'
 import ReactDOM from 'react-dom/client';
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'


import Register from '../src/Components/Register/Register.jsx'
import Login from '../src/Components/Login/Login.jsx'
import Profile from './Components/AdProfile/AdminProfile.jsx'
import Product from './Components/ProductSection/Product.jsx'
import ProductDetails from './Components/DetailsProducts/ProductDetails.jsx'
import Cart from './Components/CartSection/Cart.jsx'
import Billing from './Components/BillingSection/Billing.jsx'
import UserLogin from './Components/UserLogin/UserLog.jsx';



// --- Helper function to get logged-in userId ---
const getUserId = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  return user?._id || null;
};



const router = createBrowserRouter([

  {
    path:"/",
    element: <App/>,
  },
     {
    path:"/signup",
    element: <Register />,
  },
      {
    path:"/login",
    element: <Login />,
  },
      {
    path:"/profile",
    element: <Profile />,
  },
        {
    path:"/product",
    element: <Product userId={getUserId()} />,
  },
   
      {
    path:"/product/:id",
    element: <ProductDetails />,
  },
    {
  path: "/cart",
  element: <Cart userId={getUserId()} />,
},
        {
    path:"/billing",
    element: <Billing />,
  },
   
        {
    path:"/logins",
    element: <UserLogin/>,
  },
   
   
   
   
]);


const root = document.getElementById("root");

ReactDOM.createRoot(root).render(
  <RouterProvider router={router} />
);
//<Route path="/product/:id" element={<ProductDetails />} />