// This script tests the /api/ai/generate endpoint directly.
// To run it, open your terminal and execute: node test-ai.mjs

async function testAiGeneration() {
  const endpoint = "http://localhost:3000/api/ai/generate";
  const prompt =
    "Generate a simple JSON object with a single key 'greeting' and value 'hello world'.";

  console.log("🧪 Starting AI Generation Test...");
  console.log(`📡 Sending POST request to: ${endpoint}`);
  console.log(`📝 With prompt: "${prompt}"`);
  console.log("----------------------------------------");

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    });

    console.log(`Status Code: ${response.status}`);
    const responseBody = await response.text();

    console.log("Raw Response Body:");
    console.log(responseBody);
    console.log("----------------------------------------");

    if (!response.ok) {
      console.error("❌ Test Failed: The server returned an error.");
    } else {
      try {
        // Attempt to find and parse JSON within the response
        const match = responseBody.match(/{[\s\S]*}/);
        if (match) {
          JSON.parse(match[0]);
          console.log("✅ Test Succeeded: The response contains valid JSON.");
        } else {
          console.error(
            "❌ Test Failed: The successful response did not contain valid JSON."
          );
        }
      } catch (e) {
        console.error(
          "❌ Test Failed: Could not parse JSON from the successful response."
        );
      }
    }
  } catch (error) {
    console.error(
      "❌ Test Failed: An error occurred while making the request."
    );
    console.error(error);
  }
}

testAiGeneration();
