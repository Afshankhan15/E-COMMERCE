// import { useState, useEffect } from 'react';
// import reactLogo from './assets/react.svg';
// import viteLogo from '/vite.svg';
// import './App.css';

// function App() {
//   const [count, setCount] = useState(0);
//   const [name, setName] = useState<string>(''); // State to store the name
//   const [loading, setLoading] = useState(true); // Loading state

//   // Fetch name from backend when component mounts
//   useEffect(() => {
//     const fetchName = async () => {
//       try {
//         // const serverUrl = ;
//         const response = await fetch(`${import.meta.env.VITE_SERVER}/api/student`);
//         // const response = await fetch('http://localhost:3000/api/name');
//         const data = await response.json();
//         setName(data.name);
//         setLoading(false);
//       } catch (error) {
//         console.error('Error fetching name:', error);
//         setLoading(false);
//       }
//     };

//     fetchName();
//   }, []); // Empty dependency array means this runs once on mount

//   return (
//     <>
//       <div>
//         <a href="https://vite.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.tsx</code> and save to test HMR
//         </p>
//         {/* Display the fetched name */}
//         <p>
//           {loading ? 'Loading name...' : `Name from backend: ${name}`}
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>
//     </>
//   );
// }

// export default App;
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react"; // lazy-loading to prevent un-necessary rendering of pages
import Loader from "./components/loader";
import { Toaster } from "react-hot-toast";
import { onAuthStateChanged } from "firebase/auth";
// import { auth } from "./firebase";
import { auth } from "./firebase";
import {
  getUserInfo,
  userExist,
  userNotExist,
} from "./redux/reducer/userReducer";
import { shallowEqual, useSelector } from "react-redux";
import Header from "./components/header";
import ProtectedRoute from "./components/protected-route";
import { useAppDispatch } from "../hooks";
import { User } from "./types/types";
// import { RootState } from "./redux/reducer/store";
import { RootState } from "./redux/reducer/store";

const Dashboard = lazy(() => import("./pages/admin/dashboard"));
const Customer = lazy(() => import("./pages/admin/Customer"));
const ManageCustomer = lazy(() => import("./pages/admin/ManageCustomer"));
const Product = lazy(() => import("./pages/admin/Product"));
const Cart = lazy(() => import("./pages/Cart"));
const Transaction = lazy(() => import("./pages/admin/Transaction"));
const OrderDetails = lazy(() => import("./components/admin/OrderDetails"));
const HomePage = lazy(() => import("./pages/homepage"));
const Shipping = lazy(() => import("./pages/shipping"));
const Login = lazy(() => import("./pages/login"));
const Search = lazy(() => import("./pages/Search"));
const Order = lazy(() => import("./pages/order"));
const ManageProduct = lazy(() => import("./pages/manage-product"));
// const NotFound = lazy(() => import("./pages/not-found"));
const CheckOut = lazy(() => import("./pages/checkOut"));

const App = () => {
  const dispatch = useAppDispatch();

  //   const { user, loading } = useSelector(
  //     (state: RootState) => state.userReducer
  //   );

  const { user, loading } = useSelector(
    (state: RootState) => ({
      user: state.userReducer.user,
      loading: state.userReducer.loading,
    }),
    shallowEqual // Prevents re-render unless user or loading changes
  );

  // Not a Re-Run: The useEffect doesn’t trigger again after the first render —it’s the listener callback inside onAuthStateChanged(auth, callback) that executes when the auth state changes, like when a user logs in.(login, logout, or app load with a persisted session)

  // LOGGED IN OR not on the basis of user exist on firebase or not simple
  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      // Source: This user comes directly from Firebase Authentication (auth object). and not from above redux user
      if (user) {
        console.log("LOGGED IN");
        console.log("UID", user);
        // call backend api to get user detal using uid (FLOW here -> userAPI -> BACKEND)
        // const data = await getUser(user.uid);
        // dispatch(userExist(data.user)); // userexist -> reducer
        // Dispatch the getUserInfo thunk to fetch user details
        await dispatch(getUserInfo(user.uid))
          .unwrap()
          .then((fetchedUser: User) => {
            // focus
            console.log("FETCHED USER", fetchedUser); // user object
            dispatch(userExist(fetchedUser)); // Pass fetched user to userExist
          })
          .catch((error: any) => {
            console.error("Failed to fetch user:", error);
            dispatch(userNotExist());
          });
      } else {
        console.log("NOT LOGGED IN");
        dispatch(userNotExist());
      }
    });
  }, []); // [] -> run only once, but callback triggers on auth state change

  console.log("USER ROLE APP PAGE", user?.role);

  return loading ? (
    <p>Loading....</p>
  ) : (
    <Router>
      <Header user={user} />
      <Suspense fallback={<Loader />}>
        <Routes>
          {/* main homepage */}

          <Route path="/" element={<HomePage />} />

          {/* <Route path="/login" element={<Login />} /> */}
          {/* [EXAMPLE OF CHILDREN NOT OUTLET IN LOGIN] */}
          <Route
            path="/login"
            element={
              // if user is LOGGED-IN then make sure that logged-in user can't access the Login page
              <ProtectedRoute isAuthenticated={user ? false : true}>
                <Login />
              </ProtectedRoute>
            }
          />

          {/* LOGGED-IN USER ROUTES */}

          {/* usage of OUTLET -> IF PROTECTED ROUTE HAS CHILD ROUTES */}
          {/* all the 3 route in PR treated as OUTLET and not children */}
          <Route
            element={<ProtectedRoute isAuthenticated={user ? true : false} />}
          >
            {/* CART PAGE(yt) */}
            <Route path="/cart" element={<Cart />} />
            <Route path="/shipping" element={<Shipping />} />
            {/* my orders */}
            <Route path="/order" element={<Order />} />
            {/* manage product  */}
            {/* FRONTEND URL ---> http://localhost:5173/manage-product/676c4a548610456126b5ee28 */}
            <Route
              path="/manage-product/:productId"
              element={<ManageProduct />}
            />

            <Route path="/pay" element={<CheckOut />} />
          </Route>

          {/* ADMIN-LINKS */}
          <Route
            element={
              <ProtectedRoute
                isAuthenticated={true}
                adminRoute={true}
                isAdmin={user?.role === "admin" ? true : false}
              />
            }
          >
            {/* admin-dashbaord page */}
            <Route path="/admin/dashboard" element={<Dashboard />} />
            {/* admin-customers */}
            <Route path="/admin/customer" element={<Customer />} />
            <Route
              path="/manage-customer/:customerId"
              element={<ManageCustomer />}
            />
            {/* admin-Products */}
            <Route path="/admin/product" element={<Product />} />
            {/* admin-transaction */}
            <Route path="/admin/transaction" element={<Transaction />} />
            {/* Add the new nested route for order details */}
            <Route path="/trans/:orderId" element={<OrderDetails />} />
          </Route>

          {/* search products */}
          <Route path="/search" element={<Search />} />

          {/* if above url not matched then  */}
          {/* <Route path="*" element={<NotFound />} /> */}
        </Routes>
      </Suspense>
      {/* add toaster */}
      <Toaster position="bottom-center" />
    </Router>
  );
};

export default App;
