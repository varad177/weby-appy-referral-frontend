

import React, { useContext, useEffect, useState } from 'react'
import AnimationWrapper from '../Animation/AnimationWrapper'
import api from '../../axios/api'
import { getUser } from '../getUser/getUser'
import { userContext } from '../../App'
import { Link, useNavigate } from 'react-router-dom'
import { LinearProgress } from '@mui/material'
import Navbar from '../Navbar/Navbar'

const ViewReferrel = () => {
    const [loader, setLoader] = useState(false);
    const navigate = useNavigate();
    const [referrel, setReferrel] = useState();
    const { userAuth, setUserAuth } = useContext(userContext);

    useEffect(() => {
        checkSignIn();
    }, []);

    const getAllRef = async () => {
        setLoader(true)
        try {
            const response = await api.get('/get-all-referels', {
                headers: {
                    'Authorization': `bearer ${userAuth && userAuth.access_token}`
                }
            });
            setReferrel(response.data);
            setLoader(false)
        } catch (err) {
            console.log(err.message);
            setLoader(false)
        }
    };

    const checkSignIn = async () => {
        const user = await getUser();
        console.log(user);

        if (!user) {
            return navigate('/login');
        }

        await setUserAuth(user);

        if (userAuth && userAuth.access_token == null) {
            return navigate('/login');
        }

        // Only call getAllRef once after setting userAuth
        getAllRef();
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
                {
                    referrel && referrel.map((data, i) => {

                        return (

                            <AnimationWrapper transition={{ duration: 1, delay: i * 0.08 }} className='flex col-12 col-md-6 col-lg-4 w-full md:w-[48%] lg:w-[32.8%] shadow-md rounded-md hover:border hover:border-orange-600 h-[6rem] max-md:mt-1 gap-1 p-3 justify-center'>
                                <div onClick={() => navigate(`/view-referrel/${data._id}`)} className='w-[30%]'>
                                    <img className='img-fluid w-full h-full object-contain ' src={data.logoURL} alt="" />
                                </div>
                                <div className='w-[70%]'>
                                    <div className='text-center mb-1'>
                                        <h1 className='font-bold text-xl'>{data.companyName}</h1>
                                    </div>
                                    <div className='flex relative gap-2 flex-col'>
                                        <div className='flex gap-2'><Link target='_blank' to={`mailto:${data.email}`} className='h-full w-1/2 text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:bg-gradient-to-l focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800 font-medium rounded-lg text-sm text-center'>Email</Link>
                                            <Link target='_blank' to={`https://wa.me/91${data.mobileNumber}
`} className='h-full w-1/2 text-white bg-gradient-to-r from-green-500 to-green-700 hover:bg-gradient-to-l focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-purple-800 font-medium rounded-lg text-sm text-center bg-green-500'>whatsapp</Link></div>
                                        <p className=' text-xs absolute -bottom-[1.5rem]  text-orange-600 right-8'>Referrel By - <span className='text-black'>{data.referrelBy}</span></p>
                                    </div>

                                </div>
                            </AnimationWrapper>


                        )
                    })
                }
            </section >
        </>
    )
}

export default ViewReferrel
