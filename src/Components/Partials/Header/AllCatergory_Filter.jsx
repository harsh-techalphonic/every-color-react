import React, { useState, useRef, useEffect } from 'react';
import AllCategoriesAPi from '../../../API/AllCategoriesAPi';
import { useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBarsStaggered } from '@fortawesome/free-solid-svg-icons';

export default function AllCatergory_Filter() {
    const allCategories = useSelector((store) => store.allCategories);
    const [showCategoriesDropdown, setshowCategoriesDropdown] = useState(false);
    const dropdownCategoriesRef = useRef(null);
    const location = useLocation(); 

    const toggleCategoriesDropdown = () => {
        setshowCategoriesDropdown((prev) => !prev);
    };

    const handleCategoriesClickOutside = (e) => {
        if (dropdownCategoriesRef.current && !dropdownCategoriesRef.current.contains(e.target)) {
            setshowCategoriesDropdown(false);
        }
    };

    
    useEffect(() => {
        document.addEventListener('mousedown', handleCategoriesClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleCategoriesClickOutside);
        };
    }, []);

    
    useEffect(() => {
        setshowCategoriesDropdown(false);
    }, [location.pathname]); 

    return (
        <>
            <AllCategoriesAPi />
            <button className='ms-4' onClick={toggleCategoriesDropdown}>
                <FontAwesomeIcon className='me-2' icon={faBarsStaggered} /> All Categories
            </button>
            {showCategoriesDropdown && (
                <div className='dropdown-menu show position-absolute custom-dropdown asdkom' ref={dropdownCategoriesRef}>
                    <ul className='list-unstyled'>
                        {allCategories.data?.map((category, index) => (
                            <li key={index}>
                                <Link to={`/category/${category.slug}`}>{category.name}</Link>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </>
    );
}
