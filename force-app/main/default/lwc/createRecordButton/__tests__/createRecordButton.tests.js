/* eslint-disable no-debugger */
import { createElement } from "lwc";
import CreateRecordButton from "c/createRecordButton";
import { registerLdsTestWireAdapter } from "@salesforce/sfdx-lwc-jest";
import { getObjectInfo } from "lightning/uiObjectInfoApi";
import { getRecord } from "lightning/uiRecordApi";

// Mock realistic data
const mockGetObject = require("./data/objectInfo.json");
const mockGetRecord = require("./data/recordInfo.json");

// Register as an LDS wire adapter. Some tests verify the provisioned values trigger desired behavior.
const getObjectWireAdapter = registerLdsTestWireAdapter(getObjectInfo);
const getRecordWireAdapter = registerLdsTestWireAdapter(getRecord);

describe("c-create-record-button", () => {
  afterEach(() => {
    // The jsdom instance is shared across test cases in a single file so reset the DOM
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it("contains a button with specified label", () => {
    // create initial element
    const element = createElement("c-create-record-button", {
      is: CreateRecordButton
    });
    element.objectApiName = "innohub__Innovation_Idea__c";
    element.label = "foo";
    document.body.appendChild(element);

    // Emit data from @wire
    getObjectWireAdapter.emit(mockGetObject);

    return Promise.resolve().then(() => {
      const button = element.shadowRoot.querySelector(".button");
      expect(button.textContent).toBe("foo");
    });
  });

  it("Hides the button if Visibility field is false", () => {
    // create initial element
    const element = createElement("c-create-record-button", {
      is: CreateRecordButton
    });
    element.objectApiName = "innohub__Innovation_Idea__c";
    element.label = "foo";
    element.recordId = "a011X000003Lu4tQAC";
    element.visibilityField = "innohub__Allow_Idea_Submission__c";
    document.body.appendChild(element);

    // Emit data from @wire
    getObjectWireAdapter.emit(mockGetObject);
    getRecordWireAdapter.emit(mockGetRecord);

    return Promise.resolve().then(() => {
      const button = element.shadowRoot.querySelector(".button");
      expect(button).toBeNull();
    });
  });

  it("doesn't show if objectApiName isn't specified", () => {
    // create initial element
    const element = createElement("c-create-record-button", {
      is: CreateRecordButton
    });
    document.body.appendChild(element);

    const button = element.shadowRoot.querySelector(".button");
    expect(button).toBeNull();
  });


  it("shows an error if fieldApiName doesn't exist on specified object", () => {
    // create initial element
    const element = createElement("c-create-record-button", {
      is: CreateRecordButton
    });
    element.objectApiName = "innohub__Innovation_Idea__c";
    element.fieldApiName = "foo"
    document.body.appendChild(element);

    // Emit data from @wire
    getObjectWireAdapter.emit(mockGetObject);

    return Promise.resolve().then(() => {
      const button = element.shadowRoot.querySelector(".button");
      const errorMessage = element.shadowRoot.querySelector("c-error-panel");
      expect(errorMessage).not.toBeNull();
      expect(button).toBeNull();
    });
  });

  it("displays an error panel", () => {
    // create initial element
    const element = createElement("c-create-record-button", {
      is: CreateRecordButton
    });
    document.body.appendChild(element);

    // Emit error from @wire
    getObjectWireAdapter.error();

    return Promise.resolve().then(() => {
      const errorPanelEl = element.shadowRoot.querySelector("c-error-panel");
      expect(errorPanelEl).not.toBeNull();
    });
  });
});
