import React from 'react'
import DeleteIcon from '@mui/icons-material/Delete';
import { User } from '../../types/types';
import { useAppDispatch } from '../../../hooks';
import { deleteCustomer } from '../../redux/reducer/customerReducer';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/reducer/store';
import { useNavigate } from 'react-router-dom';

interface CustomerDataProps {
    data: User[]
}
const CustomerTable:React.FC<CustomerDataProps> = ({data}) => {
const dispatch = useAppDispatch();
const navigate = useNavigate()

const loggedInAdmin = useSelector((state: RootState) => state.userReducer).user;

  const handleDeleteCustomer = async (customerId: string) => {

    try {
      if(!customerId) return;
      await dispatch(deleteCustomer({ customerId, adminId: loggedInAdmin?._id}))
      // dispatch(deleteCustomer(customerId, loggedInAdmin))
      .unwrap()
      .then((res: any) => { // res -> {success: true, message: 'Roman Deleted successfully'}
        toast.success(res?.message ?? "Customer deleted successfully");
        console.log("delete res -->", res?.message)
      })
      .catch((error: any) => {
        console.error("error in deleting cutomer", error);
        toast.error("error in deleting cutomer")
      })
    } catch (error) {
      console.error("error in deleting cutomer")
    }
  }

  const handleRowClick = (customerId: string) => {
    console.log("customer id", customerId)
    navigate(`/manage-customer/${customerId}`);
  };
  // const getImageUrl = (photo: string) => {
  //   // Check if photo is a full URL (starts with http or https)
  //   if (photo.startsWith('http://') || photo.startsWith('https://')) {
  //     return photo; // Use the full URL as-is
  //   }
  //   // Otherwise, assume it's a relative path and prepend the server URL
  //   return `${import.meta.env.VITE_SERVER}/${photo}`;
  // };
  return (
    <div className="w-full overflow-x-auto">
    <table className="w-full min-w-[640px]">
      <thead className="bg-gray-50">
        <tr>
          {['Avatar', 'Name', 'Gender', 'Email', 'Role', 'Action'].map((header) => (
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
        {data.map((item) => (
          <tr 
          onClick={() => handleRowClick(item._id)}
            key={item.email}
            className="hover:bg-gray-50 transition-colors"
          >
            <td className="py-4 px-6">
            <img
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-200"
                  // src={getImageUrl(item.photo)} // Use helper function
                  alt={`${item.name}'s avatar`}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/fallback-avatar.jpg'; // Update to a real fallback path
                  }}
                />
            </td>
            <td className="py-4 px-6 text-sm text-gray-900">{item.name}</td>
            <td className="py-4 px-6 text-sm text-gray-600">
              <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium
                ${item.gender === 'Male' ? 'bg-blue-100 text-blue-800' : 
                  item.gender === 'Female' ? 'bg-pink-100 text-pink-800' : 
                  'bg-gray-100 text-gray-800'}`}>
                {item.gender}
              </span>
            </td>
            <td className="py-4 px-6 text-sm text-gray-600">{item.email}</td>
            <td className="py-4 px-6 text-sm">
              <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium
                ${item.role === 'Admin' ? 'bg-purple-100 text-purple-800' : 
                  'bg-green-100 text-green-800'}`}>
                {item.role}
              </span>
            </td>
            <td className="py-4 px-6">
              <button
              onClick={() => handleDeleteCustomer(item._id)}
                className="text-red-600 hover:text-red-800 transition-colors"
                aria-label={`Delete ${item.name}`}
              >
                <DeleteIcon fontSize="small" />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    {data.length === 0 && (
      <div className="py-12 text-center text-gray-500">
        No customers found
      </div>
    )}
  </div>
)
}

export default CustomerTable