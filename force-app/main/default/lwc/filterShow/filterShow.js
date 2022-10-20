import { LightningElement, wire } from "lwc";
import { CurrentPageReference, NavigationMixin } from "lightning/navigation";
import LABEL from '@salesforce/label/c.Filter_Show_Label';
import ALL_LABEL from '@salesforce/label/c.Filter_Type_All';
import SUBMISSIONS_LABEL from '@salesforce/label/c.my_Submissions_Filter_Label';
import LIKED_LABEL from '@salesforce/label/c.Favourite_Ideas_Label';

const OPTIONS = [
  { label: ALL_LABEL, value: "" },
  { label: SUBMISSIONS_LABEL, value: "mySubmissions" },
  { label: LIKED_LABEL, value: "liked" }
];

export default class FilterShow extends NavigationMixin(LightningElement) {
  options = OPTIONS;
  label = LABEL;

  @wire(CurrentPageReference)
  pageRef;

  handleChange(event) {
    // if selected value is a record type, update innohub__show query parameter with selected value
    const value = event.target.value;
    const state = { ...this.pageRef.state };
    if (value !== "" && value) {
      state.innohub__show = value;
    } else if ("innohub__show" in state) {
      delete state.innohub__show;
    }
    this[NavigationMixin.Navigate]({
      ...this.pageRef,
      state
    });
  }

  get selectedValue() {
    if (this.pageRef) {
      const value = this.pageRef.state.innohub__show;
      if (value) {
        return value;
      }
    }
    return this.options[0].value;
  }
}