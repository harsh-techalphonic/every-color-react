import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { API_URL } from '../../../Config/config';

export default function SearchBar() {
  const [tags, setTags] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();
  const wrapperRef = useRef(null);

  // Fetch tags from API
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const res = await fetch(`${API_URL}/tags`);
        const data = await res.json();
        if (data.success && Array.isArray(data.tags)) {
          // Remove empty strings
          setTags(data.tags.filter(tag => tag.trim() !== ""));
        }
      } catch (err) {
        console.error("Error fetching tags:", err);
      }
    };
    fetchTags();
  }, []);

  // Close suggestions when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle submit
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/product?search=${encodeURIComponent(searchTerm)}`);
      setShowSuggestions(false);
    }
  };

  // Filter tags by typed input
  const filteredTags = tags.filter(tag =>
    tag.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div ref={wrapperRef} className="position-relative sraechbar-we" style={{ margin: "0 8px" }}>
      <div className="input-group">
        <input
          type="text"
          className="form-control mx-0"
          placeholder="What are you looking for?"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setShowSuggestions(true);
          }}
          aria-label="Search"
        />
        <span
          className="input-group-text"
          onClick={handleSearch}
          style={{ cursor: "pointer" }}
        >
          <FontAwesomeIcon icon={faSearch} />
        </span>
      </div>

      {showSuggestions && searchTerm && (
        <div className="searchbarOUTPut">
          <ul className="list-unstyled">
            {filteredTags.length > 0 ? (
              filteredTags.map((tag, index) => (
                <li key={index}>
                  <Link
                      to={`/product?category_id=null&subcategory_id=null&home_type=null&search=${encodeURIComponent(tag)}&sort=new&min_price=21&max_price=7434&ratings=null`}
                    onClick={() => {
                      setSearchTerm(tag);
                      setShowSuggestions(false); // close on tag click
                    }}
                  >
                    {tag}
                  </Link>
                </li>
              ))
            ) : (
              <li className="mb-3 text-muted">No products found</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
