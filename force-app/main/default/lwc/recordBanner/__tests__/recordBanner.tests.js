/* eslint-disable no-debugger */
import { createElement } from "lwc";
import RecordBanner from "c/recordBanner";
import { registerLdsTestWireAdapter } from "@salesforce/sfdx-lwc-jest";
import { getRecord } from "lightning/uiRecordApi";
// import { getObjectInfo } from "lightning/uiObjectInfoApi";

// Mock realistic data
const mockGetRecord = require("./data/record.json");
const mockGetCreator = require("./data/creator.json");
// const mockGetObject = require("./data/objectInfo.json");

// Register as an LDS wire adapter. Some tests verify the provisioned values trigger desired behavior.
const getRecordWireAdapter = registerLdsTestWireAdapter(getRecord);
// const getObjectWireAdapter = registerLdsTestWireAdapter(getObjectInfo);

describe("c-record-banner", () => {
  afterEach(() => {
    // The jsdom instance is shared across test cases in a single file so reset the DOM
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  describe("get Record @wire data positive tests", () => {
    it("renders author image from authorImageUrl", () => {
      const EXPECTED_URL = "https://i.imgur.com/MBZ1KVA.png";

      // create initial element
      const element = createElement("c-record-banner", {
        is: RecordBanner
      });
      element.authorImageUrl = EXPECTED_URL;
      document.body.appendChild(element);

      // Emit data from @wire
      getRecordWireAdapter.emit(mockGetRecord);

      return Promise.resolve().then(() => {
        const authorImageEl = element.shadowRoot.querySelector(".author-image");
        expect(authorImageEl.style.backgroundImage).toMatch(EXPECTED_URL);
      });
    });

    it("prioritizes the author image field name over the author image url", () => {
      // create initial element
      const element = createElement("c-record-banner", {
        is: RecordBanner
      });
      element.authorImageField = "innohub__Image__c";
      element.authorImageUrl = "https://i.imgur.com/MBZ1KVA.png";
      document.body.appendChild(element);

      // Emit data from @wire
      getRecordWireAdapter.emit(mockGetRecord);

      return Promise.resolve().then(() => {
        const authorImageEl = element.shadowRoot.querySelector(".author-image");

        // extract url from rich text
        const searchString = 'img src="';
        let expected = mockGetRecord.fields.innohub__Image__c.value;
        const startIndex = expected.indexOf('img src="') + searchString.length;
        expected = expected.substring(startIndex);
        const endIndex = expected.indexOf('"');
        expected = expected.substring(0, endIndex).replace(/amp;/g, "");

        expect(authorImageEl.style.backgroundImage).toMatch(expected);
      });
    });

    it("renders correct author name", () => {
      // create initial element
      const element = createElement("c-record-banner", {
        is: RecordBanner
      });
      element.authorField = "Name";
      document.body.appendChild(element);

      // Emit data from @wire
      getRecordWireAdapter.emit(mockGetRecord);

      return Promise.resolve().then(() => {
        const authorEl = element.shadowRoot.querySelector(".author");
        expect(authorEl.textContent).toBe(mockGetRecord.fields.Name.value);
      });
    });

    it("renders correct heading", () => {
      // create initial element
      const element = createElement("c-record-banner", {
        is: RecordBanner
      });
      element.headingField = "Name";
      document.body.appendChild(element);

      // Emit data from @wire
      getRecordWireAdapter.emit(mockGetRecord);

      return Promise.resolve().then(() => {
        const headingEl = element.shadowRoot.querySelector("h1 strong");
        expect(headingEl.textContent).toBe(mockGetRecord.fields.Name.value);
      });
    });

    it("renders correct body", () => {
      // create initial element
      const element = createElement("c-record-banner", {
        is: RecordBanner
      });
      element.bodyField = "innohub__Describe_your_evolution__c";
      document.body.appendChild(element);

      // Emit data from @wire
      getRecordWireAdapter.emit(mockGetRecord);

      return Promise.resolve().then(() => {
        const bodyEl = element.shadowRoot.querySelector(".content-body");
        expect(bodyEl.value).toBe(
          mockGetRecord.fields.innohub__Describe_your_evolution__c.value
        );
      });
    });

    it("has dynamic background color", () => {
      const color = "rgb(204, 206, 254)";
      // create initial element
      const element = createElement("c-record-banner", {
        is: RecordBanner
      });
      element.backgroundColor = color;
      document.body.appendChild(element);
      const bodyEl = element.shadowRoot.querySelector(".container");
      expect(bodyEl.style.backgroundColor).toBe(color);
    });

    it("has dynamic text color", () => {
      const color = "rgb(204, 206, 254)";
      // create initial element
      const element = createElement("c-record-banner", {
        is: RecordBanner
      });
      element.textColor = color;
      document.body.appendChild(element);
      const bodyEl = element.shadowRoot.querySelector(".container");
      expect(bodyEl.style.color).toBe(color);
    });

    it("shows a countdown if a close-date field is provided", () => {
      // create initial element
      const element = createElement("c-record-banner", {
        is: RecordBanner
      });
      element.closeDateField = "CreatedDate";
      document.body.appendChild(element);

      // Emit data from @wire
      getRecordWireAdapter.emit(mockGetRecord);

      return Promise.resolve().then(() => {
        const countdownEl = element.shadowRoot.querySelector("c-countdown");
        expect(countdownEl).not.toBeNull();
      });
    });

    it("shows learn more button if showLearnMoreButton is set to true", () => {
      // create initial element
      const element = createElement("c-record-banner", {
        is: RecordBanner
      });
      element.showLearnMoreButton = true;
      document.body.appendChild(element);

      // Emit data from @wire
      getRecordWireAdapter.emit(mockGetRecord);

      return Promise.resolve().then(() => {
        const button = element.shadowRoot.querySelector(".learn-more");
        expect(button).not.toBeNull();
      });
    });

    it("shows learn more modal if learn more button is clicked", () => {
      // create initial element
      const element = createElement("c-record-banner", {
        is: RecordBanner
      });
      element.showLearnMoreButton = true;
      document.body.appendChild(element);

      // Emit data from @wire
      getRecordWireAdapter.emit(mockGetRecord);

      return Promise.resolve().then(() => {
        const button = element.shadowRoot.querySelector(".learn-more");
        button.click();
        return Promise.resolve().then(() => {
          const learnMoreEl = element.shadowRoot.querySelector("c-record-additional-detail");
          expect(learnMoreEl).not.toBeNull();
        });
      });
    });
  });

  describe("get Record @wire data negative tests", () => {
    it("renders default author image from created by user, when nothing else specified", () => {
      // create initial element
      const element = createElement("c-record-banner", {
        is: RecordBanner
      });
      document.body.appendChild(element);

      // Emit data from @wire
      getRecordWireAdapter.emit(mockGetCreator);

      return Promise.resolve().then(() => {
        const authorImageEl = element.shadowRoot.querySelector(".author-image");
        expect(authorImageEl.style.backgroundImage).toMatch(
          mockGetCreator.fields.MediumPhotoUrl.value
        );
      });
    });

    it("hides body, when field api Name is invalid", () => {
      // create initial element
      const element = createElement("c-record-banner", {
        is: RecordBanner
      });
      element.bodyField = "abcd";
      document.body.appendChild(element);

      // Emit data from @wire
      getRecordWireAdapter.emit(mockGetRecord);

      return Promise.resolve().then(() => {
        const bodyEl = element.shadowRoot.querySelector(".content-body");
        expect(bodyEl).toBeNull();
      });
    });

    it("hides heading, when field api Name is invalid", () => {
      // create initial element
      const element = createElement("c-record-banner", {
        is: RecordBanner
      });
      element.headingField = "abcd";
      document.body.appendChild(element);

      // Emit data from @wire
      getRecordWireAdapter.emit(mockGetRecord);

      return Promise.resolve().then(() => {
        const headingEl = element.shadowRoot.querySelector("h1 strong");
        expect(headingEl).toBeNull();
      });
    });

    it("hides learn more button if learnMoreField is invalid", () => {
      // create initial element
      const element = createElement("c-record-banner", {
        is: RecordBanner
      });
      element.learnMoreField = "foo";
      document.body.appendChild(element);

      // Emit data from @wire
      getRecordWireAdapter.emit(mockGetRecord);

      return Promise.resolve().then(() => {
        const button = element.shadowRoot.querySelector(".learn-more");
        expect(button).toBeNull();
      });
    });

    it("hides modal by default", () => {
      // create initial element
      const element = createElement("c-record-banner", {
        is: RecordBanner
      });
      element.learnMoreField = "innohub__Describe_your_evolution__c";
      document.body.appendChild(element);

      // Emit data from @wire
      getRecordWireAdapter.emit(mockGetRecord);

      return Promise.resolve().then(() => {
        const learnMoreEl = element.shadowRoot.querySelector(".learn-more-content");
        expect(learnMoreEl).toBeNull();
      });
    });

    it("defaults to grey background", () => {
      const color = "abcd";
      // create initial element
      const element = createElement("c-record-banner", {
        is: RecordBanner
      });
      element.backgroundColor = color;
      document.body.appendChild(element);
      const bodyEl = element.shadowRoot.querySelector(".container");
      expect(bodyEl.style.backgroundColor).toBe("rgb(239, 239, 239)");
    });
  });

  describe("get Record @wire error", () => {
    it("displays an error panel", () => {
      // Create initial element
      const element = createElement("c-record-banner", {
        is: RecordBanner
      });
      document.body.appendChild(element);

      // Emit error from @wire
      getRecordWireAdapter.error();

      return Promise.resolve().then(() => {
        const errorPanelEl = element.shadowRoot.querySelector("c-error-panel");
        expect(errorPanelEl).not.toBeNull();
      });
    });
  });
});
