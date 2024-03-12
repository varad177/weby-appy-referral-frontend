import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/webyappylogo.png";
import Notification from "../Notification/Notification";


const Navbar = () => {

    const [sideBar, setSideBar] = useState(false)

    const [user, setUser] = useState({})

    const navigte = useNavigate()

    useEffect(() => {

        checkSignIn()
    }, [])
    const checkSignIn = async () => {
        const userInsession = sessionStorage.getItem('user')
        const userInfo = JSON.parse(userInsession)
        setUser(userInfo)


    };

    const handleSignOut = () => {
        sessionStorage.clear();
        navigte('/login')

    }


    const [open, setOpen] = React.useState(false);
    const [selectedValue, setSelectedValue] = useState("");

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = (value) => {
        setOpen(false);
        setSelectedValue(value);

    };



    return (
        <>
            <div className={"fixed right-0 border h-screen w-[18rem] max-md:w-full z-10 bg-white duration-500 " +
                (sideBar === true ? " opacity-100 pointer-events-auto" : " opacity-0 pointer-events-none")}>
                <div className="w-full relative py-4">
                    <i onClick={() => setSideBar(preval => !preval)} className="fa-solid fa-xmark absolute   right-2 mr-4 border border-orange-400 p-2 rounded-md text-orange-600 hover:text-white hover:bg-orange-600 duration-150"></i>
                </div>

                <div className="s aspect-square flex items-center justify-center w-[8rem] mx-auto mt-8 ">
                    <img

                        alt="logo"
                        src={user !== null && user.logoURL}
                        className="object-contain"
                    />
                </div>
                <div className="flex items-center">
                    <button onClick={handleSignOut} className="btn mt-8 mx-auto ">Sign Out</button>
                </div>
                {
                    user && user.role == 'admin' && <div className="flex items-center">
                        <button onClick={() => navigte('/admin-panel/weby-appy-all-referrels')} className="btn mt-4 mx-auto ">ADMIN PANEL</button>
                    </div>
                }

                <div className="w-full mt-4 flex items-center">
                    <Link className="text-center  w-full">
                        <i className="fa-solid fa-lock mr-2 text-orange-600"></i>Change Password
                    </Link>
                </div>
                <hr className="opacity-10 mt-4 " />
                <div className="">
                    <ul>
                        <li className="text-center text-orange-600 py-3">
                            <Link to={""}>About Webyappy</Link>
                        </li>
                        <hr className="opacity-10" />
                        <li className="text-center text-orange-600 py-3">
                            <Link to={""}>Contact</Link>
                        </li>
                        <hr className="opacity-10" />
                    </ul>

                </div>
            </div >
            <div className="w-full h-[4rem] shadow-md flex justify-between items-center p-3">
                <div className="h-full">
                    <img src={logo} alt="logo" className="img-fluid h-full " />
                </div>
                <div className="pr-4 flex gap-4">
                    <i onClick={handleClickOpen} className="fa-solid fa-bell text-2xl relative text-orange-600 cursor-pointer">

                        {
                            user !== null && user.notificationStatus && <span class="position-absolute top-0 start-100 translate-middle p-[6px] bg-danger border border-light rounded-circle">

                            </span>
                        }

                    </i>
                    <Notification
                        selectedValue={selectedValue}
                        open={open}
                        onClose={handleClose}
                    />
                    <i onClick={() => setSideBar(preval => !preval)} className="fa-solid fa-bars text-2xl text-orange-600 cursor-pointer"></i>
                </div>


            </div>

        </>
    );
};

export default Navbar;
