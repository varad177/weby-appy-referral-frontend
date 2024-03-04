

import React, { useState } from 'react';
import './Loader.css'; // Import the CSS file

const Loader = () => {
    const [isActive, setIsActive] = useState(true);



    return (



        <div className={isActive ? "loading-overlay is-active" : "loading-overlay"}>
            <span className="fas fa-spinner fa-3x fa-spin text-orange-500"></span>
        </div>




    );
};

export default Loader;
