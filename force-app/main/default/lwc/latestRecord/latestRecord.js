import { LightningElement, api, track, wire } from "lwc";
import { getObjectInfo } from "lightning/uiObjectInfoApi";
import { NavigationMixin } from "lightning/navigation";
import getLatestRecordId from "@salesforce/apex/LatestRecordController.getLatestRecordId";
import getRecords from "@salesforce/apex/recordListViewController.getRecords";
import LATEST_LABEL from "@salesforce/label/c.Latest";
import VIEW_LABEL from "@salesforce/label/c.View_all";
import Id from '@salesforce/user/Id';

export default class LatestRecord extends NavigationMixin(LightningElement) {
  currentUserId = Id;
  latestLabel = LATEST_LABEL;
  viewAllLabel = VIEW_LABEL;

  @api sObjectApiName;
  @api categoryField;
  @api creatorField;
  @api creatorImageFallbackUrl;
  @api creatorImageField;
  @api customField;
  @api conditions;
  @api dateField;
  @api imageField;
  @api nameField;
  @api pointsField;
  @api recommendedField;
  @api showViewAll;
  @api typeField;
  @api userType;
  @api voteField;
  @api voteLookupField;
  @api voteRecordRelationshipName;
  @api voteSObject;

  @track error;
  @track objectInfo;
  @track latestRecordId;
  @track record;
  @track creator;
  @track viewAllUrl;
  @track ownerId;

  @wire(getObjectInfo, { objectApiName: "$sObjectApiName" })
  wiredObjectInfo({ data, error }) {
    if (error) {
      this.error = error;
    } else if (data) {
      this.objectInfo = data;
      this.generateViewAllUrl();
    }
  }

  connectedCallback() {
    this.assignDefaultParametersForKnownObject();
    this.retrieveRecords();
  }

  async retrieveRecords() {
    try {
      const records = await getRecords({
        objApiName: this.sObjectApiName,
        fields: this.fields,
        voteField: this.voteField,
        voteRecordRelationship: this.voteRecordRelationshipName,
        lookupField: "",
        votesObject: this.voteSObject,
        voteObjectLookup: this.voteLookupField,
        contextId: "",
        pageSize: 1,
        page: 1,
        usePagination: "true",
        filters: "",
        sortBy: "",
        show: "",
        recordTypeId: "",
        name: this.nameField,
        points: this.pointsField,
        recommended: "",
        userType: this.userType,
        approvalCondition: this.conditions,
      });
      this.record = records[0];
    } catch (error) {
      //eslint-disable-next-line
      console.error(error);
    }
  }

  async generateViewAllUrl() {
    if (!this.sObjectApiName) return;

    this.listViewPageRef = {
      type: "standard__objectPage",
      attributes: {
        objectApiName: this.sObjectApiName,
        actionName: "list"
      }
    };
    this.viewAllUrl = await this[NavigationMixin.GenerateUrl](
      this.listViewPageRef
    );
  }

  get noRecordsFoundText() {
    return `Looks like we can't find any ${this.objectInfo.labelPlural}`;
  }

  get fields() {
    let fields = "Id";
    if (this.nameField) {
      fields += ", " + this.nameField;
    }
    if (this.typeField) {
      fields += ", " + this.typeField;
    }
    if (this.imageField) {
      fields += ", " + this.imageField;
    }
    if (this.recommendedField) {
      fields += ", " + this.recommendedField;
    }
    if (this.pointsField) {
      fields += ", " + this.pointsField;
    }
    if (this.categoryField) {
      fields += ", toLabel(" + this.categoryField + ")";
    }
    if (this.customField) {
      fields += ", toLabel(" + this.customField + ")";
    }
    if (this.dateField) {
      fields += ", " + this.dateField;
    }
    return fields;
  }

  get isIdeaLikedByUser() {
    if ("innohub__Innovation_Idea_Votes__r" in this.record) {
      const votes = this.record[this.voteRecordRelationshipName];
      const userVote = votes.filter(vote => vote.CreatedById === this.currentUserId);
      if (userVote.length > 0) {
        return userVote[0][this.voteField];
      }
      return false;
    }
  }

  get recordTileInputData() {
    if (!this.record) return undefined;

    // Setting default creator, creator image and type
    let creator, creatorImage, type;
    if (!this.creatorField || this.creatorField === "") {
      if (this.userType === "Creator") {
        creator = this.record.CreatedBy.Name;
      } else {
        creator = this.record.Owner.Name;
      }
     }
    if (!this.creatorImageField || this.creatorImageField === "") {
      if (this.userType === "Creator") {
        creatorImage = this.record.CreatedBy.SmallPhotoUrl;
      } else {
        creatorImage = this.record.Owner.SmallPhotoUrl;
      }
    }

    const recordTileInputData = {
      recordId: this.record.Id,
      name: this.record[this.nameField],
      recordType: this.typeField ? this.ref(this.record, this.typeField) : undefined,
      image: this.record[this.imageField],
      recommended: 
        this.record[this.recommendedField],
      points:
        this.record[this.pointsField] || 0,
      category: 
        this.record[this.categoryField],
      creator: creator || this.record[this.creatorField],
      creatorImage: creatorImage || this.record[this.creatorImageField],
      defaultCreatorImage: this.creatorImageFallbackUrl,
      voteSObject: this.voteSObject,
      voteRecordRelationship: this.voteRecordRelationshipName,
      voteLookupField: this.voteLookupField,
      voteType: this.isIdeaLikedByUser,
      voteField: this.voteField,
      customField: 
        this.record[this.customField],
      date: this.record[this.dateField]
    };
    return recordTileInputData;
  }

  //Helper function to allow for child relationships in certain fields referenced in design attributes
  ref(obj, str) {
    return str.split(".").reduce(function(o, x) {
      return o[x];
    }, obj);
  }

  setParamToValueIfEmpty(param, value) {
    if (!this[param] || this[param] === "") {
      this[param] = value;
    }
  }

  assignDefaultParametersForKnownObject() {
    switch (this.sObjectApiName) {
      // Idea
      case "innohub__Innovation_Idea__c":
        this.setParamToValueIfEmpty("categoryField", "innohub__Category__c");
        this.setParamToValueIfEmpty(
          "conditions",
          "innohub__Approval_Status__c='Approved'"
        );
        this.setParamToValueIfEmpty("typeField", "RecordType.Name");
        this.setParamToValueIfEmpty("imageField", "innohub__Image__c");
        this.setParamToValueIfEmpty("nameField", "Name");
        this.setParamToValueIfEmpty("pointsField", "innohub__Points__c");
        this.setParamToValueIfEmpty(
          "recommendedField",
          "innohub__Recommended__c"
        );
        this.setParamToValueIfEmpty("voteField", "innohub__Vote_Type__c");
        this.setParamToValueIfEmpty(
          "voteLookupField",
          "innohub__Innovation_Idea__c"
        );
        this.setParamToValueIfEmpty(
          "voteRecordRelationshipName",
          "innohub__Innovation_Idea_Votes__r"
        );
        this.setParamToValueIfEmpty(
          "voteSObject",
          "innohub__Innovation_Idea_Vote__c"
        );
        break;

      // Demo
      case "innohub__Demo__c":
        this.setParamToValueIfEmpty("categoryField", "innohub__Category__c");
        this.setParamToValueIfEmpty("imageField", "innohub__Image__c");
        this.setParamToValueIfEmpty("nameField", "Name");
        this.setParamToValueIfEmpty("pointsField", "innohub__Points__c");
        this.setParamToValueIfEmpty("typeField", "innohub__Demo_Type__c");
        this.setParamToValueIfEmpty("voteField", "innohub__Vote_Type__c");
        this.setParamToValueIfEmpty("voteLookupField", "innohub__Demo__c");
        this.setParamToValueIfEmpty(
          "voteRecordRelationshipName",
          "innohub__Demo_Vote__r"
        );
        this.setParamToValueIfEmpty("voteSObject", "innohub__Demo_Vote__c");
        break;

      // Prototype
      case "innohub__Prototype__c":
        this.setParamToValueIfEmpty("categoryField", "innohub__Region__c");
        this.setParamToValueIfEmpty("imageField", "innohub__Image__c");
        this.setParamToValueIfEmpty("nameField", "Name");
        break;

      // Inspiration
      case "innohub__User_Voice__c":
        this.setParamToValueIfEmpty("categoryField", "innohub__Workstream__c");
        this.setParamToValueIfEmpty("imageField", "innohub__Image__c");
        this.setParamToValueIfEmpty("nameField", "Name");
        break;

      // Activity
      case "innohub__Activity__c":
        this.setParamToValueIfEmpty("categoryField", "innohub__Type__c");
        this.setParamToValueIfEmpty("imageField", "innohub__Image__c");
        this.setParamToValueIfEmpty("nameField", "Name");
        break;

      default:
    }
  }
}