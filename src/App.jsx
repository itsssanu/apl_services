// // import { useEffect, useState } from 'react';
// // import { Routes, Route } from "react-router-dom";
// // import Sidebar from './components/Sidebar';
// // import TopNav from './components/TopNav';
// // import CustomersPage from './pages/CustomersPage';
// // import AccessoriesPage from './pages/AccessoriesPage';
// // import AmountPage from './pages/AmountPage';
// // import {
// //   getWorkItems,
// //   createWorkItem,
// //   updateWorkItem,
// //   deleteWorkItem
// // } from './services/workService';
// // import { getAccessories, createAccessory, updateAccessory, deleteAccessory } from './services/accessoryService';
// // import { getAmountSummary } from './services/amountService';
// // import { getCurrentMonthYear, getMonthDateRange } from './utils/constants';
// // import LoginPage from './pages/auth/LoginPage';
// // import RegisterPage from "./pages/auth/RegisterPage";


// // export default function App() {
// //   const [activePage, setActivePage] = useState('customers');
// //   const [sidebarOpen, setSidebarOpen] = useState(false);

// //   const current = getCurrentMonthYear();

// //   const range = getMonthDateRange(
// //     current.month,
// //     current.year
// //   );

// //   const [filters, setFilters] = useState({
// //     name: "",
// //     status: "",
// //     workType: "",
// //     priority: "",
// //     month: current.month,
// //     year: current.year,
// //     startDate: range.startDate,
// //     endDate: range.endDate

// //   });
// //   const [page, setPage] = useState(1);
// //   const [totalRows, setTotalRows] = useState(0);

// //   const LIMIT = 10;

// //   const [workItems, setWorkItems] = useState([]);

// //   const [accessoryFilters, setAccessoryFilters] = useState({
// //     workType: "",
// //     name: "",
// //     month: current.month,
// //     year: current.year,
// //     startDate: range.startDate,
// //     endDate: range.endDate
// //   });

// //   const [accessories, setAccessories] = useState([]);

// //   const [accessoryPage, setAccessoryPage] = useState(1);

// //   const [accessoryTotalRows, setAccessoryTotalRows] = useState(0);

// //   const [amountFilters, setAmountFilters] = useState({
// //     name: "",
// //     month: current.month,
// //     year: current.year,
// //     startDate: range.startDate,
// //     endDate: range.endDate
// //   });

// //   const [amountPage, setAmountPage] = useState(1);

// //   const [amountRows, setAmountRows] = useState([]);

// //   const [amountTotalRows, setAmountTotalRows] = useState(0);

// //   useEffect(() => {
// //     loadWorkItems();
// //   }, [filters, page]);

// //   useEffect(() => {
// //     loadAccessories();
// //   }, [accessoryFilters, accessoryPage]);

// //   useEffect(() => {
// //   if (activePage === "amount") {
// //     loadAmount();
// //   }
// // }, [activePage, amountFilters, amountPage]);

// //   async function loadWorkItems() {
// //     try {
// //       const result = await getWorkItems(filters, page, LIMIT);

// //       setTotalRows(result.count);

// //       const formatted = result.data.map(item => ({
// //         id: item.id,
// //         name: item.name,
// //         phone: item.phone,
// //         city: item.city,
// //         status: item.status,
// //         workType: item.work_type,
// //         comments: item.comments,
// //         date: item.work_date,
// //         priority: item.priority,
// //         dueDate: item.due_date,
// //         reminder: item.reminder,
// //         serviceAmount: item.service_amount,
// //         servicePaid: item.service_paid,
// //         serviceBalance: item.service_balance,

// //         accessoriesAmount: item.accessories_amount,
// //         accessoriesPaid: item.accessories_paid,
// //         accessoriesBalance: item.accessories_balance,

// //         accessories: item.accessories || []
// //       }));

// //       setWorkItems(formatted);

// //     } catch (err) {
// //       console.error(err);
// //     }
// //   }

// //   async function handleSaveWorkItem(item) {
// //     try {
// //       if (item.id) {
// //         await updateWorkItem(item.id, item);
// //       } else {
// //         await createWorkItem(item);
// //       }

// //       await loadWorkItems();
// //     } catch (err) {
// //       console.error(err);
// //     }
// //   }

// //   async function handleDeleteWorkItem(id) {
// //     try {
// //       await deleteWorkItem(id);

// //       await loadWorkItems();
// //     } catch (err) {
// //       console.error(err);
// //     }
// //   }

// //   async function loadAccessories() {

// //     const result = await getAccessories(
// //       accessoryFilters,
// //       accessoryPage,
// //       10
// //     );

// //     setAccessoryTotalRows(result.count);

// //     setAccessories(
// //       result.data.map(a => ({
// //         id: a.id,
// //         workType: a.work_type,
// //         buyDate: a.buy_date,
// //         productName: a.product_name,
// //         amount: a.amount
// //       }))
// //     );
// //   }

// //   async function handleSaveAccessory(item) {

// //     if (item.id)
// //       await updateAccessory(item.id, item);
// //     else
// //       await createAccessory(item);

// //     loadAccessories();
// //   }

// //   async function handleDeleteAccessory(id) {

// //     await deleteAccessory(id);

// //     loadAccessories();

// //   }

// //   async function loadAmount() {

// //     const result = await getAmountSummary(
// //       amountFilters,
// //       amountPage,
// //       10
// //     );

// //     setAmountTotalRows(result.count);

// //     setAmountRows(
// //   result.data.map(item => ({
// //     id: item.id,
// //     name: item.name,

// //     serviceAmount: Number(item.service_amount),
// //     servicePaid: Number(item.service_paid),
// //     serviceBalance: Number(item.service_balance),

// //     latestDate: item.work_date
// //   }))
// // );

// //   }

// //   return (
// //     <div className="flex h-screen bg-gray-100 overflow-hidden">
// //       {/* Sidebar */}
// //       <Sidebar
// //         active={activePage}
// //         onChange={setActivePage}
// //         open={sidebarOpen}
// //         onClose={() => setSidebarOpen(false)}
// //       />

// //       {/* Main content */}
// //       <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
// //         {/* Top nav */}
// //         <TopNav
// //           page={activePage}
// //           onMenuClick={() => setSidebarOpen(true)}
// //           notifCount={workItems.filter(i => i.status === 'Pending').length}
// //         />

// //         {/* Page content */}
// //         <main className="flex-1 overflow-y-auto">
// //           {activePage === 'customers' && (
// //             <CustomersPage
// //               items={workItems}
// //               onSave={handleSaveWorkItem}
// //               onDelete={handleDeleteWorkItem}
// //               filters={filters}
// //               setFilters={setFilters}
// //               page={page}
// //               setPage={setPage}
// //               totalRows={totalRows}
// //             />
// //           )}
// //           {activePage === 'accessories' && (
// //             <AccessoriesPage
// //               accessories={accessories}
// //               onSave={handleSaveAccessory}
// //               onDelete={handleDeleteAccessory}

// //               filters={accessoryFilters}
// //               setFilters={setAccessoryFilters}

// //               page={accessoryPage}
// //               setPage={setAccessoryPage}

// //               totalRows={accessoryTotalRows}
// //             />
// //           )}
// //           {activePage === 'amount' && (
// //             <AmountPage
// //               amountSummary={amountRows}
// //               filters={amountFilters}
// //               setFilters={setAmountFilters}
// //               page={amountPage}
// //               setPage={setAmountPage}
// //               totalRows={amountTotalRows}
// //             />
// //           )}
// //         </main>
// //       </div>
// //     </div>
// //   );

// //   return (
// //     <Routes>

// //         <Route
// //             path="/login"
// //             element={<LoginPage />}
// //         />

// //         <Route
// //             path="/register"
// //             element={<RegisterPage />}
// //         />

// //     </Routes>
// // );
// // }

// import { useState } from "react";
// import { Routes, Route, Navigate } from "react-router-dom";

// import Sidebar from "./components/Layout/Sidebar";
// import TopNav from "./components/Layout/TopNav";

// import CustomersPage from "./pages/dashboard/CustomersPage";
// import AccessoriesPage from "./pages/dashboard/AccessoriesPage";
// import AmountPage from "./pages/dashboard/AmountPage";

// import LoginPage from "./pages/auth/LoginPage";
// import RegisterPage from "./pages/auth/RegisterPage";

// import { useApp } from "./context/AppContext";
// import ProtectedRoute from "./auth/ProtectedRoute";
// import CompanySetupPage from "./pages/auth/CompanySetupPage";
// import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
// import ResetPasswordPage from "./pages/auth/ResetPasswordPage";
// import ProfilePage from "./pages/profile/ProfilePage";
// import DashboardLayout from "./components/Layout/DashboardLayout";

// export default function App() {
//   const [activePage, setActivePage] = useState("customers");
//   const [sidebarOpen, setSidebarOpen] = useState(false);

//   const {
//     // Customers
//     workItems,
//     filters,
//     setFilters,
//     page,
//     setPage,
//     totalRows,
//     handleSaveWorkItem,
//     handleDeleteWorkItem,

//     // Accessories
//     accessories,
//     accessoryFilters,
//     setAccessoryFilters,
//     accessoryPage,
//     setAccessoryPage,
//     accessoryTotalRows,
//     handleSaveAccessory,
//     handleDeleteAccessory,

//     // Amount
//     amountRows,
//     amountFilters,
//     setAmountFilters,
//     amountPage,
//     setAmountPage,
//     amountTotalRows,
//   } = useApp();

//   return (
//     <Routes>
//       {/* Authentication */}
//       <Route path="/login" element={<LoginPage />} />
//       <Route path="/register" element={<RegisterPage />} />

//       <Route
//         path="/forgot-password"
//         element={<ForgotPasswordPage />}
//       />

//       <Route
//         path="/reset-password"
//         element={<ResetPasswordPage />}
//       />

//       {/* Dashboard */}
//       <Route
//         element={
//           <ProtectedRoute>
//             <DashboardLayout
//               sidebarOpen={sidebarOpen}
//               setSidebarOpen={setSidebarOpen}
//               workItems={workItems}
//             />
//           </ProtectedRoute>
//         }
//       >

//         <Route
//           index
//           element={
//             <CustomersPage
//               items={workItems}
//               onSave={handleSaveWorkItem}
//               onDelete={handleDeleteWorkItem}
//               filters={filters}
//               setFilters={setFilters}
//               page={page}
//               setPage={setPage}
//               totalRows={totalRows}
//             />
//           }
//         />

//         <Route
//           path="accessories"
//           element={
//             <AccessoriesPage
//               accessories={accessories}
//               onSave={handleSaveAccessory}
//               onDelete={handleDeleteAccessory}
//               filters={accessoryFilters}
//               setFilters={setAccessoryFilters}
//               page={accessoryPage}
//               setPage={setAccessoryPage}
//               totalRows={accessoryTotalRows}
//             />
//           }
//         />

//         <Route
//           path="amount"
//           element={
//             <AmountPage
//               amountSummary={amountRows}
//               filters={amountFilters}
//               setFilters={setAmountFilters}
//               page={amountPage}
//               setPage={setAmountPage}
//               totalRows={amountTotalRows}
//             />
//           }
//         />

//         <Route
//           path="profile"
//           element={<ProfilePage />}
//         />

//         <Route
//           path="company-setup"
//           element={<CompanySetupPage />}
//         />

//       </Route>

//       <Route path="*" element={<Navigate to="/" replace />} />
//     </Routes>
//   );
// }


import AppRoutes from "./pages/routes/AppRoutes";

export default function App() {
  return <AppRoutes />;
}