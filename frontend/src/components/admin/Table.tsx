import { useState } from 'react'
import {transaction} from '../../assets/data.json'

interface TransactionTable {
    _id: string,
    amount: number,
    quantity: number,
    discount: number,
    status: string
}
interface TableProps {
    data: TransactionTable[]; // Define the prop type as an [[[[[array of TransactionTable objects]]]]
  }
const Table:React.FC<TableProps> = ({data}) => {
    // store table sorted data
    // const [tableData, setTableData] = useState<TransactionTable[]>(transaction)
    const [tableData, setTableData] = useState<TransactionTable[]>(data)
    const [isAscending, setIsAscending] = useState<boolean>(false)
    // handleSort quantity
    // const handleSortQuantity = () => {
    //     setIsAscending(!isAscending)
    //     const tempTable = [...transaction]
    //     console.log("tempTable", tempTable)
    //     const sortedTable = tempTable.sort((a, b) => a.quantity - b.quantity)
    //    !isAscending ?  setTableData(sortedTable) : setTableData(transaction)
    // }
    // // handleSort Amount
    // const handleSortDiscount = () => {
    //     setIsAscending(!isAscending)
    //     const tempTable = [...transaction]
    //     console.log("tempTable", tempTable)
    //     const sortedTable = tempTable.sort((a, b) => a.discount - b.discount)
    //    !isAscending ?  setTableData(sortedTable) : setTableData(transaction)
    // }
    // // handleSort Amount
    // const handleSortAmount = () => {
    //     setIsAscending(!isAscending)
    //     const tempTable = [...transaction]
    //     console.log("tempTable", tempTable)
    //     const sortedTable = tempTable.sort((a, b) => a.amount - b.amount)
    //    !isAscending ?  setTableData(sortedTable) : setTableData(transaction)
    // }
     // Generic handleSort function
     const handleSort = (key: keyof TransactionTable) => {
        setIsAscending(!isAscending)
    
        // Use bracket notation to access the property dynamically
        const sortedTable = [...transaction].sort((a, b) => {
            if (a[key] < b[key]) return isAscending ? 1 : -1
            if (a[key] > b[key]) return isAscending ? -1 : 1
            return 0
        })

         // If table is already sorted, reset to original data
        //  if (isAscending) {
        //     setTableData(transaction)
        // } else {
        //     setTableData(sortedTable)
        // }
    
        setTableData(sortedTable)
    }
  return (
   <table className='w-full'>
    {/* table header */}
    <tr className='bg-slate-100'>
        <th className='py-4 px-4 text-start text-slate-400 text-md'>Id</th>
        <th onClick={() => handleSort('quantity')} className='py-4 px-4 text-start text-slate-400 text-md'>Quantity</th>
        <th onClick={() => handleSort('discount')} className='py-4 px-4 text-start text-slate-400 text-md'>Discount</th>
        {/* <th onClick={handleSortAmount} className='py-2 px-4 text-start'>Amount</th> */}
        <th onClick={() => handleSort('amount')} className='py-4 px-4 text-start text-slate-400 text-md'>Amount</th>
        <th  onClick={() => handleSort('status')}  className='py-4 px-4 text-start text-slate-400 text-md'>Status</th>
    </tr>

    {/* table body */}
    {
        // transaction.map((item) => (
        tableData.map((item) => (
            <tr>
            <td className='py-4 px-4 text-start border-b-[1.5px] border-b-gray-200'>{item._id}</td>
            <td className='py-4 px-4 text-start border-b-[1.5px] border-b-gray-200'>{item.quantity}</td>
            <td className='py-4 px-4 text-start border-b-[1.5px] border-b-gray-200'>{item.discount}</td>
            <td className='py-4 px-4 text-start border-b-[1.5px] border-b-gray-200'>{item.amount}</td>
            <td className='py-4 px-4 text-start border-b-[1.5px] border-b-gray-200'>{item.status}</td>
        </tr>
        ))
    }

   </table>
  )
}

export default Table
