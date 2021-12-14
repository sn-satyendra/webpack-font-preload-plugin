import rimraf from "rimraf";
import { run } from "./utils/TestUtil";
import { WP_OUTPUT_DIR } from "./constants/Constants";

describe("WebpackFontPreloadPlugin tests", () => {
  beforeEach((done) => {
    rimraf(WP_OUTPUT_DIR, done);
  });

  it("test 1", async () => {
    try {
      const { index, assets } = await run();
      console.log(index, assets);
    } catch (error) {
      console.log(error);
    }
  });
});
