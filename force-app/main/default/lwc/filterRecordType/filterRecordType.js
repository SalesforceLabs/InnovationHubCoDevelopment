import { LightningElement, wire, api } from "lwc";
import { getObjectInfo } from "lightning/uiObjectInfoApi";
import { CurrentPageReference, NavigationMixin } from "lightning/navigation";
import LABEL from "@salesforce/label/c.idea_Filter_Type_Title";
import ALL_LABEL from "@salesforce/label/c.Filter_Type_All";

export default class FilterRecordType extends NavigationMixin(
  LightningElement
) {
  label = LABEL;
  allLabel = ALL_LABEL;

  @api objectApiName;

  @wire(CurrentPageReference)
  pageRef;

  @wire(getObjectInfo, { objectApiName: "$objectApiName" })
  objectInfo;

  handleChange(event) {
    // if selected value is a record type, update innohub__recordTypeId query parameter with selected value
    const value = event.target.value;
    const state = { ...this.pageRef.state };
    if (value !== "" && value) {
      state.innohub__recordTypeId = value;
    } else if ("innohub__recordTypeId" in state) {
      delete state.innohub__recordTypeId;
    }
    this[NavigationMixin.Navigate]({
      ...this.pageRef,
      state
    });
  }

  get isBuilder() {
    const hostname = window.location.hostname;
    return(hostname.indexOf('sitepreview') >= 0 || hostname.indexOf('livepreview') >= 0)
  }

  get error() {
    if (this.objectInfo) {
      if (this.objectInfo.error) {
        return this.objectInfo.error;
      }
    }
    return undefined;
  }

  get options() {
    if (this.recordTypes) {
      const options = [
        { label: this.allLabel, value: "" },
        ...this.recordTypes
      ];
      return options;
    }
    return undefined;
  }

  get recordTypes() {
    if (this.objectInfo.data) {
      const recordTypes = this.objectInfo.data.recordTypeInfos;
      const recordTypeArray = Object.values(recordTypes)
        .filter(type => Object.keys(this.objectInfo.data.recordTypeInfos).length > 1 ? !type.master&&type.available : type.available)
        .map(type => ({
          label: type.name,
          value: type.recordTypeId
        }));
      return recordTypeArray;
    }
    return undefined;
  }

  get selectedValue() {
    if (this.pageRef) {
      const value = this.pageRef.state.innohub__recordTypeId;
      if (value) {
        return value;
      }
    }
    if (this.options) {
      return this.options[0].value;
    }
    return undefined;
  }

  get multipleRecordTypes() {
    if (this.recordTypes) {
      return this.recordTypes.length > 1;
    }
    return false;
  }
}