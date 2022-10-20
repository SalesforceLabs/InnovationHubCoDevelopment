/* eslint-disable no-debugger */
import { createElement } from "lwc";
import VideoPlayer from "c/videoPlayer";
import { registerLdsTestWireAdapter } from "@salesforce/sfdx-lwc-jest";
import { getRecord } from "lightning/uiRecordApi";

// Mock realistic data
const mockGetRecord = require("./data/record.json");

// Register as an LDS wire adapter. Some tests verify the provisioned values trigger desired behavior.
const getRecordWireAdapter = registerLdsTestWireAdapter(getRecord);

describe("c-video-player", () => {
  afterEach(() => {
    // The jsdom instance is shared across test cases in a single file so reset the DOM
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  describe("positive tests no wire", () => {
    it("renders a title", () => {
      // create initial element
      const element = createElement("c-video-player", {
        is: VideoPlayer
      });
      element.title = "foo";
      document.body.appendChild(element);

      const titleEl = element.shadowRoot.querySelector(".title");
      expect(titleEl.textContent).toBe("foo");
    });

    it("plays a video from file Id", () => {
      // create initial element
      const element = createElement("c-video-player", {
        is: VideoPlayer
      });
      element.videoFileId = "foo";
      document.body.appendChild(element);

      const playerEl = element.shadowRoot.querySelector(".player");
      expect(playerEl).not.toBeNull();
    });

    it("plays a youtube video from url", () => {
      const videoId = "cAASeTJQBjI";
      // create initial element
      const element = createElement("c-video-player", {
        is: VideoPlayer
      });
      element.videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
      document.body.appendChild(element);

      const playerEl = element.shadowRoot.querySelector(".player");
      expect(playerEl.src).toBe(`http://www.youtube.com/embed/${videoId}`);
    });

    it("plays a vimeo video from url", () => {
      const videoId = "385647949";
      // create initial element
      const element = createElement("c-video-player", {
        is: VideoPlayer
      });
      element.videoUrl = `https://vimeo.com/${videoId}`;
      document.body.appendChild(element);

      const playerEl = element.shadowRoot.querySelector(".player");
      expect(playerEl.src).toBe(`http://player.vimeo.com/video/${videoId}`);
    });

    it("plays a Google Drive video from url", () => {
      const videoId = "1KqAIjtC0NVUEyRt-nKPutizBDZ48RRdR";
      // create initial element
      const element = createElement("c-video-player", {
        is: VideoPlayer
      });
      element.videoUrl = `https://drive.google.com/file/d/${videoId}/view?usp=sharing`;
      document.body.appendChild(element);

      const playerEl = element.shadowRoot.querySelector(".player");
      expect(playerEl.src).toBe(
        `https://drive.google.com/file/d/${videoId}/preview`
      );
    });

    it("prioritizes file Id over url", () => {
      const videoId = "385647949";
      // create initial element
      const element = createElement("c-video-player", {
        is: VideoPlayer
      });
      element.videoUrl = `https://vimeo.com/${videoId}`;
      element.videoFileId = "foo"
      document.body.appendChild(element);

      const playerEl = element.shadowRoot.querySelector(".player");
      expect(playerEl.localName).toBe("video");
    });
  });

  describe("negative tests no wire", () => {
    it("renders no title if not specified", () => {
      // create initial element
      const element = createElement("c-video-player", {
        is: VideoPlayer
      });
      document.body.appendChild(element);

      const titleEl = element.shadowRoot.querySelector(".title");
      expect(titleEl).toBeNull();
    });

    it("renders missing message if not video source specified", () => {
      // create initial element
      const element = createElement("c-video-player", {
        is: VideoPlayer
      });
      document.body.appendChild(element);

      const messageEl = element.shadowRoot.querySelector(".missing-message");
      expect(messageEl.textContent).toBeNull();
    });
  });

  describe("get Record @wire data positive tests", () => {
    it("renders a title from record", () => {
      // create initial element
      const element = createElement("c-video-player", {
        is: VideoPlayer
      });
      element.titleField = "Name";
      document.body.appendChild(element);

      // Emit data from @wire
      getRecordWireAdapter.emit(mockGetRecord);

      return Promise.resolve().then(() => {
        const titleEl = element.shadowRoot.querySelector(".title");
        expect(titleEl.textContent).toBe("Amazing Idea");
      });
    });

    it("renders a video from record using file Id", () => {
      // create initial element
      const element = createElement("c-video-player", {
        is: VideoPlayer
      });
      element.videoFileIdField = "innohub__Video_File_Id__c";
      element.videoUrlField = "innohub__Video_URL__c";
      document.body.appendChild(element);

      // Emit data from @wire
      getRecordWireAdapter.emit(mockGetRecord);

      return Promise.resolve().then(() => {
        const playerEl = element.shadowRoot.querySelector(".player");
        expect(playerEl).not.toBeNull();
      });
    });

    it("renders a video from record using url", () => {
      // create initial element
      const element = createElement("c-video-player", {
        is: VideoPlayer
      });
      element.videoUrlField = "innohub__Video_URL__c";
      element.videoFileIdField = "foo";
      document.body.appendChild(element);

      // Emit data from @wire
      getRecordWireAdapter.emit(mockGetRecord);

      return Promise.resolve().then(() => {
        const playerEl = element.shadowRoot.querySelector(".player");
        expect(playerEl.src).toBe("http://www.youtube.com/embed/80RzZkMCLOY");
      });
    });
  });
  
  describe("get Record @wire data negative tests", () => {
    it("displays an error panel", () => {
      // Create initial element
      const element = createElement("c-video-player", {
        is: VideoPlayer
      });
      document.body.appendChild(element);

      // Emit error from @wire
      getRecordWireAdapter.error();

      return Promise.resolve().then(() => {
        const errorPanelEl = element.shadowRoot.querySelector("c-error-panel");
        expect(errorPanelEl).not.toBeNull();
      });
    });
  });
});
