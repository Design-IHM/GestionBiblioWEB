import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
// import { Card, Button } from "react-bootstrap";
// import Slider from "react-slick";
// import styled from "styled-components";
// import "./blog.css";
// import PageItem from "react-bootstrap/PageItem";
import Pagination from "react-bootstrap/Pagination";
const Pagenation = () => {
    return (
        <>
            <nav aria-label="Page navigation example">
                <ul className="pagination justify-content-center">
                    <li className="page-item disabled">
                        <a className="page-link">Previous</a>
                    </li>
                    <li className="page-item">
                        <a className="page-link" href="#">
                            1
                        </a>
                    </li>
                    <li className="page-item">
                        <a className="page-link" href="#">
                            2
                        </a>
                    </li>
                    <li className="page-item">
                        <a className="page-link" href="#">
                            3
                        </a>
                    </li>
                    <li className="page-item">
                        <a className="page-link" href="#">
                            Next
                        </a>
                    </li>
                </ul>
            </nav>
            <Pagination className="pagination justify-content-center">
                <Pagination.Prev />
                <Pagination.Item>{1}</Pagination.Item>

                <Pagination.Item>{2}</Pagination.Item>
                <Pagination.Item>{3}</Pagination.Item>
                <Pagination.Item>{4}</Pagination.Item>
                <Pagination.Item>{5}</Pagination.Item>
                <Pagination.Item>{6}</Pagination.Item>

                <Pagination.Item>{7}</Pagination.Item>
                <Pagination.Next />
            </Pagination>
        </>
    );
};

export default Pagenation;
