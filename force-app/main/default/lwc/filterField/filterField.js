import { LightningElement, api, wire, track } from "lwc";
import { getObjectInfo } from "lightning/uiObjectInfoApi";
import { getPicklistValues } from "lightning/uiObjectInfoApi";
import { CurrentPageReference, NavigationMixin } from "lightning/navigation";
import ALL_LABEL from '@salesforce/label/c.Filter_Type_All';

export default class FilterField extends NavigationMixin(LightningElement) {
  allLabel = ALL_LABEL;

  @api objectApiName;

  @api
  get fieldApiName() {
    return this._fieldApiName;
  }
  set fieldApiName(value) {
    this.fullFieldName = `${this.objectApiName}.${value}`;
    this._fieldApiName = value;
  }

  @track fullFieldName;

  @wire(CurrentPageReference)
  pageRef;

  @wire(getObjectInfo, { objectApiName: "$objectApiName" })
  objectInfo;

  @wire(getPicklistValues, {
    recordTypeId: "$recordTypeId",
    fieldApiName: "$fullFieldName"
  })
  picklistValues;

  handleChange(event) {
    // generates json stringified filter array
    const value = event.target.value;
    const state = { ...this.pageRef.state };
    let filters = {};
    if (this.pageRef.state.innohub__filters) {
      filters = JSON.parse(decodeURI(this.pageRef.state.innohub__filters));
    }
    if (value !== "" && value) {
      filters[this.fieldApiName] = value;
    } else if (this.fieldApiName in filters) {
      delete filters[this.fieldApiName];
    }
    state.innohub__filters = encodeURI(JSON.stringify(filters));
    if (Object.keys(filters).length === 0 && filters.constructor === Object) {
      delete state.innohub__filters;
    }
    this[NavigationMixin.Navigate]({
      ...this.pageRef,
      state
    });
  }

  isFieldType(objectInfo, fieldApiName, fieldType) {
    if (objectInfo.data && fieldApiName) {
      if (fieldApiName in objectInfo.data.fields) {
        const type = objectInfo.data.fields[fieldApiName]
          .dataType;
        if (type === fieldType) {
          return true;
        }
      }
    } else if (!objectInfo.data && !fieldApiName) {
      return true;
    }
    return false;
  }

  get isBuilder() {
    const hostname = window.location.hostname;
    return(hostname.indexOf('sitepreview') >= 0 || hostname.indexOf('livepreview') >= 0)
  }

  get error() {
    if (this.picklistValues) {
      if (this.picklistValues.error) {
        return this.picklistValues.error;
      }
    }
    if (this.objectInfo) {
      if (this.objectInfo.error) {
        return this.objectInfo.error;
      }
    }

    return undefined;
  }

  get fieldIsPicklist() {
    return this.isFieldType(this.objectInfo, this.fieldApiName, "Picklist");
  }

  get invalidField() {
    return !this.fieldIsPicklist && !this.isMultiPicklist;
  }

  get isMultiPicklist() {
    return this.isFieldType(this.objectInfo, this.fieldApiName, "MultiPicklist");
  }

  get label() {
    if (this.objectInfo.data) {
      return this.objectInfo.data.fields[this.fieldApiName].label;
    }
    return undefined;
  }

  get options() {
    if (this.picklistValues.data) {
      if (this.fieldIsPicklist) {
        return [
          { label: this.allLabel, value: "" },
          ...this.picklistValues.data.values
        ];
      }
      if (this.isMultiPicklist) {
        return this.picklistValues.data.values;
      }
    }
    return undefined;
  }

  get recordTypeId() {
    if (this.pageRef) {
      if (this.pageRef.state.innohub__recordTypeId) {
        return this.pageRef.state.innohub__recordTypeId;
      }
    }
    return "012000000000000AAA";
  }

  get selectedValue() {
    if (this.pageRef) {
      if (this.pageRef.state.innohub__filters) {
        const value = JSON.parse(decodeURI(this.pageRef.state.innohub__filters))[
          this.fieldApiName
        ];
        if (value) {
          return value;
        }
      }
    }
    if (this.options && this.fieldIsPicklist) {
      return this.options[0].value;
    }
    return undefined;
  }
}