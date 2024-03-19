import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { Nav, NavbarContainer, NavLogo, NavIcon, HamburgerIcon, NavMenu, NavItem, NavLinks, NavItemBtn, NavBtnLink } from './Navbar.elements';
import { FaTimes, FaBars } from 'react-icons/fa';
import { IconContext } from 'react-icons/lib';
import { Button } from '../../globalStyles';

function Navbar() {
    const { isAuthenticated, isProfessor, isStudent, isAdminAuthenticated, logout, adminLogout } = useAuth();

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
        window.addEventListener('resize', showButton);
        
        return () => window.removeEventListener('resize', showButton);
    }, []);

    const handleSignOut = () => {
        if (isAdminAuthenticated) {
            adminLogout();
        } else {
            logout();
        }
        closeMobileMenu();
    };

    return (
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
                        {!isAuthenticated && !isAdminAuthenticated && (
                            <>
                                <NavItem>
                                    <NavLinks to='/' onClick={closeMobileMenu}>Home</NavLinks>
                                </NavItem>
                                <NavItem>
                                    <NavLinks to='/about' onClick={closeMobileMenu}>About Us</NavLinks>
                                </NavItem>
                            </>
                        )}
                        {isAuthenticated && isStudent && (
                            <>
                                <NavItem>
                                    <NavLinks to='/studentHome' onClick={closeMobileMenu}>Student Home</NavLinks>
                                </NavItem>
                                <NavItem>
                                    <NavLinks to='/viewprofile' onClick={closeMobileMenu}>Profile</NavLinks>
                                </NavItem>
                            </>
                        )}
                        {isAuthenticated && isProfessor && (
                            <>
                                <NavItem>
                                    <NavLinks to='/professorHome' onClick={closeMobileMenu}>Professor Home</NavLinks>
                                </NavItem>
                                <NavItem>
                                    <NavLinks to='/profileview' onClick={closeMobileMenu}>Profile</NavLinks>
                                </NavItem>
                            </>
                        )}
                        {isAdminAuthenticated && (
                            <>
                                <NavItem>
                                    <NavLinks to='/admin/dashboard' onClick={closeMobileMenu}>Admin Home</NavLinks>
                                </NavItem>
                            </>
                        )}
                        {(isAuthenticated || isAdminAuthenticated) ? (
                            <NavItemBtn>
                                {button ? (
                                    <Button primary onClick={handleSignOut}>SIGN OUT</Button>
                                ) : (
                                    <Button fontBig primary onClick={handleSignOut}>SIGN OUT</Button>
                                )}
                            </NavItemBtn>
                        ) : (
                            <NavItemBtn>
                                {button ? (
                                    <NavBtnLink to='/signin'>
                                        <Button primary>SIGN IN</Button>
                                    </NavBtnLink>
                                ) : (
                                    <NavBtnLink to='/signin'>
                                        <Button fontBig primary onClick={closeMobileMenu}>SIGN IN</Button>
                                    </NavBtnLink>
                                )}
                            </NavItemBtn>
                        )}
                    </NavMenu>
                </NavbarContainer>
            </Nav>
        </IconContext.Provider>
    );
}

export default Navbar;
