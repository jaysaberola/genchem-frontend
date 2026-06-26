import React, { useEffect, useState } from "react";
import Header from "@/components/Layout/_Header";
import HeaderBar from "@/components/Layout/HeaderBar";
import GlobalFooter from '@/components/Layout/GlobalFooter';

export default function Projects() {

    return (
        
        <div>
            <Header />
            <HeaderBar />

            <div className="d-flex text-center flex-column align-items-center cutter-section">
                <div className="container">

                    <div className="heading-block text-center border-0 cutter-title" data-heading="P">
                        <h2 className="fs-1 fw-bold mb-4">Our Projects</h2>
                        <small className="fs-5 fw-light text-secondary">
                            Our Projects showcase the strength, precision, and reliability behind every PVC pipe solution we deliver. 
                            From residential plumbing to large-scale commercial systems, we build durable connections that stand the test of time.
                        </small>
                    </div>

                </div>

                <div className="container projects-gallery">
                    
                    <div className="d-flex flex-column gap-2">
                        <div className="d-flex flex-column flex-md-row align-items-center gap-4 my-5">
                            <img src="/images/projects/proj8.jpg" alt="" className="img-fluid rounded-3 animate-hov shadow" />
                            <div className="d-flex flex-column text-start ps-5">
                                <h3>Heritage Park</h3>
                                <small className="fs-5 fw-light text-secondary">
                                    Our Projects showcase the strength, precision, and reliability behind every PVC pipe solution we deliver. 
                                    From residential plumbing to large-scale commercial systems, we build durable connections that stand the test of time.
                                </small>
                            </div>
                        </div>
                        <div className="d-flex flex-column flex-md-row align-items-center gap-4 my-5">
                            <div className="d-flex flex-column text-start pe-3">
                                <h3>El Jardin Del Presidente</h3>
                                <small className="fs-5 fw-light text-secondary">
                                    Our Projects showcase the strength, precision, and reliability behind every PVC pipe solution we deliver. 
                                    From residential plumbing to large-scale commercial systems, we build durable connections that stand the test of time.
                                </small>
                            </div>
                            <img src="/images/projects/proj5.jpg" alt="" className="img-fluid rounded-3 animate-hov shadow" />
                        </div>
                    </div>
                    <div className="d-flex flex-column gap-2">
                        <div className="d-flex flex-column flex-md-row align-items-center gap-4 my-5">
                            <img src="/images/projects/proj2.jpg" alt="" className="img-fluid rounded-3 animate-hov shadow" />
                            <div className="d-flex flex-column text-start ps-5">
                                <h3>RCBC Plaza</h3>
                                <small className="fs-5 fw-light text-secondary">
                                    Our Projects showcase the strength, precision, and reliability behind every PVC pipe solution we deliver. 
                                    From residential plumbing to large-scale commercial systems, we build durable connections that stand the test of time.
                                </small>
                            </div>
                        </div>
                        <div className="d-flex flex-column flex-md-row align-items-center gap-4 my-5">
                            <div className="d-flex flex-column text-start pe-3">
                                <h3>Robinson's Galleria Regency</h3>
                                <small className="fs-5 fw-light text-secondary">
                                    Our Projects showcase the strength, precision, and reliability behind every PVC pipe solution we deliver. 
                                    From residential plumbing to large-scale commercial systems, we build durable connections that stand the test of time.
                                </small>
                            </div>
                            <img src="/images/projects/proj6.jpg" alt="" className="img-fluid rounded-3 animate-hov shadow" />
                        </div>
                    </div>
                    <div className="d-flex flex-column gap-2">
                        <div className="d-flex flex-column flex-md-row align-items-center gap-4 my-5">
                            <img src="/images/projects/proj4.jpg" alt="" className="img-fluid rounded-3 animate-hov shadow" />
                            <div className="d-flex flex-column text-start ps-5">
                                <h3>Corinthian Hills</h3>
                                <small className="fs-5 fw-light text-secondary">
                                    Our Projects showcase the strength, precision, and reliability behind every PVC pipe solution we deliver. 
                                    From residential plumbing to large-scale commercial systems, we build durable connections that stand the test of time.
                                </small>
                            </div>
                        </div>
                        <div className="d-flex flex-column flex-md-row align-items-center gap-4 my-5">
                            <div className="d-flex flex-column text-start pe-3">
                                <h3>Greenbelt 1 & 2 Redevelopment</h3>
                                <small className="fs-5 fw-light text-secondary">
                                    Our Projects showcase the strength, precision, and reliability behind every PVC pipe solution we deliver. 
                                    From residential plumbing to large-scale commercial systems, we build durable connections that stand the test of time.
                                </small>
                            </div>
                            <img src="/images/projects/proj7.jpg" alt="" className="img-fluid rounded-3 animate-hov shadow" />
                        </div>
                    </div>
                    <div className="d-flex flex-column gap-2">
                        <div className="d-flex flex-column flex-md-row align-items-center gap-4 my-5">
                            <img src="/images/projects/proj10.jpg" alt="" className="img-fluid rounded-3 animate-hov shadow" />
                            <div className="d-flex flex-column text-start ps-5">
                                <h3>Manila - Japanese School</h3>
                                <small className="fs-5 fw-light text-secondary">
                                    Our Projects showcase the strength, precision, and reliability behind every PVC pipe solution we deliver. 
                                    From residential plumbing to large-scale commercial systems, we build durable connections that stand the test of time.
                                </small>
                            </div>
                        </div>
                        <div className="d-flex flex-column flex-md-row align-items-center gap-4 my-5">
                            <div className="d-flex flex-column text-start pe-3">
                                <h3>Paseo Parkview</h3>
                                <small className="fs-5 fw-light text-secondary">
                                    Our Projects showcase the strength, precision, and reliability behind every PVC pipe solution we deliver. 
                                    From residential plumbing to large-scale commercial systems, we build durable connections that stand the test of time.
                                </small>
                            </div>
                            <img src="/images/projects/proj9.jpg" alt="" className="img-fluid rounded-3 animate-hov shadow" />
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