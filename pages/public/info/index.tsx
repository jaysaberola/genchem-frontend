import React, { useEffect, useState } from "react";
import Header from "@/components/Layout/_Header";
import HeaderBar from "@/components/Layout/HeaderBar";
import GlobalFooter from '@/components/Layout/GlobalFooter';

export default function Info() {

    return (
        
        <div>

            <Header />
            <HeaderBar />

            <div className="d-flex text-center flex-column align-items-center cutter-section">
                <div className="container">

                    <div className="heading-block text-center border-0 cutter-title" data-heading="A">
                        <h2 className="fs-1 fw-bold mb-4">Additional Information Table</h2>
                        <small className="fs-5 fw-light text-secondary">
                            The following table outlines additional performance characteristics, applicable testing standards, and relevant reference data to support detailed product evaluation and engineering assessment. These specifications are provided to assist consultants, contractors, and project engineers in verifying compliance with industry requirements, ensuring suitability for intended applications, and maintaining quality assurance standards. All values are based on standardized laboratory testing and established manufacturing controls to ensure consistent product performance and reliability.
                        </small>
                    </div>

                </div>

                <div className="col-12 col-md-6 d-flex justify-content-center align-items-start">
                    <table className="border-0 shadow animate-hov" style={{borderCollapse: "collapse"}}>
                        <tbody>
                            <tr>
                                <td style={{border: "0px", padding: "0px"}}>
                                    <img src="/images/technicals/tec1.gif" alt="" className="img-techs" style={{display: "block"}}/>
                                </td>
                                <td style={{border: "0px", padding: "0px"}}>
                                    <img src="/images/technicals/tec2.gif" alt="" className="img-techs" style={{display: "block"}}/>
                                </td>
                            </tr>
                            <tr>
                                <td style={{border: "0px", padding: "0px"}}>
                                    <img src="/images/technicals/tec3.gif" alt="" className="img-techs" style={{display: "block"}}/>
                                </td>
                                <td style={{border: "0px", padding: "0px"}}>
                                    <img src="/images/technicals/tec4.gif" alt="" className="img-techs" style={{display: "block"}}/>
                                </td>
                            </tr>
                            <tr>
                                <td style={{border: "0px", padding: "0px"}}>
                                    <img src="/images/technicals/tec5.gif" alt="" className="img-techs" style={{display: "block"}}/>
                                </td>
                                <td style={{border: "0px", padding: "0px"}}>
                                    <img src="/images/technicals/tec6.gif" alt="" className="img-techs" style={{display: "block"}}/>
                                </td>
                            </tr>
                            <tr>
                                <td style={{border: "0px", padding: "0px"}}>
                                    <img src="/images/technicals/tec7.gif" alt="" className="img-techs" style={{display: "block"}}/>
                                </td>
                                <td style={{border: "0px", padding: "0px"}}>
                                    <img src="/images/technicals/tec8.gif" alt="" className="img-techs" style={{display: "block"}}/>
                                </td>
                            </tr>
                            <tr>
                                <td style={{border: "0px", padding: "0px"}}>
                                    <img src="/images/technicals/tec9.gif" alt="" className="img-techs" style={{display: "block"}}/>
                                </td>
                                <td style={{border: "0px", padding: "0px"}}>
                                    <img src="/images/technicals/tec10.gif" alt="" className="img-techs" style={{display: "block"}}/>
                                </td>
                            </tr>
                            <tr>
                                <td style={{border: "0px", padding: "0px"}}>
                                    <img src="/images/technicals/tec11.gif" alt="" className="img-techs" style={{display: "block"}}/>
                                </td>
                                <td style={{border: "0px", padding: "0px"}}>
                                    <img src="/images/technicals/tec12.gif" alt="" className="img-techs" style={{display: "block"}}/>
                                </td>
                            </tr>
                            <tr>
                                <td style={{border: "0px", padding: "0px"}}>
                                    <img src="/images/technicals/tec13.gif" alt="" className="img-techs" style={{display: "block"}}/>
                                </td>
                                <td style={{border: "0px", padding: "0px"}}>
                                    <img src="/images/technicals/tec14.gif" alt="" className="img-techs" style={{display: "block"}}/>
                                </td>
                            </tr>
                            <tr>
                                <td style={{border: "0px", padding: "0px"}}>
                                    <img src="/images/technicals/tec15.gif" alt="" className="img-techs" style={{display: "block"}}/>
                                </td>
                                <td style={{border: "0px", padding: "0px"}}>
                                    <img src="/images/technicals/tec16.gif" alt="" className="img-techs" style={{display: "block"}}/>
                                </td>
                            </tr>
                            <tr>
                                <td style={{border: "0px", padding: "0px"}}>
                                    <img src="/images/technicals/tec17.gif" alt="" className="img-techs" style={{display: "block"}}/>
                                </td>
                                <td style={{border: "0px", padding: "0px"}}>
                                    <img src="/images/technicals/tec18.gif" alt="" className="img-techs" style={{display: "block"}}/>
                                </td>
                            </tr>
                        </tbody>     
                    </table>
                </div>

            </div>

            <div className="w-100">
                <GlobalFooter />
            </div>

        </div>

    );
}