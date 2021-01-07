import { LightningElement, api, track, wire } from "lwc";
import { CurrentPageReference, NavigationMixin } from "lightning/navigation";
import FILTER_LABEL from "@salesforce/label/c.Filter_Label";
import RESET_LABEL from "@salesforce/label/c.Rest_Filters_Button_Label";
import HIDE_FILTER_LABEL from "@salesforce/label/c.Filter_Hide_Filters";
import SHOW_MORE_LABEL from "@salesforce/label/c.Filter_Show_More";

export default class FilterPanel extends NavigationMixin(LightningElement) {
  filterLabel = FILTER_LABEL;
  resetButtonLabel = RESET_LABEL;

  @api backgroundColor;
  @api borderColor;
  @api borderSize;
  @api showSort = false;
  @api showFilterShow = false;
  @api showRecordTypeFilter = false;
  @api filters;
  @api objectApiName;
  @api inSidebar = false;

  @track showMoreFilters = false;

  @wire(CurrentPageReference)
  pageRef;

  connectedCallback() {
    if (!this.isMobile) {
      this.showMoreFilters = true;
    }
  }

  resetFilters() {
    const state = { ...this.pageRef.state };
    delete state.innohub__sortBy;
    delete state.innohub__filters;
    delete state.innohub__show;
    delete state.innohub__recordTypeId;
    this[NavigationMixin.Navigate]({
      ...this.pageRef,
      state
    });
  }

  toggleAccordion() {
    this.showMoreFilters = !this.showMoreFilters;
  }

  get buttonLabel() {
    return this.showMoreFilters ? HIDE_FILTER_LABEL : SHOW_MORE_LABEL;
  }

  get containerStyle() {
    let style = this.backgroundColor
    ? `background-color: ${this.backgroundColor}; `
    : "background-color: #efefef; ";
    if (this.borderColor && this.borderSize) {
      if (this.borderSize > 0) {
        style += `border: ${this.borderSize}px solid ${this.borderColor}`;
      }
    }
    return style;
  }

  get isMobile() {
    return screen.width < 720;
  }

  get filterArray() {
    if (this.filters) {
      const cleanString = this.filters.replace(/ /g, "");
      return cleanString.split(",");
    }
    return undefined;
  }

  get largeDeviceSize() {
    return this.inSidebar ? 12 : 3;
  }

  get showShowMoreButton() {
    if (!this.isMobile) {
      return false;
    }
    if (!this.filters) {
      return false;
    }
    return true;
  }
}