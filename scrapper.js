import puppeteer from "puppeteer";

// Helper function to generate unique IDs
const generateUniqueId = () => {
  return `id-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
};

(async () => {
  // Launch Puppeteer
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  // Go to the review page
  await page.goto(
    "https://www.rottentomatoes.com/m/beetlejuice_beetlejuice/reviews?type=user",
    { waitUntil: "networkidle2" } // Ensures the page is fully loaded
  );

  // Function to click the "Load More" button
  async function clickLoadMore(page, clicks = 5) {
    for (let i = 0; i < clicks; i++) {
      try {
        console.log(`Attempting to click "Load More" button, attempt ${i + 1}`);

        // Evaluate inside browser context
        const result = await page.evaluate(() => {
          // Find the element with Shadow DOM
          const shadowHost = document.querySelector(
            'rt-button[data-loadmoremanager="btnLoadMore:click"]'
          );
          if (!shadowHost) return false;

          // Access Shadow DOM
          const shadowRoot = shadowHost.shadowRoot;
          if (!shadowRoot) return false;

          // Find the load more button inside the Shadow DOM
          const loadMoreButton = shadowRoot.querySelector("button");
          if (loadMoreButton) {
            // Dispatch a click event
            loadMoreButton.click();
            return true;
          }
          return false;
        });

        if (result) {
          console.log(`Clicked "Load More" button, attempt ${i + 1}`);

          // Wait for new content to load (wait for 2 seconds)
          await new Promise((resolve) => setTimeout(resolve, 2000));
        } else {
          console.log(
            "Load More button not found or unable to click. Stopping."
          );
          break;
        }
      } catch (error) {
        console.log("Error interacting with Load More button:", error);
        break;
      }
    }
  }

  // Function to scrape reviews with unique IDs
  async function scrapeReviews(page) {
    const reviews = await page.evaluate(() => {
      // Find all review elements
      const reviewElements = document.querySelectorAll(".audience-review-row");

      let extractedReviews = [];

      reviewElements.forEach((reviewElement) => {
        // Extract the name
        const nameElement = reviewElement.querySelector(
          ".audience-reviews__name"
        );
        const name = nameElement ? nameElement.innerText.trim() : "No name";

        // Extract the review comment
        const reviewElementText = reviewElement.querySelector(
          ".audience-reviews__review"
        );
        const reviewText = reviewElementText
          ? reviewElementText.innerText.trim()
          : "No review text";

        extractedReviews.push({ name, review: reviewText });
      });

      return extractedReviews;
    });

    // Add unique IDs to each review
    const reviewsWithIds = reviews.map((review, index) => ({
      id: generateUniqueId(), // Assign unique ID to each review
      ...review,
    }));

    console.log(`Extracted ${reviewsWithIds.length} reviews with unique IDs.`);
    return reviewsWithIds;
  }

  // Click the "Load More" button 5 times
  await clickLoadMore(page, 5);

  // Extract the reviews after clicking the button
  const reviews = await scrapeReviews(page);

  // Log the reviews with unique IDs
  console.log("Extracted Reviews with Unique IDs:", reviews);

  // Close the browser
  await browser.close();
})();
