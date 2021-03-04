import { createElement } from 'lwc';
import modularuserInfo from 'c/modularuserInfo';

describe('c/modularuserInfo', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    it('renders user Profile with given input values', () => {
        const RECORD_FIELDS_INPUT = [
            'fullName',
            'MediumPhotoUrl'
        ];
        const RECORD_ID_INPUT = 'a0G1j000002zLW0EAM';
        const OBJECT_API_NAME_INPUT = 'innohub__Innovation_Idea__c';
        const RECORD_FIELD = 'Creator'

          // Create initial element
          const element = createElement('c/modularuserInfo', {
            is: modularuserInfo
        });
        // Set public properties
        element.recordId = RECORD_ID_INPUT;
        element.objectApiName = OBJECT_API_NAME_INPUT;
        document.body.appendChild(element);

        // Validate if correct parameters have been passed to base components
        const formEl = element.shadowRoot.querySelector(
            'modularUserInfo'
        );
        expect(formEl.fields).toEqual(RECORD_FIELDS_INPUT);
        expect(formEl.recordId).toBe(RECORD_ID_INPUT);
        expect(formEl.objectApiName).toBe(OBJECT_API_NAME_INPUT);
    });
    it('is accessible', () => {
        const element = createElement('c/modularuserInfo', {
            is: modularuserInfo
        });

        document.body.appendChild(element);

        return Promise.resolve().then(() => expect(element).toBeAccessible());
    });
});
