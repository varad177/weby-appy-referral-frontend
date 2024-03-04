import React, { useEffect, useState } from "react";

import loginbg from "../../assets/loginbg.jpg";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../axios/api";
import logo from "../../assets/webyappylogo.png";
import { getUser } from "../getUser/getUser";

const Login = () => {
  const [info, setInfo] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
   
    checkSignIn();
  }, []);

  const checkSignIn = async () => {
    // const data =  await getUser();
   const userInsession = sessionStorage.getItem('user')
   const data = JSON.parse(userInsession)
  
    if (data) {
      navigate("/");
      return
    }
  };

  const handleChange = (e) => {
    setInfo({ ...info, [e.target.name]: e.target.value });
  };

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!info.email) {
      return toast.error("please enter the email");
    }
    if (!info.password) {
      return toast.error("please enter the password");
    }
    const loading = toast.loading("wait! Authentication is in process");

    api
      .post("/login", info)
      .then((res) => {

        console.log("from login",res.data);
        toast.dismiss(loading);
        console.log("teh daa is ", res.data);

        sessionStorage.setItem("user", JSON.stringify(res.data));

        toast.success("login successfully completed");
        navigate("/");
      })
      .catch((err) => {
        toast.dismiss(loading);
        toast.error(err.response.data.error);
      });

    console.log(info);
  };

  return (
    <div className="font-mono w-full h-screen ">
      <div className="mx-auto">
        <div className="flex justify-center md:px-6 px-2 max-md:mt-12 ">
          <div className="w-full flex">
            <div className="w-full h-[100vh] overflow-hidden bg-gray-400 hidden lg:block lg:w-1/2 bg-cover rounded-l-lg">
              <img
                className="w-full h-full object-cover"
                src={loginbg}
                alt="Login Background"
              />
            </div>
            <div className="w-full lg:w-1/2 bg-white md:p-5 max-md:p-2 rounded-lg lg:rounded-l-none mt-12 space-y-4">
              <div className="md:w-[90%] w-[97%] h-auto mx-auto  ">
                <img
                  className="img-fluid mx-auto my-4 "
                  src={logo}
                  alt="loading"
                />
              </div>
              <h3 className="pt-4 text-2xl text-center">Welcome Back!</h3>
              <form className="px-8 pt-6 pb-8 mb-4 bg-white rounded">
                <div className="mb-4">
                  <label
                    className="block mb-2 text-sm font-bold text-gray-700"
                    htmlFor="email"
                  >
                    Email
                  </label>
                  <input
                    name="email"
                    className="w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                    id="email"
                    type="email"
                    value={info.email}
                    onChange={handleChange}
                    placeholder="email"
                  />
                </div>
                <div className="mb-4">
                  <label
                    className="block mb-2 text-sm font-bold text-gray-700"
                    htmlFor="password"
                  >
                    Password
                  </label>
                  <input
                    name="password"
                    value={info.password}
                    onChange={handleChange}
                    className="w-full px-3 py-2 mb-3 text-sm leading-tight text-gray-700 border  rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                    id="password"
                    type="password"
                    placeholder="password"
                  />
                </div>

                <div className="mb-6 text-center">
                  <button
                    onClick={handleSubmit}
                    className="w-full px-4 py-2 font-bold text-white bg-orange-600 rounded-full hover:bg-orange-700 focus:outline-none focus:shadow-outline"
                    type="button"
                  >
                    Sign In
                  </button>
                </div>
                <hr className="mb-6 border-t" />

                <div className="text-center">
                  <Link
                    className="inline-block text-sm text-blue-500 align-baseline hover:text-blue-800"
                    to="#"
                  >
                    Forgot Password?
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
