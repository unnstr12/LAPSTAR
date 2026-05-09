import React from 'react';
import Navbar from './global-components/navbar-v2';
import PageHeader from './global-components/page-header';
import BlogDetails from './blog-components/blog-details';
import Footer from './global-components/footer';

const BlogPage = () => {
    return <div>
        <Navbar />
        <PageHeader headertitle="Nhật ký LapStar"  />
        <BlogDetails />
        <Footer />
    </div>
}

export default BlogPage

