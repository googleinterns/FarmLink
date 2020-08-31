import React from "react";
import { render } from "@testing-library/react";
import SignUp from "./signup";

test("check if signup page renders properly", () => {
  const { getByText } = render(<SignUp />);
  const linkElement = getByText(/Sign up/);
  expect(linkElement).toBeInTheDocument();
});
