import { LightningElement, api, track } from "lwc";
import COUNTDOWN_CLOSED_LABEL from "@salesforce/label/c.Countdown_Closed";
import CLOSES_LABEL from "@salesforce/label/c.Countdown_Closes";

export default class Countdown extends LightningElement {
  closedLabel = COUNTDOWN_CLOSED_LABEL;
  closesLabel = CLOSES_LABEL;
  @api dateTime;
  @api backgroundColor;
  @api textColor;
  @api simple = false;
  @api startDate;
  @api statusInput;

  @track days;
  @track hours;
  @track minutes;
  @track seconds;

  @track expired = false;
  @track wrongDateFormat = false;

  connectedCallback() {
    this.calculateTimeToDisplay();
    // eslint-disable-next-line
    const refreshId = setInterval(() => {
      this.calculateTimeToDisplay(refreshId);
    }, 1000);
  }

  colorValues(color) {
    if (color === "") {
      return undefined;
    }

    if (color.toLowerCase() === "transparent") {
      return [0, 0, 0, 0];
    }

    if (color[0] === "#") {
      if (color.length < 7) {
        // convert #RGB and #RGBA to #RRGGBB and #RRGGBBAA
        color =
          "#" +
          color[1] +
          color[1] +
          color[2] +
          color[2] +
          color[3] +
          color[3] +
          (color.length > 4 ? color[4] + color[4] : "");
      }
      return [
        parseInt(color.substr(1, 2), 16),
        parseInt(color.substr(3, 2), 16),
        parseInt(color.substr(5, 2), 16),
        color.length > 7 ? parseInt(color.substr(7, 2), 16) / 255 : 1
      ];
    }

    if (color.indexOf("rgb") === -1) {
      // convert named colors
      const temp_elem = document.body.appendChild(
        document.createElement("fictum")
      ); // intentionally use unknown tag to lower chances of css rule override with !important
      const flag = "rgb(1, 2, 3)"; // this flag tested on chrome 59, ff 53, ie9, ie10, ie11, edge 14
      temp_elem.style.color = flag;
      if (temp_elem.style.color !== flag) return undefined; // color set failed - some monstrous css rule is probably taking over the color of our object
      temp_elem.style.color = color;
      if (temp_elem.style.color === flag || temp_elem.style.color === "")
        return undefined; // color parse failed
      color = getComputedStyle(temp_elem).color;
      document.body.removeChild(temp_elem);
    }

    if (color.indexOf("rgb") === 0) {
      if (color.indexOf("rgba") === -1) color += ",1"; // convert 'rgb(R,G,B)' to 'rgb(R,G,B)A' which looks awful but will pass the regxep below
      return color.match(/[.\d]+/g).map(a => {
        return +a;
      });
    }
    return undefined;
  }

  calculateTimeToDisplay(intervalId) {
    const now = new Date().getTime();
    const countDownDate = new Date(this.dateTime).getTime();

    // if end date is not valid exit loop and show error message
    if (isNaN(countDownDate)) {
      this.wrongDateFormat = true;
      clearInterval(intervalId);
    }

    // Find the distance between now and the count down date
    const distance = countDownDate - now;
    this.expired = distance < 0;

    // Stop countdown if expired
    if (this.expired) {
      clearInterval(intervalId);
    }

    // Time calculations for days, hours, minutes and seconds
    this.days = Math.floor(distance / (1000 * 60 * 60 * 24));
    this.days = this.days < 10 ? `0${this.days}` : this.days;
    this.hours = Math.floor(
      (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    this.hours = this.hours < 10 ? `0${this.hours}` : this.hours;
    this.minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    this.minutes = this.minutes < 10 ? `0${this.minutes}` : this.minutes;
    this.seconds = Math.floor((distance % (1000 * 60)) / 1000);
    this.seconds = this.seconds < 10 ? `0${this.seconds}` : this.seconds;
  }

  transparentColor(color) {
    const colorValues = this.colorValues(color);
    return `rgba(${colorValues[0]}, ${colorValues[1]}, ${colorValues[2]}, 0.7)`;
  }

  get countDownStyle() {
    if (!this.isMobile) {
      return `background-color: ${
        this.backgroundColor
          ? this.transparentColor(this.backgroundColor)
          : "rgba(255,255,255,0.5)"
      }; color: ${
        this.textColor ? this.textColor : "#222"
      }; border: 1px solid ${this.textColor ? this.textColor : "#222"}`;
    }
    return undefined;
  }

  get isMobile() {
    return screen.width < 768;
  }

  get dateInMs() {
    if (this.dateTime) {
      return new Date(this.dateTime).getTime();
    }
    return undefined;
  }

  get startDateInMs() {
    if (this.startDate) {
      return new Date(this.startDate).getTime();
    }
    return undefined;
  }

  get errorMessageClasses() {
    return this.inverseColors
      ? "slds-p-around_medium error-message box"
      : "slds-p-around_medium error-message box inverse";
  }

  get expiredMessageClasses() {
    return this.inverseColors
      ? "expired-message slds-p-around_medium slds-text-heading_medium box"
      : "expired-message slds-p-around_medium slds-text-heading_medium box inverse";
  }

  get showCountdown() {
    return !this.expired && !this.wrongDateFormat;
  }

  get status() {
    return this.statusInput || this.closedLabel;
  }
}