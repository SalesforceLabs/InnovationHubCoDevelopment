import { LightningElement, api } from 'lwc';

export default class LatestSubmissions extends LightningElement {
  @api firstObject;
  @api firstObjectUserType;
  @api secondObject;
  @api secondObjectUserType;
  @api thirdObject;
  @api thirdObjectUserType;

}