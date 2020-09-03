import React from "react";
import { render } from "@testing-library/react";
import App from "./App";

test("check if login page renders properly", () => {
  const { getByText } = render(<App />);
  const linkElement = getByText(/Login/);
  expect(linkElement).toBeInTheDocument();
});
