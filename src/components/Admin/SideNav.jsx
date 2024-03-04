import React, { useEffect, useRef, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";

const SideNav = () => {
    let page = window.location.pathname.split("/")[2];
    let [pageState, setPageState] = useState(page ? page.replace("-", " ") : '');

    useEffect(() => {
        setShowSideNav(false);
        pageStateTab.current.click();
    }, [pageState]);

    let activeTabLine = useRef();
    let sideBarIcon = useRef();
    let pageStateTab = useRef();
    let [showSideNav, setShowSideNav] = useState(false);

    const changePageState = (e) => {
        let { offsetWidth, offsetLeft } = e.target;
        activeTabLine.current.style.width = offsetWidth + "px";
        activeTabLine.current.style.left = offsetLeft + "px";

        if (e.target === sideBarIcon.current) {
            setShowSideNav(!showSideNav);
        }
    };

    return (
        <section className="border relative flex py-0 m-0 max-md:flex-col">
            <div className="sticky md:top-[20px] z-30 ">
                <div className="md:hidden bg-white  border-b border-grey flex flex-nowrap overflow-x-auto ">
                    <button
                        onClick={changePageState}
                        ref={sideBarIcon}
                        className="p-5 capitalize "
                    >
                        <i className="fa-solid fa-bars-staggered pointer-events-none"></i>
                    </button>
                    <button
                        ref={pageStateTab}
                        onClick={changePageState}
                        className="p-5 capitalize "
                    >
                        {pageState}
                    </button>
                    <hr
                        ref={activeTabLine}
                        onClick={changePageState}
                        className="absolute bottom-0 duration-500"
                    />
                </div>

                <div
                    className={
                        "min-w-[200px] h-[calc(100vh-80px-60px)] md:h-cover md:sticky  overflow-y-auto p-6 md:pr-0 md:border-grey md:border-r absolute max-md:top:[64px] bg-white  duration-500 " +
                        (!showSideNav
                            ? " max-md:opacity-0 max-md:pointer-events-none "
                            : " opacity-100 pointer-events-auto")
                    }
                >
              

                    <h1 className="text-xl text-dark-grey mb-3 ">ADMIN PANEL </h1>
                    <hr className="border-grey ml-6 mb-8 mr-6 " />

                    <NavLink
                        to={"/admin-panel/weby-appy-all-referrels"}
                        onClick={(e) => setPageState(e.target.innerText)}
                        className="sidebar-link"
                    >
                     
                         All Referrels
                    </NavLink>
                    <br />
                    <br />
                    <NavLink
                        to={"/admin-panel/weby-appy-non-business-referrels"}
                        onClick={(e) => setPageState(e.target.innerText)}
                        className="sidebar-link"
                    >
                        non Business Referrels
                    </NavLink>
                    <br />
                    <br />
                    <NavLink
                        to={"/admin-panel/weby-appy-business-referrels"}
                        onClick={(e) => setPageState(e.target.innerText)}
                        className="sidebar-link"
                    >
                        Business Referrels
                    </NavLink>
                    <br />
                    <br />
                    <NavLink
                        to={"/admin-panel/monthly-analytics"}
                        onClick={(e) => setPageState(e.target.innerText)}
                        className="sidebar-link"
                    >
                        Monthly Referrel Analytics
                    </NavLink>
                    <br />
                    <br />
                    <NavLink
                        to={"/admin-panel/completed-referrel-monthly-analytics"}
                        onClick={(e) => setPageState(e.target.innerText)}
                        className="sidebar-link"
                    >
    Completed referrel Analytics                    </NavLink>
                </div>
            </div>

            <div className="max-md:-mt-8 mt-5 w-full">
                    <Outlet />
                </div>
        </section>
    );
};

export default SideNav;
