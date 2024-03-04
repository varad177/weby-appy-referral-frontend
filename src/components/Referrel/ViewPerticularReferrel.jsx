import React, { useEffect, useState } from 'react'
import { useContext } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { userContext } from '../../App'
import { getUser } from '../getUser/getUser'
import api from '../../axios/api'
import { LinearProgress } from '@mui/material'
import toast from 'react-hot-toast'
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { Modal } from 'react-responsive-modal';
import 'react-responsive-modal/styles.css';
import Navbar from '../Navbar/Navbar'

const CopyButton = ({ text }) => {
  const [isCopied, setIsCopied] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const copyToClipboard = () => {
    navigator.clipboard.writeText(text);
    toast.success('copied 👍')
    setIsCopied(true);

    // Reset the "Copied" state after a short delay
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  return (
    <button
      className={isCopied ? "text-green-500" : "text-black"}
      onClick={copyToClipboard}
    >
      <i class="fa-solid fa-copy"></i>
    </button>
  );
};


const ViewPerticularReferrel = () => {
  const navigate = useNavigate()
  const { userAuth, setUserAuth } = useContext(userContext)
  const { refId } = useParams()
  const [referrel, setReferrel] = useState()
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    checkSignIn();



    getRef()



  }, [])

  const getRef = () => {
    setLoader(true)
    api.post('/get-referel_by_id', { _id: refId }, {
      headers: {
        'Authorization': `Berear ${userAuth && userAuth.access_token}`
      }
    }).then((res) => {
      setReferrel(res.data)
      setLoader(false)
      console.log(res.data);
    })
      .catch(err => {
        console.log(err.message);
        setLoader(false)
      })
  }

  const checkSignIn = async () => {
    const user = await getUser();
    console.log(user);

    if (!user) {
      return navigate('/login');
    }



    if (userAuth && userAuth.access_token == null) {
      return navigate('/login');
    }


  };


  const handleDelete = async () => {
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
                  toast.success("Referral deleted successfully");
                  setLoader(false);
                  return navigate((-1));
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
      <section className='w-full mx-auto bg-[#EDEDED] p-4  ' >
        {loader ? (
          <LinearProgress
            color='inherit'
            style={{
              color: '#F26722',
            }}
          />
        ) : referrel != null ? (
          <div className='rounded-md bg-white md:p-8 border w-[98%] md:w-[80%] mx-auto shadow-md'>



            <div className='w-full p-4 flex flex-col items-center gap-4 '>
              <img src={referrel.logoURL} className='mx-auto h-32 w-32' alt="logo" />
              <div className='flex items-center gap-4 max-md:flex-col'>
                <p className='text-orange-600 text-sm '>created By:- <span className='text-black '>{referrel.referrelBy}</span></p>
                <p className='text-orange-600 text-sm '>created At:- <span className='text-black '>{referrel.createdAt}</span></p>
              </div>



            </div>
            <div className='w-full grid grid-cols-1 md:grid-cols-2 '>



              <div className="w-full p-4  ">

                <h1 className='text-2xl text-orange-500 max-md:text-md font-bold mb-2'>Company Name <i className="fa-regular fa-building"></i></h1>
                <h1 className='text-md max-md:text-[16px] capitalize'>  {referrel.companyName}</h1>
                <hr className='w-full my-3' />
                <h1 className='text-2xl text-orange-500 max-md:text-md font-bold mb-2'>Mobile Number <i className="fa-solid fa-phone"></i></h1>

                <p className='text-md max-md:text-[16px]'>   {referrel.mobileNumber}   <CopyButton text={referrel.mobileNumber} /></p>

                <hr className='w-full my-3' />
                <p className='text-2xl max-md:text-md font-bold  text-orange-500'>Email <i className="fa-regular fa-envelope"></i> </p>
                <p className='text-md max-md:text-[16px] overflow-hidden whitespace-nowrap overflow-ellipsis '>  {referrel.email}   <CopyButton text={referrel.email} /></p>
                <hr className='w-full my-3' />
                <p className='text-2xl max-md:text-md font-bold  text-orange-500'>Website Url <i className="fa-solid fa-globe"></i> </p>
                <p className='text-md max-md:text-[16px] overflow-hidden whitespace-nowrap overflow-ellipsis '>  {referrel.websiteURL}   <CopyButton text={referrel.websiteURL} /></p>
                <hr className='w-full my-3' />


              </div>

              <div className='w-full p-4'>
                <p className='text-2xl max-md:text-md font-bold  text-orange-500'>Description <i className="fa-solid fa-pen"></i> </p>

                <p className='w-full my-2'>{referrel.description}</p>
                <hr className='w-full my-3' />

                <div className='flex gap-2 my-4 items-center max-md:justify-center'>
                  <Link to={referrel.websiteURL} target='_blank' className='btn'><i className="fa-solid fa-globe"></i></Link>
                  <Link to={`https://wa.me/91${referrel.mobileNumber}
`} target='_blank' className='btn'><i className="fa-brands fa-whatsapp"></i></Link>
                  <Link to={`mailto:${referrel.email}`} target='_blank' className='btn'><i className="fa-regular fa-envelope"></i></Link>
                </div>
                <hr className='w-full my-3' />


              </div>

            </div>

          </div>
        ) : (
          ''
        )}
      </section>
    </>
  );
};

export default ViewPerticularReferrel;
