import React, { useContext, useEffect, useState } from 'react';
import Navbar from '../Navbar/Navbar';
import { getUser } from '../getUser/getUser';
import { useNavigate } from 'react-router-dom';
import { userContext } from '../../App';
import api from '../../axios/api';
import toast from 'react-hot-toast';
import { LinearProgress } from '@mui/material';

const EditReferrer = () => {
  const navigate = useNavigate();

  const { userAuth, setUserAuth } = useContext(userContext);

  const [users, setUsers] = useState([]);
  const [loader, setLoader] = useState(false);


  useEffect(() => {
    checkSignIn();
  }, []);

  const checkSignIn = async () => {
    const user = await getUser();
    if (!user) {
      return navigate('/login');
    }

    if (userAuth && !userAuth.access_token) {
      return navigate('/login');
    }

    setUserAuth(user);
    getAllUser();
  };

  const getAllUser = () => {
    setLoader(true);
    api
      .get('/get-all-users', {
        headers: {
          Authorization: `Bearer ${userAuth && userAuth.access_token}`,
        },
      })
      .then((res) => {
        setLoader(false);
        setUsers(res.data);
      })
      .catch((err) => {
        setLoader(false);
        toast.error(err.message);
      });
  };


  const [selectedUserId, setSelectedUserId] = useState(null);
  const toggleDetails = (userId) => {
    setSelectedUserId((prevUserId) => (prevUserId === userId ? null : userId));

  };

  return (
    <>
      <Navbar />
      {loader ? (
        <LinearProgress
          color="inherit"
          style={{
            color: '#F26722',
          }}
        />
      ) : users.length ? (
        <section className="w-full mx-auto bg-[#EDEDED] min-h-screen h-auto p-4">
          <div className="p-4 rounded-md bg-white md:p-8 border w-full md:w-[65%] mx-auto shadow-md">
            <h1 className="text-center text-xl mb-4 md:text-4xl font-bold text-orange-500">
              Assign Micro Applications
            </h1>

            {users.map((user, i) => (
              <div key={user._id} className="w-full mb-4 hover:border hover:border-orange-600">
                <div className="w-full flex flex-col shadow-md rounded-md">
                  <div className='w-full flex p-2 relative '>
                    <div className="absolute max-md:hidden left-0 top-0 bottom-0 bg-orange-500 w-[30px] h-full flex items-center justify-center text-white font-bold text-xl">
                      {i + 1}
                    </div>
                    <div className="md:ml-[35px] flex items-center justify-center">
                      <img
                        className="md:w-16 md:h-16 w-[3rem] h-[3rem] object-contain"
                        src={user.logoURL}
                        alt="logo"
                      />
                    </div>
                    <div className=" max-md:flex max-md:items-center  ml-3 space-y-2 w-full">
                      <h1 className="md:text-xl text-wrap  font-bold">
                        {' '}
                        <i className="fa-regular fa-building text-orange-500"></i> {user.companyName}
                      </h1>
                      {/* Show email and mobile number above medium screens */}
                      <div className={`md:flex md:flex-col max-md:hidden`}>
                        <h1>
                          {' '}
                          <i className="fa-regular text-orange-500 fa-envelope"></i> {user.email}
                        </h1>
                        <h1>
                          {' '}
                          <i className="text-orange-500 fa-solid fa-phone"></i> {user.contact}
                        </h1>
                      </div>
                      <button
                        className=" absolute right-2 block md:hidden bg-orange-500 text-white p-2 rounded"
                        onClick={() => toggleDetails(user._id)}
                      >
                        <i class={"fa-solid fa-eye" + (selectedUserId === user._id ? "-slash" : "")}></i>
                      </button>
                    </div>
                    <div onClick={()=>navigate(`/create-referrer/${user._id}`)} className="absolute max-md:hidden right-0 top-0 bottom-0 bg-orange-500 w-[30px] h-full flex items-center justify-center text-white font-bold text-xl">
                      <i className="fa-solid fa-pen-nib"></i>
                    </div>
                  </div>
                  {selectedUserId === user._id && (
                    <div className="md:flex md:flex-col mx-auto space-y-2">
                      <h1>
                        {' '}
                        <i className="fa-regular text-orange-500 fa-envelope"></i> {user.email}
                      </h1>
                      <h1>
                        {' '}
                        <i className="text-orange-500 fa-solid fa-phone"></i> {user.contact}
                      </h1>
                      <i onClick={()=>navigate(`/create-referrer/${user._id}`)} className="fa-solid text-white rounded-md mb-2 text-center fa-pen-nib mx-auto py-2 px-4 bg-orange-500"></i>
                    </div>
                  )}
                </div>
                {/* Button to toggle details on smaller screens */}

              </div>
            ))}
          </div>
        </section>
      ) : (
        ''
      )}
    </>
  );
};

export default EditReferrer;