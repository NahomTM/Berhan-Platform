import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import SignIn from "./pages/signin";
import Dashboard from "./pages/dashboard";
import ManageEmployee from "./components/admin/manageEmployee/page";
import ProtectedLayout from "./pages/ProtectedLayout";
import AdminPrivateRoute from "../utils/adminPrivateRoute"; // Verify correct import
import AddEmployee from "./components/admin/manageEmployee/addEmployee/page";
import ManageCourse from "./components/admin/manageCourse/page";
import NewCourse from "./components/admin/manageCourse/addCourse/page";
import InstructorPrivateRoute from "../utils/instructorPrivateRoute";
import DocumentUploader from "./components/instructor/manageUploads/newUpload/page";
import ManageUploads from "./components/instructor/manageUploads/page";
import MultiStepExamForm from "./components/instructor/manageExams/newExam/page";
import ManageExam from "./components/instructor/manageExams/page";
import AddStudent from "./components/admin/manageStudent/addStudent/page";
import ManageStudent from "./components/admin/manageStudent/page";
import UserProfile from "./pages/profile";
import MultiStepExamForm2 from "./components/instructor/manageExams/newExam/edit";
import MessageComponent from "./components/messages/page";
import ManageResult from "./components/instructor/manageResults/page";

const App = () => {
  const { isLoggedIn, logout } = useAuth();

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={isLoggedIn ? <Navigate to="/dashboard" /> : <SignIn />}
        />

        {isLoggedIn && (
          <>
            <Route
              path="/dashboard"
              element={
                <ProtectedLayout onLogout={logout}>
                  <Dashboard />
                </ProtectedLayout>
              }
            />
            <Route
              path="/manageProfile"
              element={
                <ProtectedLayout onLogout={logout}>
                  <UserProfile />
                </ProtectedLayout>
              }
            />
            {/* <Route
              path="/messages"
              element={
                <ProtectedLayout onLogout={logout}>
                  <MessageComponent />
                </ProtectedLayout>
              }
            /> */}
          </>
        )}

        {isLoggedIn && (
          <>
            <Route element={<AdminPrivateRoute />}>
              <Route
                path="/manageEmployee"
                element={
                  <ProtectedLayout onLogout={logout}>
                    <ManageEmployee /> {/* Check correct import/export */}
                  </ProtectedLayout>
                }
              />
              <Route
                path="/addNewEmployee"
                element={
                  <ProtectedLayout onLogout={logout}>
                    <AddEmployee /> {/* Check correct import/export */}
                  </ProtectedLayout>
                }
              />
              <Route
                path="/manageCourse"
                element={
                  <ProtectedLayout onLogout={logout}>
                    <ManageCourse /> {/* Check correct import/export */}
                  </ProtectedLayout>
                }
              />
              <Route
                path="/addNewCourse"
                element={
                  <ProtectedLayout onLogout={logout}>
                    <NewCourse /> {/* Check correct import/export */}
                  </ProtectedLayout>
                }
              />
              <Route
                path="/manageStudent"
                element={
                  <ProtectedLayout onLogout={logout}>
                    <ManageStudent /> {/* Check correct import/export */}
                  </ProtectedLayout>
                }
              />
              <Route
                path="/addNewStudent"
                element={
                  <ProtectedLayout onLogout={logout}>
                    <AddStudent /> {/* Check correct import/export */}
                  </ProtectedLayout>
                }
              />
            </Route>
            <Route element={<InstructorPrivateRoute />}>
              <Route
                path="/newUpload"
                element={
                  <ProtectedLayout onLogout={logout}>
                    <DocumentUploader /> {/* Check correct import/export */}
                  </ProtectedLayout>
                }
              />
              <Route
                path="/manageUploads"
                element={
                  <ProtectedLayout onLogout={logout}>
                    <ManageUploads /> {/* Check correct import/export */}
                  </ProtectedLayout>
                }
              />
              <Route
                path="/newExam"
                element={
                  <ProtectedLayout onLogout={logout}>
                    <MultiStepExamForm /> {/* Check correct import/export */}
                  </ProtectedLayout>
                }
              />
              <Route
                path="/manageExam"
                element={
                  <ProtectedLayout onLogout={logout}>
                    <ManageExam /> {/* Check correct import/export */}
                  </ProtectedLayout>
                }
              />
              <Route
                path="/manageResult"
                element={
                  <ProtectedLayout onLogout={logout}>
                    <ManageResult /> {/* Check correct import/export */}
                  </ProtectedLayout>
                }
              />
            </Route>
            
          </>
        )}

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

const AppWithProvider = () => (
  <AuthProvider>
    <App />
  </AuthProvider>
);

export default AppWithProvider;
