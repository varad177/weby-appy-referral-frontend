

import React, { useContext, useEffect, useState } from 'react'
import AnimationWrapper from '../Animation/AnimationWrapper'
import api from '../../axios/api'
import { getUser } from '../getUser/getUser'
import { userContext } from '../../App'
import { Link, useNavigate } from 'react-router-dom'
import { LinearProgress } from '@mui/material'
import Navbar from '../Navbar/Navbar'
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { Modal } from 'react-responsive-modal';
import 'react-responsive-modal/styles.css';
import toast from 'react-hot-toast'




const DeleteReferrel = () => {
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

    const handleDelete = async (refId) => {
        try {
            const confirmOptions = {
                customUI: ({ onClose }) => (
                    <Modal open={true} onClose={onClose} center>
                        <div>
                            <h2 className='font-bold'>Confirm Deletion</h2>
                            <p className='my-3'>Are you sure you want to delete this referral?</p>
                            <button className='btn' onClick={async () => {
                                onClose();
                                setLoader(true);

                                const response = await api.post('/delete-referrel', { _id: refId }, {
                                    headers: {
                                        'Authorization': `Bearer ${userAuth?.access_token || ''}`
                                    }
                                });

                                if (response.status === 200) {
                                    setReferrel(prevReferrels => prevReferrels.filter(item => item._id !== refId));
                                    toast.success("Referral deleted successfully");
                                    setLoader(false);

                                } else {
                                    throw new Error("Failed to delete referral");
                                }
                            }}>
                                Yes
                            </button>
                            <button className='btn ml-4' onClick={() => {
                                onClose();
                                setLoader(false);
                            }}>
                                No
                            </button>
                        </div>
                    </Modal>
                ),
            };

            // Display responsive confirmation dialog
            confirmAlert(confirmOptions);
        } catch (error) {
            setLoader(false);
            toast.error(error.message);
        }
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

                            <AnimationWrapper transition={{ duration: 1, delay: i * 0.08 }} className='flex relative col-12 col-md-6 col-lg-4 w-full md:w-[48%] lg:w-[32.8%] shadow-md rounded-md overflow-hidden hover:border hover:border-orange-600 h-[5rem] max-md:mt-1 gap-1 justify-center '>
                                <div onClick={() => navigate(`/view-referrel/${data._id}`)} className='w-[30%] p-3 '>
                                    <img className='img-fluid w-full h-full object-contain ' src={data.logoURL} alt="" />
                                </div>
                                <div className='w-[70%] '>
                                    <div className='text-center flex justify-center mt-4  '>
                                        <h1 className='font-bold text-xl'>{data.companyName}</h1>
                                    </div>

                                </div>
                                <div className='absolute right-0 h-full  '>
                                    <div onClick={() => handleDelete(data._id)} className='mx-auto   w-[3rem] bg-orange-500 py-[3px] px-2 text-center text-white h-full hover:bg-orange-700 flex items-center justify-center'>
                                        <i className="fa-solid fa-trash"></i></div>
                                </div>
                            </AnimationWrapper>


                        )
                    })
                }
            </section >
        </>
    )
}

export default DeleteReferrel
