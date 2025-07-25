import React from 'react';
import Navbar from '../../components/global-components/navbar-v2';
import PageHeader from '../../components/global-components/page-header';
import PolicyPage from './policy-page';
import Footer from '../../components/global-components/footer';

const Policy = () => {
    return <div>
        <Navbar />
        <PageHeader headertitle="Chính sách" subheader="Chính sách"  />
        <PolicyPage />
        <Footer />
    </div>
}

export default Policy

