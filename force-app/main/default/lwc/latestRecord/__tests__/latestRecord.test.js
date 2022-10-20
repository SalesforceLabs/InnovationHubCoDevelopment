/* eslint-disable no-debugger */
import { createElement } from "lwc";
import LatestRecord from "c/latestRecord";
import {
  registerLdsTestWireAdapter,
  registerApexTestWireAdapter
} from "@salesforce/sfdx-lwc-jest";
import { getObjectInfo } from "lightning/uiObjectInfoApi";
import getRecords from "@salesforce/apex/recordListViewController.getRecords";

// Mocking imperative Apex method call
jest.mock(
  "@salesforce/apex/recordListViewController.getRecords",
  () => {
    return {
      default: jest.fn()
    };
  },
  { virtual: true }
);

// Sample data for imperative Apex call
const APEX_RECORDS_SUCCESS = [
  {
    Id: "a0G3N000000Gj0tUAC",
    Name: "Very new",
    RecordTypeId: "0123N000000QwWJQA0",
    innohub__Image__c:
      '<p style=""><img src="/servlet/rtaImage?eid=a0G3N000000Gj0t&amp;feoid=00N3N000001TY0I&amp;refid=0EM3N0000008YAe" alt="hero.png"></img></p>',
    innohub__Recommended__c: false,
    innohub__Points__c: 0,
    innohub__Category__c: "Value 1;Value 3",
    CreatedById: "0053N000000sUEqQAM",
    RecordType: { Name: "Idea", Id: "0123N000000QwWJQA0" },
    CreatedBy: {
      Name: "User User",
      SmallPhotoUrl: "/profilephoto/005/T",
      Id: "0053N000000sUEqQAM",
      CommunityNickname: "test-hce9lq9dg1hh"
    }
  }
];

// Sample error for imperative Apex call
const APEX_RECORDS_ERROR = {
  body: { message: "An internal server error has occurred" },
  ok: false,
  status: 400,
  statusText: "Bad Request"
};

// Mock realistic data
const mockGetObject = require("./data/objectInfo.json");

// Register as an LDS wire adapter. Some tests verify the provisioned values trigger desired behavior.
const getObjectWireAdapter = registerLdsTestWireAdapter(getObjectInfo);
const getRecordWireAdapter = registerApexTestWireAdapter(getRecords);

describe("c-latest-record", () => {
  afterEach(() => {
    // The jsdom instance is shared across test cases in a single file so reset the DOM
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
    // Prevent data saved on mocks from leaking between tests
    jest.clearAllMocks();
  });

  it("displays a record tile if the sObjectApiName is specified", () => {
    // Assign mock value for resolved Apex promise
    getRecords.mockResolvedValue(APEX_RECORDS_SUCCESS);

    // create initial element
    const element = createElement("c-latest-record", {
      is: LatestRecord
    });
    element.sObjectApiName = "innohub__Innovation_Idea__c";
    element.userType = "Creator";
    element.creatorImageFallbackUrl = "/img/icon/t4v35/standard/groups_120.png";
    element.nameField = "Name";
    document.body.appendChild(element);

    // Emit data from @wire
    getObjectWireAdapter.emit(mockGetObject);

    return Promise.resolve().then(() => {
      const recordTileEls = element.shadowRoot.querySelectorAll("c-record-tile");
      expect(recordTileEls).not.toBeNull();
    });
  });
  it("displays a missing illustration if it doesn't find a record", () => {
    // create initial element
    const element = createElement("c-latest-record", {
      is: LatestRecord
    });
    element.sObjectApiName = "innohub__Innovation_Idea__c";
    element.userType = "Creator";
    document.body.appendChild(element);

    // Emit data from @wire
    getObjectWireAdapter.emit(mockGetObject);

    return Promise.resolve().then(() => {
      const illustration = element.shadowRoot.querySelector("c-illustration");
      expect(illustration).not.toBeNull();
    });
  });
});
