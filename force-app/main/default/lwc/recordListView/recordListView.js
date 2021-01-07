import { LightningElement, api, wire, track } from "lwc";
import { refreshApex } from "@salesforce/apex";
import { CurrentPageReference, NavigationMixin } from "lightning/navigation";
import getRecordCount from "@salesforce/apex/recordListViewController.getRecordCount";
import getRecords from "@salesforce/apex/recordListViewController.getRecords";
import noResultsLabel from "@salesforce/label/c.no_results_found_Label";
import noResultsSuggestionLabel from "@salesforce/label/c.no_results_suggestion_Label";
//ppinon 12/1/2020 adding message between paginator and recordlistview to manage the page change and recordcount
import {
  subscribe,
  unsubscribe,
  publish,
  APPLICATION_SCOPE,
  MessageContext
} from "lightning/messageService";
//ppinon 12/1/2020 listview receives PaginatorMessage from the paginator in order to display the right page and the number of tiles
import PaginatorMessage from "@salesforce/messageChannel/innohub_paginator__c";
//ppinon 12/1/2020 listview publishes ListvewMessage to the paginator in order to send the number of records, so that paginator can calculate the number of pages
import ListviewMessage from "@salesforce/messageChannel/innohub_listview__c";

export default class RecordListView extends NavigationMixin(LightningElement) {
  //width not well managed ppinon 11/25/2020

  @api flexipageRegionWidth;
  @api inSidebar = false;
  @api recordId = "";
  @api object = "";
  @api name;
  @api recordType;
  @api image;
  @api recommended = "";
  @api points = "";
  @api category = "";
  @api userType = "";
  @api defaultUserImage;
  @api approvalCondition = "";
  @api likes;
  @api customField;
  @api dateField;
  @api votesObject = "";
  @api voteRecordRelationship = "";
  @api voteField = "";
  @api voteType = "";
  @api voteObjectLookup = "";
  @api lookupField = "";
  @api usePagination;
  @api defaultRecordTypes = "";
  @api defaultFilters = "";
  @api Tiletype = "Standard";
  @api backgroundColor = "rgba(255, 255, 255,0)";

  @track myerror;
  @track records = { data: [] };
  @track screenWidth = parseInt(this.getBoundingClientRect().width, 10);
  //@track screenWidth = this.flexipageRegionWidth;
  @track pageRef;
  pageRef;

  recordCount;
  wiredRecordsResult;
  errormessage;
  pageSize = 8;
  currentPage = 1;

  filters = "";
  sortBy = "newest";
  show = "";
  recordTypeId = "";

  isLoading = true;

  previousFilters;
  @track firstrender = true;

  // for subscription to paginator message chanel
  subscription = null;

  //Exposing Label
  noResultsLabel = noResultsLabel;
  noResultsSuggestionLabel = noResultsSuggestionLabel;

  //Callback to fire resize function on size change
  //ppinon 12/8/2020 I changed the logic of exchanging data with paginator to avoid infinite loop via the url change detection
  connectedCallback() {
    //console.log("We are exexuting connectedcallback");
    this.subscribeToMessageChannel();
    this.size = parseInt(this.getBoundingClientRect().width, 10);
    //console.log('durant appel connected call back ' + parseInt(this.getBoundingClientRect().width,10));
    window.addEventListener("resize", this.resize);
  }

  // ppinon 12/8/2020 added rendercallback to capture the size when available in the lwc lifecycle
  renderedCallback() {
    if (this.firstrender) {
      //console.log('durant appel rendered call back ' + parseInt(this.getBoundingClientRect().width,10));
      this.size = parseInt(this.getBoundingClientRect().width, 10);
      this.firstrender = false;
    }
  }

  disconnectedCallback() {
    this.unsubscribeToMessageChannel();
  }

  //Assigns the size of screen to an attribute when fired
  //ppinon 12/3/2020 getting the right size not the screen size
  resize = () => {
    //this.size = screen.width;
    this.size = parseInt(this.getBoundingClientRect().width, 10);
    //console.log('longueur si jamais' + parseInt(this.getBoundingClientRect().width,10));
    //console.log('size si jamais' + this.size);
  };

  //Message management
  @wire(MessageContext)
  messageContext;

  //ppinon 12/1/2020 all the functions to manage the message
  subscribeToMessageChannel() {
    if (!this.subscription) {
      this.subscription = subscribe(
        this.messageContext,
        PaginatorMessage,
        (message) => this.handleMessage(message)
      );
    }
  }

  unsubscribeToMessageChannel() {
    unsubscribe(this.subscription);
    this.subscription = null;
  }

  // Handler for message received by component
  handleMessage(message) {
    //console.log("réception du message current: " + message.Currentpage + ' Pagesize: '+ message.Pagesize);
    this.currentPage = message.Currentpage;
    this.pageSize = message.Pagesize;
    this.currentPage = message.Currentpage;
    //console.log('longueur si jamais' + this.getBoundingClientRect().width);
  }

  //Refreshes cached data obtained via Apex
  handleRefreshRecords() {
    return refreshApex(this.wiredRecordsResult);
  }

  //Field mapping based on design attribute selected
  get user() {
    if (this.userType == "Creator") {
      return "CreatedBy.Name";
    } else {
      return "Owner.Name";
    }
  }

  //Field mapping based on design attribute selected
  get userImage() {
    if (this.userType == "Creator") {
      return "CreatedBy.SmallPhotoUrl";
    } else {
      return "Owner.SmallPhotoUrl";
    }
  }

  //Gets record count - the amount of records existing based on parameters provided
  @wire(getRecordCount, {
    objApiName: "$object",
    lookupField: "$lookupField",
    contextId: "$recordId",
    filters: "$filters",
    sortBy: "$sortBy",
    show: "$show",
    recordTypeId: "$recordTypeId",
    votesObject: "$votesObject",
    voteObjectLookup: "$voteObjectLookup",
    userType: "$userType",
    approvalCondition: "$approvalCondition",
    voteField: "$voteField"
  })
  wiredRecordsCount({ error, data }) {
    //console.log("Wired record count");
    if (error) {
      //console.log("error on calling getcount");
      console.error(error);
    } else if (typeof data !== "undefined") {
      this.recordCount = JSON.stringify(data);
      //console.log("nombre de records:" + this.recordCount);
      const payload = { recordCount: this.recordCount };
      publish(this.messageContext, ListviewMessage, payload);
    }
  }

  //Fires every time Current Page Reference is changed, any changes to state are caught here

  @wire(CurrentPageReference)
  wiredPageRef(pageRef) {
    //console.log("wired page reference");
    if (pageRef) {
      //this.handleRefreshRecords();
      this.pageRef = pageRef;
      if (pageRef.state.innohub__sortBy) {
        this.sortBy = decodeURIComponent(pageRef.state.innohub__sortBy);
        //this.handleRefreshRecords();
      } else {
        this.sortBy = "newest";
      }
      if (pageRef.state.innohub__show) {
        this.show = decodeURIComponent(pageRef.state.innohub__show);
        //this.handleRefreshRecords();
        //this.retrieveRecords();
      } else {
        this.show = "";
      }
      if (pageRef.state.innohub__filters) {
        this.filters = this.filters = decodeURIComponent(
          pageRef.state.innohub__filters
        );
        //this.handleRefreshRecords();
      } else {
        this.filters = "";
      }
      if (pageRef.state.innohub__recordTypeId) {
        this.recordTypeId = this.pageRef.state.innohub__recordTypeId;
        //this.retrieveRecords();
      } else {
        this.recordTypeId = "";
      }
    }
  }

  //Obtains records based on parameters provided
  @wire(getRecords, {
    objApiName: "$object",
    fields: "$fields",
    voteField: "$voteField",
    voteRecordRelationship: "$voteRecordRelationship",
    lookupField: "$lookupField",
    votesObject: "$votesObject",
    voteObjectLookup: "$voteObjectLookup",
    contextId: "$recordId",
    pageSize: "$pageSize",
    page: "$currentPage",
    usePagination: "$usePagination",
    filters: "$filters",
    sortBy: "$sortBy",
    show: "$show",
    recordTypeId: "$recordTypeId",
    name: "$name",
    points: "$points",
    recommended: "$recommended",
    userType: "$userType",
    approvalCondition: "$approvalCondition"
  })
  wiredRecords(result) {
    //console.log("Wired get the records"+this.pageSize+' page : '+this.currentPage);
    this.errormessage = "";
    this.wiredRecordsResult = result;
    if (result.error) {
      // ppinon console.log("error on calling getrecords" + result.error.body.message);
      console.error(result.error);
      // ppinon 11/26/20 When an error it is better to inform the user ...
      this.errormessage = result.error.body.message;
      this.myerror = result.error;
    } else if (result.data) {
      this.records.data = [];

      //If results exist, they are mapped to fields selected in the designer before assigned to each tile
      result.data.forEach((element) => {
        this.records.data.push({
          id: element.Id,
          name: element[this.name],
          recordType: this.ref(element, this.recordType),
          image: element[this.image],
          recommended: element[this.recommended],
          points: element[this.points],
          category: element[this.category],
          creator: this.ref(element, this.user),
          creatorImage: this.ref(element, this.userImage),
          defaultCreatorImage: this.defaultUserImage,
          likes: element[this.likes],
          customField: element[this.customField],
          dateField: element[this.dateField],
          voteType: this.checkVote(element)
        });
      });
      this.isLoading = false;
    } else {
      //When there are no results, set the dataset to empty
      this.records.data = [];
      // Pascal Pinon 11/25/2020 having no data is a possible result, in that case we also need to stop the spinner
      // this.isLoading = false;
    }
  }

  //ppinon 12/7/2020 the background was transparent by default, not nice in Lightning Experience
  get containerStyle() {
    let style = this.backgroundColor
      ? `background-color: ${this.backgroundColor}; `
      : "background-color: #efefef; ";

    return style;
  }

  //Returns true if small screen (mobile)
  get isMobile() {
    return this.screenWidth < 768;
  }

  //Setter for screen width
  set size(value) {
    this.screenWidth = value;
  }

  //Returns the max width for each tile to the Lightning Layout component based on screen size and "inSidebar" designer attribute
  get size() {
    // ppinon calculated size in order to have the right number of tiles on a row dynamicaly
    if (this.Tiletype == "Mobile" || this.Tiletype=="Standard") {
      //console.log('size calculé' + Math.round(this.screenWidth/(30*16 + 8)));
      var CalculatedSize = parseInt(
        12 / Math.round(this.screenWidth / (25 * 16 + 10))
      );
      if (CalculatedSize > 12) {
        CalculatedSize = 12;
      }
      if (CalculatedSize < 3) {
        CalculatedSize = 3;
      }
      //console.log('area size = ' + this.screenWidth);
      //console.log('calculated size = ' + CalculatedSize);
      return CalculatedSize;
    }

    if (this.isMobile) {
      if (this.screenWidth < 612) {
        return 12;
      } else {
        return 6;
      }
    } else if (this.inSidebar) {
      if (this.screenWidth < 924) {
        return 12;
      } else if (this.screenWidth < 1356) {
        return 6;
      } else {
        return 4;
      }
    } else {
      if (this.screenWidth < 612) {
        return 12;
      } else if (this.screenWidth < 922) {
        return 6;
      } else if (this.screenWidth < 1210) {
        return 4;
      } else {
        return 3;
      }
    }
  }

  get standardTile() {
    if (this.Tiletype == "Standard") {
      return true;
    } else {
      return false;
    }
  }

  get mobileTile() {
    if (this.Tiletype == "Mobile") {
      return true;
    } else {
      return false;
    }
  }

  //Returns true if there are no results in dataset
  get noResults() {
    if (this.records.data.length > 0) {
      return false;
    }
    if (!("innohub__recordCount" in this.pageRef.state) && !this.isLoading) {
      return true;
    }
    return false;
  }

  //Checks whether a vote has previously been attached to the record from subquery
  checkVote(element) {
    if (element[this.voteRecordRelationship]) {
      element = element[this.voteRecordRelationship];
      if (element[0][this.voteField]) {
        return element[0][this.voteField];
      }
    }
    return false;
  }

  //Helper function to allow for child relationships in certain fields referenced in design attributes
  ref(obj, str) {
    return str.split(".").reduce(function (o, x) {
      return o[x];
    }, obj);
  }

  //Getter for fields to be queried
  @api
  get fields() {
    var fields = "Id";
    if (this.name) {
      fields += ", " + this.name;
    }
    if (this.recordType) {
      if (this.recordType == "RecordType.Name") {
        fields += ", toLabel(RecordType.Name)";
      } else {
        fields += ", " + this.recordType;
      }
    }
    if (this.image) {
      fields += ", " + this.image;
    }
    if (this.recommended) {
      fields += ", " + this.recommended;
    }
    if (this.points) {
      fields += ", " + this.points;
    }
    if (this.category) {
      fields += ", toLabel(" + this.category + ")";
    }
    if (this.customField) {
      fields += ", toLabel(" + this.customField + ")";
    }
    if (this.dateField) {
      fields += ", " + this.dateField;
    }
    return fields;
  }
}
