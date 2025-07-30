import React from 'react'
import { Link } from 'react-router-dom'

export default function CategoryCard({data }) {
  return (
            <div key={data.id} className="Shop_by_health-card">
              <div className="card-img">
                <img src={data.image_url} alt="Product" />
              </div>
              <div className="product-detail">
                <h3>
                  <Link to={`/category/${data.slug}`}>{data.name}</Link>
                </h3>
              </div>
            </div>
  )
}
