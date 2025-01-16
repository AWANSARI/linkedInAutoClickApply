// content.js
// Immediately invoke an async function (so we can use await)
(async function main() {
  /***********************************************
   * 0)  Override or simulate clicks & keypresses *
   ***********************************************/
  function simulateCommandClick(element) {
    // Create a MouseEvent to simulate a left-click
    const mouseEventDown = new MouseEvent("mousedown", {
      bubbles: true,
      cancelable: true,
      button: 0,
      metaKey: true, // Command key
    });
    const mouseEventUp = new MouseEvent("mouseup", {
      bubbles: true,
      cancelable: true,
      button: 0,
      metaKey: true,
    });
    const mouseEventClick = new MouseEvent("click", {
      bubbles: true,
      cancelable: true,
      button: 0,
      metaKey: true,
    });

    // Simulate the "keydown" event for Command (⌘)
    const commandKeyDownEvent = new KeyboardEvent("keydown", {
      key: "Meta",
      keyCode: 91,
      code: "MetaLeft",
      which: 91,
      metaKey: true,
      bubbles: true,
    });

    document.dispatchEvent(commandKeyDownEvent);
    element.dispatchEvent(mouseEventDown);
    element.dispatchEvent(mouseEventClick);
    element.dispatchEvent(mouseEventUp);

    // Simulate releasing the Command key
    const commandKeyUpEvent = new KeyboardEvent("keyup", {
      key: "Meta",
      keyCode: 91,
      code: "MetaLeft",
      which: 91,
      metaKey: false,
      bubbles: true,
    });
    document.dispatchEvent(commandKeyUpEvent);
  }

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /***********************************************
   * 1) Find all pagination buttons and iterate   *
   ***********************************************/
  let pageButtons = Array.from(
    document.querySelectorAll("li[data-test-pagination-page-btn] button")
  );
  console.log(`Found ${pageButtons.length} pages.`);

  for (let p = 0; p < pageButtons.length; p++) {
    const pageButton = pageButtons[p];
    console.log(`Clicking page ${p + 1}...`);
    pageButton.click();

    // Wait for jobs to load
    await sleep(2000);

    /***********************************************
     * 2) Find and iterate over job cards on page  *
     ***********************************************/
    let jobCardSelector = "li.occludable-update .job-card-container--clickable";
    let jobCards = Array.from(document.querySelectorAll(jobCardSelector));
    console.log(`Page ${p + 1}: found ${jobCards.length} jobs.`);

    for (let j = 0; j < jobCards.length; j++) {
      let jobCard = jobCards[j];
      console.log(`  Opening job #${j + 1}...`);
      jobCard.click();

      // Wait for job details to load
      await sleep(2000);

      /***********************************************
       * 3) Find & click any “Apply” button(s)       *
       ***********************************************/
      let applyButtons = Array.from(
        document.querySelectorAll("button.jobs-apply-button")
      );
      const elements = document.querySelectorAll(".artdeco-button__text");
      // Filter the elements that have text content exactly matching "Apply" (case-sensitive)
      const applyElements = Array.from(elements).filter(
        (element) => element.textContent === "\n    Apply\n"
      );

      // Log the number of elements found
      console.log(
        `Found ${applyElements.length} elements with class 'artdeco-button__text' and text 'Apply'.`
      );
      if (applyButtons.length === 0) {
        console.log(`    No "Apply" button found for job #${j + 1}.`);
      } else {
        console.log(
          `    Found ${applyButtons.length} "Apply" button(s). Clicking...`
        );
        // Simulate Command+Click on the first “Apply” button
        applyElements.forEach((e) => {
          console.log("actual click");
          simulateCommandClick(e);
        });
        // Press Command+1 (some personal custom action?)
        await sleep(1000);
      }
    }

    // (Optional) Re-query pagination if needed. The DOM might change once you go to another page.
    // pageButtons = Array.from(document.querySelectorAll("li[data-test-pagination-page-btn] button"));
  }

  console.log("Done iterating through pages and jobs!");
})();
