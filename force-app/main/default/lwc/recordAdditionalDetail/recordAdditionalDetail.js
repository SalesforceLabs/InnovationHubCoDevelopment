import { LightningElement, api } from "lwc";

export default class RecordAdditionalDetail extends LightningElement {
  @api recordId;
  @api author;
  @api authorImageUrl;
  @api body;
  @api category;
  @api endDate;
  @api startDate;
  @api title;
  @api videoTitle;
  @api videoTitleField;
  @api videoFileId;
  @api videoFileIdField;
  @api videoUrl;
  @api videoUrlField;

  get authorImageStyle() {
    return `background-image: url(${this.authorImageUrl})`;
  }

  get hideAuthorSection() {
    return !this.author && !this.authorImageUrl;
  }

  get isMobile() {
    return screen.width < 768;
  }

  get showDateSection() {
    return this.startDate || this.endDate;
  }

  get showSeparator() {
    return this.startDate && this.endDate && !this.isMobile;
  }

  get showVideo() {
    return (
      this.videoFileId ||
      this.videoFileIdField ||
      this.videoUrl ||
      this.videoUrlField
    );
  }
}