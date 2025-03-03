import { Link } from "react-router-dom";
import {
  FaSearch,
  FaShoppingBag,
  FaSignInAlt,
  FaUser,
  FaSignOutAlt,
} from "react-icons/fa";
import { useState } from "react";
import { User } from "../types/types";
import { signOut } from "firebase/auth";
// import { auth } from "../firebase";
import {auth} from '../firebase'
import toast from "react-hot-toast";

interface PropsType {
  user: User | null;
}

const Header = ({ user }: PropsType) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const logoutHandler = async () => {
    try {
      await signOut(auth);
      toast.success("Signed Out Successfully");
      setIsOpen(false);
    } catch (error) {
      toast.error("Sign Out Failed");
    }
  };

  return (
    <nav className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Logo/Home */}
          <Link to="/" onClick={() => setIsOpen(false)} className="flex items-center gap-2">
            <span className="text-2xl font-bold tracking-tight">ShopEase</span>
          </Link>

          {/* Right: Navigation Icons */}
          <div className="flex items-center gap-6">
            <Link
              to="/search"
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-full hover:bg-indigo-700 transition-colors duration-200"
              title="Search"
            >
              <FaSearch size={20} />
            </Link>
            <Link
              to="/cart"
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-full hover:bg-indigo-700 transition-colors duration-200"
              title="Cart"
            >
              <FaShoppingBag size={20} />
            </Link>

            {user?._id ? (
              <div className="relative">
                <button
                  onClick={() => setIsOpen((prev) => !prev)}
                  className="p-2 rounded-full hover:bg-indigo-700 transition-colors duration-200"
                  title="Profile"
                >
                  <FaUser size={20} />
                </button>

                {/* Dropdown Menu */}
                {isOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-lg shadow-xl py-2 z-10 animate-fade-in">
                    {user.role === "admin" && (
                      <Link
                        to="/admin/dashboard"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 hover:bg-indigo-100 hover:text-indigo-600 transition-colors duration-200"
                      >
                        <FaUser size={16} />
                        Admin
                      </Link>
                    )}
                    <Link
                      to="/order"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 hover:bg-indigo-100 hover:text-indigo-600 transition-colors duration-200"
                    >
                      <FaShoppingBag size={16} />
                      Orders
                    </Link>
                    <button
                      onClick={logoutHandler}
                      className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-red-100 hover:text-red-600 transition-colors duration-200"
                    >
                      <FaSignOutAlt size={16} />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="p-2 rounded-full hover:bg-indigo-700 transition-colors duration-200"
                title="Login"
              >
                <FaSignInAlt size={20} />
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Overlay for closing dropdown on click outside */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-25 z-0"
        />
      )}
    </nav>
  );
};

export default Header;