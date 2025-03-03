import AdminLayout from "../../layouts/admin";
import ProductTable from "../../components/admin/ProductTable";
import AddIcon from "@mui/icons-material/Add";
import ReactModal from "react-modal"; // modal
import AddProduct from "../../components/modal/AddProduct";
import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { useSelector } from "react-redux";
import { UserReducerInitialState } from "../../types/reducer-types";
import { Product } from "../../types/types";
import { toast } from "react-hot-toast";
import Loader from "../../components/loader";

// product App
const ProductPage = () => {
  const [isOpenAddProduct, setIsOpenAddProduct] = useState(false);
  const [productData, setProductData] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // modal toggle
  const togglePopupAddProduct = () => {
    setIsOpenAddProduct(!isOpenAddProduct);
  };

  // redux to fetch user_id from userReducer to use it in API ADMIN-PRODUCTS and NEW-PRODUCT
  const user = useSelector(
    (state: { userReducer: UserReducerInitialState }) => state.userReducer
  ); // // state.[reducer_name]
  console.log("redux-user", user);

  const fetchAllAdminProduct = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER}/api/v1/product/admin-products?id=${
          user?.user?._id
        }`
      );

      console.log(response.data);
      setProductData(response.data.products);
    } catch (error) {
      // Cast the error to AxiosError explicitly
      const axiosError = error as AxiosError;

      // Check if it's an AxiosError and handle it
      if (axiosError.response) {
        // Access AxiosError's response and status text
        toast.error(axiosError.response.statusText);
        console.error(
          "Error fetching products:",
          axiosError.response?.data || axiosError
        );
      } else {
        // Handle cases where the error doesn't have a response (e.g., network issues)
        toast.error("Network error or server unreachable");
        console.error("Axios error without response:", axiosError.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllAdminProduct();
  }, []);

  // Transform productData to include the action field
  const productTableData = productData.map((product) => ({
    photo: product.photo,
    name: product.name,
    price: product.price,
    stock: product.stock,
    action: `/manage-product/${product._id}`, // Example action
  }));

  if (isLoading) {
    return <Loader />; // Show a loading spinner while fetching data
  }

 

  return (
    <AdminLayout>
      <div className="flex flex-col w-full p-8">
        {/* Add Product Button */}
        <div className="flex justify-end mb-6">
          <button
            onClick={togglePopupAddProduct}
            className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            <AddIcon className="mr-2" />
            Add Product
          </button>
        </div>

        {/* Product Table */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <ProductTable data={productTableData} />
        </div>
      </div>

      {/* Add Product Modal */}
      <ReactModal
        isOpen={isOpenAddProduct}
        onRequestClose={togglePopupAddProduct}
        className="flex justify-center items-center min-h-screen bg-overlay/50 bg-gradient-to-t"
        overlayClassName="fixed inset-0 bg-transparent bg-opacity-50 flex justify-center items-center"
      >
        <AddProduct close={togglePopupAddProduct} />
      </ReactModal>
    </AdminLayout>
  );
};

export default ProductPage;