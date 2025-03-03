import AdminLayout from "../../layouts/admin"
import CustomerTable from "../../components/admin/CustomerTable"
import { useSelector } from "react-redux"
// import { RootState } from "../../redux/reducer/store"
import { RootState } from "../../redux/reducer/store"
import { useEffect } from "react"
import { useAppDispatch } from "../../../hooks"
import { getCustomer } from "../../redux/reducer/customerReducer"
import toast from "react-hot-toast"

const Customer = () => {
  const dispatch = useAppDispatch()
  const {user} = useSelector((state: RootState) => state.userReducer)
  const {customers} = useSelector((state: RootState) => state.customerReducer)
  useEffect(() => {
    if(user) {
      dispatch(getCustomer(user._id))
      .unwrap()
      .then((customers: any) => {
        console.log("customers ----> ",customers); // customers ---->  (2) [{…}, {…}]
        toast.success("fetch customer successfully")
      })
      .catch((error: any) => console.error(error))
    }
  }, [user])
  return (
    <AdminLayout>
    <div className="px-4 py-6 md:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Customers</h1>
       
      </div>
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <CustomerTable data={customers} />
      </div>
    </div>
  </AdminLayout>
  )
}

export default Customer
