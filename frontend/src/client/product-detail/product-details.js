import React from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../../components/global-components/navbar-v2';
import ProductDetailsPage from './product-details-page';
import ProductSlider from './product-slider';
import Footer from '../../components/global-components/footer';

const ProductDetails = () => {
    const { variantId } = useParams();

    return <div>
        <Navbar />
        <ProductDetailsPage />
        <ProductSlider productId={variantId} />
        <Footer />
    </div>
}

export default ProductDetails

