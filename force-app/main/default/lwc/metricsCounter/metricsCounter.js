import { LightningElement, api, wire, track } from "lwc";
import { getObjectInfo } from "lightning/uiObjectInfoApi";
import getRecordMetrics from "@salesforce/apex/MetricsCounterController.getRecordMetrics";

export default class MetricsCounter extends LightningElement {
  @api recordId;
  @api childObjectApiName;
  @api lookupFieldApiName;
  @api textColor;

  @wire(getObjectInfo, { objectApiName: "$childObjectApiName" })
  objectInfo;

  @track apexParameters;

  @wire(getRecordMetrics, { stringifiedParameters: "$apexParameters" })
  recordMetrics;

  connectedCallback() {
    this.apexParameters = JSON.stringify({
      recordId: this.recordId,
      childObjectApiName: this.childObjectApiName,
      lookupFieldApiName: this.lookupFieldApiName
    });
  }

  get childRecordCount() {
    if (this.recordMetrics.data) {
      return this.recordMetrics.data.childRecordCount;
    }
    return 0;
  }

  get chatterPostCount() {
    if (this.recordMetrics.data) {
      return this.recordMetrics.data.chatterPostCount;
    }
    return 0;
  }

  get lookupFieldValid() {
    if (this.objectInfo.data && this.lookupFieldApiName) {
      if (this.lookupFieldApiName in this.objectInfo.data.fields) {
        const fieldType = this.objectInfo.data.fields[this.lookupFieldApiName]
          .dataType;
        return fieldType === "Reference";
      }
    }
    return true;
  }

  get error() {
    if (!this.lookupFieldValid) {
      return {
        message: `${this.lookupFieldApiName} is not a lookup field on ${this.childObjectApiName}`
      };
    }
    if (this.objectInfo.error) {
      return this.objectInfo.error;
    }
    if (this.recordMetrics.error) {
      return this.recordMetrics.error;
    }
    return undefined;
  }

  get textColorStyle() {
    if (this.textColor) {
      return `color: ${this.textColor}`;
    }
    return undefined;
  }
}