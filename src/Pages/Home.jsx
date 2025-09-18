import React from 'react'
import { Link } from "react-router-dom";

import Header from '../Components/HeaderComponents/Header'
import Product from '../Components/ProductSection/Product';

function Home()
 {
  return (
    <div>
        <Header />
        <Link to="/signup">Sign up</Link>
        <Product />
        
      
    </div>
  )
}

export default Home
