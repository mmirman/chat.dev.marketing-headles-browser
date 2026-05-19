import * as net from "net";

const LINKEDIN_HOST_PATTERN = /(^|\.)linkedin\.com$/i;
const LINKEDIN_TEST_HOST_PATTERN = /(^|\.)linkedintest\.com$/i;

export function appendTestToDomain(value: string): string {
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return value;
  }

  const hostname = url.hostname;
  if (!hostname || net.isIP(hostname) !== 0) {
    return value;
  }

  const labels = hostname.split(".");
  const labelIndex = labels.length > 1 ? labels.length - 2 : 0;
  if (labels[labelIndex].endsWith("test")) return value;
  labels[labelIndex] = `${labels[labelIndex]}test`;
  url.hostname = labels.join(".");
  return url.toString();
}

export function shouldApplyLinkedInTestBranding(hostname: string): boolean {
  return (
    LINKEDIN_HOST_PATTERN.test(hostname) ||
    LINKEDIN_TEST_HOST_PATTERN.test(hostname)
  );
}

export function replaceLinkedInBrandText(value: string): string {
  return value.replace(/\bLinkedIn\b/g, "LinkedInTest");
}

export function modifyNavigationUrl(
  value: string,
  appendEveryDomain?: boolean,
): string {
  if (appendEveryDomain) return appendTestToDomain(value);

  try {
    const url = new URL(value);
    if (shouldApplyLinkedInTestBranding(url.hostname)) {
      return appendTestToDomain(value);
    }
  } catch {
    return value;
  }

  return value;
}

export function getLinkedInTestInitScript(): string {
  return `
(() => {
  const shouldApply = (hostname) =>
    /(^|\\.)linkedin\\.com$/i.test(hostname) ||
    /(^|\\.)linkedintest\\.com$/i.test(hostname);

  if (!shouldApply(window.location.hostname)) return;

  const replaceBrand = (value) =>
    typeof value === "string" ? value.replace(/\\bLinkedIn\\b/g, "LinkedInTest") : value;

  const replaceTextNode = (node) => {
    const next = replaceBrand(node.nodeValue || "");
    if (next !== node.nodeValue) node.nodeValue = next;
  };

  const replaceAttributes = (element) => {
    for (const attr of ["alt", "aria-label", "placeholder", "title", "value"]) {
      if (!element.hasAttribute?.(attr)) continue;
      const current = element.getAttribute(attr);
      const next = replaceBrand(current);
      if (next !== current) element.setAttribute(attr, next);
    }
  };

  const walk = (root) => {
    if (root.nodeType === Node.TEXT_NODE) {
      replaceTextNode(root);
      return;
    }

    if (root.nodeType !== Node.ELEMENT_NODE && root.nodeType !== Node.DOCUMENT_NODE) {
      return;
    }

    if (root.nodeType === Node.ELEMENT_NODE) replaceAttributes(root);

    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    for (let node = walker.nextNode(); node; node = walker.nextNode()) {
      replaceTextNode(node);
    }

    if (root.querySelectorAll) {
      for (const element of root.querySelectorAll("[alt], [aria-label], [placeholder], [title], [value]")) {
        replaceAttributes(element);
      }
    }
  };

  const apply = () => {
    document.title = replaceBrand(document.title);
    walk(document.documentElement || document);
  };

  apply();

  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) walk(node);
      if (mutation.type === "characterData") replaceTextNode(mutation.target);
      if (mutation.type === "attributes") replaceAttributes(mutation.target);
    }
    document.title = replaceBrand(document.title);
  }).observe(document.documentElement || document, {
    subtree: true,
    childList: true,
    characterData: true,
    attributes: true,
    attributeFilter: ["alt", "aria-label", "placeholder", "title", "value"],
  });
})();
`;
}
