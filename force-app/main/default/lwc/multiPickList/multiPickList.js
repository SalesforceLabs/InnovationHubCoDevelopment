import { LightningElement, api, track } from "lwc";
import selectOption from "@salesforce/label/c.selectOption";
import optionsSelected from "@salesforce/label/c.optionsSelected";

export default class MultiPickList extends LightningElement {
  @api label = ""; //Name of the dropDown
  @api maxSelected = 2; //Max selected item display
  @api options; // List of items to display
  @api value;
  @api placeholder = selectOption;

  @track backdrop = false;

  @track _initializationCompleted = false;
  @track _filterValue = "";

  connectedCallback() {
    this.showfilterinput = true;
  }

  renderedCallback() {
    if (!this._initializationCompleted) {
      this.template
        .querySelector(".ms-input")
        .addEventListener("click", event => {
          this.onDropDownClick(event.target);
          this.backdrop = true;
          event.stopPropagation();
        });
      this.template.addEventListener("click", event => {
        event.stopPropagation();
      });
      document.addEventListener("click", () => {
        this.closeAllDropDown();
      });
      this._initializationCompleted = true;
    }
  }

  handleItemSelected(event) {
    const itemValue = event.detail.item.value;
    let selectedValues = [];
    if (this.value) {
      selectedValues = this.value.split(";");
    }
    if (selectedValues.includes(itemValue)) {
      this.value = selectedValues
        .filter(value => value !== itemValue)
        .join(";");
    } else {
      selectedValues.push(itemValue);
      this.value = selectedValues.join(";");
    }
    this.dispatchEvent(new CustomEvent("change"));
  }

  closeAllDropDown() {
    Array.from(this.template.querySelectorAll(".ms-picklist-dropdown")).forEach(
      node => {
        node.classList.remove("slds-is-open");
      }
    );
    this.backdrop = false;
  }

  onDropDownClick() {
    let dropdown = this.template.querySelector(".ms-picklist-dropdown");
    if (!dropdown.classList.contains("slds-is-open")) {
      this.closeAllDropDown();
      dropdown.classList.add("slds-is-open");
    } else {
      this.closeAllDropDown();
    }
  }

  get _mOptions() {
    if (this.options) {
      const mOptions = this.options.map(option => {
        let selected = false;
        if (this.value) {
          selected = this.value.split(";").includes(option.value);
        }
        return {
          ...option,
          selected
        };
      });
      return mOptions;
    }
    return [];
  }

  get inputValue() {
    let selections = "";
    if (this.selectedItems.length < 1) {
      selections = this.placeholder;
    } else if (this.selectedItems.length > this.maxSelected) {
      selections = `${this.selectedItems.length} ${optionsSelected}`;
    } else {
      this.selectedItems.forEach((option, index) => {
        if (index > 0) {
          selections += `, ${option.label}`;
        } else {
          selections += option.label;
        }
      });
    }
    return selections;
  }

  get selectedItems() {
    if (this.value && this.options) {
      const selected = this.value.split(";");
      return this.options.filter(option => selected.includes(option.value));
    }
    return [];
  }
}