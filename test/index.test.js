import rimraf from "rimraf";
import { run, findPreloadedFonts, areValidFonts } from "./utils/TestUtil";
import { WP_OUTPUT_DIR } from "./constants/Constants";

const cleanOutput = (done) => {
  rimraf(WP_OUTPUT_DIR, done);
};

describe("WebpackFontPreloadPlugin tests", () => {
  beforeEach(cleanOutput);
  afterAll(cleanOutput);

  it("should preload all the available fonts when no configuration is specified", async () => {
    const extensions = ["woff", "woff2", "ttf", "eot"];
    const { indexDocument } = await run();
    const fonts = findPreloadedFonts(indexDocument);
    expect(fonts.length).toBe(4);
    expect(await areValidFonts(fonts, extensions)).toBe(true);
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
