import React, { useState, useEffect } from "react";
import Header from "../../Components/Partials/Header/Header";
import Footer from "../../Components/Partials/Footer/Footer";
import Product_card from "../../Components/Product/Product_card/Product_card";
import Product_filter from "../../Components/ProductDetail/Product_filter/Product_filter";
import { Link, useParams } from "react-router-dom";
import { Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { filtersAction } from "../../store/Products/filtersSlice";
import ScrollToTop from "../ScrollToTop";

export default function Product({category_type}) {
  const fetch_products = useSelector((store) => store.products);
fetch_products.data.forEach(product => {
    // console.log(`"Product Image URL:", ${product.img_url} <br>  ${product.id}`);
    console.log("product data", product)
});

  const fetch_filter = useSelector((store) => store.filters);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 991);
  const [showFilter, setShowFilter] = useState(false);
  // const [catProducts,setCatProducts] = useState([]);
  const [products, setProducts] = useState([])
  const {category, sub_category} = useParams();

  useEffect(()=>{
    setProducts(fetch_products.data)
    if(!category_type) return;
    console.log(category_type)
    if(category_type == 'category'){
      setProducts(fetch_products.data.filter((value) => value.category_slug == category))
    }else{
      setProducts(fetch_products.data.filter((value) => value.sub_category_slug == sub_category))
    }
  },[category_type,fetch_products.status,sub_category,category])
  useEffect(()=>{
    dispatch(filtersAction.countProduct(products.length));
  },[products])
  const dispatch = useDispatch();
  const handleSortChange = (event) => {
    dispatch(filtersAction.sorted(event.target.value));
  };

  const handleResize = () => {
    setIsMobile(window.innerWidth <= 991);
  };

  const toggleFilter = () => {
    setShowFilter((prev) => !prev);
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const filters = ["Milk delivery bag", "5 Star Rating"];

  return (
    <>
    <ScrollToTop/>
      <Header />

      <section className="All_Products">
        <div className="container">
          <div className="row g-lg-5 g-md-4">
            <div className="col-lg-3">
              <div className="fliterbox mt-lg-5 mt-md-4 mt-3 mb-0">
                <div className="fliterbox-tile d-flex align-items-center justify-content-between">
                  <div className="title-box">
                    <h2>
                      <span
                        className={`filter-btn ${isMobile ? "showrel" : ""}`}
                        onClick={toggleFilter}
                      >
                        Filter
                      </span>
                    </h2>
                  </div>
                  <div className="title-box">
                    <Link to="/product">Clear Filter</Link>
                  </div>
                </div>
                <div
                  className={`filter-contaienr ${
                    isMobile ? "filter-container" : ""
                  } ${showFilter ? "show" : ""}`}
                >
                  <Product_filter products={fetch_products} />
                </div>
              </div>
            </div>

            <div className="col-lg-9">
              <div className="product-section my-5">
                <div className="feature-product-tile  d-flex flex-wrap align-items-center justify-content-between">
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
                      value={fetch_filter.sorted}
                      onChange={handleSortChange}
                    >
                      <option value="newest">Newest</option>
                      <option value="popular">Most Popular</option>
                      <option value="a_to_z">A to Z</option>
                      <option value="z_to_a">Z to A</option>
                      <option value="low_to_high">Price: Low to High</option>
                      <option value="high_to_low">Price: High to Low</option>
                    </Form.Select>
                  </div>
                </div>

                <div className="d-flex justify-content-between align-items-center bg-light p-2 rounded mb-3">
                  <div className="d-flex align-items-center gap-2">
                    <span className="text-secondary">Active Filters:</span>
                    {filters.map((filter, index) => (
                      <div
                        key={index}
                        className="d-flex align-items-center px-2 py-1 "
                      >
                        <span className="me-1 fw-bold">{filter}</span>
                        <button className="btn  p-0 text-secondary">
                          <span size={12} className="fw-bold">
                            X
                          </span>
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="text-secondary">
                    {fetch_filter.countProduct} Results found.
                  </div>
                </div>

                <Product_card products={products} filters={fetch_filter} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
