import { LightningElement, api, track } from "lwc";
import { NavigationMixin } from "lightning/navigation";
import pointLabel from "@salesforce/label/c.points_Label";
import likeLabel from "@salesforce/label/c.like_Label";
import likedLabel from "@salesforce/label/c.liked_Label";
import unlikeLabel from "@salesforce/label/c.unlike_Label";
import noCategoryLabel from "@salesforce/label/c.no_category_selected_Label";
import vote from "@salesforce/apex/recordListViewController.vote";

export default class RecordTile extends NavigationMixin(LightningElement) {
  @api recordId;
  @api name;
  @api recordType;
  @api image;
  @api recommended;
  @api points;
  @api category;
  @api creator;
  @api creatorImage;
  @api defaultCreatorImage;
  @api voteSobject;
  @api voteRecordRelationship;
  @api voteObjectLookup;
  @api voteField;
  @api voteType;
  @api customField;
  @api date;
  @track recordPageUrl;

  //Exposing Label
  pointLabel = pointLabel;
  likeLabel = likeLabel;
  likedLabel = likedLabel;
  unlikeLabel = unlikeLabel;
  noCategory = noCategoryLabel;

  //Callback fires when component is added to DOM
  connectedCallback() {
    // Generate a URL to the record page
    this[NavigationMixin.GenerateUrl]({
      type: "standard__recordPage",
      attributes: {
        recordId: this.recordId,
        actionName: "view"
      }
    }).then(url => {
      this.recordPageUrl = url;
    });
  }

  //Sets class of tile depending on boolean value of "recommended" field
  get cardClass() {
    return this.recommended
      ? "slds-card tile tileRecommended"
      : "slds-card tile";
  }

  //Converts points / multiplies by 10
  get convertedPoints() {
    return this.points * 10;
  }

  //Splits category multi-select, replaces semicolon with pipe
  get formattedCategories() {
    return this.category.replace(new RegExp(";", "g"), " | ");
  }

  //Handles voting record update
  handleVote() {
    vote({
      id: this.recordId,
      sObj: this.voteSobject,
      field: this.voteField,
      vote: !this.voteType,
      relationshipField: this.voteObjectLookup
    })
      .then(result => {
        this.voteType = !this.voteType;
        if (this.voteType) {
          this.points += 1;
        } else {
          this.points -= 1;
        }
        //Fires event to refresh cached records
        this.dispatchEvent(new CustomEvent("refreshrecords"));
      })
      .catch(error => {
        // eslint-disable-next-line
        console.error("Error!: ", error);
      });
  }
}