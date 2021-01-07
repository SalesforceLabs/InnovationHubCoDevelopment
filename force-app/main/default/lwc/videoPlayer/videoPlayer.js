import { LightningElement, api, wire, track } from "lwc";
import { getRecord, getFieldValue } from "lightning/uiRecordApi";

export default class VideoPlayer extends LightningElement {
  @api recordId;
  @api title;
  @api titleField;
  @api videoFileId;
  @api videoFileIdField;
  @api videoUrl;
  @api videoUrlField;

  @track videoSource;

  @wire(getRecord, {
    recordId: "$recordId",
    layoutTypes: ["Full"],
    modes: ["View"]
  })
  record;

  generateVimeoEmbedUrl(vimeoLink) {
    const regExp = /(?:vimeo)\.com.*(?:videos|video|channels|)\/([\d]+)/i;
    const match = vimeoLink.match(regExp);
    const videoId = match ? match[1] : undefined;
    if (videoId) {
      return `//player.vimeo.com/video/${videoId}`;
    }
    return undefined;
  }

  generateYouTubeEmbedUrl(ytLink) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = ytLink.match(regExp);
    const videoId = match && match[2].length === 11 ? match[2] : undefined;
    if (videoId) {
      return `//www.youtube.com/embed/${videoId}`;
    }
    return undefined;
  }

  generatesGoogleDriveEmbedUrl(gdLink) {
    const regExp = /\/file\/d\/([^/]+)/;
    const match = gdLink.match(regExp);
    let videoId = match ? match[1] : undefined;
    if (videoId) {
      return `https://drive.google.com/file/d/${videoId}/preview`;
    }
    const url = new URL(gdLink);
    if (url.hostname.includes("drive.google.com")) {
      videoId = url.searchParams.get("id");
      return `https://drive.google.com/file/d/${videoId}/preview`;
    }
    return undefined;
  }

  get error() {
    if (this.record) {
      return this.record.error;
    }
    return undefined;
  }

  // returns video file id from record if field is specified. Fall back is to return specified video file id
  get fileId() {
    if (this.videoFileIdField) {
      const fileId = getFieldValue(
        this.record.data,
        `${this.objectApiName}.${this.videoFileIdField}`
      );
      if (fileId) {
        return fileId;
      }
    }
    return this.videoFileId;
  }

  get isRawVideo() {
    return this.fileId && this.fileId !== "";
  }

  get isPlayer() {
    return !this.isRawVideo && this.url && this.url !== "";
  }

  get source() {
    if (this.fileId) {
      return `/sfc/servlet.shepherd/document/download/${this.fileId}`;
    }
    if (this.url) {
      const youtubeSource = this.generateYouTubeEmbedUrl(this.url);
      const vimeoSource = this.generateVimeoEmbedUrl(this.url);
      const gdSource = this.generatesGoogleDriveEmbedUrl(this.url);
      if (youtubeSource) {
        return youtubeSource;
      }
      if (vimeoSource) {
        return vimeoSource;
      }
      if (gdSource) {
        return gdSource;
      }else{
        return this.url;
      }
    }
    return undefined;
  }

  get url() {
    if (this.videoUrlField) {
      const url = getFieldValue(
        this.record.data,
        `${this.objectApiName}.${this.videoUrlField}`
      );
      if (url) {
        return url;
      }
    }
    return this.videoUrl;
  }

  get noSource() {
    return !this.source;
  }

  get objectApiName() {
    if (this.record.data) {
      return this.record.data.apiName;
    }
    return undefined;
  }

  get uiTitle() {
    if (this.titleField) {
      const title = getFieldValue(
        this.record.data,
        `${this.objectApiName}.${this.titleField}`
      );
      if (title) {
        return title;
      }
    }
    return this.title;
  }
}