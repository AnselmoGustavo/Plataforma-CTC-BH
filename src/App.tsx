import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "@/components/ProtectedRoute";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Events from "./pages/Events";
import Volunteers from "./pages/Volunteers";
import ParticipationReport from "./pages/ParticipationReport";
import FinancialReport from "./pages/FinancialReport";
import Associates from "./pages/Associates";
import RentalManagement from "./pages/RentalManagement";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Auth />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/events"
            element={
              <ProtectedRoute>
                <Events />
              </ProtectedRoute>
            }
          />
          <Route
            path="/volunteers"
            element={
              <ProtectedRoute>
                <Volunteers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/participation-report"
            element={
              <ProtectedRoute>
                <ParticipationReport />
              </ProtectedRoute>
            }
          />
          <Route
            path="/financial-report"
            element={
              <ProtectedRoute>
                <FinancialReport />
              </ProtectedRoute>
            }
          />
          <Route
            path="/rental-management"
            element={
              <ProtectedRoute>
                <RentalManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/associates"
            element={
              <ProtectedRoute>
                <Associates />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
