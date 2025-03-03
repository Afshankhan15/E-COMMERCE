import DeleteIcon from "@mui/icons-material/Delete";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
// import { RootState } from "../redux/reducer/store";
// import { RootState } from "../redux/reducer/store";
import { RootState } from "../redux/reducer/store";
import { CartItem } from "../types/types";
import {
  addToCart,
  calculateDiscount,
  calculateTotal,
  removeFromCart,
} from "../redux/reducer/cartReducer";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { useAppDispatch } from "../../hooks";
const Cart = () => {
  const dispatch = useAppDispatch();
  const [couponCode, setCouponCode] = useState("");
  const [debounceCouponCode, setDebounceCouponCode] = useState("");
  const [discount, setDiscount] = useState<number>(0);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [discountMessage, setDiscountMessage] = useState<string | null>(null)

  const allCarts = useSelector((state: RootState) => state.cartReducer);

  const { cartItems, shippingCharges, subtotal, tax, total } = allCarts;
  console.log("cart page --->", allCarts);

  const handleAddQuantity = (cardItem: CartItem) => {
    if (cardItem.stock <= cardItem.quantity) {
      return toast.error("Stock not available");
    }
    console.log("cardItem 123 -->", cardItem);
    dispatch(
      addToCart({
        ...cardItem,
        quantity: cardItem.quantity + 1,
      })
    );
  };
  const handleDecrementQuantity = (cardItem: CartItem) => {
    if (cardItem.quantity <= 1) {
      return;
    }
    console.log("cardItem 123 -->", cardItem);
    dispatch(
      addToCart({
        ...cardItem,
        quantity: cardItem.quantity - 1,
      })
    );
  };

  const handleRemoveProduct = (productId: string) => {
    dispatch(removeFromCart(productId));
  };

  useEffect(() => {
    dispatch(calculateTotal());
  }, [allCarts]);

  useEffect(() => {
    if (discount) {
      dispatch(calculateDiscount(discount));
    }
  }, [discount]);

  const handleGetDiscount = async () => {
    if (debounceCouponCode === "")
      return toast.error("Please enter coupon code");

    setIsApplyingCoupon(true);
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_SERVER
        }/api/v1/payment/discount?coupon=${couponCode}`
      );

      console.log(response.data);
      setDiscount(response.data.discount);
      setCouponCode("");
      setDiscountMessage(`Discount of ${response.data.discount} applied successfully`);
    } catch (error: AxiosError | any) {
      console.error(error.response.data);
      toast.error(error.response.data.message);
      setDiscountMessage(null)
    } finally {
      setIsApplyingCoupon(false);
      
    }
  };

  useEffect(() => {
    // Set a timeout to update debounceCouponCode after 1 second of inactivity
    const timeoutId = setTimeout(() => {
      setDebounceCouponCode(couponCode);
    }, 1000);

    // Cleanup function to clear the timeout if couponCode changes before 1 second
    return () => clearTimeout(timeoutId);
  }, [couponCode]);

  useEffect(() => {
    console.log("debounceCouponCode", debounceCouponCode);
    if (debounceCouponCode) {
      handleGetDiscount();
    }
  }, [debounceCouponCode]);

  return (
    <div className="w-full max-w-7xl mx-auto p-6 md:p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Your Cart</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-6">
          {cartItems.length === 0 ? (
            <p className="text-center text-gray-500 text-lg">Your cart is empty</p>
          ) : (
            cartItems.map((item: any) => (
              <div
                key={item.productId}
                className="flex items-center bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <img
                  src={`${import.meta.env.VITE_SERVER}/${item.photo}`}
                  alt={item.name}
                  className="w-24 h-24 object-cover rounded-md"
                />
                <div className="flex-1 ml-4">
                  <p className="text-lg font-semibold text-gray-800">{item.name}</p>
                  <p className="text-gray-600">${item.price}</p>
                  <div className="flex items-center mt-2 space-x-2">
                    <button
                      onClick={() => handleDecrementQuantity(item)}
                      className="p-1 bg-gray-200 rounded-full hover:bg-gray-300 transition-colors"
                    >
                      <RemoveIcon style={{ fontSize: "1rem" }} />
                    </button>
                    <span className="text-sm font-semibold">{item.quantity}</span>
                    <button
                      onClick={() => handleAddQuantity(item)}
                      className="p-1 bg-gray-200 rounded-full hover:bg-gray-300 transition-colors"
                    >
                      <AddIcon style={{ fontSize: "1rem" }} />
                    </button>
                    <span className="text-sm text-gray-500 ml-2">Stock: {item.stock}</span>
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveProduct(item.productId)}
                  className="text-red-500 hover:text-red-700 transition-colors"
                >
                  <DeleteIcon style={{ fontSize: "1.5rem" }} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Order Summary */}
        <div className="bg-white p-6 rounded-lg shadow-md lg:sticky lg:top-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Order Summary</h2>
          <div className="space-y-4 text-gray-700">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-semibold">${subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span className="font-semibold">${shippingCharges}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax</span>
              <span className="font-semibold">${tax}</span>
            </div>
            <div className="flex justify-between text-red-600">
              <span>Discount</span>
              <span>-${discount}</span>
            </div>
            <div className="flex justify-between border-t pt-4 text-lg font-bold text-gray-800">
              <span>Total</span>
              <span>${total}</span>
            </div>
          </div>

          {/* Coupon Section */}
          <div className="mt-6">
            <input
              placeholder="Enter Coupon Code"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all"
              type="text"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
            />
            <button
              onClick={handleGetDiscount}
              disabled={isApplyingCoupon}
              className={`w-full mt-3 p-3 rounded-lg text-white ${
                isApplyingCoupon
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              } transition-colors duration-200`}
            >
              {isApplyingCoupon ? "Applying..." : "Apply Coupon"}
            </button>
            {discountMessage && (
              <p className="text-green-600 text-sm mt-2 text-center">{discountMessage}</p>
            )}
          </div>

          {/* Checkout Button */}
          <Link to="/shipping" className="block mt-6">
            <button className="w-full p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200">
              Proceed to Checkout
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;

//   return (
//     <div className="w-full max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 p-8">
//       {cartItems.map((item) => (
//         <div className="flex gap-6 max-w-[450px] md:max-w-[500px]">
//           <div className="flex flex-col text-sm text-center w-[80%]">
//             <p className="flex p-1">
//               {/* <img src={camImage} alt="" className="w-[24rem] h-64 bg-cover" /> */}
//               <img
//                 src={`${import.meta.env.VITE_SERVER}/${item.photo}`}
//                 alt=""
//                 className="w-[24rem] h-64 bg-cover"
//               />
//             </p>
//             <p className="text-gray-600 mt-2">{item.name}</p>
//             <p className="font-bold mt-1">{item.price}</p>
//           </div>

//           <div className="flex gap-4">
//             <div className="flex gap-4 text-sm">
//               <p className="bg-slate-300 my-auto cursor-pointer">
//                 {" "}
//                 <p onClick={() => handleDecrementQuantity(item)}>
//                   <RemoveIcon style={{ fontSize: "1.1rem" }} />{" "}
//                 </p>
//               </p>
//               <p className="my-auto text-sm font-semibold">
//                 quantity : {item.quantity}
//               </p>
//               <p className="my-auto text-sm font-semibold">
//                 stock : {item.stock}
//               </p>
//               <p className="bg-slate-300 my-auto cursor-pointer">
//                 {" "}
//                 <p onClick={() => handleAddQuantity(item)}>
//                   <AddIcon style={{ fontSize: "1.1rem" }} />{" "}
//                 </p>
//               </p>
//             </div>
//             <div className="my-auto cursor-pointer text-red-600">
//               {/* <p onClick={() => handleRemoveProduct(item._id)}> */}
//               <p onClick={() => handleRemoveProduct(item.productId)}>
//                 <DeleteIcon style={{ fontSize: "1.7rem" }} />
//               </p>
//             </div>
//           </div>
//         </div>
//       ))}
//       {/* 2nd div */}
//       <div className="bg-white p-6 border rounded-lg shadow-sm">
//         <h2 className="text-xl font-bold mb-6">Order Summary</h2>
//         <div className="space-y-4">
//           <div className="flex justify-between">
//             <p className="text-gray-600">Subtotal</p>
//             <p className="font-semibold">${subtotal}</p>
//           </div>
//           <div className="flex justify-between">
//             <p className="text-gray-600">Shipping Charges</p>
//             <p className="font-semibold">${shippingCharges}</p>
//           </div>
//           <div className="flex justify-between">
//             <p className="text-gray-600">Tax</p>
//             <p className="font-semibold">${tax}</p>
//           </div>
//           <div className="flex justify-between">
//             <p className="text-red-600">Discount</p>
//             <p className="text-red-600">-${discount}</p>
//           </div>
//           <div className="flex justify-between border-t pt-4">
//             <p className="text-lg font-bold">Total</p>
//             <p className="text-lg font-bold">${total}</p>
//           </div>
//         </div>

//         {/* Coupon Code */}
//         <div className="mt-8">
//           <input
//             placeholder="Enter Coupon Code"
//             className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
//             type="text"
//             value={couponCode}
//             onChange={(e) => setCouponCode(e.target.value)}
//           />
//           <button
//             onClick={handleGetDiscount}
//             disabled={isApplyingCoupon}
//             className="w-full mt-4 bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
//           >
//             {isApplyingCoupon ? "Applying..." : "Apply Coupon"}
//           </button>
//           {discountMessage && (
//               <p className="text-green-600 text-sm mt-2">{discountMessage}</p>
//             )}
//         </div>

//         {/* Checkout Button */}
//         <Link to="/shipping" className="block mt-8">
//           <button className="w-full bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 transition-colors duration-200">
//             Proceed to Checkout
//           </button>
//         </Link>
//       </div>
//     </div>
//   );
// };

// export default Cart;