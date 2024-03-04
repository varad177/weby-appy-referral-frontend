import React, { useContext, useEffect } from "react";
import { getUser } from "../getUser/getUser";
import { Link, useNavigate } from "react-router-dom";
import { userContext } from "../../App";
import Navbar from "../Navbar/Navbar";

const Home = () => {
  const navigate = useNavigate();
  const { userAuth, setUserAuth } = useContext(userContext);

  useEffect(() => {
    checkSignIn();



  }, []);

  const checkSignIn = async () => {
    const user = await getUser();
    console.log(user);

    if (user) {
      setUserAuth(user)
      sessionStorage.setItem("user", JSON.stringify(user));
    } else {
      navigate('/login');
    }
  };

  return (
    <>
      <Navbar />
      <section className="w-full h-screen bg-[#EDEDED]">
        <div className="grid grid-cols-1 w-full  md:grid-cols-2  ">
          <div className=" p-4 md:p-5 grid w-full grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-lg w-full  p-4 md:p-8 bg-white shadow-md">
              <h2 className="mb-3 font-bold">
                {" "}
                <i className="fa-solid fa-user text-orange-500 mr-2"></i>
                Referrer{" "}
              </h2>
              <hr />
              <div>
                <ul className="mt-3 flex flex-col gap-1 space-y-3">
                  {userAuth && userAuth.task.includes("crr") && (
                    <li>
                      <Link
                        className="hover:text-blue-500"
                        to={"/create-referrer"}
                      >
                        <i className="fa-solid fa-plus text-orange-500 mr-2"></i>{" "}
                        create Referrer
                      </Link>
                    </li>
                  )}
                  {userAuth && userAuth.task.includes("vrr") && (
                    <li>
                      <Link
                        className="hover:text-blue-500"
                        to={"/view-referrers"}
                      >
                        <i className="fa-solid fa-eye text-orange-500 mr-2"></i>{" "}
                        View Referrers
                      </Link>
                    </li>
                  )}
                  {userAuth && userAuth.task.includes("err") && (
                    <li>
                      <Link className="hover:text-blue-500" to={"/edit-referrers"}>
                        <i className="fa-solid fa-pen text-orange-500 mr-2"></i>{" "}
                        Edit Referrer
                      </Link>
                    </li>
                  )}
                  {userAuth && userAuth.task.includes("drr") && (
                    <li>
                      <Link className="hover:text-blue-500" to={"/delete-referrers"}>
                        <i className="fa-solid fa-trash text-orange-500 mr-2"></i>{" "}
                        Delete Referrer{" "}
                      </Link>
                    </li>
                  )}
                  {userAuth && userAuth.task.includes("ama") && (
                    <li>
                      <Link
                        className="hover:text-blue-500"
                        to={"/assign-application"}
                      >
                        <i class="fa-solid text-orange-500  fa-user"></i> Assign
                        Micro Application
                      </Link>
                    </li>
                  )}
                </ul>
              </div>
            </div>
            <div className=" rounded-lg p-4 md:p-8 w-full bg-white shadow-md">
              <h2 className="mb-3 font-bold">
                {" "}
                <i className="fa-solid fa-user text-orange-500 mr-2"></i>
                Referrel
              </h2>
              <hr />
              <div>
                <ul className="mt-3 flex flex-col gap-1 space-y-3">
                  {userAuth && userAuth.task.includes("crl") && (
                    <li>
                      <Link
                        className="hover:text-blue-500"
                        to={"/create-referrel"}
                      >
                        <i className="fa-solid fa-plus text-orange-500 mr-2"></i>
                        Create Referrel
                      </Link>
                    </li>
                  )}
                  {userAuth && userAuth.task.includes("vrl") && (
                    <li>
                      <Link
                        className="hover:text-blue-500"
                        to={"/view-referrels"}
                      >
                        <i className="fa-solid fa-eye text-orange-500 mr-2"></i>
                        view Referrel
                      </Link>
                    </li>
                  )}
                  {userAuth && userAuth.task.includes("erl") && (
                    <li>
                      <Link
                        className="hover:text-blue-500"
                        to={"/edit-referrel"}
                      >
                        <i className="fa-solid fa-pen text-orange-500 mr-2"></i>{" "}
                        Edit Referrel
                      </Link>
                    </li>
                  )}
                  {userAuth && userAuth.task.includes("drl") && (
                    <li>
                      <Link
                        className="hover:text-blue-500"
                        to={"/delete-referrel"}
                      >
                        <i className="fa-solid fa-trash text-orange-500 mr-2"></i>{" "}
                        Delete Referrel
                      </Link>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
