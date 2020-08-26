// navBar.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import Home from './home';
//const authMiddleWare = require("../util/auth");

// jest.mock("../util/auth");
// const authMiddleWare = require("../util/auth");

// authMiddleWare.mockImplementation(() => true);

const localStorage = jest.fn();

localStorage.mockReturnValueOnce("Bearer 12345");

console.log(localStorage.mock);

//authMiddleWare.mockReturnValue(true);

// Names of all of the tabs that should be available in home
const pages = ["Farms", "Food Banks", "Deals", "Surplus", "Produce", "Account", "Login"];

// Iterate through each of the page names
test.each(pages)(
  "Check if Nav Bar have %s link.",
  (page) => {
    render(<Home />);
    expect(localStorage.__STORE__["AuthToken"]).toBe("BEARER 1234");
    //Ensure that all pages are present
    const linkDom = screen.getByText(page); 
  }
);