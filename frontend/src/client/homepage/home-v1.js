import React from 'react';
import Navbar from '../../components/global-components/navbar-v2';
import Banner from './banner';
import Featured from './featured';
import ProductV1 from './product-v1';
import About from './about';
import Pricing from './pricing';
import FunFact from '../../components/section-components/funfact';
import Testimonial from '../../components/section-components/testimonial';
import LatestPost from '../../components/blog-components/latest-news';
import Footer from '../../components/global-components/footer';

const Home_V1 = () => {
    return <div>
        <Navbar />
        <Banner />
        <ProductV1 />
        <Featured />
        <Pricing />
        <About />
        {/* <Testimonial />
        <FunFact /> */}
        {/* <LatestPost /> */}
        <Footer />
    </div>
}

export default Home_V1

