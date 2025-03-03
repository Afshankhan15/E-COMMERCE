import React from 'react'
import SideBar from '../../components/admin/Sidebar'
// import Header from '../../components/header'
// const DefaultLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
const AdminLayout:React.FC<{ children: React.ReactNode}> = ({children}) => {
  return (
    <div className='w-full flex'>
        <SideBar />
       {/* <main className='w-full lg:w-[calc(100%-250px)] lg:ml-[250px] min-h-screen flex flex-col p-8 gap-8 bg-slate-100'> */}
       <main className='w-full lg:w-[calc(100%-250px)] lg:ml-[250px] min-h-screen flex flex-col p-8 gap-8 bg-slate-50'>
        {/* <Header user={null}/> */}
        {children}
      </main>
    </div>
  )
}

export default AdminLayout
