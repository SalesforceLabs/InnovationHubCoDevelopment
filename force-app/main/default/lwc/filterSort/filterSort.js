import { LightningElement, wire } from "lwc";
import { CurrentPageReference, NavigationMixin } from "lightning/navigation";
import LABEL from '@salesforce/label/c.Filter_Sort_By_Label';
import NEWEST_LABEL from '@salesforce/label/c.Filter_Sort_By_Newest';
import OLDEST_LABEL from '@salesforce/label/c.Filter_Sort_By_Oldest';
import POPULAR_LABEL from '@salesforce/label/c.Filter_Sort_By_Popular';
import ALPHABETICAL_LABEL from '@salesforce/label/c.Filter_Sort_By_Alphabetical';

const OPTIONS = [
  { label: NEWEST_LABEL, value: "" },
  { label: OLDEST_LABEL, value: "oldest" },
  { label: POPULAR_LABEL, value: "popular" },
  { label: ALPHABETICAL_LABEL, value: "alphabetically" }
];

export default class FilterSort extends NavigationMixin(LightningElement) {
  options = OPTIONS;
  label = LABEL;

  @wire(CurrentPageReference)
  pageRef;

  handleChange(event) {
    // if selected value is a record type, update innohub__sortBy query parameter with selected value
    const value = event.target.value;
    const state = { ...this.pageRef.state };
    if (value !== "" && value) {
      state.innohub__sortBy = value;
    } else if ("innohub__sortBy" in state) {
      delete state.innohub__sortBy;
    }
    this[NavigationMixin.Navigate]({
      ...this.pageRef,
      state
    });
  }

  get selectedValue() {
    if (this.pageRef) {
      const value = this.pageRef.state.innohub__sortBy;
      if (value) {
        return value;
      }
    }
    return this.options[0].value;
  }
}