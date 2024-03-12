import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext'; // Adjust the import path as necessary
import { Nav, NavbarContainer, NavLogo, NavIcon, HamburgerIcon, NavMenu, NavItem, NavLinks, NavItemBtn, NavBtnLink } from './Navbar.elements';
import { FaTimes, FaBars } from 'react-icons/fa';
import { IconContext } from 'react-icons/lib';
import { Button } from '../../globalStyles';
import { useLocation } from 'react-router-dom';



function Navbar() {
    const location = useLocation();
    const { isAdmin } = location.state || {}; 
    const { isAuthenticated, isProfessor, isStudent, logout } = useAuth(); 

    const [click, setClick] = useState(false);
    const [button, setButton] = useState(true);

    const handleClick = () => setClick(!click);
    const closeMobileMenu = () => setClick(false);

    const showButton = () => {
        if (window.innerWidth <= 960) {
            setButton(false);
        } else {
            setButton(true);
        }
    };

    useEffect(() => {
        showButton();
        // Cleanup event listener
        const handleResize = () => showButton();
        window.addEventListener('resize', handleResize);
        
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Function to handle sign out
    const handleSignOut = (e) => {
        e.preventDefault();
        logout(); // This function should handle the sign out logic.
        closeMobileMenu();
    };

    return (
        <>
            <IconContext.Provider value={{ color: '#fff' }}>
                <Nav>
                    <NavbarContainer>
                        <NavLogo to='/'>
                            <NavIcon />
                            ProfessorAI
                        </NavLogo>
                        <HamburgerIcon onClick={handleClick}>
                            {click ? <FaTimes /> : <FaBars />}
                        </HamburgerIcon>
                        <NavMenu onClick={handleClick} click={click}>
                            {isAdmin && (
                                <>
                                    <NavItem>
                                    <NavLinks 
                                        to={{
                                            pathname: '/admin/dashboard',
                                            state: { isAdmin: true }
                                        }} 
                                        onClick={closeMobileMenu}
                                        >
                                        Admin Home
                                    </NavLinks>
                                    </NavItem>

                                </>
                            )}

                            {/* Only show Home and About Us links when not authenticated */}
                            {!isAuthenticated && !isAdmin&&(
                                <>
                                    <NavItem>
                                        <NavLinks to='/' onClick={closeMobileMenu}>
                                            Home
                                        </NavLinks>
                                    </NavItem>
                                    <NavItem>
                                        <NavLinks to='/About' onClick={closeMobileMenu}>
                                            About Us
                                        </NavLinks>
                                    </NavItem>
                                </>
                            )}

                            {/* Conditional Links based on user role */}
                            {isAuthenticated && isStudent && (
                                <>
                                    <NavItem>
                                        <NavLinks to='/studentHome' onClick={closeMobileMenu}>Student Home</NavLinks>
                                    </NavItem>
                                    <NavItem>
                                        <NavLinks to='/viewProfile' onClick={closeMobileMenu}>Profile</NavLinks>
                                    </NavItem>
                                </>
                            )}
                            {isAuthenticated && isProfessor && (
                                <>
                                    <NavItem>
                                        <NavLinks to='/professorHome' onClick={closeMobileMenu}>Professor Home</NavLinks>
                                    </NavItem>
                                    <NavItem>
                                        <NavLinks to='/profileView' onClick={closeMobileMenu}>Profile</NavLinks>
                                    </NavItem>
                                </>
                            )}


                            {/* Toggle between SIGN IN and SIGN OUT based on isAuthenticated */}
                            {isAuthenticated || isAdmin? (
                                <NavItemBtn>
                                    {button ? (
                                        <Button primary onClick={handleSignOut}>SIGN OUT</Button>
                                    ) : (
                                        <Button onClick={handleSignOut} fontBig primary>SIGN OUT</Button>
                                    )}
                                </NavItemBtn>
                            ) : (
                                <NavItemBtn>
                                    {button ? (
                                        <NavBtnLink to='/SignIn'>
                                            <Button primary>SIGN IN</Button>
                                        </NavBtnLink>
                                    ) : (
                                        <NavBtnLink to='/SignIn'>
                                            <Button onClick={closeMobileMenu} fontBig primary>SIGN IN</Button>
                                        </NavBtnLink>
                                    )}
                                </NavItemBtn>
                            )}
                        </NavMenu>
                    </NavbarContainer>
                </Nav>
            </IconContext.Provider>
        </>
    );
}

export default Navbar;
