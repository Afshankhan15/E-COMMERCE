import React from 'react'
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
//npm install --save react-circular-progressbar
// import { buildStyles, CircularProgressbar } from 'react-circular-progressbar';
// import 'react-circular-progressbar/dist/styles.css';
import clsx from 'clsx';
interface widgetProps {
    heading: string,
    amount: boolean,
    value: number,
    percentage: number,
    color: string
}
const Widget:React.FC<widgetProps> = ({heading, amount, value, percentage, color}) => {
    // const Widget = () => {
  return (
    <div className='w-[225px] flex gap-2 border rounded-md shadow-md bg-white p-8'>
        <div className='flex flex-col gap-1 w-1/2'>
        <p className='text-gray-600 text-sm'>{heading}</p>
        <h1 className='font-semibold text-xl'>
           {/* {amount === true} ? ${value} : {value} */}
           {amount === true ? `$${value}` : value}
            </h1>
        {/* <div className='flex gap-1 text-green-500 text-sm font-semibold'> */}
        <div className={clsx(
            'flex gap-1 text-sm font-semibold',
            percentage < 0 ? 'text-red-500' : "text-green-500"
        )}>
            <p> {percentage < 0 ? <TrendingDownIcon style={{fontSize:"1rem"}}/> : <TrendingUpIcon style={{fontSize:"1rem"}}/>} </p>
            {/* <p>+{percentage}%</p> */}
           <p>{percentage < 0 ? `${percentage}` : `+${percentage}`}</p>
        </div>
        </div>
        {/* percentage div */}
        {/* <div className='w-1/2 flex justify-center items-center'>
            
            <CircularProgressbar
            
             value={Math.abs(percentage)} // Use the absolute value to avoid negative progress
             text={`${percentage}%`} styles={buildStyles({pathColor: `${color}`, textColor:`${color}`, textSize:"1.5rem"})}/>
        </div> */}

      
    </div>
  )
}

export default Widget
