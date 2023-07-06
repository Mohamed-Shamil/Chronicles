import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import LodignSpinners from "../Components/loginSpinners/lodignSpinners";

function AdminRouter() {
    const AdminLogin = lazy(() => import("../Pages/Admin/AdminLogin"))
    const AdminDashboard = lazy(()=> import('../Pages/Admin/AdminDashboard'))
  return (
    <div>
      {/* Admin SignIn page */}
      <Routes>
        <Route
          exact
          path="/admin"
          element={
            <Suspense fallback={<LodignSpinners />}>
              <AdminLogin />
            </Suspense>
          }
        ></Route>

<Route
          exact
          path="/admin/dashboard"
          element={
            <Suspense fallback={<LodignSpinners />}>
              <AdminDashboard />
            </Suspense>
          }
        ></Route>
      </Routes>
    </div>
  );
}

export default AdminRouter;
