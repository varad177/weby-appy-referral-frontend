

import React, { useContext, useEffect, useState } from 'react'
import AnimationWrapper from '../Animation/AnimationWrapper'
import api from '../../axios/api'
import { getUser } from '../getUser/getUser'
import { userContext } from '../../App'
import { Link, useNavigate } from 'react-router-dom'
import { LinearProgress, Pagination } from '@mui/material'
import Navbar from '../Navbar/Navbar'

const EditReferrel = () => {
    const [loader, setLoader] = useState(false);
    const navigate = useNavigate();
    const [referrel, setReferrel] = useState();
    const { userAuth, setUserAuth } = useContext(userContext);
    const [search, setSearch] = useState({
        search: "",
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [totalEntries, setTotalEntries] = useState(0);
    const entriesPerPage = 10;
    const totalPages = Math.ceil(totalEntries / entriesPerPage);
    useEffect(() => {
        // checkSignIn();

    }, []);
    useEffect(() => {
        checkSignIn()
        api.get("/get-entries-count").then((res) => {
            console.log(res.data);
            setTotalEntries(res.data);
        });
        getAllRef();

    }, [search, currentPage])

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    const getAllRef = async () => {
        setLoader(true);
        try {
            const response = await api.post(
                "/get-all-referels",
                {
                    search: search.search,
                    page: currentPage,
                },
                {
                    headers: {
                        Authorization: `bearer ${userAuth && userAuth.access_token}`,
                    },
                }
            );
            setReferrel(response.data);
            setLoader(false);
        } catch (err) {
            console.log(err.message);
            setLoader(false);
        }
    };

    const checkSignIn = async () => {
        const user = sessionStorage.getItem("user");
        const token = JSON.parse(user).access_token;

        if (!token) {
            return navigate("/login");
        }
    };

    const handleSearch = (e) => {
        setSearch((prevSearch) => ({
            ...prevSearch,
            [e.target.name]: e.target.value,
        }));
    };



    return (
        <>
            <Navbar />
            <section className='row w-full mx-auto gap-2 cursor-pointer p-1  '>
                {loader &&
                    <LinearProgress
                        color="inherit"
                        style={{

                            color: "#F26722",
                        }}
                    />
                }
                <div className="flex justify-end w-full px-4 py-2">
                    <input
                        name="search"
                        value={search.search}
                        onChange={handleSearch}
                        type="text"
                        placeholder="search"
                        className="input-box"
                        autoComplete="off"
                    />
                </div>
                {
                    referrel && referrel.map((data, i) => {

                        return (

                            <AnimationWrapper transition={{ duration: 1, delay: i * 0.08 }} className='flex relative col-12 col-md-6 col-lg-4 w-full md:w-[48%] lg:w-[32.8%] shadow-md rounded-md overflow-hidden hover:border hover:border-orange-600 h-[5rem] max-md:mt-1 gap-1 justify-center '>
                                <div onClick={() => navigate(`/view-referrel/${data._id}`)} className='w-[30%] p-3 '>
                                    <img className='img-fluid w-full h-full object-contain ' src={data.logoURL} alt="" />
                                </div>
                                <div className='w-[70%] '>
                                    <div className='text-center flex justify-center mt-4  '>
                                        <h1 className='font-bold text-xl'>{data.companyName}</h1>
                                    </div>
                                    <div className='flex relative gap-2 flex-col'>

                                        <p className=' text-xs absolute -bottom-[1.5rem]  text-orange-600 right-16'>Referrel By - <span className='text-black'>{data.referrelBy}</span></p>
                                    </div>

                                </div>
                                <div className='absolute right-0 h-full  '>
                                    <div onClick={() => navigate(`/create-referrel/${data._id}`)} className='mx-auto   w-[3rem] bg-orange-500 py-[3px] px-2 text-center text-white h-full hover:bg-orange-700 flex items-center justify-center'>
                                        <i className="fa-solid fa-pen"></i></div>
                                </div>
                            </AnimationWrapper>


                        )
                    })
                }
                <div className="w-full flex justify-end py-4 ">
                    <Pagination
                        page={currentPage}
                        onChange={handlePageChange}
                        count={totalPages}
                        color="primary"
                    />
                </div>
            </section >
        </>
    )
}

export default EditReferrel
