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
import Body from './Components/BodySection/Body.jsx';
import Baby from './Components/BabySection/Baby.jsx';
import Black from './Components/BlackSection/Black.jsx';
import UserProf from './Components/UserProfile/UserProf.jsx'
import CombinedLogin from './Components/CombinedLogins/ComLogin.jsx';

 


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
    element: <CombinedLogin />,
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
        {
    path:"/body",
    element: <Body />,
  },
       {
    path:"/userProfile",
    element: <UserProf />,
  },
   
    
   
   
   
]);


const root = document.getElementById("root");

ReactDOM.createRoot(root).render(
  <RouterProvider router={router} />
);
//<Route path="/product/:id" element={<ProductDetails />} />