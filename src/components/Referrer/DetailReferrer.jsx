import React, { useEffect, useState } from 'react'
import Navbar from '../Navbar/Navbar'
import toast from 'react-hot-toast';
import api from '../../axios/api';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { formatDate } from '../../utils/utils';
import { LinearProgress } from '@mui/material';

const CopyButton = ({ text }) => {
  const [isCopied, setIsCopied] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const copyToClipboard = () => {
    navigator.clipboard.writeText(text);
    toast.success('copied 👍')
    setIsCopied(true);

    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  return (
    <button
      className={isCopied ? "text-green-500" : "text-orange-700"}
      onClick={copyToClipboard}
    >
      <i class="fa-solid fa-copy"></i>
    </button>
  );
};


const DetailReferrer = () => {

  const [user, setUser] = useState({})

  const { userId } = useParams()

  const navigate = useNavigate()
  const [loader, setLoader] = useState(false);

  useEffect(() => {

    if (sessionStorage.length === 0) {
      return navigate('/login')
    }

    setLoader(true)

    api.post('/user-profile-by-id', {
      _id: userId
    }).then((res) => {
      setUser(res.data)
      setLoader(false)
      
    })
    .catch((err) => {
      setLoader(false)
      return toast.error('Unable to show the profile of Referrer')
      })

  }, [])



  return (
    <>
      <Navbar />
      {
        loader ? (
          <LinearProgress
            color="inherit"
            style={{
              color: "#F26722",
            }}
          />
        ) : user ? <>
          <div className='w-full bg-[#EDEDED] min-h-screen h-auto md:p-12 p-4  '>


            <div className='w-[98%] p-4 md:p-8 sm:w-[85%] md:w-[90%] rounded-md mx-auto bg-white'>
              <h1 className="text-center text-xl mb-4 md:text-4xl  font-extrabold text-orange-500">
                Referrer's Profile        </h1>
              <div className='p-4 border-b-2 h-auto border-orange-600 mx-auto w-full'>
                <div className='md:w-40  md:h-32 w-40 flex items-center justify-center h-32 mx-auto relative'>
                  <img className=' mx-auto object-contain' src={user.logoURL} alt="photo" />
                </div>


              </div>

              <div className=' mt-4 w-full mx-auto'>
                <h1 className=' text-orange-600 text-2xl md:text-3xl   font-extrabold text-center '>{user.companyName}</h1>
                <div className='w-full flex items-center py-4'>
                  <button className='btn mx-auto'><Link to={user.websiteURL} target='_black'>VISITE WEBSITE</Link></button>
                </div>

                <div className='w-full grid md:grid-cols-2 gap-4 grid-cols-1'>
                  <div className='w-full p-3 email-container space-y-1'>
                    <p className='text-md  font-extrabold text-orange-500'>Website-URL :- </p>
                    <p>{user.websiteURL}   <CopyButton text={"varad"} /></p>
                    <p className='text-md  font-extrabold text-orange-500'>Email :- </p>

                    <p>{user.email} <CopyButton text={"varad"} /></p>

                    <p className='text-md  font-extrabold text-orange-500'>Whats-App Number :- </p>
                    <p>{user.contact} <CopyButton text={"varad"} /></p>

                  </div>
                  <div className='w-full p-3 space-y-1'>
                    <p className='text-md  font-extrabold text-orange-500'>Role :- </p>
                    <p>{user.role}</p>
                    <p className='text-md  font-extrabold text-orange-500'>Number Of Referrels :- </p>
                    <p>{user.noOfRef}</p>
                    <p className='text-md  font-extrabold text-orange-500'>Join At :- </p>
                    <p>{formatDate(user.createdAt)}</p>
                    {

                    }
                  </div>

                </div>


              </div>


            </div>


          </div>


        </> : ''
      }
    </>
  )

}

export default DetailReferrer