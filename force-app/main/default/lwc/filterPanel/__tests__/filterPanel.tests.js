/* eslint-disable no-debugger */
import { createElement } from "lwc";
import FilterPanel from "c/filterPanel";
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

describe("c-filter-panel", () => {
  afterEach(() => {
    // The jsdom instance is shared across test cases in a single file so reset the DOM
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  describe("Positive Tests", () => {
    it("includes filter-sort if specified", () => {
      // create initial element
      const element = createElement("c-filter-panel", {
        is: FilterPanel
      });
      element.showSort = true;
      document.body.appendChild(element);

      const sortEl = element.shadowRoot.querySelector("c-filter-sort");
      expect(sortEl).not.toBeNull();
    });

    it("includes filter-show if specified", () => {
      // create initial element
      const element = createElement("c-filter-panel", {
        is: FilterPanel
      });
      element.showFilterShow = true;
      document.body.appendChild(element);

      const showEl = element.shadowRoot.querySelector("c-filter-show");
      expect(showEl).not.toBeNull();
    });

    it("includes filter-record-type if specified", () => {
      // create initial element
      const element = createElement("c-filter-panel", {
        is: FilterPanel
      });
      element.showRecordTypeFilter = true;
      element.objectApiName = "innohub__Innovation_Idea__c";
      document.body.appendChild(element);

      // Emit data from @wire
      currentPageReferenceAdapter.emit(mockCurrentPageReference);
      getObjectWireAdapter.emit(mockGetObject);

      return Promise.resolve().then(() => {
        const filterEl = element.shadowRoot.querySelector(
          "c-filter-record-type"
        );
        expect(filterEl).not.toBeNull();
      });
    });

    it("includes a reset button", () => {
      // create initial element
      const element = createElement("c-filter-panel", {
        is: FilterPanel
      });
      document.body.appendChild(element);

      const button = element.shadowRoot.querySelector(".reset-button");
      expect(button).not.toBeNull();
    });
  });

  describe("Negative Tests", () => {
    it("doesn't include filter-sort by default", () => {
      // create initial element
      const element = createElement("c-filter-panel", {
        is: FilterPanel
      });
      document.body.appendChild(element);

      const sortEl = element.shadowRoot.querySelector("c-filter-sort");
      expect(sortEl).toBeNull();
    });

    it("doesn't include filter-show by default", () => {
      // create initial element
      const element = createElement("c-filter-panel", {
        is: FilterPanel
      });
      document.body.appendChild(element);

      const showEl = element.shadowRoot.querySelector("c-filter-show");
      expect(showEl).toBeNull();
    });

    it("doesn't include filter-type by default", () => {
      // create initial element
      const element = createElement("c-filter-panel", {
        is: FilterPanel
      });
      document.body.appendChild(element);

      const filterEl = element.shadowRoot.querySelector("c-filter-type");
      expect(filterEl).toBeNull();
    });
  });
});
