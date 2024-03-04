import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import Login from "./components/Authentication/Login";
import { createContext, useEffect, useState } from "react";
import Home from "./components/Home/Home";
import Navbar from "./components/Navbar/Navbar";
import CreateReferrer from "./components/Referrer/CreateReferrer";
import CreateReferrel from "./components/Referrel/Create-Referrel";
import { getUser } from "./components/getUser/getUser";
import ViewReferrel from "./components/Referrel/ViewReferrel";
import ViewPerticularReferrel from "./components/Referrel/ViewPerticularReferrel";
import Notification from "./components/Notification/Notification";
import EditReferrel from "./components/Referrel/EditReferrel";
import DeleteReferrel from "./components/Referrel/DeleteReferrel";
import AssignApplication from "./components/Referrer/AssignApplication";
import AssignApplicatiomForm from "./components/Referrer/AssignApplicatiomForm";
import ViewReferrers from "./components/Referrer/ViewReferrers";
import EditReferrer from "./components/Referrer/EditReferrer";
import DeleteReferrer from "./components/Referrer/DeleteReferrer";
import DetailReferrer from "./components/Referrer/DetailReferrer";
import Admin from "./components/Admin/Admin";
import SideNav from "./components/Admin/SideNav";
import CompletedReferrels from "./components/Admin/CompletedReferrels";
import InCompleteReferrel from "./components/Admin/InCompleteReferrel";
import MonthlyAnalyticsChart from "./components/Admin/MonthlyAnalytics";
import BarGraph from "./components/Admin/MonthlyAnalytics";
import MonthlyAnalysisOfCompletedRef from "./components/Admin/MonthlyAnalysisOfCompletedRef";

export const userContext = createContext({});

function App() {
  const [userAuth, setUserAuth] = useState();

  useEffect(() => {
    checkSignIn();
  }, []);

  const checkSignIn = async () => {
    const user = await getUser();
    if (user != -1) {
      setUserAuth(user);
      sessionStorage.setItem("user", JSON.stringify(user));
    }
  };

  return (
    <userContext.Provider value={{ userAuth, setUserAuth }}>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="" element={<Home />} />
          <Route path="/create-referrer" element={<CreateReferrer />} />
          <Route path="/create-referrer/:id" element={<CreateReferrer />} />
          <Route path="/create-referrel" element={<CreateReferrel />} />
          <Route
            path="/create-referrel/:referrelid"
            element={<CreateReferrel />}
          />
          <Route path="/view-referrels" element={<ViewReferrel />} />
          <Route
            path="/view-referrel/:refId"
            element={<ViewPerticularReferrel />}
          />
          {/* <Route path="/notification" element={<Notification />} /> */}
          <Route path="/edit-referrel" element={<EditReferrel />} />
          <Route path="/delete-referrel" element={<DeleteReferrel />} />
          <Route path="/assign-application" element={<AssignApplication />} />
          <Route
            path="/assign-micro-application/:id"
            element={<AssignApplicatiomForm />}
          />
          <Route path="/view-referrers" element={<ViewReferrers />} />
          <Route path="/edit-referrers" element={<EditReferrer />} />
          <Route path="/delete-referrers" element={<DeleteReferrer />} />
          <Route path="/profile/:userId" element={<DetailReferrer />} />

          <Route path="/admin-panel" element={<SideNav />}>
            <Route path="weby-appy-all-referrels" element={<Admin />} />
            <Route
              path="weby-appy-business-referrels"
              element={<CompletedReferrels />}
            />
            <Route
              path="weby-appy-non-business-referrels"
              element={<InCompleteReferrel />}
            />
            <Route
              path="monthly-analytics"
              element={<BarGraph />}
            />
            <Route
              path="completed-referrel-monthly-analytics"
              element={<MonthlyAnalysisOfCompletedRef />}
            />
          </Route>
        </Routes>
      </Router>
    </userContext.Provider>
  );
}

export default App;
