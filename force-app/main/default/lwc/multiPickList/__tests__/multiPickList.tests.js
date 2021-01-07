/* eslint-disable no-debugger */
import { createElement } from "lwc";
import MultiPickList from "c/multiPickList";

describe("c-multi-pick-list", () => {
  afterEach(() => {
    // The jsdom instance is shared across test cases in a single file so reset the DOM
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it("displays options", () => {
    // create initial element
    const element = createElement("c-multi-pick-list", {
      is: MultiPickList
    });
    element.options = [
      { label: "Option 1", value: "option1"},
      { label: "Option 2", value: "option2"},
      { label: "Option 3", value: "option3"}
    ];
    document.body.appendChild(element);
    const checkEl = element.shadowRoot.querySelectorAll("c-pick-list-item");
    expect(checkEl.length).toBe(3);
  });

  it("accepts value as input", () => {
    // create initial element
    const element = createElement("c-multi-pick-list", {
      is: MultiPickList
    });
    element.options = [
      { label: "Option 1", value: "option1"},
      { label: "Option 2", value: "option2"},
      { label: "Option 3", value: "option3"}
    ];
    element.value = "option1;option2";
    document.body.appendChild(element);
    const checkEl = element.shadowRoot.querySelectorAll("c-pick-list-item")[0];
    expect(checkEl.item.selected).toBe(true);
  });
});
