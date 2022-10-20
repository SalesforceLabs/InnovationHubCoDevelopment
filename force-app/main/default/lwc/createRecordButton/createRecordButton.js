import { LightningElement, api, wire, track } from "lwc";
import { getObjectInfo } from "lightning/uiObjectInfoApi";
import { getRecord, getFieldValue } from "lightning/uiRecordApi";
import { NavigationMixin } from "lightning/navigation";

export default class CreateRecordButton extends NavigationMixin(
  LightningElement
) {
  @api recordId;
  @api fieldApiName;
  @api fieldValue;
  @api label;
  @api objectApiName;
  @api possibleRecordTypes;
  @api defaultValuesString;
  @api visibilityField;

  @track selectedRecordType;

  @wire(getRecord, {
    recordId: "$recordId",
    layoutTypes: ["Full"],
    modes: ["View"]
  })
  record;

  @wire(getObjectInfo, { objectApiName: "$objectApiName" })
  objectInfo;

  buttonClickedHandler() {
    if (!this.recordTypeId && this.recordTypes.length > 1) {
      this.template.querySelector("c-modal").show();
    } else {
      this.createRecord(this.recordTypeId);
    }
  }

  nextButtonClickedHandler() {
    if (this.selectedRecordType) {
      this.template.querySelector("c-modal").hide();
      this.createRecord(this.selectedRecordType);
    }
  }

  createRecord(recordTypeId) {
    const detail = {};
    let defaultValues = {};
    if (this.defaultValuesString) {
      defaultValues = JSON.parse(this.defaultValuesString);
    }
    if (
      this.fieldApiName &&
      this.fieldApiName !== "" &&
      this.fieldValue &&
      this.fieldValue !== ""
    ) {
      defaultValues[this.fieldApiName] = this.fieldValue;
    }
    detail.defaultValues = defaultValues;
    detail.recordTypeId = recordTypeId;
    this.dispatchEvent(new CustomEvent("create", { detail }));
  }

  typeChangeHandler(event) {
    this.selectedRecordType = event.target.value;
  }

  get nextDisabled() {
    return !this.selectedRecordType;
  }

  get isButtonVisible() {
    // if field api name is provided overwrite url
    if (this.recordId && this.visibilityField) {
      return getFieldValue(
        this.record.data,
        `${this.parentObjectApiName}.${this.visibilityField}`
      );
    }
    return true;
  }

  get recordTypeId() {
    if (this.objectInfo.data && this.possibleRecordTypesArray) {
      if (this.possibleRecordTypesArray.length === 1) {
        const recordTypes = Object.values(
          this.objectInfo.data.recordTypeInfos
        ).filter((type) => type.available);
        const recordType = recordTypes.filter(
          (type) =>
            type.name === this.possibleRecordTypesArray[0] ||
            type.Id === this.possibleRecordTypesArray[0]
        );
        if (recordType.length !== 0) {
          return recordType[0].recordTypeId;
        }
      }
    }
    return undefined;
  }

  get possibleRecordTypesArray() {
    if (this.possibleRecordTypes) {
      const cleanString = this.possibleRecordTypes.replace(/, /g, ",");
      return cleanString.split(",");
    }
    return undefined;
  }

  get recordTypes() {
    if (this.objectInfo.data) {
      const recordTypes = Object.values(
        this.objectInfo.data.recordTypeInfos
      ).filter((type) => Object.keys(this.objectInfo.data.recordTypeInfos).length > 1 ? !type.master&&type.available : type.available);

      let availableRecordTypes = recordTypes;
      if (this.possibleRecordTypesArray) {
        availableRecordTypes = recordTypes.filter(
          (recordType) =>
            this.possibleRecordTypesArray.includes(recordType.name) ||
            this.possibleRecordTypesArray.includes(recordType.recordTypeId)
        );
      }
      return availableRecordTypes.map((type) => ({
        label: type.name,
        value: type.recordTypeId
      }));
    }
    return [];
  }

  get validField() {
    if (this.objectInfo.data && this.fieldApiName) {
      return this.fieldApiName in this.objectInfo.data.fields;
    }
    return true;
  }

  get parentObjectApiName() {
    if (this.record.data) {
      return this.record.data.apiName;
    }
    return undefined;
  }

  get showButton() {
    return !this.error && this.objectApiName && this.isButtonVisible;
  }

  get isBuilder() {
    const hostname = window.location.hostname;
    return(hostname.indexOf('sitepreview') >= 0 || hostname.indexOf('livepreview') >= 0)
  }

  get error() {
    if (this.objectInfo.error) {
      return this.objectInfo.error;
    }
    if (!this.validField) {
      return { message: "Field doesn't exist on specified object" };
    }
    if (
      this.objectApiName &&
      !this.recordTypeId &&
      this.recordTypes.length === 0
    ) {
      return {
        message: "Record Type doesn't exist or user doesn't have access"
      };
    }
    return undefined;
  }
}