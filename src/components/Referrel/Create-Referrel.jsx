import React, { useContext, useEffect, useState } from "react";

import { LinearProgress } from "@mui/material";
import api from "../../axios/api";
import toast from "react-hot-toast";
import { userContext } from "../../App";
import { getUser } from "../getUser/getUser";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import addLogo from '../../assets/addLogo.png'


const CreateReferrel = () => {


    const [loader, setLoader] = useState(false);
    let { userAuth, setUserAuth } = useContext(userContext);

    const navigate = useNavigate()
    const { referrelid } = useParams()

    useEffect(() => {
        checkSignIn();
        if (referrelid) {
            getRef()
        }

    }, []);

    const getRef = () => {
        setLoader(true)
        api.post('/get-referel_by_id', { _id: referrelid }, {
            headers: {
                'Authorization': `Berear ${userAuth && userAuth.access_token}`
            }
        }).then((res) => {
            setInfo(res.data)
            setImageUrl(res.data.logoURL)
            setLoader(false)
        })
            .catch(err => {
                console.log(err.message);
                setLoader(false)
            })
    }

    const checkSignIn = async () => {
        const user = await getUser();

        if (user) {
            setUserAuth(user)
            sessionStorage.setItem("user", JSON.stringify(user));
        } else {
            navigate('/login');
        }
    };

    const [imageUrl, setImageUrl] = useState('');



    const [info, setInfo] = useState({
        email: "",
        companyName: "",
        mobileNumber: "",
        websiteURL: "",
        logoURL: "",
        description: "",
        referrelid: null

    });

    const handleChange = (e) => {
        setInfo({ ...info, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        if (!info.companyName) {
            return toast.error('company name is required.')

        }
        if (!info.email) {
            return toast.error('email is required.')

        }


        if (!info.mobileNumber) {
            return toast.error('mobile number is required.')

        }
        if (!info.websiteURL) {
            return toast.error('website URL is required.')

        }
        if (!info.description) {
            return toast.error('Description is required.')

        }
      
        e.preventDefault();

        const data = new FormData()
        data.append('email', info.email)
        data.append('companyName', info.companyName)
        data.append('mobileNumber', info.mobileNumber)
        data.append('websiteURL', info.websiteURL)
        data.append('logoURL', info.logoURL)
        data.append('description', info.description)
        referrelid && data.append('referrelid', referrelid)
        setLoader(true);



        api
            .post("/add-referrel", data, {
                headers: {
                    Authorization: `Berear ${userAuth && userAuth.access_token}`,
                },
            })
            .then((res) => {
                setLoader(false)
                setInfo({
                    email: "",
                    companyName: "",
                    mobileNumber: "",
                    websiteURL: "",
                    logoURL: "",
                    description: "",
                    referrelid: null
                })
                return toast.success(res.data.message)
            })
            .catch((err) => {
                setLoader(false)
                return toast.error(err.response.data.error)
            });
    };

    const handleImageChange = (e) => {
        setInfo({ ...info, logoURL: e.target.files[0] })

        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onload = (e) => {
            setImageUrl(e.target.result);
        };

        reader.readAsDataURL(file);

    }

    return (
        <>
            <Navbar />
            <section className="w-full min-h-screen h-auto max-md:p-4 p-16 bg-[#EDEDED]">
                <div className="w-full h-auto rounded-md bg-white p-4 md:p-12 shadow-md ">
                    <div className="w-full  mt-8 p-8  ">
                        <h1 className="text-center text-2xl md:text-4xl font-bold text-orange-500">
                            Add Referrel
                        </h1>
                        {loader ? (
                            <LinearProgress
                                color="inherit"
                                style={{
                                    margin: "1rem 0 ",
                                    color: "#F26722",
                                }}
                            />
                        ) : (
                            <hr className="border-orange-500 border-2 mt-3 " />
                        )}
                    </div>

                    <div className="p-1 md:p-8 space-y-2 ">
                        <div className="flex gap-4 max-md:flex-col">
                            <div className="md:w-[50%] w-full space-y-2 ">
                                <label htmlFor="companyName">Enter Company Name</label>
                                <input
                                    onChange={handleChange}
                                    value={info.companyName}
                                    name="companyName"
                                    id="companyName"
                                    placeholder="Enter Company name"
                                    className="input"
                                    type="text"
                                />
                            </div>
                            <div className="md:w-[50%] w-full space-y-2">
                                <label htmlFor="mobileNumber">
                                    Enter WhatsApp/Contact Number
                                </label>
                                <input
                                    onChange={handleChange}
                                    name="mobileNumber"
                                    value={info.mobileNumber}
                                    id="mobileNumber"
                                    placeholder="Enter WhatsApp/Contact Number"
                                    className="input"
                                    type="number"
                                />
                            </div>
                        </div>
                        <div className="flex gap-4 max-md:flex-col">
                            <div className="md:w-[50%] w-full  space-y-2 ">
                                <label htmlFor="email">Enter The Email</label>
                                <input
                                    onChange={handleChange}
                                    name="email"
                                    value={info.email}
                                    id="email"
                                    placeholder="Enter Email corresponding to the Referrel"
                                    className="input"
                                    type="email"
                                />
                            </div>
                            <div className="md:w-[50%] w-full space-y-2 ">
                                <label htmlFor="website">Enter Website Link</label>
                                <input
                                    onChange={handleChange}
                                    name="websiteURL"
                                    value={info.websiteURL}
                                    id="website"
                                    placeholder="Enter Website Link"
                                    className="input"
                                    type="text"
                                />
                            </div>
                        </div>
                        <div className="flex gap-4 max-md:flex-col w-full">

                            <div className='md:w-[50%] w-full space-y-2'>
                                <div className="cursor-pointer border w-full h-[4rem] relative">
                                    <img src={imageUrl ? imageUrl : addLogo} className="cursor-pointer border w-full h-[4rem] object-contain" />
                                    <label className="w-[6rem] h-[2rem] bg-orange-600 absolute top-0 right-0 text-white text-sm flex items-center justify-center rounded-md md:hidden" htmlFor="logoURL">
                                        Add Logo
                                    </label>
                                </div>

                                <input id="logoURL" className="hidden" type="file" onChange={handleImageChange} />
                            </div>
                            <div className="md:w-[50%] w-full space-y-2'" >
                                <label htmlFor="logoURL" className="max-md:hidden border bg-orange-500 w-full h-full flex items-center justify-center text-2xl text-white rounded-md">
                                    Add Logo
                                </label>
                            </div>




                        </div>

                        <div>
                            <label htmlFor="description">Description</label>
                            <textarea
                                onChange={handleChange}
                                name="description"
                                id="description"
                                value={info.description}
                                placeholder="Write a Small Description About The Requirements "
                                className="input "
                            ></textarea>
                        </div>

                        <div className="w-full flex mt-4 ">
                            <button onClick={handleSubmit} className="btn mx-auto">
    
                                {referrelid ? "update" : 'Create'} Referrel
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default CreateReferrel;
