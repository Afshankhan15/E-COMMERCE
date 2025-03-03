import React, { useState } from "react";
import axios, { AxiosError } from "axios";
import { useSelector } from "react-redux";
import { UserReducerInitialState } from "../../types/reducer-types";
import toast from "react-hot-toast";
// Define the type for the props
interface AddProductProps {
  close: () => void; // specify that close is a function that returns void
  product?: ProductType; // for UPDATE IT IS MUST
}
type ProductType = {
  name: string;
  photo: File | null; // FILE TYPE
  price: string;
  stock: string;
  category: string;
};

const AddProduct: React.FC<AddProductProps> = ({ close }) => {
  // const [product, setProduct] = useState({
  //    name: "",
  //    photo: "",
  //    price: 0,
  //    stock: 0,
  //    category: "",
  // })

  // redux useReducer
  const user = useSelector(
    (state: { userReducer: UserReducerInitialState }) => state.userReducer
  );
  console.log("redux-user", user);

  const [product, setProduct] = useState<ProductType>({
    name: "",
    photo: null,
    price: "", // Start with null
    stock: "", // Start with null
    category: "",
  });
  const handleClose = () => {
    close();
  };

  // THIS IS RIGHT BUT FOR PHOTO USE BELOW ONE
  //   handle product change
  // const handleProductChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //    setProduct((prev: any) => ({
  //       ...prev,
  //       [e.target.name]: e.target.value
  //    }))
  // }
  const handleProductChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, files } = e.target;

    if (type === "file") {
      setProduct((prev) => ({
        ...prev,
        photo: files ? files[0] : null, // Handle file input
      }));
    } else {
      setProduct((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  console.log("product", product);

  // ADD NEW PRODUCTS
  const handleAddProduct = async () => {
    if (!product.photo) {
      toast.error("Please add a photo");
      return;
    }
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER}/api/v1/product/new?id=${
          user?.user?._id
        }`,
        {
          name: product.name,
          price: parseFloat(product.price), // Convert to number
          stock: parseInt(product.stock), // Convert to number
          category: product.category,
          photo: product.photo, // Assuming you handle photo uploading separately
        },
        {
          headers: {
            "Content-Type": "multipart/form-data", // Important: Ensure proper content type
          },
        }
      );

      console.log(response.data);
      toast.success("Product added successfully!");
      handleClose(); // Close the form after success
      //   setProductData(response.data.products);
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
      // toast.error(error.response.statusText);
      // const err = error as CustomError
      // toast.error(err.data.message);
      console.error("Error fetching plants:", error);
    }
  };

  return (
    <div className="w-full sm:w-[500px] flex flex-col py-6 m-10 sm:m-0 px-10 border rounded-md bg-white overflow-y-auto">
      <h1 className="text-center text-xl font-semibold mb-2">New Product</h1>
      <div className="flex flex-col gap-1 ">
        <label htmlFor="Name">Name</label>
        <input
          type="text"
          placeholder="Enter Name"
          className="border rounded px-3 py-3 outline-none"
          name="name"
          value={product.name}
          onChange={handleProductChange}
        />
      </div>
      {/* price */}
      <div className="flex flex-col gap-1 mt-1">
        <label htmlFor="Price">Price</label>
        <input
          type="number"
          placeholder="Enter Price"
          className="border rounded px-3 py-3 outline-none"
          name="price"
          value={product.price}
          onChange={handleProductChange}
        />
      </div>
      {/* price */}
      <div className="flex flex-col gap-1 mt-1">
        <label htmlFor="Stock">Stock</label>
        <input
          type="number"
          placeholder="Enter Stock"
          className="border rounded px-3 py-3 outline-none"
          name="stock"
          value={product.stock}
          onChange={handleProductChange}
        />
      </div>
      {/* category */}
      <div className="flex flex-col gap-1 mt-1">
        <label htmlFor="Category">Category</label>
        <input
          type="text"
          placeholder="Enter Category"
          className="border rounded px-3 py-3 outline-none"
          name="category"
          value={product.category}
          onChange={handleProductChange}
        />
      </div>
      {/* Photo */}
      <div className="flex flex-col gap-1 mt-1">
        <label htmlFor="Photo">Photo</label>
        <input
          type="file"
          accept="image/*"
          placeholder="Enter Photo"
          className="border rounded px-3 py-3 outline-none"
          name="photo"
          //  value={product.photo}
          onChange={handleProductChange}
        />
      </div>
      {/* Display selected image preview */}
      {product.photo && (
        <div className="mt-2">
          <img
            src={URL.createObjectURL(product.photo)} // Create object URL from the photo file
            alt="Selected Preview"
            className="h-16 w-16 object-contain mx-auto"
          />
        </div>
      )}
      <div className="flex justify-center items-center mt-4">
       
        <button
          //  onClick={handleClose}
          onClick={handleAddProduct}
          className="border rounded-xl bg-blue-600 text-white p-1 font-semibold w-1/2"
        >
          Add product
        </button>
      </div>
    </div>
  );
};

export default AddProduct;