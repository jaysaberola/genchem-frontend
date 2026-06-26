import React, { useEffect, useState } from "react";
import Header from "@/components/Layout/_Header";
import HeaderBar from "@/components/Layout/HeaderBar";
import GlobalFooter from '@/components/Layout/GlobalFooter';

export default function Technicals() {

    return (
        
        <div>

            <Header />
            <HeaderBar />

            <div className="d-flex text-center flex-column align-items-center cutter-section">
                <div className="container">

                    <div className="heading-block text-center border-0 cutter-title" data-heading="T">
                        <h2 className="fs-1 fw-bold mb-4">Technical Information</h2>
                        <small className="fs-5 fw-light text-secondary">
                            Here are outlines the complete specifications of GENCHEM PH products, including material composition, pressure ratings, dimensions, compliance standards, and installation guidelines to ensure durability, safety, and superior performance in every application.
                        </small>
                    </div>

                </div>

                <div className="container projects-gallery">
                    
                    <div className="d-flex flex-column gap-2">

                        <div className="d-flex flex-column flex-md-row align-items-center gap-4 my-5">
                            <div className="d-flex flex-column text-start pe-3 col-12 col-md-6">
                                <div className="d-flex align-items-center gap-2 mb-2">
                                    <h3><span className="fw-bold fs-2">Orangeberg uPVC</span> Sanitary Piping System</h3>
                                </div>
                                <div className="card my-4 shadow animate-hov">
                                    <div className="card-header">
                                        <strong>Lightest of all Plumbing Materials</strong>
                                    </div>
                                    <div className="card-body">
                                        <p className="card-text">
                                            <i>Orangeberg PVC Sanitary Pipes & Fittings</i> are by
                                            far the lightest of any plumbing system. Its specific
                                            gravity is less than one-fifth the specific gravity
                                            of steel and cast iron. Three meter length pipes are
                                            easily carried. Because of its lightness in weight,
                                            it is easy to transport, handle and install, especially
                                            in tight places. It is also highly resistant to sunlight
                                            and rain. Its mechanical properties and pipe performance
                                            are not affected by the climate and can be installed
                                            in any kind of weather conditions.
                                        </p>
                                    </div>
                                </div>
                                <div className="card my-4 shadow animate-hov">
                                    <div className="card-header">
                                        <strong>Corrosion-Proof</strong>
                                    </div>
                                    <div className="card-body">
                                        <p className="card-text">
                                            <i>Orangeberg PVC Sanitary Pipes & Fittings</i> are totally
                                            resistant to all waste system liquids and gases. It
                                            is highly resistant to an extremely wide range of chemicals.
                                            It is being used now in chemical plants to convey concentrated
                                            acids and strong alkaline solutions – chemicals
                                            which would quickly destroy metallic plumbing pipes.
                                            Now you can have a chemical piping system for your
                                            in house plumbing job.
                                        </p>
                                    </div>
                                </div>
                                <div className="card my-4 shadow animate-hov">
                                    <div className="card-header">
                                        <strong>High Impact Resistance</strong>
                                    </div>
                                    <div className="card-body">
                                        <p className="card-text">
                                            Impact blow that would hopelessly break the best of
                                            today’s cast iron pipe or dent copper plumbing
                                            pipe glance harmlessly off Orangeberg PVC Sanitary
                                            Pipes. Rough handling, backfilling, traffic loads,
                                            vibration, temperature changes – the hazards
                                            which make metallic plumbing jobs unusable are no problem
                                            with Orangeberg PVC Sanitary Pipes & Fittings.
                                        </p>
                                    </div>
                                </div>
                                <div className="card my-4 shadow animate-hov">
                                    <div className="card-header">
                                        <strong>Performance Tested and Time Tested</strong>
                                    </div>
                                    <div className="card-body">
                                        <p className="card-text">
                                            <i>Orangeberg PVC Sanitary Pipes & Fittings</i> are produced
                                            under the most rigid production supervision and undergoes
                                            the most comprehensive quality tests before they are
                                            dispatched from the factory. Consistent samplings,
                                            torture tests quality checks are part of the standard
                                            manufacturing procedure in a 24-hour, round the clock
                                            duty of a quality control personnel, hand-in-hand with
                                            production staffs. Orangeberg PVC Sanitary Pipes and
                                            Fittings with its unique superior properties offers
                                            a long-lasting, trouble-free plumbing system.
                                        </p>
                                    </div>
                                </div>
                                
                            </div>

                            <div className="col-12 col-md-6 d-flex justify-content-center align-items-start">
                                <table className="border-0" style={{borderCollapse: "collapse"}}>
                                    <tbody>
                                        <tr>
                                            <td style={{border: "0px", padding: "0px"}}>
                                                <img src="/images/technicals/pip1.jpg" alt="" className="img-techs" style={{display: "block"}}/>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style={{border: "0px", padding: "0px"}}>
                                                <img src="/images/technicals/pip2.jpg" alt="" className="img-techs" style={{display: "block"}}/>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style={{border: "0px", padding: "0px"}}>
                                                <img src="/images/technicals/pip3.jpg" alt="" className="img-techs" style={{display: "block"}}/>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style={{border: "0px", padding: "0px"}}>
                                                <img src="/images/technicals/pip4.jpg" alt="" className="img-techs" style={{display: "block"}}/>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style={{border: "0px", padding: "0px"}}>
                                                <img src="/images/technicals/pip5.jpg" alt="" className="img-techs" style={{display: "block"}}/>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style={{border: "0px", padding: "0px"}}>
                                                <img src="/images/technicals/pip6.jpg" alt="" className="img-techs" style={{display: "block"}}/>
                                            </td>
                                        </tr>
                                    </tbody>     
                                </table>
                            </div>

                        </div>

                        <hr style={{ opacity: .22, margin: "22px 0" }} />

                        <div className="d-flex flex-column align-items-center gap-4 my-5">
                            <div className="d-flex flex-column text-start col-12 mb-4">
                                <div className="d-flex align-items-center gap-2 mb-2">
                                    <h3><span className="fw-bold fs-2">Bluebell uPVC</span> Pressure Main Piping System</h3>
                                </div>
                                <div className="card my-4 shadow animate-hov pb-4">
                                    <div className="card-header">
                                        <strong>General Properties and Quality Standards </strong>
                                    </div>
                                    <div className="card-body">
                                        <p className="card-text">
                                            <i>BLUEBELL uPVC Pressure Pipe</i> is extruded in nominal
                                            six (6) meter lengths from virgin unplasticized polyvinyl
                                            chloride (uPVC) materials. The pipe is produced with
                                            the bell-shape socket end which has an internal groove
                                            that accommodates the special BLUEBELL PIPE-SEAL RUBBER
                                            RING. The other end of the pipe is chamfered into a
                                            spigot shape. Jointing of the uPVC pipeline is simply
                                            done by pushing the spigot end of the pipe into the
                                            socket end of the nest pipe to make a watertight joint.
                                            The color of the pipe is blue.
                                        </p>
                                        <br />
                                        <p className="card-text">
                                            The name BLUEBELL stands for the BLUE color and Bell
                                            end uPVC piping system. The pipe is manufactured in
                                            nominal outside diameter from 63mm to 315mm, suitable
                                            for working pressure up to 1.2 MPa. The extruded uPVC
                                            pipe has a smooth inner wall which provides a low resistance,
                                            hence better flow efficiency. BLUEBELL uPVC Pressure
                                            Pipelines can be assembled under any temperature and
                                            weather condition. The jointed uPVC pipes, under normal
                                            circumstances, are not required to be cooled before
                                            backfilling, as any subsequent thermal movement will
                                            be taken up in the joints. It also eliminates the need
                                            to delay hydrostatic testing, assuring all concrete
                                            thrust block and anchorage block have reached their
                                            adequate strength, as there immediately, the pipes
                                            have already been joined watertight. In comparing BLUEBELL
                                            uPVC Pressure Piping System and
                                            the solvent cement system, experience has shown that
                                            BLUEBELL uPVC Pressure Pipes can be joined faster
                                            that the solvent cement system of pipeline jointing.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="col-12 d-flex justify-content-center align-items-start">
                                <table className="table table-striped table-hover table-bordered shadow" style={{borderTop: "4px solid red"}}>
                                    <thead>
                                        <tr>
                                            <th colSpan={2}>Property</th>
                                            <th>Value</th>
                                            <th>Unit</th>
                                            <th>Test Method</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td rowSpan={5} className="align-middle">
                                                <strong>Physical Characteristics</strong>
                                            </td>
                                            <td className="align-middle">
                                                <small>
                                                    Appearance
                                                </small>
                                            </td>
                                            <td colSpan={2}>
                                                <small>
                                                    The pipe shall be homogenous throughout and free from cracks, holes, encrustations and other foreign inclusions
                                                </small>
                                            </td>
                                            <td><small>PNS 65:1993</small></td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <small>
                                                    Color
                                                </small>
                                            </td>
                                            <td colSpan={2}>
                                                <small>
                                                    The color of the pipe shall be blue nearest to RAL 5012
                                                </small>
                                            </td>
                                            <td>
                                                <small>
                                                    PNS 65:1993
                                                </small>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td rowSpan={2} className="align-middle">
                                                <small>
                                                    Effect of Materials on Water Quality
                                                </small>
                                            </td>
                                            <td colSpan={2}>
                                                <small>
                                                    see table 1
                                                </small>
                                            </td>
                                            <td  className="text-nowrap">
                                                <small>
                                                    PNS 65:1993 / PNS 966
                                                </small>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td colSpan={2}>
                                                <small>
                                                    No disintegration
                                                </small>
                                            </td>
                                            <td>
                                                <small>
                                                    PNS 65:1993 / PNS 978
                                                </small>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <small>
                                                    Resistance to Acetone
                                                </small>
                                            </td>
                                            <td colSpan={2}>
                                                <small>
                                                    The mass shall not increase by more than 0.316 g nor decrease by more than 0.013 g.
                                                </small>
                                            </td>
                                            <td>
                                                <small>
                                                    PNS 65:1993 / PNS 979
                                                </small>
                                            </td>
                                        </tr>
                                        
                                        <tr>
                                            <td rowSpan={3} className="align-middle">
                                                <strong>Physical Properties</strong>
                                            </td>
                                            <td>
                                                <small>
                                                    Vicat Softening Temperature, min.
                                                </small>
                                            </td>
                                            <td>
                                                <small>
                                                    76
                                                </small>
                                            </td>
                                            <td>
                                                <small>
                                                    °C
                                                </small>
                                            </td>
                                            <td>
                                                <small>
                                                    PNS 65:1993 / PNS 952
                                                </small>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <small>
                                                    Longitudinal Reversion, max.
                                                </small>
                                            </td>
                                            <td>
                                                <small>
                                                    5
                                                </small>
                                            </td>
                                            <td>
                                                <small>
                                                    %
                                                </small>
                                            </td>
                                            <td>
                                                <small>
                                                    PNS 65:1993 / PNS 951
                                                </small>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <small>
                                                    Water Absorption, max.
                                                </small>
                                            </td>
                                            <td>
                                                <small>
                                                    40
                                                </small>
                                            </td>
                                            <td>
                                                <small>
                                                    g / m<sup>2</sup>
                                                </small>
                                            </td>
                                            <td>
                                                <small>
                                                    PNS 65:1993 / PNS 953
                                                </small>
                                            </td>
                                        </tr>

                                        <tr>
                                            <td rowSpan={3} className="align-middle">
                                                <strong>Mechanical Properties</strong>
                                            </td>
                                            <td>
                                                <small>
                                                    Hydrostatic Pressure
                                                </small>
                                            </td>
                                            <td colSpan={2}>
                                                <small>
                                                    see table 2
                                                </small>
                                            </td>
                                            <td>
                                                <small>
                                                    PNS 65:1993 / PNS 509
                                                </small>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <small>
                                                    Resistance to External Blows, max.
                                                </small>
                                            </td>
                                            <td>
                                                <small>
                                                    10
                                                </small>
                                            </td>
                                            <td>
                                                <small>
                                                    %
                                                </small>
                                            </td>
                                            <td>
                                                <small>
                                                    PNS 65:1993 / PNS 697
                                                </small>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <small>
                                                    Flattening, min.
                                                </small>
                                            </td>
                                            <td>
                                                <small>
                                                    60
                                                </small>
                                            </td>
                                            <td>
                                                <small>
                                                    g / m<sup>2</sup>
                                                </small>
                                            </td>
                                            <td>
                                                <small>
                                                    PNS 65:1993 / PNS 800
                                                </small>
                                            </td>
                                        </tr>

                                    </tbody>
                                </table>
                            </div>

                            <div className="d-flex flex-column text-start col-12 mb-4">
                                <div className="card my-4 shadow animate-hov pb-4">
                                    <div className="card-header">
                                        <strong>Effect of Materials on Water Quality</strong>
                                    </div>
                                    <div className="card-body">
                                        <p className="card-text">
                                            When used under the conditions for which they are designed,
                                            non-metallic materials in contact with, or likely to
                                            come into contact with potable water shall not constitute
                                            a toxic hazard, shall not constitute a microbial growth
                                            and shall not give rise to unpleasant taste or odor,
                                            cloudiness or discoloration of the water.
                                        <br />
                                        <br />
                                            Concentration of substances, chemicals and biological
                                            agents leached from materials in contact with potable
                                            water and measurements of the relevant organoleptic
                                            / physical parameters shall not exceed the maximum
                                            values recommended by the World Health Organization
                                            in its publication “Guidelines for drinking water
                                            quality” Vol. 1 “Recommendations” (WHO,
                                            Geneva, 1984).
                                        <br />
                                        <br />
                                            If lead or mono / di-alkyl tin compounds are permitted
                                            to be used as stabilizers, the quantity of lead or
                                            tin measured as metals shall be determined in accordance
                                            with the method prescribed in PNS 966. The permitted
                                            levels shall not exceed the limits specified in table
                                            1.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="col-12 d-flex justify-content-center align-items-start">
                                <table className="table table-striped table-hover table-bordered shadow" style={{borderTop: "4px solid red"}}>
                                    <thead>
                                        <tr>
                                            <th colSpan={4}>Table 1 – Maximum Levels of Toxic Substances</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td rowSpan={2}>
                                                Toxic Substances
                                            <br />
                                                mg/L
                                            </td>
                                            <td colSpan={2}>
                                                Extraction
                                            </td>
                                            <td rowSpan={2}>
                                                Total Concentration
                                            <br />
                                                of 3 Extras
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <small>1st</small>
                                            </td>
                                            <td>
                                                <small>3rd</small>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <small>Lead</small>
                                            </td>
                                            <td>
                                                <small>1.00</small>
                                            </td>
                                            <td>
                                                <small>0.05</small>
                                            </td>
                                            <td>
                                                <small></small>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <small>Cadmium</small>
                                            </td>
                                            <td>
                                                <small></small>
                                            </td>
                                            <td>
                                                <small></small>
                                            </td>
                                            <td>
                                                <small>0.01</small>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <small>Mercury</small>
                                            </td>
                                            <td>
                                                <small></small>
                                            </td>
                                            <td>
                                                <small></small>
                                            </td>
                                            <td>
                                                <small>0.001</small>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <div className="d-flex flex-column text-start col-12 mb-4">
                                <div className="card shadow animate-hov">
                                    <div className="card-body">
                                        <p className="card-text">
                                            The Pipe shall conform to the applied pressure for
                                            the hydrostatic pressure tests indicated in Table 2
                                            when tested in accordance with PNS 509.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="col-12 d-flex justify-content-center align-items-start">
                                <table className="table table-striped table-hover table-bordered shadow" style={{borderTop: "4px solid red"}}>
                                    <thead>
                                        <tr>
                                            <th colSpan={5} className="text-end"><small className="fw-light float-right">Unit: Mpa</small></th>
                                        </tr>
                                        <tr>
                                            <th colSpan={5}>
                                                Table 2 – Applied Pressure Test at 28ºC
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>
                                                <small className="text-center fw-semibold">Series</small>
                                            </td>
                                            <td>
                                                <small>10</small>
                                            </td>
                                            <td>
                                                <small>8</small>
                                            </td>
                                            <td>
                                                <small>7</small>
                                            </td>
                                            <td>
                                                <small>5</small>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <small>Burst Pressure</small>
                                            </td>
                                            <td>
                                                <small>3.80</small>
                                            </td>
                                            <td>
                                                <small>4.56</small>
                                            </td>
                                            <td>
                                                <small>5.49</small>
                                            </td>
                                            <td>
                                                <small>7.10</small>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <small>Short Term Pressure</small>
                                            </td>
                                            <td>
                                                <small>3.60</small>
                                            </td>
                                            <td>
                                                <small>4.30</small>
                                            </td>
                                            <td>
                                                <small>5.20</small>
                                            </td>
                                            <td>
                                                <small>6.70</small>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <small>Long Term Pressure</small>
                                            </td>
                                            <td>
                                                <small>2.50</small>
                                            </td>
                                            <td>
                                                <small>3.00</small>
                                            </td>
                                            <td>
                                                <small>3.60</small>
                                            </td>
                                            <td>
                                                <small>4.65</small>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <div className="d-flex flex-column text-start col-12 mb-4">
                                <div className="card my-4 shadow animate-hov">
                                    <div className="card-header">
                                        <strong>Chemical Properties and Resistance </strong>
                                    </div>
                                    <div className="card-body py-4">
                                        <p className="card-text">
                                            <i> BLUEBELL uPVC PRESSURE PIPE</i> is highly resistant to
                                            carious corrosive fluids including acids, alkalis,
                                            salts and other chemical solutions as indicated in
                                            the following table. Information shown on this table
                                            are based on research and actual laboratory tests conducted
                                            in the factory which are believed to be accurate. This
                                            table is intended to serve as a guide for the application
                                            of BLUEBELL uPVC PRESSURE PIPE in the transport and
                                            conveyance of various chemical materials.
                                        </p>
                                    </div>
                                    <div className="card-footer">
                                        <h6 className="text-center">Click <a href="/public/info" className="text-danger">here</a> to see the table.</h6>
                                    </div>
                                </div>
                            </div>

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