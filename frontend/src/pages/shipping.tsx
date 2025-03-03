import { ChangeEvent, FormEvent, useState } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
// import { RootState } from "../redux/reducer/store";
// import { RootState } from "../redux/reducer/store";
import { RootState } from "../redux/reducer/store";
import toast from "react-hot-toast";
import { createPayment } from "../redux/reducer/orderReducer";
import { useAppDispatch } from "../../hooks";
import { saveShippingInfo } from "../redux/reducer/cartReducer";
// import { newOrder } from "../redux/reducer/cartReducer";
const Shipping = () => {
  const dispatch = useAppDispatch();
  // const dispatch =()
  const navigate = useNavigate();
  const [shippingInfo, setShippingInfo] = useState({
    address: "",
    city: "",
    state: "",
    country: "",
    pinCode: "",
  });

  // const cartItems = useSelector((state: RootState) => state.cartReducer)
  const { cartItems, subtotal, tax, total, shippingCharges, discount } =
    useSelector((state: RootState) => state.cartReducer);
  const userID = useSelector((state: RootState) => state.userReducer).user?._id;

  //   handlechange
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setShippingInfo((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // right but now flow is ---> get shipping info clcik on pay button to get client secret when we give the total_amount then if all success then
  // go to checkOut page and place the order simple

  // in this we directly place the order that's why we commented out
  // const handlePayNow = async () => {
  //   if (!userID || !cartItems || !shippingInfo || !subtotal || !tax || !total) {
  //     return toast.error("Please enter all fileds");
  //   }
  //   try {

  //     const orderData = {
  //       orderItems: cartItems,
  //       shippingInfo,
  //       user: userID,
  //       subtotal,
  //       tax,
  //       total,
  //       shippingCharges,
  //       discount,
  //     };

  //     // Dispatch the newOrder action
  //     // Without unwrap(): It always resolves, even if the action is rejected.
  //     // With unwrap(): It will throw an error if newOrder was rejected, making it easier to handle errors.
      // await dispatch(newOrder(orderData))
      //   .unwrap()
      //   .then(() => {
      //     toast.success("Order placed successfully!");
      //   })
      //   .catch((error) => {
      //     toast.error(error.message || "Failed to place order.");
      //   });

  //     // toast.success("Order placed successfully!");
  //   } catch (error) {
  //     console.error("Error fetching plants:", error);
  //   }
  // };

  const handlePayNow = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      // Save shipping info to Redux cart state
      dispatch(saveShippingInfo(shippingInfo));


       // Create payment and navigate to the payment page(checkOut)

      // Dispatch the newOrder action
      // Without unwrap(): It always resolves, even if the action is rejected.
      // With unwrap(): It will throw an error if newOrder was rejected, making it easier to handle errors.
      await dispatch(createPayment(total))
        .unwrap()
        .then((data: any) => {
          // toast.success("Payment created successfully");
          navigate("/pay", { state: data.clientSecret });
        })
        .catch((error: any) => {
          console.error(error);
          toast.error(error.message || "Failed to create payment.");
        });

      // toast.success("Order placed successfully!");
    } catch (error) {
      console.error("Error fetching plants:", error);
    }
  };

  // useEffect(() => {
  //   // if cartItems.length === 0 then navigate to cart
  // if(cartItems.cartItems.length === 0) {
  //   return navigate('/carty')
  // }
  // }, [cartItems.cartItems])

  return (
    <div className="relative w-full min-h-screen p-8">
      {/* arrow icon */}
      <div
        onClick={() => navigate("/carty")}
        className="bg-black text-white absolute top-2 left-4 border rounded-full p-1"
      >
        <ArrowBackIcon className="hover:transform duration-300 ease-in hover:-translate-x-1 cursor-pointer" />
      </div>
      {/* main div */}
      <form
      onSubmit={handlePayNow}
      className="max-w-sm mx-auto flex flex-col p-8 gap-8 border rounded shadow mt-5">
        <h1 className="text-xl font-semibold text-center">
          SHIPPING <br /> ADDRESS
        </h1>
        <div className="flex flex-col gap-4">
          <input
            className="py-2 px-4 border border-gray-300 rounded shadow outline-none"
            placeholder="Address"
            type="text"
            name="address"
            value={shippingInfo.address}
            onChange={handleChange}
            required
          />
          <input
            className="py-2 px-4 border border-gray-300 rounded shadow outline-none"
            placeholder="City"
            type="text"
            name="city"
            value={shippingInfo.city}
            onChange={handleChange}
            required
          />
          <input
            className="py-2 px-4 border border-gray-300 rounded shadow outline-none"
            placeholder="State"
            type="text"
            name="state"
            value={shippingInfo.state}
            onChange={handleChange}
            required
          />
          <select
            name="country"
            value={shippingInfo.country}
            onChange={handleChange}
            className="py-2 px-4 border border-gray-300 rounded shadow outline-none"
            required
          >
            <option value="India">India</option>
            <option value="Japan">Japan</option>
            <option value="Australia">Australia</option>
          </select>
          <input
            className="py-2 px-4 border border-gray-300 rounded shadow outline-none"
            placeholder="Pin Code"
            type="number"
            name="pinCode"
            value={shippingInfo.pinCode}
            onChange={handleChange}
            required
          />
          <button
            type="submit"
            className="text-white bg-blue-600 hover:opacity-80 border rounded-md p-2"
          >
            PAY NOW
          </button>
        </div>
      </form>
    </div>
  );
};

export default Shipping;