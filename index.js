const puppeteer = require("puppeteer");

(async function main() {
  try {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.setUserAgent(
      "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36"
    );

    // Navigate to WhatsApp Web
    await page.goto("https://web.whatsapp.com/");
    console.log("Please scan the QR code to log in...");

    // Wait for login
    await page.waitForSelector("div[role='textbox']", { timeout: 60000 });

    const contactName = "Baba";
    const message = "Hello, this is a test message.";
    const amountOfMessages = 5;

    // Select the contact
    console.log(`Searching for contact: ${contactName}`);
    await page.waitForSelector(`span[title='${contactName}']`);
    await page.click(`span[title='${contactName}']`);
    console.log(`Chat with '${contactName}' opened.`);

    // Find the message input box within the chat 
    const messageBoxSelector = "div[role='textbox'][contenteditable='true']";
    await page.waitForSelector(messageBoxSelector);
    console.log("Message input box found.");

    for (let i = 0; i < amountOfMessages; i++) {
      console.log(`Preparing to send message ${i + 1}: "${message}"`);

      // Set the message in the input box
      await page.evaluate(
        (msg, selector) => {
          const messageBox = document.querySelector(selector);
          if (!messageBox) throw new Error("Message input box not found!");
          messageBox.textContent = msg; // Set the message text directly
          messageBox.dispatchEvent(new InputEvent("input", { bubbles: true })); // Trigger input event
        },
        message,
        messageBoxSelector
      );

      // Log to confirm message input
      const currentText = await page.evaluate(
        (selector) => document.querySelector(selector)?.innerText,
        messageBoxSelector
      );
      console.log(`Current text in input box: "${currentText}"`);

      // Ensure the send button is clickable
      console.log("Attempting to click the send button...");
      await page.waitForSelector("span[data-testid='send']");
      await page.click("span[data-testid='send']");
      console.log(`Message ${i + 1} sent.`);

      // Wait between messages
      await page.waitForTimeout(1000);
    }

    console.log("All messages sent successfully.");
    await browser.close();
  } catch (error) {
    console.error("Error during execution:", error);
  }
})();
