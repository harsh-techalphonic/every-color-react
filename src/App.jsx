import React, { useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";

import "react-toastify/dist/ReactToastify.css";
import Home from "./Pages/Home/Home";
import About from "./Pages/About/About";
import Product from "./Pages/Product/Product";
import ProductDetail from "./Pages/ProductDetail/ProductDetail";
import Cart from "./Pages/Cart/Cart";
import Wishlist from "./Pages/Wishlist/Wishlist";
import Login from "./Pages/Auth/Login/Login";
import SignUp from "./Pages/Auth/SignUp/SignUp";
import ForgetPassword from "./Pages/Auth/ForgetPassword/ForgetPassword";
import ResetPassword from "./Pages/Auth/ResetPassword/ResetPassword";
import VerifyAccount from "./Pages/Auth/VerifyAccount/VerifyAccount";
import UserAccount from "./Pages/UserAccount/UserAccount";
import Contact from "./Pages/Contact/Contact";
import TermCondition from "./Pages/Tcpprc/TermCondition";
import Privacy_policy from "./Pages/Tcpprc/Privacy_policy";
import Privacy_policy_vendor from "./Pages/Tcpprc/Privacy_policy_vendor";
import TermCondition_vendor from "./Pages/Tcpprc/TermCondition_vendor";
import Return_policy from "./Pages/Tcpprc/Return_policy";
import Checkout_page from "./Pages/Checkout/Checkout_page";
import BecomeSeller from "./Pages/Auth/BecomeSeller/BecomeSeller";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Provider } from "react-redux";
import ecommerceStore from "./store";
import Category from "./Pages/Category/Category";
import Support from "./Pages/Support/Support";
import PrivateRoute from "./Components/UserAccount/PrivateRoute";
import BulkOrder from "./Pages/BulkOrder/BulkOrder";
import Export from "./Pages/Export/Export";
import TrackOrder from "./Pages/TrackOrder/TrackOrder";
import TrackingPage from "./Pages/TrackOrder/TrackingPage";



function App() {
  const [headerHeight, setHeaderHeight] = useState(0);
  
  const handleHeaderHeight = (height) => {
    console.log("Dynamic Header Height:", height);
    setHeaderHeight(height);
  };
  console.log( "header height =", headerHeight)
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home  onHeaderHeight={handleHeaderHeight} />,
    },
    {
      path: "/about",
      element: <About onHeaderHeight={handleHeaderHeight} />,
    },
    {
      path: "/product",
      element: <Product onHeaderHeight={handleHeaderHeight}/>,
    },
    {
      path: "/product/category/:sub_category",
      element: <Product category_type="sub_category" onHeaderHeight={handleHeaderHeight}/>,
    },
    {
      path: "/product/:slug",
      element: <ProductDetail  onHeaderHeight={handleHeaderHeight}/>,
    },
    // {
    //   path : '/category/:category',
    //   element : <Product />
    // },
    {
      path: "/category/:category",
      element: <Category category_type="sub_category" onHeaderHeight={handleHeaderHeight} />,
    },
     {
      path : '/category/:category/:sub_category',
      element : <Product category_type="sub_category" onHeaderHeight={handleHeaderHeight}/>
    },
    {
      path: "/cart",
      element: <Cart onHeaderHeight={handleHeaderHeight} />,
    },
    {
      path: "/wishlist",
      element: <Wishlist onHeaderHeight={handleHeaderHeight} />,
    },
    {
      path: "/login",
      element: <Login  onHeaderHeight={handleHeaderHeight}/>,
    },
    {
      path: "/signup",
      element: <SignUp onHeaderHeight={handleHeaderHeight} />,
    },
    {
      path: "/forget-password",
      element: <ForgetPassword onHeaderHeight={handleHeaderHeight} />,
    },
    {
      path: "/reset-password",
      element: <ResetPassword  onHeaderHeight={handleHeaderHeight}/>,
    },
    {
      path: "/verify",
      element: <VerifyAccount  onHeaderHeight={handleHeaderHeight}/>,
    },
    {
      path: "/user-account",
      element: (
        <PrivateRoute>
          <UserAccount  onHeaderHeight={handleHeaderHeight} />
        </PrivateRoute>
      ),  
    },
    {
      path: "/contact-us",
      element: <Contact  onHeaderHeight={handleHeaderHeight}/>,
    },
    {
      path: "/term&conditons",
      element: <TermCondition  onHeaderHeight={handleHeaderHeight}/>,
    },
    {
      path: "/privacy-policy",
      element: <Privacy_policy onHeaderHeight={handleHeaderHeight} />,
    },
    {
      path: "/return-policy",
      element: <Return_policy onHeaderHeight={handleHeaderHeight} />,
    },
    {
      path: "/vendor-privacy-policy",
      element: <Privacy_policy_vendor onHeaderHeight={handleHeaderHeight} />,
    },
    {
      path: "/vendor-terms-conditions",
      element: <TermCondition_vendor onHeaderHeight={handleHeaderHeight} />,
    },
    {
      path: "/checkout",
      element: <Checkout_page  onHeaderHeight={handleHeaderHeight}/>,
    },
    {
      path: "/support",
      element: <Support  onHeaderHeight={handleHeaderHeight}/>,
    },
     {
      path: "/bulk-order",
      element: <BulkOrder  onHeaderHeight={handleHeaderHeight}/>
    },
    {
      path: "/export",
      element: <Export  onHeaderHeight={handleHeaderHeight}/>
    },
     {
      path: "/track-order",
      element: <TrackOrder  onHeaderHeight={handleHeaderHeight}/>
    },
    {
      path: "/track-order-detail",
      element: <TrackingPage  onHeaderHeight={handleHeaderHeight}/>
    },
    {
      path: "*",
      element: <Home />,
    },
  ]);
  return (
    <main style={{paddingTop:headerHeight}}>
      <Provider store={ecommerceStore}>
        <RouterProvider router={router}></RouterProvider>
      </Provider>
    </main>
  );
}

export default App;
