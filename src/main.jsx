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
    element: <Product />,
  },
   
      {
    path:"/product/:id",
    element: <ProductDetails />,
  },
   
   
   
   
]);


const root = document.getElementById("root");

ReactDOM.createRoot(root).render(
  <RouterProvider router={router} />
);
//<Route path="/product/:id" element={<ProductDetails />} />