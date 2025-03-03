import ProductCard from "../components/product-card";
import ListIcon from "@mui/icons-material/List";
import CloseIcon from "@mui/icons-material/Close";
import clsx from "clsx";
import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { toast } from "react-hot-toast";
import { Product } from "../types/types";
import { addToCart } from "../redux/reducer/cartReducer";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../hooks";
import { useSelector } from "react-redux";
// import { RootState } from "../redux/reducer/store";
// import { RootState } from "../redux/reducer/store";
import { RootState } from "../redux/reducer/store";
const Search = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  console.log(search);
  const [sort, setSort] = useState("");
  const [maxPrice, setMaxPrice] = useState<number>(1000);
  const [category, setCategory] = useState("");
  // const [page, setPage] = useState(1);

  const [products, setProducts] = useState<Product[]>([]); // PRODUCT DATA
  const [categoryTypes, setCategoryTypes] = useState<string[]>([]); // productCategory":["camera","laptop"]}

  const [isFilterListOpen, setisFilterListOpen] = useState<boolean>(false);
  const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth); // Track window width


  const {user} = useSelector((state: RootState) => state.userReducer)

  // Track screen size to manage the visibility of the sidebar
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth); // Update window width on resize
    };

    // Add resize listener
    window.addEventListener("resize", handleResize);

    // Clean up on unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []); // Empty array to run this effect only once when the component mounts

  // Whenever windowWidth changes, adjust the visibility of the sidebar
  useEffect(() => {
    if (windowWidth >= 640) {
      setisFilterListOpen(false); // Hide filter list on screens larger than 'sm'
    }
  }, [windowWidth]); // Dependency on windowWidth, will run every time it changes

  // handleFilterListItem


 
   const handleAddToCart = (product: any) => {

    // Check if user is logged in
    if (!user) {
      toast.error("Please log in to add items to your cart");
      navigate("/login");
      return;
    }
  
      if(product.stock < 1) {
        return toast.error("Out of stock");
      }
      console.log(`Product with ID: ${product._id} added to cart.`, product);
      dispatch(addToCart(product))
      toast.success("Product added to cart");
      navigate('/cart')
    };

  // FETCH CATEGORY OF PRODUCTS BEFORE SEARCH
  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER}/api/v1/product/category`
      );

      console.log(response.data);
      setCategoryTypes(response.data.productCategory);
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

  // SEARCH PRODUCTS
  const filterProducts = async () => {
    try {
      // Construct query parameters dynamically
      const params = new URLSearchParams();

      if (search) params.append("search", search);
      if (maxPrice > 1000) params.append("price", maxPrice.toString()); // Convert number to string
      if (category) params.append("category", category);
      if (sort) params.append("sort", sort);

      console.log("params", params.toString());

      // const response = await axios.get(
      //   `${import.meta.env.VITE_SERVER}/api/v1/product/filter?search=${search}&price=${maxPrice}&category=${category}&sort=${sort}`);

      // above is correct but if only paramater has values then do add it in params like search, price, category, sort
      const url = `${import.meta.env.VITE_SERVER}/api/v1/product/filter?${params.toString()}`;
      const response = await axios.get(url);
      console.log(response.data);
      setProducts(response.data.products);
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

  useEffect(() => {
    filterProducts();
  }, [search, maxPrice, category, sort]);

  useEffect(() => {
    fetchCategories();
  }, []);
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col md:flex-row gap-6 p-4 lg:p-8">
      {/* Filter Toggle Button */}
      <button
        onClick={() => setisFilterListOpen(!isFilterListOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300"
      >
        {isFilterListOpen ? <CloseIcon /> : <ListIcon />}
      </button>

      {/* Filter Sidebar */}
      <aside
        className={clsx(
          "bg-white p-6 rounded-2xl shadow-xl transform transition-all duration-300",
          "w-full md:w-80 lg:w-96 fixed md:sticky top-0 md:top-8 left-0 z-40",
          "border border-gray-100",
          isFilterListOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="sticky top-6 space-y-6">
          <h1 className="text-2xl font-bold text-gray-800 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Filters
          </h1>
          
          {/* Sort */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Sort By</label>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            >
              <option value="">Default</option>
              <option value="asc">Price: Low to High</option>
              <option value="desc">Price: High to Low</option>
            </select>
          </div>

          {/* Max Price */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">
              Max Price: ${maxPrice.toLocaleString()}
            </label>
            <input
              type="range"
              min={100}
              max={100000}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            >
              <option value="">All Categories</option>
              {categoryTypes.map((item) => (
                <option key={item} value={item}>
                  {item.charAt(0).toUpperCase() + item.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 w-full">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-800 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Products
            </h1>
            <div className="relative w-full max-w-md">
              <input
                placeholder="Search Products..."
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full p-4 pl-12 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all duration-300"
              />
              <svg
                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.length > 0 ? (
              products.map((item) => (
                <div
                  key={item._id}
                  className="transform hover:scale-105 transition-all duration-300"
                >
                  <ProductCard
                    productId={item._id}
                    photo={item.photo}
                    name={item.name}
                    price={item.price}
                    stock={item.stock}
                    handler={() => handleAddToCart(item)}
                  />
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-xl text-gray-500">No products found</p>
                <p className="text-sm text-gray-400 mt-2">Try adjusting your filters</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Overlay for mobile filter */}
      {isFilterListOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setisFilterListOpen(false)}
        />
      )}
    </div>
  );
};

export default Search;
