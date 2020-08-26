import React from "react";
import { render } from "@testing-library/react";
import App from "./App";

test("renders the login page correctly", () => {
  const { getByText } = render(<App />);
  const linkElement = getByText(/Login/);
  expect(linkElement).toBeInTheDocument();
});
