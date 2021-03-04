import { LightningElement, api, wire,track } from 'lwc';
import getUserInfo from "@salesforce/apex/UserInfoController.getUserInfo";

export default class ModularuserInfo extends LightningElement {

  @api object = "";
  @api userType = "";
  @api recordId = "";
  @track isLoading = true;
  @track userRecord = {};

  @track myerror;
  errormessage;

  //Field mapping based on design attribute selected
  get userName() {
    if (this.userType == "Creator") {
      return "CreatedBy.Name";
    } else if (this.userType == "Owner") {
      return "Owner.Name";
    } else {
      return this.userType + '.Name';
    }
  }

  //Field mapping based on design attribute selected
  get userImage() {
    if (this.userType == "Creator") {
      return "CreatedBy.MediumPhotoUrl";
    } else if (this.userType == "Owner") {
      return "Owner.MediumPhotoUrl";
    } else {
      return this.userType + '.MediumPhotoUrl'
    }
  }

  //Field mapping based on design attribute selected
  get userSmallImage() {
    if (this.userType == "Creator") {
      return "CreatedBy.SmallPhotoUrl";
    } else if (this.userType == "Owner") {
      return "Owner.SmallPhotoUrl";
    } else {
      return this.userType + '.SmallPhotoUrl'
    }
  }

  @wire(getUserInfo, {
    objApiName: "$object",
    userType: "$userType",
    currentRecordId: "$recordId"
  })
  wiredRecords(result) {
    this.errormessage = "";
    this.wiredRecordsResult = result;

    if (result.error) {
      console.error(result.error);
      this.errormessage = result.error.body.message;
      this.myerror = result.error;
    } else if (result.data) {
      this.userRecord.fullName = this.ref(result.data, this.userName);
      //add if statement copy 71 
      this.userRecord.MediumPhotoUrl = this.ref(result.data, this.userImage);
      this.userRecord.SmallPhotoUrl = this.ref(result.data, this.userSmallImage);
    }
  }

  //splits object from object name to name that we can reference
  ref(obj, str) {
    return str.split(".").reduce(function (o, x) {
      return o[x];
    }, obj);
  }

}