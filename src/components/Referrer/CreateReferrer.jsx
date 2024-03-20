

import React, { useContext, useEffect, useState } from 'react'


import { LinearProgress } from '@mui/material';
import api from '../../axios/api';
import toast from 'react-hot-toast';
import { userContext } from '../../App';
import { getUser } from '../getUser/getUser';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import addLogo from '../../assets/addLogo.png'


const CreateReferrer = () => {
    const { id } = useParams()
    const [loader, setLoader] = useState(false)
    let { userAuth, setUserAuth } = useContext(userContext)
    const [imageUrl, setImageUrl] = useState('');
 

    const [info, setInfo] = useState({
        email: "",
        password: "",
        companyName: "",
        contact: "",
        websiteURL: "",
        logoURL: "",
        _id: ""
    })
    const navigate = useNavigate()
    useEffect(() => {
        checkSignIn();

        if (id) {
            getUserToEdit(id)
            setInfo({ ...info, "_id": id })
        }

    }, []);

    const getUserToEdit = (id) => {
        try {
            setLoader(true)

            api.post('/get-user', { _id: id })
                .then((res) => {
                    setLoader(false)
                    console.log(res.data);
                    setImageUrl(res.data.logoURL)
                    setInfo({ ...info, ...res.data })

                })
                .catch(err => {
                    setLoader(false)
                   
                    return toast.error(err.response.data.error)

                })

        } catch (error) {
            return toast.error(error.message)
        }
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


    const handleChange = (e) => {
        setInfo({ ...info, [e.target.name]: e.target.value })
    }


    const handleSubmit = (e) => {
        e.preventDefault();
        if (info.email === "") {
            toast.error("Email is required.");
            return;
        }
        if (info.password === "") {
            toast.error("Password is required.");
            return;
        }
        if (info.companyName === "") {
            toast.error("Company name is required.");
            return;
        }
        if (info.contact === "") {
            toast.error("Contact is required.");
            return;
        }
        if (info.websiteURL === "") {
            toast.error("Website URL is required.");
            return;
        }
        if (info.logoURL === "") {
            toast.error("Logo URL is required.");
            return;
        }
      


        const data = new FormData()
        data.append('email', info.email)
        data.append('password', info.password)
        data.append('companyName', info.companyName)
        data.append('contact', info.contact)
        data.append('websiteURL', info.websiteURL)
        data.append('logoURL', info.logoURL)
        data.append('_id', info._id)
        setLoader(true)



        api.post('/add-referral-partner', data, {
            headers: {
                Authorization: `Berear ${userAuth && userAuth.access_token}`
            }
        }).then((res) => {
            setLoader(false)
            setInfo({
                email: "",
                password: "",
                companyName: "",
                contact: "",
                websiteURL: "",
                logoURL: "",
                _id: ""
            })
            return toast.success("Referrer added successfully 👍")
        })
            .catch(err => {
                setLoader(false)
                console.log(err);
                return toast.error(err.response.data.error)
            })
    }


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
            {
                loader && <LinearProgress
                    color="inherit"
                    style={{
                        color: '#F26722',
                    }}
                />
            }

            <section className='w-full min-h-screen h-auto max-md:p-4 p-16 bg-[#EDEDED]'>
                <div className='w-full shadow-md h-auto rounded-md bg-white p-4 md:p-12 '>



                    <div className='w-full  md:mt-8 mt-4 md:p-8  p-2 '>
                        <h1 className='text-center text-2xl md:text-4xl font-bold text-orange-500'>Create Referrer</h1>
                        <hr className='border-orange-500 border-2 mt-3 ' />

                    </div>

                    <div className='p-2 md:p-8 space-y-2 '>



                        <div className='flex gap-4 max-md:flex-col'>
                            <div className='md:w-[50%] w-full  space-y-2 '>
                                <label htmlFor="email">Enter Email of the Referrer</label>
                                <input onChange={handleChange} name='email' value={info.email} id='email' placeholder='Enter Email of the Referrer' className='input' type="email" />
                            </div>
                            <div className='md:w-[50%] w-full space-y-2 '>
                                <label htmlFor="password">Enter Password for the Referrer</label>
                                <input onChange={handleChange} name='password' value={info.password} id='password' placeholder='Enter Password for the Referrer' className='input' type="password" />
                            </div>
                        </div>

                        <div className='flex gap-4 max-md:flex-col'>
                            <div className='md:w-[50%] w-full space-y-2 '>
                                <label htmlFor="companyName">Enter Company Name</label>
                                <input onChange={handleChange} value={info.companyName} name='companyName' id='companyName' placeholder='Enter Company name' className='input' type="text" />
                            </div>
                            <div className='md:w-[50%] w-full space-y-2'>
                                <label htmlFor="contact">Enter WhatsApp/Contact Number</label>
                                <input onChange={handleChange} name='contact' value={info.contact} id='contact' placeholder='Enter WhatsApp/Contact Number' className='input' type="text" />
                            </div>

                        </div>
                        <div className='flex gap-4 max-md:flex-col'>

                            <div className='md:w-[50%] w-full space-y-2 '>
                                <label htmlFor="website">Enter Website Link</label>
                                <input onChange={handleChange} name='websiteURL' value={info.websiteURL} id='website' placeholder='Enter Website Link' className='input' type="text" />
                            </div>

                            <div className='md:w-[50%] w-full space-y-2'>
                                <label htmlFor="logoURL">Enter Company Logo </label>

                                <div className='w-full h-12 relative border'>
                                    <input id='logoImg' type="file" className='hidden' onChange={handleImageChange} />
                                    <img className=' md:w-full absolute left-0 h-full object-contain' src={imageUrl ? imageUrl : addLogo} alt="logo" />
                                    <label htmlFor='logoImg' className='bg-orange-600 absolute w-20 h-full flex items-center justify-center cursor-pointer text-white right-0 top-0'>
                                        Add Logo
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div className='w-full flex mt-4 '>
                            <button onClick={handleSubmit} className='btn mx-auto'>{id ? "Edit Referrer":"Create Referrer"}</button>
                        </div>
                    </div>


                </div>



            </section>
        </>
    )
}

export default CreateReferrer
