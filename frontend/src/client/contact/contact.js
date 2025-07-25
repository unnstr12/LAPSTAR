import React from 'react';
import Navbar from '../../components/global-components/navbar-v2';
import PageHeader from '../../components/global-components/page-header';
import ContactInfo from './contact-info';
import ContactForm from './contact-form';
import Footer from '../../components/global-components/footer';

const ContactPage = () => {
    return <div>
        <Navbar />
        <ContactInfo />
        <ContactForm />
        <Footer />
    </div>
}

export default ContactPage

