import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
// import { RootState } from "../../redux/reducer/store";
import { RootState } from "../../redux/reducer/store";
import { useAppDispatch } from "../../../hooks";
import {
  deleteOrder,
  getSingleOrder,
  processOrder,
} from "../../redux/reducer/orderReducer";
import toast from "react-hot-toast";

const OrderDetails = () => {
  const dispatch = useAppDispatch();
  const params = useParams();
  const orderId = params.orderId; // Access `orderId` from params

  const user = useSelector((state: RootState) => state.userReducer).user;
  const { loading, error, order } = useSelector(
    (state: RootState) => state.orderReducer
  );

  useEffect(() => {
    orderId && dispatch(getSingleOrder(orderId));
  }, [orderId]);

  const handleDelete = async () => {
    try {
      if (orderId && user?._id) {
        dispatch(deleteOrder({ orderId: orderId, userId: user._id }))
          .unwrap()
          .then(() => {
            toast.success("Order deleted successfully!");
          })
          .catch((error: any) => {
            toast.error(error.message || "Failed to delete order.");
            console.error("Error deleting order:", error);
          });
      }
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };

  const handleProcess = async () => {
    try {
      if (orderId && user?._id) {
        dispatch(processOrder({ orderId: orderId, userId: user._id }))
          .unwrap()
          .then(() => {
            toast.success("Order processed successfully!");
          })
          .catch((error: any) => {
            toast.error(error.message || "Failed to process order.");
            console.error("Error processing order:", error);
          });
      }
    } catch (error) {
      console.error("Error processing order:", error);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-red-500 font-medium">
        Error: {error}
      </div>
    );
  if (!order)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-500 font-medium">
        Order not found
      </div>
    );
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Order Details
          </h1>
          <span className="text-sm text-gray-500">
            Order #{order._id.slice(-6)}
          </span>
        </div>

        {/* User Information Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 transform hover:scale-[1.01] transition-all duration-300">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
            User Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <p className="text-gray-600 flex items-center">
                <span className="font-medium mr-2">Name:</span>
                <span className="bg-gray-100 px-2 py-1 rounded">
                  {user?.name || "N/A"}
                </span>
              </p>
              <p className="text-gray-600 flex items-center">
                <span className="font-medium mr-2">Email:</span>
                <span className="bg-gray-100 px-2 py-1 rounded">
                  {user?.email || "N/A"}
                </span>
              </p>
            </div>
            {user?.photo && (
              <div className="flex justify-center md:justify-end">
                <img
                  src={user.photo}
                  alt="User"
                  className="h-20 w-20 rounded-full object-cover ring-4 ring-white shadow-md hover:ring-blue-200 transition-all duration-300"
                />
              </div>
            )}
          </div>
        </div>

        {/* Order Details Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 transform hover:scale-[1.01] transition-all duration-300">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
            <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
            Order Information
          </h2>
          <div className="space-y-6">
            <div className="flex flex-wrap gap-4">
              <button
                onClick={handleDelete}
                className="relative px-5 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
              >
                <span className="relative z-10">Delete Order</span>
                <span className="absolute inset-0 bg-red-700 opacity-0 hover:opacity-20 rounded-lg transition-opacity duration-300"></span>
              </button>
              <button
                onClick={handleProcess}
                className="relative px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              >
                <span className="relative z-10">{order.status} Order</span>
                <span className="absolute inset-0 bg-blue-700 opacity-0 hover:opacity-20 rounded-lg transition-opacity duration-300"></span>
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <p className="text-gray-600">
                <strong className="text-gray-800">Order ID:</strong>
                <span className="ml-2 bg-gray-100 px-2 py-1 rounded">
                  {order._id}
                </span>
              </p>
              <p className="text-gray-600">
                <strong className="text-gray-800">Total:</strong>
                <span className="ml-2 bg-green-100 text-green-700 px-2 py-1 rounded font-medium">
                  $
                  {order.total.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </p>
              <p className="text-gray-600">
                <strong className="text-gray-800">Status:</strong>
                <span
                  className={`ml-2 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    order.status === "Processing"
                      ? "bg-red-100 text-red-700"
                      : order.status === "Shipped"
                      ? "bg-green-100 text-green-700"
                      : "bg-purple-100 text-purple-700"
                  }`}
                >
                  {order.status}
                </span>
              </p>
              <p className="text-gray-600 sm:col-span-2">
                <strong className="text-gray-800">Shipping:</strong>
                <span className="ml-2 block bg-gray-50 p-2 rounded mt-1">
                  {order.shippingInfo.address}, {order.shippingInfo.city},
                  {order.shippingInfo.state}, {order.shippingInfo.country} -
                  {order.shippingInfo.pinCode}
                </span>
              </p>
            </div>

            {/* Order Items Table */}
            <div className="mt-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <span className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></span>
                Order Items
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[600px]">
                  <thead className="bg-gray-50">
                    <tr>
                      {["Product", "Price", "Quantity", "Total"].map(
                        (header) => (
                          <th
                            key={header}
                            className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                          >
                            {header}
                          </th>
                        )
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {order.orderItems.map((item: any) => (
                      <tr
                        key={item._id}
                        className="hover:bg-gray-50 transition-all duration-200"
                      >
                        <td className="py-4 px-4">
                          <div className="flex items-center">
                            <img
                              src={`${import.meta.env.VITE_SERVER}/${
                                item.photo
                              }`}
                              alt={item.name}
                              className="h-12 w-12 rounded-lg object-cover mr-4 ring-2 ring-gray-200"
                              // onError={(e) => (e.target.src = 'path/to/fallback-image.jpg')}
                            />
                            <span className="text-gray-700 font-medium">
                              {item.name}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-gray-600">
                          $
                          {item.price.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                          })}
                        </td>
                        <td className="py-4 px-4">
                          <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-sm">
                            {item.quantity}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-gray-600 font-medium">
                          $
                          {(item.price * item.quantity).toLocaleString(
                            "en-US",
                            { minimumFractionDigits: 2 }
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
