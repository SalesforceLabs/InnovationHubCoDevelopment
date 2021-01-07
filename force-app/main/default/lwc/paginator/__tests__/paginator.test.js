import { createElement } from "lwc";
import paginator from "c/paginator";
import { registerApexTestWireAdapter, registerTestWireAdapter } from '@salesforce/sfdx-lwc-jest';
import { CurrentPageReference } from 'lightning/navigation';

const pageRefSample = require('./data/pageRef.json');

const pageRef = registerTestWireAdapter(CurrentPageReference);

describe("c-paginator", () => {
    afterEach(() => {
      // The jsdom instance is shared across test cases in a single file so reset the DOM
      while (document.body.firstChild) {
        document.body.removeChild(document.body.firstChild);
      }
      jest.clearAllMocks();
  
    });
  
  
    it("Checks how many pages are created", () => {
      // Create element
      const element = createElement("c-paginator", {
        is: paginator
      });
      pageRef.emit(pageRefSample);
      //element.pageSize = 9;
      document.body.appendChild(element);
      element.currentPage = 2;

      // Verify amount of tiles generated
      return Promise.resolve().then(() => {
        const buttonCount = element.shadowRoot.querySelectorAll("button").length;
        expect(buttonCount).toBe(7);
        //pageRefSample.state.innohub__currentPage = 2;
        //pageRef.emit(pageRefSample);
        const lightningBtnCount = element.shadowRoot.querySelectorAll("lightning-button").length;
        expect(lightningBtnCount).toBe(2);

      });
    });

    it("When no records provided, no pages should be generated", () => {
        // Create element
        const element = createElement("c-paginator", {
          is: paginator
        });
        const pageRefSampleNone = {"type":"standard__objectPage","attributes":{"objectApiName":"innohub__Innovation_Idea__c","actionName":"list"},"state":{"filterName":"Default","innohub__currentPage":1,"innohub__pageSize":9}};
        pageRef.emit(pageRefSampleNone);
        //element.pageSize = 9;
        document.body.appendChild(element);
  
        // Verify amount of tiles generated
        return Promise.resolve().then(() => {
          const buttonCount = element.shadowRoot.querySelectorAll("button").length;
          expect(buttonCount).toBe(0);
          const lightningBtnCount = element.shadowRoot.querySelectorAll("lightning-button").length;
          expect(lightningBtnCount).toBe(0);
  
        });
      });
  });
  