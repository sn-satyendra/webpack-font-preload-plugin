import rimraf from "rimraf";
import { run } from "./utils/TestUtil";
import { WP_OUTPUT_DIR } from "./constants/Constants";

const cleanOutput = (done) => {
  rimraf(WP_OUTPUT_DIR, done);
};

describe("WebpackFontPreloadPlugin tests", () => {
  beforeEach(cleanOutput);
  afterAll(cleanOutput);

  it("test 1", async () => {
    try {
      const { index, assets } = await run();
      console.log(index, assets);
    } catch (error) {
      console.log(error);
    }
  });

  it("should preload all the available fonts when no configuration is specified", async () => {
    console.log("TODO");
  });

  it("should preload only specific fonts when `extensions` is specified", async () => {
    console.log("TODO");
  });

  it("should not add `crossorigin` attribute when option is turned off", async () => {
    console.log("TODO");
  });

  it("should add link with `prefetch` when `loadType` is set as `prefetch`", async () => {
    console.log("TODO");
  });

  it("should allow to add `links` at arbitrary location in dom", async () => {
    console.log("TODO");
  });

  it("should allow to update the generated index.html by using a template placeholder", async () => {
    console.log("TODO");
  });

  it("should allow to filter font's for preload by specifying a contained string", async () => {
    console.log("TODO");
  });

  it("should allow to filter font's for preload by specifying a regex", async () => {
    console.log("TODO");
  });

  it("should preload the fonts when public path is not provided", async () => {
    console.log("TODO");
  });
});
