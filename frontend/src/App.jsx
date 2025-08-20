// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './component/Navbar/Navbar';
import Home from './component/Home/Home';
import SignIn from './component/Account/SignIn';
import SignUp from './component/Account/SignUp';
import Order from './component/Order/Order';
import OrderConfirmation from './component/OrderConfirmation/OrderConfirmation';
import Recipe from './component/Recipe/Recipe';
import Review from './component/Review/Review';
import PaymentForm from './component/PaymentForm/PaymentForm';



const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/order" element={<Order />} />
        <Route path="/payment" element={<PaymentForm />} />
        <Route path="/order-confirmation" element={<OrderConfirmation />} /> 
        <Route path="/recipe" element={<Recipe />} />  
        <Route path="/review" element={<Review />} />  


      </Routes>
    </>
  );
};

export default App;
