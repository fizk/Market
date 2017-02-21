"use strict";
import React from 'react';

const Layout = (props) => {
    return (
        <header className="layout">{props.children}</header>
    )
};

const LayoutHeader = (props) => {
    return (
        <header className="layout__header">{props.children}</header>
    )
};

const LayoutBody = (props) => {
    return (
        <header className="layout__body">{props.children}</header>
    )
};

export {Layout, LayoutHeader, LayoutBody}
