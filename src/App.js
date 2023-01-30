import React, { useState } from 'react'
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import FillLeaves from './components/FillLeaves';
import ViewScreenshot from './components/ViewScreenshot';
import AllStatements from './components/AllStatements';
import Home from './components/Home';
import Help from './components/Help';
import Login from './components/Login';
import LoadingBar from 'react-top-loading-bar'


export default function App() {
  let apiServer = "http://localhost/absentee-react/backend/";
  const [progress, setProgress] = useState(0);
  const [logins, setLogins] = useState({ 'loggedinSection': 'none', 'adminKey': 'none' });
  return (
    <BrowserRouter>
      <LoadingBar color='red' progress={progress} onLoaderFinished={() => setProgress(0)} />
      <Routes>
        <Route exact path="/" element={<Home apiServer={apiServer} setProgress={setProgress} />} />
        <Route path="/fill-leaves" element={<FillLeaves apiServer={apiServer} setProgress={setProgress} logins={logins} setLogins={setLogins} />} />
        <Route path="/all-statements" element={<AllStatements apiServer={apiServer} setProgress={setProgress} logins={logins} setLogins={setLogins} />} />
        <Route path="/view-screenshot" element={<ViewScreenshot apiServer={apiServer} setProgress={setProgress} logins={logins} setLogins={setLogins} />} />
        <Route path="/help" element={<Help apiServer={apiServer} logins={logins} setLogins={setLogins} />} />
        <Route path="/login" element={<Login apiServer={apiServer} setProgress={setProgress} logins={logins} setLogins={setLogins} />} />
      </Routes>
    </BrowserRouter>
  )
}
