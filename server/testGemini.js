import dotenv from "dotenv";
import getFixSuggestion from "./services/geminiService.js";

dotenv.config();

async function test() {

  const violation = {
    id: "image-alt",
    description: "Images must have alternate text",
    html: "<img src='photo.jpg'>"
  };

  console.log("Testing Gemini...");

  try {

    const response = await getFixSuggestion(violation);

    console.log("Gemini response:");
    console.log(response);

  } catch (error) {

    console.error("Gemini error:");
    console.error(error);

  }

}

test();