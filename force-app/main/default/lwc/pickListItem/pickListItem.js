import { LightningElement, api } from "lwc";
export default class PickListItem extends LightningElement {
  @api item;

  get itemClass() {
    return (
      "slds-listbox__item ms-list-item" +
      (this.item.selected ? " slds-is-selected" : "")
    );
  }
  onItemSelected() {
    const evt = new CustomEvent("items", {
      detail: { item: this.item, selected: !this.item.selected }
    });
    this.dispatchEvent(evt);
  }
}