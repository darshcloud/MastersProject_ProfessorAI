import React from 'react';
import { NavLink } from 'react-router-dom';
import './Navigation.css';

const Navigation = () => {
    return (
        <nav className="top-nav">
            <NavLink to="/StudentHome" activeClassName="active-link" className="nav-link">Student Home</NavLink>
            <NavLink to="/ViewProfile" activeClassName="active-link" className="nav-link">View Profile</NavLink>
        </nav>
    );
};

export default Navigation;
