import React from "react";
import { render } from "@testing-library/react";
import SignUp from "./signup";

test("renders the login page correctly", () => {
  const { getByText } = render(<SignUp />);
  const linkElement = getByText(/Sign up/);
  expect(linkElement).toBeInTheDocument();
});