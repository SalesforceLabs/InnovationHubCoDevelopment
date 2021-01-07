/* eslint-disable no-debugger */
import { createElement } from "lwc";
import Countdown from "c/countdown";

describe("c-countdown", () => {
  afterEach(() => {
    // The jsdom instance is shared across test cases in a single file so reset the DOM
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it("shows a counter", () => {
    // create initial element
    const element = createElement("c-countdown", {
      is: Countdown
    });
    let date = new Date();
    date.setDate(date.getDate() + 6);
    date = date.toString();
    element.dateTime = date;
    document.body.appendChild(element);

    const counterEl = element.shadowRoot.querySelector(".countdown");
    expect(counterEl).not.toBeNull();
  });

  it("shows an expired message", () => {
    // create initial element
    const element = createElement("c-countdown", {
      is: Countdown
    });
    let date = new Date();
    date.setDate(date.getDate() - 6);
    date = date.toString();
    element.dateTime = date;
    document.body.appendChild(element);

    const counterEl = element.shadowRoot.querySelector(".countdown");
    const expiredMessageEl = element.shadowRoot.querySelector(".expired-message");
    expect(counterEl).toBeNull();
    expect(expiredMessageEl).not.toBeNull();
  });

  it("shows an error message when date format is wrong", () => {
    // create initial element
    const element = createElement("c-countdown", {
      is: Countdown
    });
    element.dateTime = "foo";
    document.body.appendChild(element);

    const errorEl = element.shadowRoot.querySelector(".error-message");
    expect(errorEl).not.toBeNull();
  });

  it("shows an error message when date is missing", () => {
    // create initial element
    const element = createElement("c-countdown", {
      is: Countdown
    });
    document.body.appendChild(element);

    const errorEl = element.shadowRoot.querySelector(".error-message");
    expect(errorEl).not.toBeNull();
  });

  it("has a simple countdown mode", () => {
    // create initial element
    const element = createElement("c-countdown", {
      is: Countdown
    });
    let date = new Date();
    date.setDate(date.getDate() + 6);
    date = date.toString();
    element.dateTime = date;
    element.simple = true;
    document.body.appendChild(element);

    const counterEl = element.shadowRoot.querySelector("lightning-relative-date-time");
    expect(counterEl).not.toBeNull();
  });
});
