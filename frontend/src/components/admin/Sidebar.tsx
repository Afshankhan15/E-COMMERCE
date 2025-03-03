import DashboardCustomizeIcon from '@mui/icons-material/DashboardCustomize';
import ProductionQuantityLimitsIcon from '@mui/icons-material/ProductionQuantityLimits';
import PeopleIcon from '@mui/icons-material/People';
import PaidIcon from '@mui/icons-material/Paid';
import BarChartIcon from '@mui/icons-material/BarChart';
import PieChartIcon from '@mui/icons-material/PieChart';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TimerIcon from '@mui/icons-material/Timer';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import ListIcon from '@mui/icons-material/List';
import clsx from 'clsx';
import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';

const SideBar = () => {
  const location = useLocation();
  const [isListOpen, setIsListOpen] = useState<boolean>(false);

  const adminSidebarOptions = [
    {
      title: "Dashboard",
      options: [
        { services: "Dashboard", icons: <DashboardCustomizeIcon />, href: '/admin/dashboard' },
        { services: "Product", icons: <ProductionQuantityLimitsIcon />, href: '/admin/product' },
        { services: "Customer", icons: <PeopleIcon />, href: '/admin/customer' },
        { services: "Transaction", icons: <PaidIcon />, href: '/admin/transaction' },
      ],
    },
    {
      title: "Charts",
      options: [
        { services: "Bar", icons: <BarChartIcon />, href: '/def' },
        { services: "Pie", icons: <PieChartIcon />, href: '/def' },
        { services: "Line", icons: <TrendingUpIcon />, href: '/def' },
      ],
    },
    {
      title: "Apps",
      options: [
        { services: "Stopwatch", icons: <TimerIcon />, href: '/def' },
        { services: "Coupon", icons: <CurrencyRupeeIcon />, href: '/def' },
        { services: "Toss", icons: <CurrencyExchangeIcon />, href: '/def' },
      ],
    },
  ];

  const handleListItem = () => {
    setIsListOpen(!isListOpen);
  };

  return (
    <>
      {/* Sidebar */}
      <div
        className={clsx(
          'fixed top-0 left-0 w-[250px] h-screen bg-white shadow-lg p-6 overflow-y-auto scrollbar-hide z-10 transition-transform duration-300 ease-in-out',
          isListOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Logo */}
        <h1 className="text-2xl font-bold text-indigo-600 mb-8">Logo.</h1>

        {/* Sidebar Sections */}
        <div className="flex flex-col gap-8">
          {adminSidebarOptions.map((item, idx) => (
            <div key={idx}>
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                {item.title}
              </h2>
              <ul className="flex flex-col gap-2">
                {item.options.map((element, i) => (
                  <Link to={element.href} key={i}>
                    <li
                      className={clsx(
                        'flex items-center gap-3 p-3 rounded-lg text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-all duration-200',
                        location.pathname === element.href && 'bg-indigo-100 text-indigo-600 font-semibold'
                      )}
                    >
                      <span className="text-lg">{element.icons}</span>
                      <span>{element.services}</span>
                    </li>
                  </Link>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Close Button (Mobile) */}
        <div className="mt-8 lg:hidden">
          <button
            onClick={handleListItem}
            className="w-full py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
          >
            Close
          </button>
        </div>
      </div>

      {/* Toggle Button (Mobile) */}
      <button
        onClick={handleListItem}
        className={clsx(
          'lg:hidden fixed top-4 left-4 p-2 bg-indigo-600 text-white rounded-full shadow-md z-20 transition-opacity duration-200',
          isListOpen && 'opacity-0 pointer-events-none'
        )}
      >
        <ListIcon style={{ fontSize: '2rem' }} />
      </button>

      {/* Overlay (Mobile) */}
      {isListOpen && (
        <div
          onClick={handleListItem}
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-5"
        />
      )}
    </>
  );
};

export default SideBar;