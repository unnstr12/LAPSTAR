import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Featured extends Component {

  render() {
    let publicUrl = process.env.PUBLIC_URL + '/'
    const categories = [
      { name: 'Cao cấp', slug: 'laptop?categoryIds=4', icon: 'cao-cap.gif' },
      { name: 'Văn phòng', slug: 'laptop?categoryIds=5', icon: 'van-phong.gif' },
      { name: 'Gaming', slug: 'laptop?categoryIds=6', icon: 'gaming.gif' },
      { name: 'Đồ họa', slug: 'laptop?categoryIds=7', icon: 'do-hoa.gif' }
    ];

    return <section className="featured-categories-area bg-sky-blue pd-top-70 pd-bottom-70">
      <div className="container">
        <div className="row justify-content-center pb-4">
          <div className="col-lg-6">
            <div className="section-title text-center">
              <h2>Danh mục Laptop</h2>
              <p>Khám phá các dòng laptop phù hợp với nhu cầu của bạn.</p>
            </div>
          </div>
        </div>
        <div className="row justify-content-center">
          {categories.map((category, index) => (
            <div className="col-lg-3 col-md-6" key={index}>
              <Link to={`/${category.slug}`} className="single-category-wrap-link">
                <div className="single-category-wrap text-center">
                  <div className="thumb">
                    <img src={`${publicUrl}assets/img/category-icons/${category.icon}`} alt={category.name} className="category-icon" />
                  </div>
                  <h4>{category.name}</h4>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  }
}

export default Featured