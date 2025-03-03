import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { shallowEqual, useSelector } from "react-redux";
import { addToCart } from "../redux/reducer/cartReducer";
// import { RootState } from "../redux/reducer/store";
// import { RootState } from "../redux/reducer/store";
import { RootState } from "../redux/reducer/store";
import toast from "react-hot-toast";
import ProductCard from "../components/product-card";
// import cameraImage from "../assets/images/camera.jpg";
import cameraImage from '../assets/images/camera.jpg';
import { CartItem, Product } from "../types/types";
import { useAppDispatch } from "../../hooks";
import { increment } from "../redux/reducer/userReducer";

const HomePage = () => {
  console.log("RE RENDER.........");
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [productData, setProductData] = useState<CartItem[]>([]);
  // const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  // const allCarts = useSelector((state: RootState) => state.cartReducer);

  // useSelector runs every time the state.userReducer changes.
  // When you dispatch increment, it updates state.userReducer.count, creating a new userReducer state object.
  // Even though user itself doesn’t change, useSelector sees the new state.userReducer reference and triggers a re-render because it doesn’t know the selected value (user) is unchanged—unless we tell it.

  // SHALLOW EQUAL
  // The simplest and most effective way to optimize this is to use Redux’s shallowEqual as the equality comparison function in useSelector.
  // This tells React to only re-render if the selected values (user) change, not just because the state.userReducer object reference changes.

  // const { user } = useSelector((state: RootState) => state.userReducer); // it will always re-render when userreducer chnages even user did not chnage but count chnages

  // Optimize useSelector with shallowEqual
  const { user } = useSelector(
    (state: RootState) => ({
      user: state.userReducer.user,
    }),
    shallowEqual // Prevents re-render unless user changes
  );
  const handleAddToCart = (product: CartItem) => {
    // Check if user is logged in
    if (!user) {
      toast.error("Please log in to add items to your cart");
      navigate("/login");
      return;
    }

    if (product.stock < 1) {
      return toast.error("Out of stock");
    }
    dispatch(addToCart(product));
    toast.success("Product added to cart");
    navigate("/cart");
  };

  const fetchLatestProduct = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER}/api/v1/product/latest`
      );
      const formattedProducts: CartItem[] = response.data.products.map(
        (item: Product) => ({
          productId: item._id,
          name: item.name,
          photo: item.photo,
          price: item.price,
          quantity: 1,
          stock: item.stock,
        })
      );
      setProductData(formattedProducts);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to fetch products");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLatestProduct();
  }, []);

  // const { count } = useSelector((state: RootState) => state.userReducer);

  const handleIncrement = () => {
    // setCount((prevCount) => prevCount + 1);
    dispatch(increment());
  };

  return (
    <div className="w-full flex flex-col bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Hero Section */}
      <div className="relative h-[36rem] w-full overflow-hidden">
        <img
          src={cameraImage}
          alt="camera"
          className="w-full h-full object-cover transform transition-transform duration-1000 hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/50 to-transparent flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-4 animate-fade-in-down">
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Unleash Your Shopping Adventure
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-100 mb-8 max-w-2xl animate-fade-in-up">
            Explore cutting-edge products with jaw-dropping deals.
          </p>
          <button
            onClick={() => navigate("/search")}
            className="relative px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-semibold text-lg shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-purple-700 transform transition-all duration-300 hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-blue-500/50"
          >
            <span className="relative z-10">Shop Now</span>
            <span className="absolute inset-0 bg-white/20 rounded-full opacity-0 hover:opacity-100 transition-opacity duration-300"></span>
          </button>
        </div>
      </div>

      {/* Latest Products Section */}
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-gray-800 mb-12 text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent animate-fade-in">
          Latest Products
        </h1>
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
              <div
                className="absolute inset-0 animate-spin rounded-full h-16 w-16 border-t-4 border-purple-600 opacity-50"
                style={{ animationDuration: "1.5s" }}
              ></div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {productData.map((item) => (
              <ProductCard
                key={item.productId}
                productId={item.productId}
                photo={item.photo}
                name={item.name}
                price={item.price}
                stock={item.stock}
                handler={() => handleAddToCart(item)}
              />
            ))}
          </div>
        )}
      </div>

      {/* <div>COUNT: {count}</div> */}
      <button onClick={handleIncrement}>ADD</button>
    </div>
  );
};

export default HomePage;

// if increment count using dispatch (without using USESELECTOR for anything ON same page) then it will not re-render the page
// that means update count value will not trigger re-render unlike USESTATE

// but as we used useSELECTOR for user then it will re-render the page when we dispatch increment (only bcz of useselector)
// But as soon as you add useSelector for user, the component re-renders on every userReducer state change (like increment).
// This is because useSelector subscribes to the Redux store, and without optimization, it reacts to any change in the selected state slice.

// How SHALLOW EQUAL Works: By default, useSelector uses strict equality (===) to compare the previous and next values it returns.
// If you select a slice like state.userReducer and any property (e.g., count) changes, a new object is created, triggering a re-render—even
// if the part you care about (e.g., user) is unchanged. shallowEqual does a shallow comparison of the selected object’s properties,
// only triggering a re-render if those properties differ.
