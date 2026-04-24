import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { HomePage } from "./pages/HomePage";
import { RideListPage } from "./pages/RideListPage";
import { RideDetailsPage } from "./pages/RideDetailsPage";
import { DriverDashboardPage } from "./pages/DriverDashboardPage";
import { AuthPage } from "./pages/AuthPage";
import { AdminPage } from "./pages/AdminPage";
import { VoyageurPage } from "./pages/VoyageurPage";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/rides" element={<RideListPage />} />
          <Route path="/rides/:id" element={<RideDetailsPage />} />
          <Route path="/ride-details" element={<RideDetailsPage />} />
          <Route path="/ride-details/:id" element={<RideDetailsPage />} />
          <Route path="/voyageur" element={<VoyageurPage />} />
          <Route path="/conducteur" element={<DriverDashboardPage />} />
          <Route path="/driver" element={<DriverDashboardPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
