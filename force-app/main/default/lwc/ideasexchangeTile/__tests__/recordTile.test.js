import { createElement } from "lwc";
import recordTile from "c/recordTile";
import { CurrentPageReference } from "lightning/navigation";

describe("c-recordTile", () => {
  afterEach(() => {
    // The jsdom instance is shared across test cases in a single file so reset the DOM
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  function flushPromises() {
    // eslint-disable-next-line no-undef
    return new Promise(resolve => setImmediate(resolve));
  }

  it("Test that attributes display when values provided", () => {
    // Create element
    const element = createElement("c-recordTile", {
      is: recordTile
    });
      element.image =
      '<img class="jestTest" src="https://i.imgur.com/qREYm48.png"/>';
      element.points = 1;
      element.recordType = "Sample Record Name";
      element.name = 'Sample Label';
      element.recommended = true;
      element.category = "Sales;Marketing;Service";
      element.creator = "Martin Futas";
      element.creatorImage = "https://media-exp1.licdn.com/dms/image/C4E03AQF4PoHmEUJGQw/profile-displayphoto-shrink_100_100/0?e=1585180800&v=beta&t=DnNw5BJ0B6I6zOCbYY22gYSaJMVzSDSqIznujl8Q3lo";
      //@api defaultCreatorImage;
      element.voteSobject = "voteSobject";
      //@api voteType;
      element.customField = "In Developement";
      element.date = '18/02/1919';

    CurrentPageReference.mockReturnValue("/");

    document.body.appendChild(element);

    // Verify that specified fields are displayed
    return flushPromises().then(() => {
      const richText = element.shadowRoot.querySelector(
        "lightning-formatted-rich-text"
      );
      expect(richText).not.toBeNull();

      const pointsDiv = element.shadowRoot.querySelector(".points");
      expect(pointsDiv.innerHTML).toBe("10 c.points_Label");

      const recordTypeDiv = element.shadowRoot.querySelector(".recordTypeBanner");
      expect(recordTypeDiv.innerHTML).toBe("Sample Record Name");

      const nameDiv = element.shadowRoot.querySelector(".tileHeading");
      expect(nameDiv.innerHTML).toBe("Sample Label");

      const recommendedDiv = element.shadowRoot.querySelector(".recommendedBanner");
      expect(recommendedDiv).not.toBeNull();

      const categoryDiv = element.shadowRoot.querySelector(".category");
      expect(categoryDiv.innerHTML).toBe("Sales | Marketing | Service");

      const creatorDiv = element.shadowRoot.querySelector(".creatorName");
      expect(creatorDiv.innerHTML).toBe("Martin Futas");

      const creatorImageDiv = element.shadowRoot.querySelector("img[src$='DnNw5BJ0B6I6zOCbYY22gYSaJMVzSDSqIznujl8Q3lo']");
      expect(creatorImageDiv).not.toBeNull();
      
      const voteButton = element.shadowRoot.querySelector("lightning-button-stateful");
      expect(voteButton).not.toBeNull();
      const customDiv = element.shadowRoot.querySelector(".customBanner");
      expect(customDiv.innerHTML).toBe("In Developement");

      const dateDiv = element.shadowRoot.querySelector("lightning-formatted-date-time");
      expect(dateDiv).not.toBeNull();
    });
  });

  it("Test that attributes don't display when values are missing", () => {
    // Create element
    const element = createElement("c-recordTile", {
      is: recordTile
    });
    element.defaultCreatorImage = '/sampleImage.png';
    CurrentPageReference.mockReturnValue("/");

    document.body.appendChild(element);

    // Verify that specified fields are displayed
    return flushPromises().then(() => {
      const richText = element.shadowRoot.querySelector(
        "lightning-formatted-rich-text"
      );
      expect(richText).toBeNull();

      const pointsDiv = element.shadowRoot.querySelector(".points");
      expect(pointsDiv).toBeNull();

      const recordTypeDiv = element.shadowRoot.querySelector(".recordTypeBanner");
      expect(recordTypeDiv).toBeNull();

      const nameDiv = element.shadowRoot.querySelector(".tileHeading");
      expect(nameDiv.innerHTML).toBe("");

      const recommendedDiv = element.shadowRoot.querySelector(".recommendedBanner");
      expect(recommendedDiv).toBeNull();

      const categoryDiv = element.shadowRoot.querySelector(".category");
      expect(categoryDiv).toBeNull();

      const creatorDiv = element.shadowRoot.querySelector(".creatorName");
      expect(creatorDiv.innerHTML).toBe("");

      const creatorImageDiv = element.shadowRoot.querySelector("img[src$='DnNw5BJ0B6I6zOCbYY22gYSaJMVzSDSqIznujl8Q3lo']");
      expect(creatorImageDiv).toBeNull();
      
      const voteButton = element.shadowRoot.querySelector("lightning-button-stateful");
      expect(voteButton).toBeNull();

      const customDiv = element.shadowRoot.querySelector(".customBanner");
      expect(customDiv).toBeNull();

      const dateDiv = element.shadowRoot.querySelector("lightning-formatted-date-time");
      expect(dateDiv).toBeNull();

      const defaultImage = element.shadowRoot.querySelector(".defaultImage").src;
      expect(defaultImage).toBe("http://localhost/sampleImage.png");
    });
  });
});
