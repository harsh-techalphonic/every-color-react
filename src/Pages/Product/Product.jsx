/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useRef } from "react";
import Header from "../../Components/Partials/Header/Header";
import Footer from "../../Components/Partials/Footer/Footer";
import Product_card from "../../Components/Product/Product_card/Product_card";
import ProductFilter from "../../Components/ProductDetail/Product_filter/Product_filter";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { Form } from "react-bootstrap";
import ScrollToTop from "../ScrollToTop";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBarsStaggered, faClose } from "@fortawesome/free-solid-svg-icons";
import config from '../../Config/config.json'
import axios from "axios";
import logo from '../../assets/EveryColourLogo.png'
import HelmetComponent from "../../Components/HelmetComponent/HelmetComponent";
import { useSelector } from "react-redux";

export default function Product({ category_type }) {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 991);
  const [showFilter, setShowFilter] = useState(false);
  const [products, setProducts] = useState({ status: false, data: [] });
  const [fetching, setFetching] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
    const [prodata, setProdata] = useState([]);

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const category = searchParams.get("category");
  const sub_category = searchParams.get("subcategory");

  const PRODUCTS_PER_PAGE = 24;

  const [filters, setFilters] = useState({
    category_id: category || null,
    subcategory_id: sub_category || null,
    home_type: null,
    search: searchParams.get("search") || "",
    sort: "new",
    min_price: null,
    max_price: null,
    ratings: null,
  });

  const cancelTokenSource = useRef(null);
  const footerRef = useRef(null);

  const toggleFilter = () => setShowFilter((prev) => !prev);
  const handleResize = () => setIsMobile(window.innerWidth <= 991);

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  // 👇 Add this effect
useEffect(() => {
  const newSearch = searchParams.get("search") || "";
  if (newSearch !== filters.search) {
    const updatedFilters = { ...filters, search: newSearch };
    setFilters(updatedFilters);
    setProducts({ status: false, data: [] });
    setPage(1);
    setHasMore(true);
    fetchProducts(1, false, updatedFilters);
  }
}, [searchParams]);

  // Build API URL dynamically
  const buildApiUrl = (pageNum = 1, currentFilters = filters) => {
    let url = `${config.API_URL}/productsdata?sort=${currentFilters.sort}&per_page=${PRODUCTS_PER_PAGE}&page=${pageNum}`;
    if (currentFilters.category_id) url += `&category_id=${currentFilters.category_id}`;
    if (currentFilters.subcategory_id) url += `&subcategory_id=${currentFilters.subcategory_id}`;
    if (currentFilters.ratings) url += `&ratings=${currentFilters.ratings}`;
    if (currentFilters.min_price != null) url += `&min_price=${currentFilters.min_price}`;
    if (currentFilters.max_price != null) url += `&max_price=${currentFilters.max_price}`;
    if (currentFilters.search) url += `&search=${encodeURIComponent(currentFilters.search)}`;
    if (currentFilters.home_type) url += `&home_type=${currentFilters.home_type}`;
    return url;
  };

  // Fetch products
  const fetchProducts = async (pageNum = 1, append = false, currentFilters = filters) => {
    if (fetching && pageNum > 1) return;
    setFetching(true);

    if (cancelTokenSource.current) {
      cancelTokenSource.current.cancel("New request started, canceling old one.");
    }
    cancelTokenSource.current = axios.CancelToken.source();
// const token = localStorage.getItem("token");
    try {
      const url = buildApiUrl(pageNum, currentFilters);
      const response = await axios.get(url,  { cancelToken: cancelTokenSource.current.token, });

      if (response.data?.data?.length > 0) {
        setProducts((prev) => ({
          status: true,
          data: append ? [...prev.data, ...response.data.data] : response.data.data,
        }));
        setHasMore(response.data.data.length === PRODUCTS_PER_PAGE);
      } else {
        if (!append) setProducts({ status: false, data: [] });
        setHasMore(false);
      }
    } catch (error) {
      if (!axios.isCancel(error)) {
        console.error("Failed to fetch products:", error);
        if (!append) setProducts({ status: false, data: [] });
        setHasMore(false);
      }
    } finally {
      setFetching(false);
    }
  };

  // Handle filters update
  const updateFilters = (newFilters) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    setProducts({ status: false, data: [] });
    setPage(1);
    setHasMore(true);
    fetchProducts(1, false, updatedFilters);
    // Update URL for page refresh
    const params = new URLSearchParams(updatedFilters);
    navigate(`/product?${params.toString()}`, { replace: true });
  };

  const handleSortChange = (event) => {
    updateFilters({ sort: event.target.value });
  };

  const clearAllFilters = () => {
    const resetFilters = {
      sort: "new",
      min_price: null,
      max_price: null,
      ratings: null,
      category_id: null,
      subcategory_id: null,
      search: "",
      home_type: null,
    };
    setFilters(resetFilters);
    setProducts({ status: false, data: [] });
    setPage(1);
    setHasMore(true);
    fetchProducts(1, false, resetFilters);
    navigate("/product");
  };

  // Active Filters
  const activeFilters = [];
  if (filters.sort && filters.sort !== "new") activeFilters.push({ key: "sort", label: `Sort: ${filters.sort}` });
  if (filters.ratings) activeFilters.push({ key: "ratings", label: `${filters.ratings}★ & above` });
  if (filters.min_price != null && filters.max_price != null)
    activeFilters.push({ key: "price", label: `₹${filters.min_price} - ₹${filters.max_price}` });
  if (filters.category_id) activeFilters.push({ key: "category", label: `Category: ${filters.category_id}` });
  if (filters.subcategory_id) activeFilters.push({ key: "subcategory", label: `Sub-category: ${filters.subcategory_id}` });

  const removeFilter = (key) => {
    if (key === "sort") updateFilters({ sort: "new" });
    else if (key === "ratings") updateFilters({ ratings: null });
    else if (key === "price") updateFilters({ min_price: null, max_price: null });
    else if (key === "category") updateFilters({ category_id: null, subcategory_id: null });
    else if (key === "subcategory") updateFilters({ subcategory_id: null });
  };

  // Infinite scroll
  useEffect(() => {
    if (!footerRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !fetching && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      },
      { rootMargin: "200px" }
    );
    observer.observe(footerRef.current);
    return () => {
      if (footerRef.current) observer.unobserve(footerRef.current);
    };
  }, [footerRef, fetching, hasMore]);

  // Fetch next page
  useEffect(() => {
    if (page > 1) fetchProducts(page, true);
  }, [page]);

  // Initial fetch on page load
  useEffect(() => {
    fetchProducts(1, false, filters);
  }, []);

 useEffect(() => {
    if (products.status) return; // don’t fetch if products already available

    axios
      .get(`${config.API_URL}/productsdata`)
      .then(function (response) {
        setProdata(response.data); // ✅ save API response into state
      })
      .catch(function (error) {
        console.log("Error fetching products:", error);
      });
  }, [products.status]);


  return (
    <>
      <ScrollToTop />
      <Header />

      <HelmetComponent
              title={prodata?.meta?.meta_title}
              description={prodata?.meta?.meta_description}
              keywords={prodata?.meta?.meta_keyword}
              image={logo}
            />


      <section className="All_Products">
        <div className="container">
          <div className="row g-lg-5 g-md-4">
            {/* Sidebar */}
            <div className="col-lg-3">
              <div className="fliterbox mt-lg-5 mt-md-4 mt-3 mb-0">
                <div className="fliterbox-tile d-flex align-items-center justify-content-between">
                  <div className="title-box">
                    <h2 className="d-flex">
                      <span className={`filter-btn ${isMobile ? "showrel" : ""}`} onClick={toggleFilter}>
                        Filter{" "}
                        {showFilter ? <FontAwesomeIcon icon={faClose} className="d-inline-block d-lg-none" /> : <FontAwesomeIcon icon={faBarsStaggered} className="d-inline-block d-lg-none" />}
                      </span>
                    </h2>
                  </div>
                  <div className="title-box">
                    <Link to="/product" onClick={clearAllFilters}>
                      Clear Filter
                    </Link>
                  </div>
                </div>
                <div className={`filter-contaienr ${isMobile ? "filter-container" : ""} ${showFilter ? "show" : ""}`}>
                  <ProductFilter filter_category={category} products={products} updateFilters={updateFilters} filters={filters} />
                </div>
              </div>
            </div>

            {/* Product Section */}
            <div className="col-lg-9">
              <div className="product-section my-5">
                <div className="feature-product-tile d-flex flex-wrap align-items-center justify-content-between">
                  <div className="title-box">
                    <h2>
                      <span>All</span> Products
                    </h2>
                  </div>
                  <div className="title-box d-flex align-items-center gap-2">
                    <span style={{ whiteSpace: "nowrap" }}>Sort by:</span>
                    <Form.Select className="custom-select" aria-label="Sort by" value={filters.sort || "new"} onChange={handleSortChange}>
                      <option value="new">Newest</option>
                      <option value="popularity">Most Popular</option>
                      <option value="discount">Discount</option>
                      <option value="price_high_low">Price: High to Low</option>
                      <option value="price_low_high">Price: Low to High</option>
                    </Form.Select>
                  </div>
                </div>

                {/* Active Filters */}
                {activeFilters.length > 0 && (
                  <div className="d-flex flex-wrap gap-2 align-items-center justify-content-between bg-light mb-3 p-2 rounded">
                    <div className="d-flex flex-wrap gap-2 ">
                      {activeFilters.map((filter) => (
                        <div key={filter.key} className="d-flex align-items-center px-2 py-1 bg-white border rounded">
                          <span className="me-1">{filter.label}</span>
                          <button className="btn btn-sm p-0 text-secondary" onClick={() => removeFilter(filter.key)}>
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="text-secondary"> {products.data.length} Results found. </div>

                  </div>
                )}

                <Product_card products={products} />
                {fetching && <div className="text-center mt-3">Loading products...</div>}
                {!hasMore && products.data.length > 0 && <div className="text-center mt-3 text-muted">No more products.</div>}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div ref={footerRef}>
        <Footer />
      </div>
    </>
  );
}
