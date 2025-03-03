import { useEffect } from "react";
import { useAppDispatch } from "../../hooks";
import { useSelector } from "react-redux";
// import { RootState } from "../redux/reducer/store";
// import { RootState } from "../redux/reducer/store";
import { RootState } from "../redux/reducer/store";
import { myOrder } from "../redux/reducer/orderReducer";
import TransTable from "../components/admin/TransTable";
import toast from "react-hot-toast";

const Order = () => {
  const dispatch = useAppDispatch();

  // User ID
  const userId = useSelector((state: RootState) => state.userReducer).user?._id;

  // Fetch user orders from orderReducer
  const { loading, error, orders } = useSelector(
    (state: RootState) => state.orderReducer
  );

  useEffect(() => {
    if (userId) {
      dispatch(myOrder(userId))
        .unwrap()
        .catch((error: any) => {
          toast.error(error.message || "Failed to fetch orders.");
          console.error("Error fetching orders:", error);
        });
    }
  }, [userId]);

  if (loading) {
    // return <Loader />; // Show a loading spinner while fetching orders
    return <div>Loading order...</div>; // Show a loading spinner while fetching orders
  }

  if (error) {
    return <div className="text-red-500 text-center mt-8">{error}</div>; // Show error message
  }

  return (
    <div className="w-full flex justify-center p-8 bg-gray-50 min-h-screen">
      <div className="max-w-4xl w-full bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-8 text-gray-800">MY ORDERS</h1>
        {orders && <TransTable data={orders} />}
      </div>
    </div>
  );
};

export default Order;
