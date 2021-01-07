/* eslint-disable no-debugger */
import { createElement } from "lwc";
import FilterField from "c/filterField";
import {
  registerLdsTestWireAdapter,
  registerTestWireAdapter
} from "@salesforce/sfdx-lwc-jest";
import { CurrentPageReference } from "lightning/navigation";
import { getObjectInfo } from "lightning/uiObjectInfoApi";
import { getPicklistValues } from "lightning/uiObjectInfoApi";

// Mock realistic data
const mockGetObject = require("./data/objectInfo.json");
const mockCurrentPageReference = require("./data/currentPageRef.json");
const mockGetPicklistValues = require('./data/picklistValues.json');

// Register as an LDS wire adapter. Some tests verify the provisioned values trigger desired behavior.
const getObjectWireAdapter = registerLdsTestWireAdapter(getObjectInfo);
const currentPageReferenceAdapter = registerTestWireAdapter(
  CurrentPageReference
);
const getPicklistValuesAdapter = registerLdsTestWireAdapter(
  getPicklistValues
);

describe("c-filter-field", () => {
  afterEach(() => {
    // The jsdom instance is shared across test cases in a single file so reset the DOM
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it("displays a missing message when a field is specified that isn't a picklist or multi-picklist field", () => {
    // create initial element
    const element = createElement("c-filter-field", {
      is: FilterField
    });
    element.objectApiName = "innohub__Innovation_Idea__c";
    element.fieldApiName = "Name";
    document.body.appendChild(element);

    // Emit data from @wire
    currentPageReferenceAdapter.emit(mockCurrentPageReference);
    getObjectWireAdapter.emit(mockGetObject);
    getPicklistValuesAdapter.emit(mockGetPicklistValues);

    return Promise.resolve().then(() => {
      const message = element.shadowRoot.querySelector(".instructions");
      const combobox = element.shadowRoot.querySelector("lightning-combobox");
      expect(combobox).toBeNull();
      expect(message.textContent).toBe("Specify Picklist or Multi-Picklist field.");
    });
  });


  it("displays an error panel", () => {
    // create initial element
    const element = createElement("c-filter-field", {
      is: FilterField
    });
    element.objectApiName = "innohub__Innovation_Idea__c";
    element.fieldApiName = "innohub__Category__c";
    document.body.appendChild(element);

    // Emit error from @wire
    getObjectWireAdapter.error();

    return Promise.resolve().then(() => {
      const errorPanelEl = element.shadowRoot.querySelector("c-error-panel");
      expect(errorPanelEl).not.toBeNull();
    });
  });
});
