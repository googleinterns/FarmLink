// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom/extend-expect";
//require('jest-localstorage-mock');

class LocalStorageMock {
    constructor() {
      this.store = {"AuthToken":"Bearer 123455"};
    }
  
    clear() {
      this.store = {};
    }
  
    getItem(key) {
        console.log("WE ARE HERE")
      return this.store[key] || null;
    }
  
    setItem(key, value) {
      this.store[key] = value.toString();
    }
  
    removeItem(key) {
      delete this.store[key];
    }
  };
  
  global.localStorage = new LocalStorageMock;