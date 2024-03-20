
import { Box, LinearProgress } from '@mui/material'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import api from '../../axios/api';

const ForgotResetPassword = () => {

    const [loader, setLoader] = useState(false);


    useEffect(() => {

        const getTokenFromURL = () => {
            const urlParams = new URLSearchParams(window.location.search);
            const token = urlParams.get('token');


            setInfo({ ...info, token: token })


        };

        getTokenFromURL();
    }, []);



    const [info, setInfo] = useState({
        token: "",
        newPassword: "",
        newPassword2: ""
    })


    const handleChange = (event) => {
        setInfo({ ...info, [event.target.name]: event.target.value })
    }


    const navigate = useNavigate()

    const handleSubmit = (e) => {
        e.preventDefault()

        if (info.newPassword != info.newPassword2) {
            return toast.error("password and confirm password not match")
        }

        setLoader(true)

        api.post('/reset-password', { token: info.token, newPassword: info.newPassword }).then((res) => {

            setLoader(false)
            toast.success(res.data.message)
            navigate('/login')



        }).catch(({ response }) => {
            setLoader(false)
            toast.error(response.data.error)
        })
    }



    return (
        <section className='w-screen bg-[#F5F7FF] h-screen flex mt-12 justify-center'>

            <div className=' flex shadow-md items-center justify-center flex-col w-[94%] md:w-[80%]  gap-2 md:gap-4 bg-white h-fit md:p-16 p-4  mt-20 rounded-2xl'>
                {loader && (
                    <Box sx={{ width: "100%" }}>
                        <LinearProgress
                            color="inherit"
                            style={{
                                margin: "1rem 0 ",
                                color: "#F26722",
                            }} />
                    </Box>
                )}
                <div className="w-full text-2xl flex items-center justify-center max-md:flex-col max-md:items-center max-md:gap-4">

                    <h1 className='text-center font-bold'>Forgot password</h1>
                   
                </div>

                <div className='flex flex-col items-center gap-4 mt-4 w-full'>
                    <label className='font-bold' htmlFor="pass2">Enter your new password </label>
                    <input name='newPassword2' value={info.newPassword2} onChange={handleChange} id='pass2' type="text" className='input-box shadow-md col-md-6 col-sm-12 w-full  md:w-[47%]' />
                    <label className='font-bold' htmlFor="pass">confirm your new password </label>
                    <input name='newPassword' value={info.newPassword} onChange={handleChange} id='pass' type="text" className='input-box shadow-md col-md-6 col-sm-12 w-full  md:w-[47%]' />

                </div>
                <button onClick={handleSubmit} className="btn mt-4">Reset Your Password</button>

            </div>



        </section>
    )
}

export default ForgotResetPassword
