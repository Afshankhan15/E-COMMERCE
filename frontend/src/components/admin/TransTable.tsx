
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

interface TransTable {
  _id: string;
  user: string | null;
  total: number;
  discount: number;
  orderItems: any[];
  status: string;
}

interface TransTableProps {
  data: TransTable[];
}

const TransTable: React.FC<TransTableProps> = React.memo(({ data }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isAdminTransaction = location.pathname === "/admin/transaction";

  return (
    <div className="w-full overflow-x-auto bg-white rounded-xl shadow-lg">
      <table className="w-full min-w-[700px]">
        <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
          <tr>
            {["Amount", "Discount", "Quantity", "Status", "Action"].map(
              (header) => (
                <th
                  key={header}
                  className="py-4 px-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider first:rounded-tl-xl last:rounded-tr-xl"
                >
                  {header}
                </th>
              )
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {data.map((item) => (
            <tr
              key={item._id}
              className="group transition-all duration-300 hover:bg-gray-50 hover:shadow-md"
            >
              <td className="py-4 px-6 text-sm">
                <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-green-50 text-green-700 font-medium">
                  ${item.total.toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}
                </span>
              </td>
              <td className="py-4 px-6 text-sm">
                <span className="text-orange-600 font-medium">
                  ${item.discount.toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}
                </span>
              </td>
              <td className="py-4 px-6 text-sm">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-purple-100 text-purple-700 font-medium">
                  {item.orderItems.length}
                </span>
              </td>
              <td className="py-4 px-6 text-sm">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-all duration-200
                    ${
                      item.status === "Processing"
                        ? "bg-red-100 text-red-800 group-hover:bg-red-200"
                        : item.status === "Shipped"
                        ? "bg-green-100 text-green-800 group-hover:bg-green-200"
                        : item.status === "Delivered"
                        ? "bg-purple-100 text-purple-800 group-hover:bg-purple-200"
                        : "bg-gray-100 text-gray-800 group-hover:bg-gray-200"
                    }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full mr-2 
                      ${
                        item.status === "Processing"
                          ? "bg-red-500"
                          : item.status === "Shipped"
                          ? "bg-green-500"
                          : item.status === "Delivered"
                          ? "bg-purple-500"
                          : "bg-gray-500"
                      }`}
                  ></span>
                  {item.status}
                </span>
              </td>
              <td className="py-4 px-6 text-sm">
                <button
                  onClick={() => navigate(`/trans/${item._id}`)}
                  disabled={!isAdminTransaction}
                  className={`
                    relative inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium
                    transition-all duration-300 transform hover:-translate-y-0.5
                    ${
                      !isAdminTransaction
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-200"
                    }
                  `}
                >
                  <span className="relative z-10">Manage</span>
                  {isAdminTransaction && (
                    <span className="absolute inset-0 rounded-lg bg-blue-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
                  )}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {data.length === 0 && (
        <div className="py-12 text-center text-gray-500 bg-gray-50 rounded-b-xl">
          <p className="text-lg">No transactions found</p>
          <p className="text-sm mt-2">Start by creating a new transaction</p>
        </div>
      )}
    </div>
  );
});

export default TransTable;