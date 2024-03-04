import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUser } from "../getUser/getUser";
import { useContext } from "react";
import { userContext } from "../../App";
import toast from "react-hot-toast";
import api from "../../axios/api";
import { LinearProgress } from "@mui/material";
import AnimationWrapper from "../Animation/AnimationWrapper";
import Dialog from "@mui/material/Dialog";
import sadPhoto from '../../assets/sademoji.png'


const DialogStyle = {
  height: "96%",
  width: "98%",
  marginTop: "12%",
  maxHeight: "100%",
  maxWidth: "100%",
  boxShadow: "none",
  overflow: "none",
};

const Notification = (props) => {
  const [loader, setLoader] = useState(false);
  const [notification, setNotification] = useState([]);
  const navigate = useNavigate();
  const { userAuth, setUserAuth } = useContext(userContext);

  useEffect(() => {
    checkSignIn();
  }, []);

  const getAllNotification = async () => {
    try {
      if (userAuth && userAuth.access_token) {
        setLoader(true);
        const response = await api.get("/get-all-notification", {
          headers: {
            Authorization: `Bearer ${userAuth.access_token}`,
          },
        });
        setLoader(false);
        setNotification(response.data); // Assuming response contains data
      }
    } catch (error) {
      setLoader(false);
      toast.error(error.message);
    }
  };

  const checkSignIn = async () => {
    const user = await getUser();
    if (!user) {
      return navigate("/login");
    }

    if (userAuth && !userAuth.access_token) {
      return navigate("/login");
    }

    setUserAuth(user);
    getAllNotification(); // Call getAllNotification after ensuring userAuth is set
  };

  const ref = useRef()

  // Call getAllNotification if userAuth changes
  useEffect(() => {
    if (userAuth && userAuth.access_token) {
      console.log("vaaaar");
      getAllNotification();
    }
  }, [userAuth]);

  const handleNavigate = (refId) => {
    if (!refId) {
      toast.error("corresponding referrel is deleted");
    } else {
      navigate(`/view-referrel/${refId}`);
    }
  };

  // setReferrel(prevReferrels => prevReferrels.filter(item => item._id !== refId));

  const handleDelete = (refid) => {
    const loading = toast.loading("deleting...");
    try {
      api
        .post(
          "/delete-notification",
          { _id: refid },
          {
            headers: {
              Authorization: `Berear ${userAuth && userAuth.access_token}`,
            },
          }
        )
        .then(() => {
          toast.dismiss(loading);
          setNotification((preval) =>
            preval.filter((item) => item._id !== refid)
          );
          toast.success("deleted successfully");
        })
        .catch((err) => {
          toast.dismiss(loading);
          toast.error(err.message);
        });
    } catch (error) {
      toast.dismiss(loading);
      toast.error(error.message);
    }
  };

  const { onClose, selectedValue, open } = props;

  const handleClose = () => {
    onClose(selectedValue);
  };



  return (
    <>
      <Dialog ref={ref}
        PaperProps={{ sx: DialogStyle }}
        onClose={handleClose}
        open={open}
      >
        <section className="w-full mx-auto bg-[#EDEDED] h-auto md:p-4  ">
          {loader ? (
            <LinearProgress
              color="inherit"
              style={{
                color: "#F26722",
              }}
            />
          ) : (
            <div className="p-2 rounded-md bg-white md:p-8 border w-[98%] md:w-[80%] mx-auto shadow-md">
              <>
                <div className="w-full ">
                  <i
                    onClick={handleClose}
                    className="fa-solid fa-xmark   right-2 border border-orange-400 p-2 rounded-md text-orange-600 hover:text-white hover:bg-orange-600 duration-150"
                  ></i>
                </div>
                <h1 className="text-center text-2xl md:text-4xl font-bold text-orange-500">
                  Notifications
                </h1>
                {notification.length ? (
                  notification.map((notification, i) => {
                    return (
                      <AnimationWrapper
                        transition={{ duration: 1, delay: i * 0.08 }}
                        className="my-2 w-[98%] md:w-[80%] ld:w-[55%] h-[4rem] flex items-center gap-2 shadow-md p-2 mx-auto relative"
                      >
                        <div
                          onClick={() =>
                            handleNavigate(notification.referralId._id)
                          }
                          className="h-full"
                        >
                          <img
                            className="w-[3rem] max-md:w-[2.3rem] h-full object-contain rounded-full"
                            src={notification.userId !=null ? notification.userId.logoURL : sadPhoto}
                          />
                        </div>
                        <div className="flex gap-2 max-md:flex-col">
                          {<h1 className="max-md:text-sm">{notification.userId !=null ?notification.userId.companyName :"Referrel Deleted "} :</h1>}
                          {<p className="max-sm:text-sm">{notification.message}</p>}
                        </div>
                        <div
                          onClick={() => handleDelete(notification._id)}
                          className=" bg-red-200  border-red-500 h-full w-[30px] absolute right-0 top-0 bottom-0 flex items-center justify-center "
                        >
                          <i className="fa-solid text-red-600 fa-trash "></i>
                        </div>
                      </AnimationWrapper>
                    );
                  })
                ) : (
                  <h1>No Notification</h1>
                )}
              </>
            </div>
          )}
        </section>
      </Dialog>
    </>
  );
};

export default Notification;
