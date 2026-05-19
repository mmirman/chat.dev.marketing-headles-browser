import { Stagehand } from "../lib/v3/index.js";

const stagehand = new Stagehand({
  env: "LOCAL",
  initScripts: [
    {
      content: `
        window.__stagehandPreload = "installed-before-page-scripts";
      `,
    },
    {
      script: (arg: { source: string }) => {
        (window as unknown as { __stagehandPreloadSource?: string })
          .__stagehandPreloadSource = arg.source;
      },
      arg: { source: "constructor-initScripts" },
    },
  ],
});

await stagehand.init();

try {
  const page = await stagehand.context.awaitActivePage();
  await page.goto(
    `data:text/html,${encodeURIComponent(`
      <script>
        document.documentElement.dataset.preload = window.__stagehandPreload;
        document.documentElement.dataset.preloadSource =
          window.__stagehandPreloadSource;
      </script>
    `)}`,
  );

  const result = await page.evaluate(() => ({
    preload: document.documentElement.dataset.preload,
    preloadSource: document.documentElement.dataset.preloadSource,
  }));

  console.log(result);
} finally {
  await stagehand.close();
}
