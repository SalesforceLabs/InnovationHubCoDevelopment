/* eslint-disable no-debugger */
import { createElement } from "lwc";
import FilterRecordType from "c/filterRecordType";
import {
  registerLdsTestWireAdapter,
  registerTestWireAdapter
} from "@salesforce/sfdx-lwc-jest";
import { CurrentPageReference } from "lightning/navigation";
import { getObjectInfo } from "lightning/uiObjectInfoApi";

// Mock realistic data
const mockGetObject = require("./data/objectInfo.json");
const mockCurrentPageReference = require("./data/currentPageRef.json");

// Register as an LDS wire adapter. Some tests verify the provisioned values trigger desired behavior.
const getObjectWireAdapter = registerLdsTestWireAdapter(getObjectInfo);
const currentPageReferenceAdapter = registerTestWireAdapter(
  CurrentPageReference
);

describe("c-filter-record-type", () => {
  afterEach(() => {
    // The jsdom instance is shared across test cases in a single file so reset the DOM
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it("displays a picklist with available recordTypeIds", () => {
    // create initial element
    const element = createElement("c-record-banner", {
      is: FilterRecordType
    });
    element.objectApiName = "innohub__Innovation_Idea__c";
    document.body.appendChild(element);

    // Emit data from @wire
    currentPageReferenceAdapter.emit(mockCurrentPageReference);
    getObjectWireAdapter.emit(mockGetObject);

    return Promise.resolve().then(() => {
      const combobox = element.shadowRoot.querySelector("lightning-combobox");
      const options = combobox.options;
      expect(options.length).toBe(4);
    });
  });

  it("displays an error panel", () => {
    // create initial element
    const element = createElement("c-record-banner", {
      is: FilterRecordType
    });
    element.objectApiName = "innohub__Innovation_Idea__c";
    document.body.appendChild(element);

    // Emit error from @wire
    getObjectWireAdapter.error();

    return Promise.resolve().then(() => {
      const errorPanelEl = element.shadowRoot.querySelector("c-error-panel");
      expect(errorPanelEl).not.toBeNull();
    });
  });
});
