import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
// import { RootState } from "../redux/reducer/store";
// import { RootState } from "../redux/reducer/store";
import { RootState } from "../redux/reducer/store";
import { useAppDispatch } from "../../hooks";
import { newOrder } from "../redux/reducer/orderReducer";
import { resetCart } from "../redux/reducer/cartReducer";
// add publishable key here from stripe
const stripePromise = loadStripe(
  "pk_test_51QuFw1QPD6AroualWBxXEFQ070ULuO766ucM6LzhKjTgnMDGr8GzX7MVQ0Dxi0s9qIkGyo86ptHNenMdTsUXodYl000cpxatf5"
);

const CheckOutForm = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();

  const [isProcessing, setIsProcessing] = useState(false);

  const {
    cartItems,
    subtotal,
    tax,
    total,
    shippingCharges,
    discount,
    shippingInfo,
  } = useSelector((state: RootState) => state.cartReducer);

  const userID = useSelector((state: RootState) => state.userReducer).user?._id;

  console.log("userID", userID);
  console.log("cartItems", cartItems);

  const handlePayment = async () => {
    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    const orderData = {
      orderItems: cartItems, // cartItems also has stock but orderItems does not include it in DB
      shippingInfo,
      user: userID,
      subtotal,
      tax,
      total,
      shippingCharges,
      discount,
    };

    const { paymentIntent, error } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: window.location.origin },
      redirect: "if_required",
    });

    if (error) {
      setIsProcessing(false);
      return toast.error(error.message || "something went wrong");
    }

    // if payment is successful
    if (paymentIntent.status === "succeeded") {
      console.log("Placing order...");
      // then place the order
      await dispatch(newOrder(orderData))
        .unwrap()
        .then(() => {
          toast.success("Order placed successfully!");
        })
        .catch((error: any) => {
          toast.error(error.message || "Failed to place order.");
        });
      // after placing order reset the cart
      dispatch(resetCart());
      navigate("/order");
    }

    setIsProcessing(false);
  };
  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg">
      <PaymentElement />
      <button
        onClick={handlePayment}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-300"
      >
        {isProcessing ? "Processing..." : "Pay now"}
      </button>
    </div>
  );
};
const CheckOut = () => {
  const location = useLocation();
  const clientSecret: string | undefined = location.state;
  if (!clientSecret) {
    return <Navigate to={"/shipping"} />;
  }
  return (
    <Elements
      //   options={{
      //     clientSecret:
      //       "pi_3QuGqfQPD6Aroual0PmqgelO_secret_mJJHDiuUfuCYcFjH0N4aU9lk8", // coming from backend using stripe
      //   }}
      options={{
        clientSecret: clientSecret, // it includes the total amount of order price placed by user 
      }}
      stripe={stripePromise}
    >
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <CheckOutForm />
      </div>
    </Elements>
  );
};

export default CheckOut;
