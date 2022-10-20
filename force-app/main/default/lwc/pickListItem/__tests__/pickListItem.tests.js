/* eslint-disable no-debugger */
import { createElement } from "lwc";
import PickListItem from "c/pickListItem";

describe("c-pick-list-item", () => {
  afterEach(() => {
    // The jsdom instance is shared across test cases in a single file so reset the DOM
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it("displays a unchecked element", () => {
    // create initial element
    const element = createElement("c-pick-list-item", {
      is: PickListItem
    });
    element.item = { label: "Option 1", value: "option1", selected: false };
    document.body.appendChild(element);
    const checkEl = element.shadowRoot.querySelector(".ms-list-item");
    expect(checkEl.classList.contains("slds-is-selected")).toBe(false);
  });

  it("displays a checked element", () => {
    // create initial element
    const element = createElement("c-pick-list-item", {
      is: PickListItem
    });
    element.item = { label: "Option 1", value: "option1", selected: true };
    document.body.appendChild(element);
    const checkEl = element.shadowRoot.querySelector(".ms-list-item");
    expect(checkEl.classList.contains("slds-is-selected")).toBe(true);
  });
});
