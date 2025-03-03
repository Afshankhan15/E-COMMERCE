import { useNavigate } from "react-router-dom";

interface ProductTableData {
  photo: string;
  name: string;
  price: number;
  stock: number;
  action: string;
}

interface ProductTableProps {
  data: ProductTableData[];
}

const ProductTable: React.FC<ProductTableProps> = ({ data }) => {
  const navigate = useNavigate();

  const handleManage = (action: string) => {
    console.log("action -->", action);
    navigate(action);
  };

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full min-w-[640px]">
        <thead className="bg-gray-50">
          <tr>
            {["Photo", "Name", "Price", "Stock", "Action"].map((header) => (
              <th
                key={header}
                className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {data.map((item, index) => (
            <tr
              key={`${item.name}-${index}`}
              className="hover:bg-gray-50 transition-colors"
            >
              <td className="py-4 px-6">
                <img
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-200"
                  src={`${import.meta.env.VITE_SERVER}/${item.photo}`}
                  alt={`${item.name} product`}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "path/to/fallback-image.jpg";
                  }}
                  loading="lazy"
                />
              </td>
              <td className="py-4 px-6 text-sm font-medium text-gray-900">
                {item.name}
              </td>
              <td className="py-4 px-6 text-sm text-gray-600">
                <span className="inline-flex items-center px-2 py-1 rounded-full bg-green-100 text-green-800">
                  $
                  {item.price.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </td>
              <td className="py-4 px-6 text-sm">
                <span
                  className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                    item.stock > 10
                      ? "bg-green-100 text-green-800"
                      : item.stock > 0
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {item.stock} in stock
                </span>
              </td>
              <td className="py-4 px-6">
                <button
                  onClick={() => handleManage(item.action)}
                  className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-100 rounded-lg hover:bg-blue-200 hover:text-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Manage
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {data.length === 0 && (
        <div className="py-12 text-center text-gray-500">No products found</div>
      )}
    </div>
  );
};

export default ProductTable;
