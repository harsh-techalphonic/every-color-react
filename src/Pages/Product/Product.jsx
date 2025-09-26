/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useRef } from "react";
import Header from "../../Components/Partials/Header/Header";
import Footer from "../../Components/Partials/Footer/Footer";
import Product_card from "../../Components/Product/Product_card/Product_card";
import ProductFilter from "../../Components/ProductDetail/Product_filter/Product_filter";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { Form } from "react-bootstrap";
import ScrollToTop from "../ScrollToTop";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBarsStaggered, faClose } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

export default function Product({ category_type }) {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 991);
  const [showFilter, setShowFilter] = useState(false);
  const [products, setProducts] = useState({ status: false, data: [] });
  const [fetching, setFetching] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  const [searchParams] = useSearchParams();
  const category = searchParams.get("category");
  const sub_category = searchParams.get("subcategory");

  

  const PRODUCTS_PER_PAGE = 24;

  const [filters, setFilters] = useState({
    category_id: null,
    subcategory_id: null,
    home_type: null,
    search: "",
    sort: "new",
    min_price: null,
    max_price: null,
    ratings: null,
  });
 

  const isInitialMount = useRef(true);
  const cancelTokenSource = useRef(null);
  const footerRef = useRef(null);

  const toggleFilter = () => setShowFilter((prev) => !prev);
  const handleResize = () => setIsMobile(window.innerWidth <= 991);

  useEffect(() => {
    console.log(category, sub_category)
    setFilters({...filters,category_id: category, subcategory_id: sub_category})
  }, [category, sub_category]);

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Build API URL dynamically
  const buildApiUrl = (pageNum = 1, currentFilters = filters) => {
    let url = `https://dhanbet9.co/api/productsdata?sort=${currentFilters.sort}&per_page=${PRODUCTS_PER_PAGE}&page=${pageNum}`;
    if (currentFilters.category_id)
      url += `&category_id=${currentFilters.category_id}`;
    if (currentFilters.subcategory_id)
      url += `&subcategory_id=${currentFilters.subcategory_id}`;
    if (currentFilters.category_slug)
      url += `&category_slug=${currentFilters.category_slug}`;
    if (currentFilters.subcategory_slug)
      url += `&subcategory_slug=${currentFilters.subcategory_slug}`;
    const search = searchParams.get("search");
    if (search) url += `&search=${encodeURIComponent(search)}`;
    const home_type = searchParams.get("home_type");
    if (home_type) url += `&home_type=${home_type}`;
    if (currentFilters.ratings) url += `&ratings=${currentFilters.ratings}`;
    if (currentFilters.min_price != null)
      url += `&min_price=${currentFilters.min_price}`;
    if (currentFilters.max_price != null)
      url += `&max_price=${currentFilters.max_price}`;
    return url;
  };

  // Fetch products
  const fetchProducts = async (
    pageNum = 1,
    append = false,
    currentFilters = filters
  ) => {
    if (fetching && pageNum > 1) return;
    setFetching(true);

    if (cancelTokenSource.current) {
      cancelTokenSource.current.cancel(
        "New request started, canceling old one."
      );
    }
    cancelTokenSource.current = axios.CancelToken.source();

    try {
      const url = buildApiUrl(pageNum, currentFilters);


      const response = await axios.get(url, {
        cancelToken: cancelTokenSource.current.token,
      });

      if (response.data?.data?.length > 0) {
        console.log('buildApiUrl',response)
        setProducts((prev) => ({
          status: true,
          data: append
            ? [...prev.data, ...response.data.data]
            : response.data.data,
        }));
        setHasMore(response.data.data.length === PRODUCTS_PER_PAGE);
      } else {
        if (!append) setProducts({ status: false, data: [] });
        setHasMore(false);
      }
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("Request canceled:", error.message);
      } else {
        console.error("Failed to fetch products:", error);
        if (!append) setProducts({ status: false, data: [] });
        setHasMore(false);
      }
    } finally {
      setFetching(false);
    }
  };

  // Effect 1: Initial load
  useEffect(() => {
    isInitialMount.current = false;
    setProducts({ status: false, data: [] });
    setPage(1);
    setHasMore(true);
    fetchProducts(1, false);
  }, [category, sub_category, searchParams]);

  // Effect 2: Filter changes (debounced for sort/price/ratings)
  useEffect(() => {
    if (isInitialMount.current) return;

    const handler = setTimeout(() => {
      setProducts({ status: false, data: [] });
      setPage(1);
      setHasMore(true);
      fetchProducts(1, false);
    }, 500);

    return () => clearTimeout(handler);
  }, [filters.sort, filters.min_price, filters.max_price, filters.ratings]);

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
    if (page > 1) {
      fetchProducts(page, true);
    }
  }, [page]);

  const handleSortChange = (event) => {
    setFilters((prev) => ({ ...prev, sort: event.target.value }));
  };

  // Update filters (category/subcategory clicks)
  const updateFilters = (newFilters) => {
    setFilters((prev) => {
      const updatedFilters = { ...prev, ...newFilters };
      setProducts({ status: false, data: [] });
      setPage(1);
      setHasMore(true);
      fetchProducts(1, false, updatedFilters);
      return updatedFilters;
    });
  };

  // ✅ Active Filters
  const activeFilters = [];
  if (filters.sort && filters.sort !== "new")
    activeFilters.push({ label: `Sort: ${filters.sort}`, key: "sort" });
  if (filters.ratings)
    activeFilters.push({
      label: `${filters.ratings}★ & above`,
      key: "ratings",
    });
  if (
    filters.min_price != null &&
    filters.max_price != null &&
    (filters.min_price !== 0 || filters.max_price !== 10000)
  )
    activeFilters.push({
      label: `₹${filters.min_price} - ₹${filters.max_price}`,
      key: "price",
    });
  if (filters.category_slug)
    activeFilters.push({
      label: `Category: ${filters.category_slug}`,
      key: "category",
    });
  if (filters.subcategory_slug)
    activeFilters.push({
      label: `Sub-category: ${filters.subcategory_slug}`,
      key: "subcategory",
    });
    const clearAllFilters = () => {
  // Reset local states
  setMinPrice(fixedMinPrice);
  setMaxPrice(fixedMaxPrice);
  setSelectedRating(null);

  updateFilters({
    sort: "new",
    min_price: null,
    max_price: null,
    ratings: null,
    category_id: null,
    category_slug: null,
    subcategory_id: null,
    subcategory_slug: null,
  });

  navigate("/product");
};


  return (
    <>
      <ScrollToTop />
      <Header />

      <section className="All_Products">
        <div className="container">
          <div className="row g-lg-5 g-md-4">
            {/* Sidebar */}
            <div className="col-lg-3">
              <div className="fliterbox mt-lg-5 mt-md-4 mt-3 mb-0">
                <div className="fliterbox-tile d-flex align-items-center justify-content-between">
                  <div className="title-box">
                    <h2 className="d-flex">
                      <span
                        className={`filter-btn ${isMobile ? "showrel" : ""}`}
                        onClick={toggleFilter}
                      >
                        Filter{" "}
                        {showFilter ? (
                          <FontAwesomeIcon
                            icon={faClose}
                            className="d-inline-block d-lg-none"
                          />
                        ) : (
                          <FontAwesomeIcon
                            icon={faBarsStaggered}
                            className="d-inline-block d-lg-none"
                          />
                        )}
                      </span>
                    </h2>
                  </div>
                  <div className="title-box">
  <Link to="/product" onClick={clearAllFilters}>
    Clear Filter
  </Link>
</div>
                </div>
                <div
                  className={`filter-contaienr ${
                    isMobile ? "filter-container" : ""
                  } ${showFilter ? "show" : ""}`}
                >
                  <ProductFilter
                    filter_category={category}
                    products={products}
                    updateFilters={updateFilters}
                    filters={filters}
                  />
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
                    <Form.Select
                      className="custom-select"
                      aria-label="Sort by"
                      value={filters.sort || "new"}
                      onChange={handleSortChange}
                    >
                      <option value="new">Newest</option>
                      <option value="popularity">Most Popular</option>
                      <option value="discount">Discount</option>
                      <option value="price_high_low">Price: High to Low</option>
                      <option value="price_low_high">Price: Low to High</option>
                    </Form.Select>
                  </div>
                </div>

                {/* ✅ Active filters section */}
                <div className="d-flex justify-content-between align-items-center bg-light p-2 rounded my-3 fitkere">
                  <div className="d-flex align-items-center gap-2">
                    <span className="text-secondary">Active Filters:</span>
                    {activeFilters.length === 0 && (
                      <span className="text-muted">None</span>
                    )}
                    {activeFilters.map((filter, index) => (
                      <div
                        key={index}
                        className="d-flex align-items-center px-2 py-1"
                      >
                        <span className="me-1 fw-bold">{filter.label}</span>
                        <button
                          className="btn p-0 text-secondary"
                          onClick={() => {
                            if (filter.key === "sort")
                              setFilters((prev) => ({ ...prev, sort: "new" }));
                            else if (filter.key === "ratings")
                              setFilters((prev) => ({
                                ...prev,
                                ratings: null,
                              }));
                            else if (filter.key === "price")
                              setFilters((prev) => ({
                                ...prev,
                                min_price: null,
                                max_price: null,
                              }));
                            else if (filter.key === "category")
                              setFilters((prev) => ({
                                ...prev,
                                category_id: null,
                                category_slug: null,
                                subcategory_id: null,
                                subcategory_slug: null,
                              }));
                            else if (filter.key === "subcategory")
                              setFilters((prev) => ({
                                ...prev,
                                subcategory_id: null,
                                subcategory_slug: null,
                              }));
                          }}
                        >
                          <span className="fw-bold">X</span>
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="text-secondary">
                    {products.data.length} Results found.
                  </div>
                </div>

                <Product_card products={products} />
                {fetching && (
                  <div className="text-center mt-3">Loading products...</div>
                )}
                {!hasMore && products.data.length > 0 && (
                  <div className="text-center mt-3 text-muted">
                    No more products.
                  </div>
                )}
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
