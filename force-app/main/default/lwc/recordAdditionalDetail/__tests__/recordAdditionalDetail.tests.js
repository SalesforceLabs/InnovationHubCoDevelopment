/* eslint-disable no-debugger */
import { createElement } from "lwc";
import RecordAdditionalDetail from "c/recordAdditionalDetail";

describe("c-record-additional-detail", () => {
  afterEach(() => {
    // The jsdom instance is shared across test cases in a single file so reset the DOM
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  describe("positive tests", () => {
    it("shows a title", () => {
      // create initial element
      const element = createElement("c-record-additional-detail", {
        is: RecordAdditionalDetail
      });
      element.title = "foo";
      document.body.appendChild(element);

      const titleEl = element.shadowRoot.querySelector(".title");
      expect(titleEl.textContent).toBe("foo");
    });

    it("shows an author image", () => {
      const testUrl = "https://i.imgur.com/MBZ1KVA.png";
      // create initial element
      const element = createElement("c-record-additional-detail", {
        is: RecordAdditionalDetail
      });
      element.authorImageUrl = testUrl;
      document.body.appendChild(element);

      const targetEl = element.shadowRoot.querySelector(".author-image");
      expect(targetEl.style.backgroundImage).toMatch(testUrl);
    });

    it("shows an author", () => {
      // create initial element
      const element = createElement("c-record-additional-detail", {
        is: RecordAdditionalDetail
      });
      element.author = "foo";
      document.body.appendChild(element);

      const targetEl = element.shadowRoot.querySelector(".author");
      expect(targetEl.textContent).toBe("foo");
    });

    it("shows a start date", () => {
      // create initial element
      const element = createElement("c-record-additional-detail", {
        is: RecordAdditionalDetail
      });
      element.startDate = "1547250828000";
      document.body.appendChild(element);

      const targetEl = element.shadowRoot.querySelector(".start-date");
      expect(targetEl).not.toBeNull();
    });

    it("shows an end date", () => {
      // create initial element
      const element = createElement("c-record-additional-detail", {
        is: RecordAdditionalDetail
      });
      element.endDate = "1547250828000";
      document.body.appendChild(element);

      const targetEl = element.shadowRoot.querySelector(".end-date");
      expect(targetEl).not.toBeNull();
    });

    it("shows categories", () => {
      // create initial element
      const element = createElement("c-record-additional-detail", {
        is: RecordAdditionalDetail
      });
      element.category = "foo";
      document.body.appendChild(element);

      const targetEl = element.shadowRoot.querySelector(".category");
      expect(targetEl.textContent).toBe("foo");
    });

    it("shows text in the body", () => {
      // create initial element
      const element = createElement("c-record-additional-detail", {
        is: RecordAdditionalDetail
      });
      element.body = "foo";
      document.body.appendChild(element);

      const targetEl = element.shadowRoot.querySelector(".body");
      expect(targetEl).not.toBeNull();
    });

    it("shows video player if video input provided", () => {
      // create initial element
      const element = createElement("c-record-additional-detail", {
        is: RecordAdditionalDetail
      });
      element.videoUrl = "https://vimeo.com/385647949";
      document.body.appendChild(element);

      const videoEl = element.shadowRoot.querySelector("c-video-player");
      expect(videoEl).not.toBeNull();
    });
  });

  describe("negative tests", () => {
    it("doesn't show title if not specified", () => {
      // create initial element
      const element = createElement("c-record-additional-detail", {
        is: RecordAdditionalDetail
      });
      document.body.appendChild(element);
      const titleEl = element.shadowRoot.querySelector(".title");
      expect(titleEl).toBeNull();
    });

    it("hides author image if not specified", () => {
      // create initial element
      const element = createElement("c-record-additional-detail", {
        is: RecordAdditionalDetail
      });
      document.body.appendChild(element);

      const targetEl = element.shadowRoot.querySelector(".author-image");
      expect(targetEl).toBeNull();
    });

    it("hides author if not specified", () => {
      // create initial element
      const element = createElement("c-record-additional-detail", {
        is: RecordAdditionalDetail
      });
      document.body.appendChild(element);

      const targetEl = element.shadowRoot.querySelector(".author");
      expect(targetEl).toBeNull();
    });

    it("hides start date if startDate attribute not specified", () => {
      // create initial element
      const element = createElement("c-record-additional-detail", {
        is: RecordAdditionalDetail
      });
      document.body.appendChild(element);

      const targetEl = element.shadowRoot.querySelector(".start-date");
      expect(targetEl).toBeNull();
    });

    it("hides end date if endDate attribute not specified", () => {
      // create initial element
      const element = createElement("c-record-additional-detail", {
        is: RecordAdditionalDetail
      });
      document.body.appendChild(element);

      const targetEl = element.shadowRoot.querySelector(".end-date");
      expect(targetEl).toBeNull();
    });

    it("hides categories if not specified", () => {
      // create initial element
      const element = createElement("c-record-additional-detail", {
        is: RecordAdditionalDetail
      });
      document.body.appendChild(element);

      const targetEl = element.shadowRoot.querySelector(".category");
      expect(targetEl).toBeNull();
    });

    it("hides body if not specified", () => {
      // create initial element
      const element = createElement("c-record-additional-detail", {
        is: RecordAdditionalDetail
      });
      document.body.appendChild(element);

      const targetEl = element.shadowRoot.querySelector(".body");
      expect(targetEl).toBeNull();
    });
  });
});
