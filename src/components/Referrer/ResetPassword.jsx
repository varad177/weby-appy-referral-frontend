

import React, { useContext, useEffect, useState } from 'react'
import Navbar from '../Navbar/Navbar'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import api from '../../axios/api'
import AnimationWrapper from '../Animation/AnimationWrapper'
import { getUser } from '../getUser/getUser'
import { userContext } from '../../App'

const ResetPassWord = () => {

    let { userAuth, setUserAuth } = useContext(userContext)

    let [pass, setPass] = useState({
        currPass: "",
        newPass: "",
    })

    const handleChange = (event) => {
        setPass({ ...pass, [event.target.name]: event.target.value })



    }

    const navigate = useNavigate()



    useEffect(() => {
        checkSignIn()


    }, [])

    const checkSignIn = async () => {

        const userInsession = sessionStorage.getItem('user')

        const userInfo = JSON.parse(userInsession)
        setUserAuth(userInfo)
        console.log(userInfo.access_token);
    };




    const handleSubmit = () => {
        if (!pass.currPass) {
            toast.error("Please fill in current password.");
            return;
        }
        if (!pass.newPass) {
            toast.error("Please fill in new password.");
            return;
        }


        const loading = toast.loading("Wait! Changing the password");

        api.post('/change-password', {
            currentPassword: pass.currPass,
            newPassword: pass.newPass
        }, {
            headers: {
                "Authorization": `Bearer ${userAuth && userAuth.access_token}`
            }
        })
            .then((res) => {
                toast.dismiss(loading);

                toast.success(res.data.message);
                setPass({
                    currPass: "",
                    newPass: "",
                })
            })
            .catch(({ response }) => {
                toast.dismiss(loading);

                toast.error(response.data.error)
            })


    };




    return (
        <div>
            <Navbar />
            <AnimationWrapper>

                <section className='w-full h-[100vh] bg-[#F5F7FF] p-8 -z-10 max-md:p-4'>
                    <div className='w-[96%] shadow-md h-auto md:w-[80%] bg-white mx-auto rounded-md '>
                        <div className='flex flex-col items-center p-4  '>
                            <div className="w-full text-2xl flex items-center justify-center max-md:flex-col max-md:items-center max-md:gap-4  ">
                                <h1 className='font-bold'>Reset Password</h1>
                                
                            </div>

                            <div className='p-8 flex items-center flex-col gap-8 max-md:w-full w-[50%] max-md:p-4'>

                                <input type="text" onChange={handleChange} value={pass.currPass} name='currPass' className='input-box w-full' placeholder='Enter Your Current Password' />
                                <input type="text" onChange={handleChange} value={pass.newPass} name='newPass' className='input-box w-full' placeholder='Enter Your New Password' />

                            </div>
                            <button onClick={handleSubmit} className="btn">submit</button>
                        </div>
                    </div>




                </section>

            </AnimationWrapper>
        </div>
    )
}

export default ResetPassWord
