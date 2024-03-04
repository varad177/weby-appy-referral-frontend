import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../App";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import toast from "react-hot-toast";
import { Box, LinearProgress } from "@mui/material";
import { Link } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import api from "../../axios/api";
import AnimationWrapper from "../Animation/AnimationWrapper";
import Loader from "../Loader/Loader";

const InCompleteReferrel = () => {
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);
  const [referrel, setReferrel] = useState([]);

  const [expandedRows, setExpandedRows] = useState([]);
  const isMobileScreen = useMediaQuery({ maxWidth: 767 });

  const toggleDetails = (index) => {
    const newExpandedRows = [...expandedRows];
    newExpandedRows[index] = !newExpandedRows[index];
    setExpandedRows(newExpandedRows);
  };


  const changeWorkStatus = (id) => {
    const user = JSON.parse(sessionStorage.getItem("user"));

    api.post('/change-work-status', {
      id
    }, {
      headers: {
        'Authorization': `bearer ${user && user.access_token}`
      }
    }).then(() => {
      // Update referrel state directly
      setReferrel(prevReferrel => prevReferrel.map(ref => ref._id === id ? { ...ref, workDone: !ref.workDone } : ref));
    }).catch((error) => {
      console.error('Error changing work status:', error);
    });
  }

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    if (!user || !user.role === "admin") {
      return navigate("/login");
    }

    getAllRef();
  }, []);

  const getAllRef = async () => {
    console.log("false wwa[mksj");
    const user = JSON.parse(sessionStorage.getItem("user"));

    setLoader(true)
    try {
      const response = await api.post('/get-all-admin-referels', { workDone: false }, {
        headers: {
          'Authorization': `bearer ${user && user.access_token}`
        }
      });
      console.log(response.data);
      setReferrel(response.data);
      setLoader(false)
    } catch (err) {
      console.log(err.message);
      setLoader(false)
    }
  };




  return (
    <div className="w-full overflow-x-hidden ">
      <section className="w-full min-h-[100vh] h-auto bg-[#F4F5FE] ">
        <div className="w-[97%] rounded-lg bg-white mx-auto  ">
          <AnimationWrapper>
            <div className="w-full overflow-x-auto">
              <table className="w-full table-auto">
                <thead>
                  <tr>
                    <th className="px-2 py-2">SR NO</th>
                    <th className="px-2 py-2">Logo</th>
                    <th className="px-2 py-2">Referrel Name</th>
                    {!isMobileScreen && <th className="px-2 py-2">Email</th>}
                    {!isMobileScreen && (
                      <th className="px-2 py-2">Mobile No</th>
                    )}
                    {!isMobileScreen && <th className="px-2 py-2">Referred By</th>}
                    {!isMobileScreen && <th className="px-2 py-2">Created At</th>}
                    {!isMobileScreen && (
                      <th className="px-2 py-2">status</th>
                    )}
                    {isMobileScreen && <th className="px-2 py-2">Details</th>}
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {referrel.length ?
                    referrel.map((ref, i) => (
                      <React.Fragment key={i}>
                        <tr
                          className={`hover:bg-blue-200 transition-all duration-2000 ${isMobileScreen && expandedRows[i]
                            ? "border-b-2 border-blue-300"
                            : ""
                            }`}
                        >
                          <td className="border px-2 py-2">{i + 1}</td>
                          <td className="border px-2 py-2"><img className="w-12 h-8 object-contain" src={ref.logoURL} alt="logo" /></td>
                          <td className="border px-2 py-2">
                            <AnimationWrapper>
                              {ref.companyName}
                            </AnimationWrapper>
                          </td>
                          {!isMobileScreen && (
                            <td className="border px-2 py-2">
                              <AnimationWrapper>
                                {ref.email}
                              </AnimationWrapper>
                            </td>
                          )}
                          {!isMobileScreen && (
                            <td className="border px-2 py-2">
                              <AnimationWrapper>
                                {ref.mobileNumber}
                              </AnimationWrapper>
                            </td>
                          )}
                          {!isMobileScreen && (
                            <td className="border px-2 py-2">
                              <AnimationWrapper>
                                {ref.referrelBy}
                              </AnimationWrapper>
                            </td>
                          )}
                          {!isMobileScreen && (
                            <td className="border px-2 py-2">
                              <AnimationWrapper>{ref.createdAt}</AnimationWrapper>
                            </td>
                          )}
                          {!isMobileScreen && (
                            <td className="border px-2 py-2">
                              <i onClick={() => changeWorkStatus(ref._id)} className={"fa-solid fa-" + (ref.workDone ? "check" : "xmark") + " text-2xl ml-4 " + (ref.workDone ? " text-green-600 " : " text-red-600 ") + "  text-center cursor-pointer"}></i>
                            </td>
                          )}
                          {isMobileScreen && (
                            <td className="border px-2 py-2">
                              <button onClick={() => toggleDetails(i)}>
                                <i className="fa-solid fa-circle-down text-xl text-blue-700 text-center"></i>
                              </button>
                            </td>
                          )}
                        </tr>
                        {isMobileScreen && expandedRows[i] && (
                          <tr>
                            <td colSpan={5} className="border px-2 py-2">
                              <AnimationWrapper>
                                Email: {ref.email}, <br /> Mobile No:{" "}
                                {ref.mobileNumber}, <br /> Referred By: {ref.referrelBy},{" "} <br />
                                {ref.mobileNumber}, <br /> Created At: {ref.createdAt},{" "} <br />
                                <i onClick={() => changeWorkStatus(ref._id)} className={"fa-solid fa-" + (ref.workDone ? "check" : "xmark") + " text-2xl ml-4 " + (ref.workDone ? " text-green-600 " : " text-red-600 ") + "  text-center cursor-pointer"}></i>
                              </AnimationWrapper>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    )) : loader ? <Loader /> : ""}
                </tbody>
              </table>
            </div>
          </AnimationWrapper>
        </div>
      </section>
    </div>
  );
};

export default InCompleteReferrel;
