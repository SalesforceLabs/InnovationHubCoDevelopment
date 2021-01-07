import { LightningElement, api, wire } from "lwc";
import { getRecord, getFieldValue } from "lightning/uiRecordApi";
import { NavigationMixin } from "lightning/navigation";
import LEARN_MORE_LABEL from "@salesforce/label/c.Learn_More_Button_Label";

export default class RecordBanner extends NavigationMixin(LightningElement) {
  learnMoreLabel = LEARN_MORE_LABEL;

  @api authorField;
  @api authorImageField;
  @api authorImageUrl;
  @api backgroundColor;
  @api backgroundColorField;
  @api bodyField;
  @api categoryField;
  @api closeDateField;
  @api headingField;
  @api imageField;
  @api imageUrl;
  @api learnMoreField;
  @api metricsChildObjectApiName;
  @api metricsLookupFieldApiName;
  @api recordId;
  @api showLearnMoreButton = false;
  @api simpleCountdown = false;
  @api startDateField;
  @api statusField;
  @api textColor;
  @api textColorField;
  @api videoTitle;
  @api videoTitleField;
  @api videoFileId;
  @api videoFileIdField;
  @api videoUrl;
  @api videoUrlField;

  @wire(getRecord, {
    recordId: "$recordId",
    layoutTypes: ["Full"],
    modes: ["View"]
  })
  record;

  @wire(getRecord, {
    recordId: "$record.data.fields.CreatedById.value",
    fields: ["User.Name", "User.MediumPhotoUrl"]
  })
  creator;

  stringContainsImage(str) {
    if (str) {
      return str.match(/<img/);
    }
    return false;
  }

  getImageSourceFromRichText(richText) {
    const searchString = 'img src="';
    const startIndex = richText.indexOf('img src="') + searchString.length;
    richText = richText.substring(startIndex);
    const endIndex = richText.indexOf('"');
    richText = richText.substring(0, endIndex).replace(/amp;/g, "");
    return richText;
  }

  isColor(str) {
    const s = new Option().style;
    s.color = str;
    if (str && str !== "") {
      return s.color === str || s.color.replace(/\s/g, "") === str;
    }
    return false;
  }

  showLearnMoreModal() {
    this.template.querySelector("c-modal").show();
  }

  // Getters
  get author() {
    // if author field api name is provided, return data from that field
    if (this.authorField && this.authorField !== "") {
      const author = getFieldValue(
        this.record.data,
        `${this.objectApiName}.${this.authorField}`
      );
      if (author) {
        return author;
      }
    }
    return getFieldValue(this.creator.data, "User.Name"); // Default to returning record creator name
  }

  get authorImage() {
    // if field api name is provided overwrite url
    if (this.authorImageField && this.authorImageField !== "") {
      const image = getFieldValue(
        this.record.data,
        `${this.objectApiName}.${this.authorImageField}`
      );
      if (this.stringContainsImage(image)) {
        return this.getImageSourceFromRichText(image);
      }
      return image;
    }

    // if an image url is provided overwrite url
    if (this.authorImageUrl && this.authorImageUrl !== "") {
      return this.authorImageUrl;
    }

    return getFieldValue(this.creator.data, "User.MediumPhotoUrl"); // default to record owner profile picture
  }

  get authorImageStyle() {
    return `background-image: url(${this.authorImage})`;
  }

  get backgroundColorStyle() {
    const backgroundColorString = `background-color: ${
      this.isColor(this.bgColor) ? this.bgColor : "#efefef"
    };`;
    const colorString = this.isColor(this.textBodyColor)
      ? `color: ${this.textBodyColor};`
      : undefined;
    return `${backgroundColorString} ${colorString}`;
  }

  get backgroundImage() {
    if (this.imageField && this.imageField !== "") {
      const image = getFieldValue(
        this.record.data,
        `${this.objectApiName}.${this.imageField}`
      );
      if (image) {
        return image;
      }
    }
    return this.imageUrl;
  }

  get backgroundImageStyle() {
    let url = this.backgroundImage;
    let color = this.isColor(this.bgColor) ? this.bgColor : "#efefef";
    let gradientDirection = "left";
    if (this.isBackgroundImageRichText) {
      url = this.getImageSourceFromRichText(this.backgroundImage);
    }
    if (this.isMobile) {
      gradientDirection = "bottom";
    }
    return `
      background-image: linear-gradient(to ${gradientDirection}, rgba(255,255,255,0) 20%, ${color}), url(${url});
      background-image: -moz-linear-gradient(to ${gradientDirection}, rgba(255,255,255,0) 20%, ${color}), url(${url})  
    `;
  }

  get bgColor() {
    // if field api name is provided overwrite url
    if (this.backgroundColorField && this.backgroundColorField !== "") {
      const color = getFieldValue(
        this.record.data,
        `${this.objectApiName}.${this.backgroundColorField}`
      );
      if (color) {
        return color;
      }
    }
    return this.backgroundColor;
  }

  get body() {
    return getFieldValue(
      this.record.data,
      `${this.objectApiName}.${this.bodyField}`
    );
  }

  get buttonStyle() {
    return `color: ${this.textBodyColor}`;
  }

  get category() {
    if (this.categoryField && this.categoryField !== "") {
      const category = getFieldValue(
        this.record.data,
        `${this.objectApiName}.${this.categoryField}`
      );
      if (category) {
        return category.replace(/;/g, " | ");
      }
    }
    return undefined;
  }

  get closeDate() {
    if (this.closeDateField) {
      const date = getFieldValue(
        this.record.data,
        `${this.objectApiName}.${this.closeDateField}`
      );
      if (date) {
        const returnValue = typeof date === "string" ? date : date.toString();
        return returnValue;
      }
    }
    return undefined;
  }

  get error() {
    return this.record.error || this.creator.error;
  }

  get heading() {
    return getFieldValue(
      this.record.data,
      `${this.objectApiName}.${this.headingField}`
    );
  }

  get isBackgroundImageRichText() {
    return this.stringContainsImage(this.backgroundImage);
  }

  get isMobile() {
    return screen.width < 768;
  }

  get learnMoreContent() {
    if (this.learnMoreField && this.learnMoreField !== "") {
      return getFieldValue(
        this.record.data,
        `${this.objectApiName}.${this.learnMoreField}`
      );
    }
    return undefined;
  }

  get objectApiName() {
    if (this.record.data) {
      return this.record.data.apiName;
    }
    return undefined;
  }

  get startDate() {
    if (this.startDateField) {
      const date = getFieldValue(
        this.record.data,
        `${this.objectApiName}.${this.startDateField}`
      );
      if (date) {
        const returnValue = typeof date === "string" ? date : date.toString();
        return returnValue;
      }
    }
    return undefined;
  }

  get status() {
    if (this.statusField) {
      return getFieldValue(
        this.record.data,
        `${this.objectApiName}.${this.statusField}`
      );
    }
    return undefined;
  }

  get showMetricsCounter() {
    return this.metricsChildObjectApiName && this.metricsLookupFieldApiName;
  }

  get textBodyColor() {
    // if field api name is provided overwrite url
    if (this.textColorField && this.textColorField !== "") {
      const color = getFieldValue(
        this.record.data,
        `${this.objectApiName}.${this.textColorField}`
      );
      if (color) {
        return color;
      }
    }
    return this.textColor;
  }
}