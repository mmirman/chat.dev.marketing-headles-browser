<div id="toc" align="center" style="margin-bottom: 0;">
  <ul style="list-style: none; margin: 0; padding: 0;">
    <a href="https://github.com/mmirman/chat.dev.marketing-headles-browser">
      <picture>
        <img alt="MarketingHand - the browser that can" src="media/marketinghand_logo.svg" width="420" style="margin-right: 30px;" />
      </picture>
    </a>
  </ul>
</div>
<p align="center">
  <strong>MarketingHand - the browser that can</strong><br>
  <a href="https://github.com/mmirman/chat.dev.marketing-headles-browser">View the Fork</a>
</p>

<p align="center">
  <a href="https://github.com/mmirman/chat.dev.marketing-headles-browser/blob/main/LICENSE">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="media/dark_license.svg" />
      <img alt="MIT License" src="media/light_license.svg" />
    </picture>
  </a>
</p>

<div align="center" style="display: flex; align-items: center; justify-content: center; gap: 4px; margin-bottom: 0;">
  <b>A fork of Browserbase Stagehand</b>
</div>

## What is MarketingHand?

MarketingHand is a fork of Browserbase Stagehand: a browser automation framework used to control web browsers with natural language and code. By combining the power of AI with the precision of code, MarketingHand makes web automation flexible, maintainable, and actually reliable.

## Why MarketingHand?

Most existing browser automation tools either require you to write low-level code in a framework like Selenium, Playwright, or Puppeteer, or use high-level agents that can be unpredictable in production. By letting developers choose what to write in code vs. natural language (and bridging the gap between the two) MarketingHand is the natural choice for browser automations in production.

1. **Choose when to write code vs. natural language**: use AI when you want to navigate unfamiliar pages, and use code when you know exactly what you want to do.

2. **Go from AI-driven to repeatable workflows**: MarketingHand lets you preview AI actions before running them, and also helps you easily cache repeatable actions to save time and tokens.

3. **Write once, run forever**: MarketingHand's auto-caching combined with self-healing remembers previous actions, runs without LLM inference, and knows when to involve AI whenever the website changes and your automation breaks.

## Getting Started

Start with MarketingHand from this fork:

```bash
git clone https://github.com/mmirman/chat.dev.marketing-headles-browser.git
cd chat.dev.marketing-headles-browser
pnpm install
```

## Example

Here's how to build a sample browser automation with MarketingHand:

```typescript
// MarketingHand's CDP engine provides an optimized, low level interface to the browser built for automation
const page = marketingHand.context.pages()[0];
await page.goto("https://github.com/mmirman/chat.dev.marketing-headles-browser");

// Use act() to execute individual actions
await marketingHand.act("click on the MarketingHand repo");

// Use agent() for multi-step tasks
const agent = marketingHand.agent();
await agent.execute("Get to the latest PR");

// Use extract() to get structured data from the page
const { author, title } = await marketingHand.extract(
  "extract the author and title of the PR",
  z.object({
    author: z.string().describe("The username of the PR author"),
    title: z.string().describe("The title of the PR"),
  }),
);
```

## Pre-render JavaScript Injection

This fork adds a constructor-level `initScripts` option for agent instrumentation
that must be present before the target page runs its own JavaScript:

```typescript
const marketingHand = new Stagehand({
  env: "LOCAL",
  initScripts: [
    { path: "./preload.js" },
    {
      script: (arg: { marker: string }) => {
        window.__agentMarker = arg.marker;
      },
      arg: { marker: "ready" },
    },
  ],
});

await marketingHand.init();
const page = await marketingHand.context.awaitActivePage();
await page.goto("https://example.com");
```

Scripts are registered on the browser context during `init()`, before control is
returned to user code. They run before page scripts on navigations and newly
created pages.

## Documentation

Use this fork's README and source for MarketingHand-specific behavior. MarketingHand keeps the Stagehand API surface where the package has not been renamed.


### Build and Run from Source

```bash
git clone https://github.com/mmirman/chat.dev.marketing-headles-browser.git
cd chat.dev.marketing-headles-browser
pnpm install
pnpm run build
pnpm run example # run the blank script at ./examples/example.ts
```

MarketingHand is best when you have an API key for an LLM provider and Browserbase credentials. To add these to your project, run:

```bash
cp .env.example .env
nano .env # Edit the .env file to add API keys
```

### Installing from a branch

You can install and build MarketingHand directly from a github branch using [gitpkg](https://github.com/EqualMa/gitpkg)

In your project's `package.json` set:
```json
"@browserbasehq/stagehand": "https://gitpkg.now.sh/mmirman/chat.dev.marketing-headles-browser/packages/core?<branchName>",
```


## Contributing

> [!NOTE]
> MarketingHand is a fork of Browserbase Stagehand.

At a high level, MarketingHand keeps the Stagehand foundation while carrying fork-specific browser automation changes in this repository.

## Acknowledgements

We'd like to thank the following people for their major contributions to Stagehand:
- [Paul Klein](https://github.com/pkiv)
- [Sean McGuire](https://github.com/seanmcguire12)
- [Miguel Gonzalez](https://github.com/miguelg719)
- [Sameel Arif](https://github.com/sameelarif)
- [Thomas Katwan](https://github.com/tkattkat)
- [Filip Michalsky](https://github.com/filip-michalsky)
- [Anirudh Kamath](https://github.com/kamath)
- [Jeremy Press](https://x.com/jeremypress)
- [Navid Pour](https://github.com/navidpour)

## License

Licensed under the MIT License.

Copyright 2025 Browserbase, Inc.

MarketingHand is a fork of Browserbase Stagehand.
