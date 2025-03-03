
import AdminLayout from "../../layouts/admin";
import TransTable from "../../components/admin/TransTable";
// import { TransData } from "../../assets/data.json";
import { useAppDispatch } from "../../../hooks";
import { useSelector } from "react-redux";
// import { RootState } from "../../redux/reducer/store";
// import { RootState } from "../../redux/reducer/store";
import { RootState } from "../../redux/reducer/store";
import { useEffect } from "react";
import { allOrder } from "../../redux/reducer/orderReducer";
import toast from "react-hot-toast";
const Transaction = () => {
  const dispatch = useAppDispatch();

  // userID
  const userId = useSelector((state: RootState) => state.userReducer).user?._id;

  // fetch user-orders from orderReducer
  const { loading, error, orders } = useSelector(
    (state: RootState) => state.orderReducer
  );
  console.log("orders", orders);

  useEffect(() => {
    if (userId) {
      dispatch(allOrder(userId))
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
    <AdminLayout>
      <div className="w-full flex justify-center p-8 bg-gray-50 min-h-screen">
      <div className="max-w-4xl w-full bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-8 text-gray-800">ALL USER ORDERS</h1>
        {orders && <TransTable data={orders} />}
      </div>
    </div>
    </AdminLayout>
  );
};

export default Transaction;
