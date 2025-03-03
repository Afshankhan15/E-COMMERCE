import SideBar from "../../components/admin/Sidebar"
import Widget from "../../components/admin/Widget"
import {WidgetData} from '../../assets/data.json'
import {InventoryData} from '../../assets/data.json'
import Chart from "../../components/admin/Chart"
import Inventory from "../../components/admin/Inventory"
import Table from "../../components/admin/Table"
import {transaction} from '../../assets/data.json'
const Dashboard = () => {
  
  return (
    <div className="w-full flex">
      <SideBar />
      {/* Second div with remaining width (100% - 250px) */}
      {/* ml-[250px] --> bcz of postion:fixed we take for sidebar so that scroll of 2nd div does not make sidebar to scroll */}
      <div className="w-full lg:w-[calc(100%-250px)] lg:ml-[250px] flex flex-col p-6 gap-8 bg-slate-100">
        {/* widget div */}
        <div className="flex flex-wrap gap-4 mx-auto justify-center">
        {WidgetData.map((item) => (
          <Widget
           heading = {item.heading}
           amount = {item.amount}
           value = {item.value}
           percentage={item.percentage}
           color={item.color}
           />
        ))}
        </div>
        {/* charts div */}
        <div className="flex flex-col lg:flex-row gap-8 my-8">
          {/* barchart */}
          <div className="w-[85%] mx-auto lg:w-[70%] p-6 border rounded-md shadow-md bg-white"> <Chart /> </div>
          
           {/* Inventory div */}
          <div className="w-[85%] mx-auto lg:w-1/4 p-6 flex flex-col gap-8 border rounded-md shadow-md bg-white">
            <h1 className="text-gray-600 font-semibold text-center text-xl">Inventory</h1>
          <div className="flex flex-col gap-10"> 
         {
          InventoryData.map((item) => (
            <Inventory
            label={item.label}
            percentage={item.percentage}
            color={item.color}
             />
          ))
         }
          </div>
          </div>
        </div>

        {/* table */}
        <div className="flex p-4 overflow-auto bg-white border rounded-md shadow-md">
          <Table data={transaction} />
        </div>
      </div>

      
    </div>
  )
}

export default Dashboard
