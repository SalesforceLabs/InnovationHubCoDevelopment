/* eslint-disable no-debugger */
import { createElement } from "lwc";
import FilterShow from "c/filterShow";

describe("c-filter-show", () => {
  afterEach(() => {
    // The jsdom instance is shared across test cases in a single file so reset the DOM
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it("displays a picklist", () => {
    // create initial element
    const element = createElement("c-record-banner", {
      is: FilterShow
    });
    document.body.appendChild(element);
    const combobox = element.shadowRoot.querySelector("lightning-combobox");
    expect(combobox).not.toBeNull();
  });
});
