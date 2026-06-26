import React, { useEffect, useState } from "react";
import Header from "@/components/Layout/_Header";
import HeaderBar from "@/components/Layout/HeaderBar";
import GlobalFooter from '@/components/Layout/GlobalFooter';

export default function Accreditations() {

    return (
        
        <div>
            <Header />
            <HeaderBar />

            <div className="d-flex text-center flex-column align-items-center cutter-section">
                <div className="container">

                    <div className="heading-block text-center border-0 cutter-title" data-heading="A">
                        <h2 className="fs-1 fw-bold mb-4">Our Accreditations</h2>
                        <small className="fs-5 fw-light text-secondary">
                            Our Projects showcase the strength, precision, and reliability behind every PVC pipe solution we deliver. 
                            From residential plumbing to large-scale commercial systems, we build durable connections that stand the test of time.
                        </small>
                    </div>

                </div>

                <div className="container projects-gallery">
                    
                    <div className="d-flex flex-column gap-2">
                        <div className="d-flex flex-column flex-md-row align-items-center gap-4 my-5">
                            <img src="/images/certs/armstrong-cert.jpg" alt="" className="img-fluid rounded-3 animate-hov shadow" />
                            <div className="d-flex flex-column text-start ps-5">
                                <h3>Armstrong PVC Quality Certification</h3>
                                <small className="fs-5 fw-light text-secondary">
                                    Armstrong PVC products are manufactured in accordance with stringent quality control systems to ensure consistent performance, durability, and safety in every application. Each product undergoes comprehensive testing procedures, including strength, pressure resistance, dimensional accuracy, and material integrity assessments, to guarantee compliance with recognized industry standards. From raw material selection to final production, every stage of the manufacturing process is carefully monitored to maintain superior product quality.
                                    Our quality certification demonstrates Armstrong PVC’s unwavering commitment to excellence, reliability, and customer satisfaction. By adhering to established national and international standards, we ensure that our PVC pipes and fittings are suitable for residential, commercial, and industrial use. This certification serves as a mark of trust—assuring clients, contractors, and partners that Armstrong PVC delivers dependable, high-performance solutions built to last.
                                </small>
                            </div>
                        </div>
                        <hr style={{ opacity: 0.22, margin: "22px 0" }} />
                        <div className="d-flex flex-column flex-md-row align-items-center gap-4 my-5">
                            <div className="d-flex flex-column text-start pe-3">
                                <h3>Bluebell PVC Quality Certification</h3>
                                <small className="fs-5 fw-light text-secondary">
                                    Bluebell PVC products are manufactured under strict quality assurance systems to ensure strength, durability, and long-term performance in various applications. Every pipe and fitting undergoes comprehensive testing for pressure resistance, dimensional accuracy, impact strength, and material consistency to meet recognized industry standards. From the careful selection of premium raw materials to the final inspection stage, each step of the production process is closely monitored to maintain superior quality.
                                    Our quality certification reflects Bluebell PVC’s commitment to delivering reliable and safe piping solutions for residential, commercial, agricultural, and industrial projects. By complying with established national and international standards, we guarantee products that provide excellent performance, structural integrity, and lasting value. This certification stands as a symbol of trust and assurance for customers, contractors, and partners who rely on Bluebell PVC for dependable and high-quality piping systems.
                                </small>
                            </div>
                            <img src="/images/certs/bluebell-cert.jpg" alt="" className="img-fluid rounded-3 animate-hov shadow" />
                        </div>
                    </div>

                </div>
            </div>

            <div className="w-100">
                <GlobalFooter />
            </div>
        </div>

    );
}