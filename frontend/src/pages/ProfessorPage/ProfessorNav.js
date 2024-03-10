import React from 'react';
import { NavLink } from 'react-router-dom';
import './Navigation.css';

const ProfessorNavigation = () => {
    return (
        <nav className="top-nav">
            <NavLink to="/Professor" activeClassName="active-link" className="nav-link">Professor Home</NavLink>
        </nav>
    );
};

export default ProfessorNavigation;
