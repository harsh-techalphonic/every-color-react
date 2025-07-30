import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './App.css'

import 'react-toastify/dist/ReactToastify.css';
import Home from './Pages/Home/Home'
import About from './Pages/About/About'
import Product from './Pages/Product/Product'
import ProductDetail from './Pages/ProductDetail/ProductDetail'
import Cart from './Pages/Cart/Cart'
import Wishlist from './Pages/Wishlist/Wishlist'
import Login from './Pages/Auth/Login/Login'
import SignUp from './Pages/Auth/SignUp/SignUp'
import ForgetPassword from './Pages/Auth/ForgetPassword/ForgetPassword'
import ResetPassword from './Pages/Auth/ResetPassword/ResetPassword'
import VerifyAccount from './Pages/Auth/VerifyAccount/VerifyAccount'
import UserAccount from './Pages/UserAccount/UserAccount'
import Contact from './Pages/Contact/Contact'
import TermCondition from './Pages/Tcpprc/TermCondition'
import Privacy_policy from './Pages/Tcpprc/Privacy_policy'
import Privacy_policy_vendor from './Pages/Tcpprc/Privacy_policy_vendor'
import TermCondition_vendor from './Pages/Tcpprc/TermCondition_vendor'
import Return_policy from './Pages/Tcpprc/Return_policy'
import Checkout_page from './Pages/Checkout/Checkout_page'
import BecomeSeller from './Pages/Auth/BecomeSeller/BecomeSeller'

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Provider } from 'react-redux'
import ecommerceStore from './store'
import Category from './Pages/Category/Category';
import Support from './Pages/Support/Support';

const router= createBrowserRouter([
  {
    path : '/',
    element : <Home/>
  },
  {
    path : '/about',
    element : <About/>
  },
  {
    path : '/product',
    element : <Product/>
  },
  {
    path : '/product/:slug',
    element : <ProductDetail/>
  },
  // {
  //   path : '/category/:category',
  //   element : <Product />
  // },
  {
    path : '/category/:category',
    element : <Category  category_type="sub_category"/>
  },
  //  {
  //   path : '/category/:category/:sub_category',
  //   element : <Product category_type="sub_category"/>
  // },
  {
    path : '/cart',
    element : <Cart/>
  },
  {
    path : '/wishlist',
    element : <Wishlist/>
  },
  {
    path : '/login',
    element : <Login/>
  },
  {
    path : '/signup',
    element : <SignUp/>
  },
  {
    path : '/forget-password',
    element : <ForgetPassword/>
  },
  {
    path : '/reset-password',
    element : <ResetPassword/>
  },
  {
    path : '/verify',
    element : <VerifyAccount/>
  },
  {
    path : '/user-account',
    element : <UserAccount/>
  },
  {
    path : '/contact-us',
    element : <Contact/>
  },
  {
    path : '/term&conditons',
    element : <TermCondition/>
  },
  {
    path : '/privacy-policy',
    element : <Privacy_policy/>
  },
  {
    path : '/return-policy',
    element : <Return_policy/>
  },
  {
    path : '/vendor-privacy-policy',
    element : <Privacy_policy_vendor/>
  },
  {
    path : '/vendor-terms-conditions',
    element : <TermCondition_vendor/>
  },
  {
    path : '/checkout/:data',
    element : <Checkout_page/>
  },
  {
    path : '/support',
    element : <Support/>
  },
  {
    path : '*',
    element : <Home/>
  },
])



function App() {
  return (
    <main>
      <Provider store={ecommerceStore}>
        <RouterProvider router={router}></RouterProvider>
      </Provider>
    </main>
  )
}

export default App
