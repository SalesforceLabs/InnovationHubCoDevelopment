/* eslint-disable no-debugger */
import { createElement } from "lwc";
import MetricsCounter from "c/metricsCounter";
import { registerLdsTestWireAdapter, registerApexTestWireAdapter } from "@salesforce/sfdx-lwc-jest";
import getRecordMetrics from "@salesforce/apex/MetricsCounterController.getRecordMetrics";
import { getObjectInfo } from "lightning/uiObjectInfoApi";

// Mock realistic data
const mockGetObject = require("./data/objectInfo.json");
const mockGetRecordMetrics = {
  chatterPostCount: 3,
  childRecordCount: 2
}

// Register as an LDS wire adapter. Some tests verify the provisioned values trigger desired behavior.
const getObjectWireAdapter = registerLdsTestWireAdapter(getObjectInfo);
const getRecordMetricsWireAdapter = registerApexTestWireAdapter(getRecordMetrics);

describe("c-metrics-counter", () => {
  afterEach(() => {
    // The jsdom instance is shared across test cases in a single file so reset the DOM
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it("displays number of child records", () => {
    // create initial element
    const element = createElement("c-metrics-counter", {
      is: MetricsCounter
    });
    element.recordId = "foo";
    element.childObjectApiName = "innohub__Innovation_Idea__c";
    element.lookupFieldApiName = "innohub__Challenge__c";
    document.body.appendChild(element);

    // Emit data from @wire
    getObjectWireAdapter.emit(mockGetObject);
    getRecordMetricsWireAdapter.emit(mockGetRecordMetrics);


    return Promise.resolve().then(() => {
      const childRecordCountElement = element.shadowRoot.querySelector(".child-count");
      expect(childRecordCountElement.textContent).toBe("2");
    });
  });

  it("displays number of chatter posts", () => {
    // create initial element
    const element = createElement("c-metrics-counter", {
      is: MetricsCounter
    });
    element.recordId = "foo";
    element.childObjectApiName = "innohub__Innovation_Idea__c";
    element.lookupFieldApiName = "innohub__Challenge__c";
    document.body.appendChild(element);

    // Emit data from @wire
    getObjectWireAdapter.emit(mockGetObject);
    getRecordMetricsWireAdapter.emit(mockGetRecordMetrics);


    return Promise.resolve().then(() => {
      const chatterPostCountElement = element.shadowRoot.querySelector(".post-count");
      expect(chatterPostCountElement.textContent).toBe("3");
    });
  });
});
