/* eslint-disable no-debugger */
import { createElement } from "lwc";
import LatestSubmissions from "c/latestSubmissions";

describe("c-latest-submissions", () => {
  afterEach(() => {
    // The jsdom instance is shared across test cases in a single file so reset the DOM
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it("displays 3 latest record components", () => {
    // create initial element
    const element = createElement("c-latest-submissions", {
      is: LatestSubmissions
    });
    element.firstObject = "innohub__Innovation_Idea__c";
    element.firstObjectUserType = "Creator";
    element.secondObject = "innohub__Demo__c";
    element.secondObjectUserType = "Creator";
    element.thirdObject = "innohub__Prototype__c";
    element.thirdObjectUserType = "Creator";
    document.body.appendChild(element);

    const latestRecordElements = element.shadowRoot.querySelectorAll("c-latest-record");
    expect(latestRecordElements.length).toBe(3);
  });
});
