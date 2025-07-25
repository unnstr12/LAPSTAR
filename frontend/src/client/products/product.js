import React from 'react';
import Navbar from '../../components/global-components/navbar-v2';
import PageHeader from '../../components/global-components/page-header';
import ProductPage from './product-page';
import Footer from '../../components/global-components/footer';

const Product = (props) => {
    // Lấy slug từ URL
    const { match } = props;
    const categorySlug = match ? match.params.categorySlug : null;

    return (
        <div>
        <Navbar />
        {/* <PageHeader headertitle="Products" subheader="pages"  /> */}
            <ProductPage categorySlug={categorySlug} />
        <Footer />
    </div>
    );
}

export default Product;

