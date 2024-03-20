
import React, { useContext, useEffect, useState } from 'react'
import { userContext } from '../../App';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../axios/api';
import Navbar from '../Navbar/Navbar';
import AnimationWrapper from '../Animation/AnimationWrapper';
import { getUser } from '../getUser/getUser';
import { LinearProgress } from '@mui/material';


const AssignApplicatiomForm = () => {
    const { userAuth, setUserAuth } = useContext(userContext)

    const [user, setUser] = useState("")
    const [selectedValues, setSelectedValues] = useState([]);
    const [loader, setLoader] = useState(false);

    const { id } = useParams()
    useEffect(() => {

        checkSignIn()
        if (id) {

            getUserforassigntak()
        }




    }, [id])

    const checkSignIn = async () => {
        const user = await getUser();
        if (!user) {
            return navigate('/login');
        }

        if (userAuth && !userAuth.access_token) {
            return navigate('/login');
        }

        return setUserAuth(user);



    };

    const getUserforassigntak = () => {
        try {

            setLoader(true)
            api.post('/get-user', { _id: id }).then((res) => {
                setLoader(false)

                setSelectedValues(res.data.task)
            })
                .catch(err => {
                    setLoader(false)
                    return toast.error(err.response.data.error)
                })

        } catch (error) {
            return toast.error(error.message)
        }
    }


    const handleSubmit = () => {
        try {
            if (!selectedValues.length) {
                return toast.error("no tasks are selected ")
            }

            const loading = toast.loading('Please wait !')


            api.post('/assign-task', { task: selectedValues, _id: id }, {
                headers: {
                    'Authorization': `Bearer ${userAuth && userAuth.access_token}`
                }
            })
                .then((res) => {
                    toast.dismiss(loading)
                    toast.success(res.data.message)
                    return navigate('/')
                })
                .catch(err => {
                    toast.dismiss(loading)
                    return toast.error(err.response.data.message)
                })

        } catch (error) {
            toast.error(error.message)
        }
    }



    const handleChange = (event) => {
        const value = event.target.value;


        if (event.target.checked) {

            setSelectedValues((prevValues) => [...prevValues, value]);
        } else {

            setSelectedValues((prevValues) => prevValues.filter((item) => item !== value));
        }
    };

    const navigate = useNavigate()



    const isTaskSelected = (value) => {
        return selectedValues.includes(value);
    };
    return (
        <>
            <Navbar />

            <AnimationWrapper>
                {loader && <LinearProgress
                    color="inherit"
                    style={{
                        color: '#F26722',
                    }}
                />}
                <section className='w-full h-auto min-h-screen  bg-[#EDEDED] p-8 -z-10 max-md:p-4'>

                    <div className='w-[96%] h-auto md:w-[80%] shadow-md bg-white mx-auto rounded-md '>
                        <div className='flex flex-col items-center p-4  '>
                            <div className="w-full ">
                                <h1 className="text-center text-xl mb-4 md:text-4xl font-bold text-orange-500">Assign Task</h1>

                            </div>
                            <h3 className='text-center text-xl font-bold max-md:mt-4'>For Referrer</h3>

                            <div className='w-full flex gap-4'>
                                <input className="form-check-input cursor-pointer" checked={isTaskSelected('crr')} onChange={handleChange} type="checkbox" value="crr" id="defaultCheck1" />
                                <label className="form-check-label" htmlFor="defaultCheck1">
                                    Create Referrer
                                </label>
                            </div>
                            <div className='w-full flex gap-4'>
                                <input className="form-check-input cursor-pointer" checked={isTaskSelected('vrr')} onChange={handleChange} type="checkbox" value="vrr" id="defaultCheck2" />
                                <label className="form-check-label" htmlFor="defaultCheck2">
                                    View Referrers
                                </label>
                            </div>
                            <div className='w-full flex gap-4'>
                                <input className="form-check-input cursor-pointer" checked={isTaskSelected('err')} onChange={handleChange} type="checkbox" value="err" id="defaultCheck3" />
                                <label className="form-check-label" htmlFor="defaultCheck3">
                                    Edit Referrers
                                </label>
                            </div>
                            <div className='w-full flex gap-4'>
                                <input className="form-check-input cursor-pointer" checked={isTaskSelected('drr')} onChange={handleChange} type="checkbox" value="drr" id="defaultCheck4" />
                                <label className="form-check-label" htmlFor="defaultCheck4">
                                    Delete Referrers
                                </label>
                            </div>
                            <div className='w-full flex gap-4'>
                                <input className="form-check-input cursor-pointer" checked={isTaskSelected('ama')} onChange={handleChange} type="checkbox" value="ama" id="defaultCheck4" />
                                <label className="form-check-label" htmlFor="defaultCheck4">
                                    Assign Micro Applications
                                </label>
                            </div>
                        </div>

                        <div className='flex flex-col items-center p-4  '>
                            <h3 className='text-center text-xl font-bold'>For Referrel
                            </h3>

                            <div className='w-full flex gap-4'>
                                <input className="form-check-input  cursor-pointer" checked={isTaskSelected('crl')} onChange={handleChange} type="checkbox" value="crl" id="defaultCheck5" />
                                <label className="form-check-label" htmlFor="defaultCheck5">
                                    Create Referrel
                                </label>
                            </div>
                            <div className='w-full flex gap-4'>
                                <input className="form-check-input cursor-pointer" checked={isTaskSelected('vrl')} onChange={handleChange} type="checkbox" value="vrl" id="defaultCheck6" />
                                <label className="form-check-label" htmlFor="defaultCheck6">
                                    View Referrel
                                </label>
                            </div>
                            <div className='w-full flex gap-4'>
                                <input className="form-check-input cursor-pointer" checked={isTaskSelected('erl')} onChange={handleChange} type="checkbox" value="erl" id="defaultCheck7" />
                                <label className="form-check-label" htmlFor="defaultCheck7">
                                    Edit Referrel
                                </label>
                            </div>
                            <div className='w-full flex gap-4'>
                                <input className="form-check-input cursor-pointer" checked={isTaskSelected('drl')} onChange={handleChange} type="checkbox" value="drl" id="defaultCheck8" />
                                <label className="form-check-label" htmlFor="defaultCheck8">
                                    Delete Referrel
                                </label>
                            </div>
                            <button onClick={handleSubmit} className="btn">Save & Submit</button>
                        </div>

                    </div>

                </section>
            </AnimationWrapper>

        </>
    )
}

export default AssignApplicatiomForm
