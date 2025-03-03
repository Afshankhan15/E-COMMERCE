// ManageCustomer.tsx
import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
// import { RootState } from "../../redux/reducer/store";
import { RootState } from "../../redux/reducer/store";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useAppDispatch } from "../../../hooks";
import { getSingleCustomer } from "../../redux/reducer/customerReducer";
import toast from "react-hot-toast";

const ManageCustomer: React.FC = () => {
  const { customerId } = useParams();
  //   const { customerId } = useParams<{ customerId: string }>();
  console.log("id --->", customerId);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { user } = useSelector((state: RootState) => state.userReducer);
  const { selectedCustomer, loading, error } = useSelector(
    (state: RootState) => state.customerReducer
  );

  useEffect(() => {
    if (customerId) {
      dispatch(getSingleCustomer({ customerId, adminId: user?._id }))
        .unwrap()
        .then((res: any) => {
          toast.success("single customer detail successfully");
          console.log("single customer res -->", res);
        })
        .catch((error: any) => {
          toast.error("error in fetching single cutomer");
          console.error("error in fetching single cutomer", error);
        });
    }
  }, [dispatch, customerId]);

  //   const getImageUrl = (photo: string) => {
  //     if (photo.startsWith("http://") || photo.startsWith("https://")) {
  //       return photo;
  //     }
  //     return `${import.meta.env.VITE_SERVER}/${photo}`;
  //   };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !selectedCustomer) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Typography variant="h6" color="error">
          {error || "Customer not found"}
        </Typography>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/admin/customer")}
          sx={{ mt: 2 }}
        >
          Back to Customers
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", p: 4 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate("/admin/customer")}
        sx={{ mb: 3 }}
      >
        Back to Customers
      </Button>

      <Card elevation={3} sx={{ borderRadius: 2 }}>
        <CardContent
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            p: 4,
          }}
        >
          {/* <Avatar
            src={getImageUrl(selectedCustomer.photo)}
            sx={{ width: 120, height: 120, mb: 3, border: "4px solid #eee" }}
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/fallback-avatar.jpg";
            }}
          /> */}

          <Typography variant="h4" gutterBottom>
            {selectedCustomer.name}
          </Typography>

          <Chip
            label={selectedCustomer.role}
            color={selectedCustomer.role === "admin" ? "secondary" : "primary"}
            sx={{ mb: 3 }}
          />

          <Box sx={{ width: "100%", maxWidth: 500 }}>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}
            >
              <Typography variant="subtitle1" color="text.secondary">
                Email:
              </Typography>
              <Typography variant="body1">{selectedCustomer.email}</Typography>
            </Box>

            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}
            >
              <Typography variant="subtitle1" color="text.secondary">
                Gender:
              </Typography>
              <Typography variant="body1">{selectedCustomer.gender}</Typography>
            </Box>

            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}
            >
              <Typography variant="subtitle1" color="text.secondary">
                ID:
              </Typography>
              <Typography variant="body1">{selectedCustomer._id}</Typography>
            </Box>

            {/* Add more fields as needed */}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ManageCustomer;
