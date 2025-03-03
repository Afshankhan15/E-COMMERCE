import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { toast } from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { Product } from "../types/types";
import { useSelector } from "react-redux";
import { UserReducerInitialState } from "../types/reducer-types";
import {
  Box,
  Typography,
  CardContent,
  CardMedia,
  Button,
  CircularProgress,
  Container,
  Divider,
  Paper,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
/*************  ✨ Codeium Command ⭐  *************/
/**
 * ManageProduct Component
 *
 * This component is responsible for fetching and displaying a single product to be managed by the admin
 *
 * @returns {JSX.Element} - a JSX element containing a single product to be managed by the admin
 */
/******  b725bbf2-4fa4-47da-91a5-1996fa60a6fd  *******/
const ManageProduct = () => {
  const navigate = useNavigate();

  const { productId } = useParams(); // to extract product-id from URL --> http://localhost:5173/manage-product/676c4a548610456126b5ee28

  console.log("productId", productId);

  const [product, setProduct] = useState<Product | null>(null); // OBJECT NOT ARRAY

  // redux to fetch user_id from userReducer to use it in API DELETE and UPDATE
  const user = useSelector(
    (state: { userReducer: UserReducerInitialState }) => state.userReducer
  ); // // state.[reducer_name]
  console.log("redux-user", user);

  const fetchSingleProduct = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER}/api/v1/product/${productId}`
      );
      setProduct(response.data.product);

      console.log(response.data);
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
    productId && fetchSingleProduct();
  }, [productId]);

  // DELETE PRODUCT : ONLY ADMIN CAN DELETE IT ->  http://localhost:4000/api/v1/product/6744b9690e5ccb69570bcf7e?id=agsgs
  const handleDelete = async (productId: string) => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_SERVER}/api/v1/product/${productId}?id=${
          user?.user?._id
        }`
      );
      console.log(response.data);
      if (response.status === 200) {
        toast.success("Product deleted successfully!");
      }
    } catch (error) {
      // Cast the error to AxiosError explicitly
      console.error(error);
    }
  };

  //  UPDATE PRODUCT : ONLY ADMIN CAN UPDATE IT ->  http://localhost:4000/api/v1/product/6744b9690e5ccb69570bcf7e?id=agsgs
  // const handleUpdate = async (productId: string) => {
  //   try {
  //     const response = await axios.put(
  //       `${import.meta.env.VITE_SERVER}/api/v1/product/${productId}?id=${
  //     user?.user?._id
  //   }`
  //     );
  //     console.log(response.data);
  //     if(response.status === 200){
  //       toast.success("Product deleted successfully!");
  //     }

  //   } catch (error) {
  //     // Cast the error to AxiosError explicitly
  //     console.error(error)
  //   }
  // }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate("/admin/product")}
        sx={{ mb: 3, color: "#1976d2" }}
      >
        Back to Products
      </Button>

      <Paper elevation={3} sx={{ borderRadius: 2, overflow: "hidden" }}>
        <Box sx={{ bgcolor: "#f5f5f5", p: 2 }}>
          <Typography variant="h5" component="h1" fontWeight="bold">
            Product Details
          </Typography>
        </Box>

        {user.loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
            <CircularProgress />
          </Box>
        ) : user.error ? (
          <Box sx={{ p: 4, textAlign: "center" }}>
            <Typography variant="h6" color="error">
              {user.error}
            </Typography>
          </Box>
        ) : product ? (
          <CardContent sx={{ p: 4 }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                gap: 4,
              }}
            >
              <CardMedia
                component="img"
                sx={{
                  width: { xs: "100%", md: 200 },
                  height: 200,
                  objectFit: "contain",
                  borderRadius: 2,
                  boxShadow: 1,
                }}
                image={`${import.meta.env.VITE_SERVER}/${product.photo}`}
                alt={product.name}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/fallback-product.jpg"; // Add a fallback image
                }}
              />

              <Box sx={{ flex: 1 }}>
                <Typography
                  variant="h4"
                  gutterBottom
                  sx={{ fontWeight: "medium" }}
                >
                  {product.name}
                </Typography>

                <Divider sx={{ my: 2 }} />

                <Box
                  sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}
                >
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography variant="subtitle1" color="text.secondary">
                      Price:
                    </Typography>
                    <Typography variant="body1">
                      ${product.price.toFixed(2)}
                    </Typography>
                  </Box>

                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography variant="subtitle1" color="text.secondary">
                      Stock:
                    </Typography>
                    <Typography variant="body1">
                      {product.stock} units
                    </Typography>
                  </Box>

                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography variant="subtitle1" color="text.secondary">
                      Category:
                    </Typography>
                    <Typography variant="body1">{product.category}</Typography>
                  </Box>

                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography variant="subtitle1" color="text.secondary">
                      ID:
                    </Typography>
                    <Typography variant="body1">{product._id}</Typography>
                  </Box>
                </Box>

                <Box
                  sx={{
                    mt: 3,
                    display: "flex",
                    gap: 2,
                    justifyContent: "flex-end",
                  }}
                >
                  <Button
                    variant="contained"
                    startIcon={<EditIcon />}
                    color="primary"
                    sx={{ borderRadius: 1 }}
                    // onClick={() => handleUpdate(product._id)}
                    disabled // Uncomment and implement handleUpdate when ready
                  >
                    Update
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<DeleteIcon />}
                    color="error"
                    sx={{ borderRadius: 1 }}
                    onClick={() => handleDelete(product._id)}
                  >
                    Delete
                  </Button>
                </Box>
              </Box>
            </Box>
          </CardContent>
        ) : (
          <Box sx={{ p: 4, textAlign: "center" }}>
            <Typography variant="h6" color="text.secondary">
              No product found
            </Typography>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default ManageProduct;
