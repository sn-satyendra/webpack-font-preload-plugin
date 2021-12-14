import { run } from "./utils/TestUtil";

describe("WebpackFontPreloadPlugin tests", () => {
  it("sample test", async () => {
    try {
      const results = await run();
      console.log(results);
    } catch (error) {
      console.log(error);
    }
  });
});
