import { LightningElement, api, track, wire } from "lwc";
import { CurrentPageReference, NavigationMixin } from "lightning/navigation";
import nextPage from "@salesforce/label/c.paginator_next_page_label";
import previousPage from "@salesforce/label/c.paginator_previous_page_label";
//ppinon 12/1/2020 added the communication between paginator and record list view via message
import {
  subscribe,
  unsubscribe,
  publish,
  MessageContext
} from "lightning/messageService";
import PaginatorMessage from "@salesforce/messageChannel/innohub_paginator__c";
import ListviewMessage from "@salesforce/messageChannel/innohub_listview__c";

export default class Paginator extends NavigationMixin(LightningElement) {
  @api pageSize;
  @api backgroundColor = "rgba(255, 255, 255,0)";

  @track MyRecordCount;
  MyCurrentPage;

  pageRef;
  //ppinon 12/1/2020 subscription to listen to Listview component
  subscription = null;

  //Exposing Label
  nextLabel = nextPage;
  previousLabel = previousPage;

  connectedCallback() {
    this.subscribeToMessageChannel();
  }

  disconnectedCallback() {
    this.unsubscribeToMessageChannel();
  }

  @wire(MessageContext)
  messageContext;

  //ppinon 12/1/2020 
  //Fires every time Current Page Reference is changed, any changes to state are caught here
  /*
  @wire(CurrentPageReference)
  wiredPageRef(pageRef) {
    console.log("appel wired page ref paginator");
    if (pageRef) {
      console.log("page ref defined paginator");
      this.pageRef = pageRef;
      if ("innohub__pageSize" in pageRef.state) {
        this.pageSize = parseInt(pageRef.state.innohub__pageSize);
      }

      if (
        "innohub__recordCount" in this.pageRef.state &&
        !("innohub__currentPage" in this.pageRef.state)
      ) {
        const state = { ...this.pageRef.state };
        state.innohub__currentPage = 1;
        if (!state.innohub__pageSize) {
          if (this.pageSize !== "" && this.pageSize) {
            state.innohub__pageSize = this.pageSize;
          } else if ("innohub__pageSize" in state) {
            delete state.innohub__pageSize;
          }
        }
        this[NavigationMixin.Navigate](
          {
            ...this.pageRef,
            state
          },
          true
        );
      }
    }
  }
  */

 
 @wire(CurrentPageReference)
 wiredPageRef(pageRef) {
   //console.log("appel wired page ref paginator");
   if (pageRef) {
     //console.log("page ref defined paginator");
     this.pageRef = pageRef;
   }
  }

  
  //ppinon 12/1/2020 adding message management functions for subscribe and unsubscribe

  subscribeToMessageChannel() {
    if (!this.subscription) {
      this.subscription = subscribe(
        this.messageContext,
        ListviewMessage,
        (message) => this.handleMessage(message)
      );
    }
  }

  unsubscribeToMessageChannel() {
    unsubscribe(this.subscription);
    this.subscription = null;
  }


  get containerStyle() {
    let style = this.backgroundColor
    ? `background-color: ${this.backgroundColor}; `
    : "background-color: #efefef; ";
  
    return style;
  }

  // Handler for message received by component
  handleMessage(message) {
    //console.log("réception du message de listview : " + message.recordCount);
    //console.log('valeur de myrecordcount' + this.MyRecordCount);
    if ((typeof this.MyRecordCount !== "undefined") && this.MyRecordCount!=message.recordCount) {this.MyCurrentPage = 1; this.currentPage=1;}
    this.MyRecordCount = message.recordCount;
    if (!this.MyCurrentPage) {this.MyCurrentPage = 1;}
    const payload = { Currentpage: this.MyCurrentPage, Pagesize: this.pageSize };
    publish(this.messageContext, PaginatorMessage, payload);
  }

  //Returns the current page
  get currentPage() {
    
    if (this.pageRef) {
      const value = parseInt(this.pageRef.state.innohub__currentPage);
      if (value) {
        //console.log('send the message');
        this.MyCurrentPage = value;
        const payload = { Currentpage: value, Pagesize: this.pageSize };
        publish(this.messageContext, PaginatorMessage, payload);
        return value;
      }
    }
    
   if (this.MyCurrentPage) {
   return this.MyCurrentPage;
   } else {return 1}
  }

  //Sets the current page and sends updates the URL
  set currentPage(page) {
    
    const state = { ...this.pageRef.state };
    if (page !== "" && page) {
      state.innohub__currentPage = page;
     this[NavigationMixin.Navigate](
      {
        ...this.pageRef,
        state
      },
      true
    );
    } else if ("innohub__currentPage" in state) {
      delete state.innohub__currentPage;
    }
    /*
    if (!state.innohub__pageSize) {
      if (this.pageSize !== "" && this.pageSize) {
        state.innohub__pageSize = this.pageSize;
      } else if ("innohub__pageSize" in state) {
        delete state.innohub__pageSize;
      }
    }
    */
    
   if (page !== "" && page) {
    this.MyCurrentPage = page;
   }
    const payload = { Currentpage: page, Pagesize: this.pageSize };
    publish(this.messageContext, PaginatorMessage, payload);
    
    //this.navigate(state);
  }

  //Helper function to update the URL with any state change
  navigate(state) {
    this[NavigationMixin.Navigate]({
      ...this.pageRef,
      state
    });
  }

  //Returns the amount of records queried from URL
  get recordCount() {
    // return this.pageRef.state.innohub__recordCount;
    return this.MyRecordCount;
  }

  //Calculates page count based on page size and amount of records
  get pageCount() {
    if (this.recordCount > 2000) {
      return Math.ceil(2000 / this.pageSize);
    }
    return Math.ceil(this.recordCount / this.pageSize);
  }

  //Generates an array of pages which should be visible based on user selection
  get pages() {
    let pageArr = [];
    let i;
    for (i = 2; i < this.pageCount; i++) {
      let page = {};
      let addToArray = false;
      //If page is the current page, make it active
      if (i == this.currentPage) {
        page.active = true;
        addToArray = true;
      }
      if (this.currentPage < 5 && i < 6) {
        page.page = i;
        addToArray = true;
      } else if (
        this.currentPage > this.pageCount - 4 &&
        i > this.pageCount - 5
      ) {
        page.page = i;
        addToArray = true;
      } else if (this.currentPage <= 4 && i <= this.currentPage + 1) {
        page.page = i;
        addToArray = true;
      } else if (
        this.currentPage >= this.pageCount - 3 &&
        i >= this.currentPage - 1
      ) {
        page.page = i;
        addToArray = true;
      } else if (i > +this.currentPage - 2 && i < +this.currentPage + 2) {
        page.page = i;
        addToArray = true;
      }
      if (addToArray) {
        pageArr.push(page);
      }
    }
    return pageArr;
  }

  //Returns true if first page is active
  get firstActive() {
    if (this.currentPage == 1) {
      return true;
    }
    return false;
  }

  //Returns true if last page is active
  get lastActive() {
    if (this.currentPage == this.pageCount) {
      return true;
    }
    return false;
  }

  //Shows ... on left side if current page is greater than 4
  get hideLeft() {
    if (this.pageCount < 7) {
      return false;
    }
    if (this.pageCount > 3 && this.currentPage > 4) {
      return true;
    }
    return false;
  }

  //Shows ... on right side if current page is less than last page -3
  get hideRight() {
    if (this.pageCount < 7) {
      return false;
    }
    if (this.pageCount > 3 && this.currentPage < this.pageCount - 3) {
      return true;
    }
    return false;
  }

  //Returns true and displays "Next" button if next page exists
  get nofurtherRecords() {
    if (parseInt(this.currentPage) == parseInt(this.pageCount) || this.MyRecordCount == 0) {
      return true;
    }
    return false;
  }

  //Returns true and displays "Back" button if previous page exists
  get nopreviousRecords() {
    if (parseInt(this.currentPage) == 1) {
      return true;
    }
    return false;
  }

  //Returns true if there are multiple pages (more than one)
  get multiplePages() {
    if (this.pageCount > 1) {
      return true;
    }
    return false;
  }

  //Navigates to current page - 1
  previous() {
    if (this.currentPage > 1) {
      this.changePage(
        { currentTarget: { value: parseInt(this.currentPage) - 1 } },
        true
      );
    }
  }

  //Navigates to current page + 1
  next() {
    if (this.currentPage < this.pageCount) {
      this.changePage(
        { currentTarget: { value: parseInt(this.currentPage) + 1 } },
        true
      );
    }
  }

  //Handles changing of pages
  changePage(event) {
    this.currentPage = parseInt(event.currentTarget.value);
  }
}
