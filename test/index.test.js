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

  /**
   * 1. should preload all the available fonts when no configuration is specified
   * 2. should preload only specific fonts when `extensions` is specified
   * 3. should not add `crossorigin` attribute when option is turned off
   * 4. should add link with `prefetch` when `loadType` is set as `prefetch`
   * 5. should allow to add `links` at arbitrary location in dom
   * 6. should allow to update the generated index.html by using a template placeholder
   * 7. should allow to filter font's for preload by specifying a contained string
   * 8. should allow to filter font's for preload by specifying a regex
   */
});
