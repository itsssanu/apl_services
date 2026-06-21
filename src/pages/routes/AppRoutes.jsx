import { Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";

import ProtectedRoute from "../../auth/ProtectedRoute";
import DashboardLayout from "../../components/Layout/DashboardLayout";

// Auth
import LoginPage from "../auth/LoginPage";
import RegisterPage from "../auth/RegisterPage";
import ForgotPasswordPage from "../auth/ForgotPasswordPage";
import ResetPasswordPage from "../auth/ResetPasswordPage";

// Dashboard
import CustomersPage from "../../pages/dashboard/CustomersPage";
import AccessoriesPage from "../../pages/dashboard/AccessoriesPage";
import AmountPage from "../../pages/dashboard/AmountPage";
import CompanySetupPage from "../../pages/auth/CompanySetupPage";

// Profile
import ProfilePage from "../../pages/profile/ProfilePage";

// Context
import { useApp } from "../../context/AppContext";
import SecurityPage from "../settings/SecurityPage";
import SettingsPage from "../settings/SettingsPage";

export default function AppRoutes() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const {
    workItems,

    filters,
    setFilters,
    page,
    setPage,
    totalRows,
    handleSaveWorkItem,
    handleDeleteWorkItem,

    accessories,
    accessoryFilters,
    setAccessoryFilters,
    accessoryPage,
    setAccessoryPage,
    accessoryTotalRows,
    handleSaveAccessory,
    handleDeleteAccessory,

    amountRows,
    amountFilters,
    setAmountFilters,
    amountPage,
    setAmountPage,
    amountTotalRows,
  } = useApp();

  return (
    <Routes>

      {/* Authentication */}

      <Route path="/login" element={<LoginPage />} />

      <Route path="/register" element={<RegisterPage />} />

      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      <Route path="/reset-password" element={<ResetPasswordPage />} />

      {/* Protected Layout */}

      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout
              sidebarOpen={sidebarOpen}
              setSidebarOpen={setSidebarOpen}
              workItems={workItems}
            />
          </ProtectedRoute>
        }
      >

        <Route
          path="/"
          element={
            <CustomersPage
              items={workItems}
              onSave={handleSaveWorkItem}
              onDelete={handleDeleteWorkItem}
              filters={filters}
              setFilters={setFilters}
              page={page}
              setPage={setPage}
              totalRows={totalRows}
            />
          }
        />

        <Route
          path="/accessories"
          element={
            <AccessoriesPage
              accessories={accessories}
              onSave={handleSaveAccessory}
              onDelete={handleDeleteAccessory}
              filters={accessoryFilters}
              setFilters={setAccessoryFilters}
              page={accessoryPage}
              setPage={setAccessoryPage}
              totalRows={accessoryTotalRows}
            />
          }
        />

        <Route
          path="/amount"
          element={
            <AmountPage
              amountSummary={amountRows}
              filters={amountFilters}
              setFilters={setAmountFilters}
              page={amountPage}
              setPage={setAmountPage}
              totalRows={amountTotalRows}
            />
          }
        />

        <Route
          path="/company-setup"
          element={<CompanySetupPage />}
        />

        <Route
          path="/profile"
          element={<ProfilePage />}
        />
        <Route
          path="/settings"
          element={<SettingsPage />}
        />
        <Route
          path="/security"
          element={<SecurityPage />}
        />

      </Route>

      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />

    </Routes>
  );
}