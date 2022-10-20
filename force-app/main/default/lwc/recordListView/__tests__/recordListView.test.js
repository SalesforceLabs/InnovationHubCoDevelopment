import { createElement } from "lwc";
import recordListView from "c/recordListView";
import { registerApexTestWireAdapter, registerTestWireAdapter } from '@salesforce/sfdx-lwc-jest';
import { CurrentPageReference } from 'lightning/navigation';
import getRecords from '@salesforce/apex/recordListViewController.getRecords';
import getRecordCount from "@salesforce/apex/recordListViewController.getRecordCount";

const mockGetIdeaList = require('./data/getIdeaList.json');
const pageRefSample = require('./data/pageRef.json');
const recordCount = 2001;
const getIdeaListAdapter = registerApexTestWireAdapter(getRecords);
const getRecordCountAdapter = registerApexTestWireAdapter(getRecordCount);
const pageRef = registerTestWireAdapter(CurrentPageReference);

describe("c-recordTile", () => {
  afterEach(() => {
    // The jsdom instance is shared across test cases in a single file so reset the DOM
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
    jest.clearAllMocks();

  });

  it("Checks how many tiles created per dataset", () => {
    // Create element
    const element = createElement("c-recordListView", {
      is: recordListView
    });
    pageRef.emit(pageRefSample);
    element.recordType = 'RecordType.Name';
    element.userType = 'Creator';
    document.body.appendChild(element);

    getRecordCountAdapter.emit(recordCount);
    getIdeaListAdapter.emit(mockGetIdeaList);


    // Verify amount of tiles generated
    return Promise.resolve().then(() => {
      const tileCount = element.shadowRoot.querySelectorAll("c-record-tile").length;
      expect(tileCount).toBe(9);
    });
  });

  it("Checks that no tiles are created when nothing in dataset", () => {
    // Create element
    const element = createElement("c-recordListView", {
      is: recordListView
    });
    pageRef.emit(pageRefSample);
    element.recordType = 'RecordType.Name';
    element.userType = 'Creator';
    document.body.appendChild(element);

    getRecordCountAdapter.emit(0);
    getIdeaListAdapter.emit([]);

    // Verify amount of tiles generated
    return Promise.resolve().then(() => {
      const tileCount = element.shadowRoot.querySelectorAll("c-record-tile").length;
      expect(tileCount).toBe(0);
    });
  });
});
