/*
 * Copyright 2024 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */
/* global WebImporter */
/* eslint-disable no-console */
import columns5Parser from './parsers/columns5.js';
import cards9Parser from './parsers/cards9.js';
import cards7Parser from './parsers/cards7.js';
import hero2Parser from './parsers/hero2.js';
import columns13Parser from './parsers/columns13.js';
import hero10Parser from './parsers/hero10.js';
import columns12Parser from './parsers/columns12.js';
import hero8Parser from './parsers/hero8.js';
import hero11Parser from './parsers/hero11.js';
import accordion15Parser from './parsers/accordion15.js';
import columns16Parser from './parsers/columns16.js';
import cards18Parser from './parsers/cards18.js';
import hero21Parser from './parsers/hero21.js';
import hero19Parser from './parsers/hero19.js';
import hero25Parser from './parsers/hero25.js';
import columns26Parser from './parsers/columns26.js';
import columns3Parser from './parsers/columns3.js';
import accordion24Parser from './parsers/accordion24.js';
import cards28Parser from './parsers/cards28.js';
import cards27Parser from './parsers/cards27.js';
import hero6Parser from './parsers/hero6.js';
import hero30Parser from './parsers/hero30.js';
import cards29Parser from './parsers/cards29.js';
import cards33Parser from './parsers/cards33.js';
import columns32Parser from './parsers/columns32.js';
import accordion36Parser from './parsers/accordion36.js';
import carousel35Parser from './parsers/carousel35.js';
import accordion37Parser from './parsers/accordion37.js';
import hero38Parser from './parsers/hero38.js';
import columns41Parser from './parsers/columns41.js';
import embedVideo39Parser from './parsers/embedVideo39.js';
import hero40Parser from './parsers/hero40.js';
import columns42Parser from './parsers/columns42.js';
import hero44Parser from './parsers/hero44.js';
import hero45Parser from './parsers/hero45.js';
import hero47Parser from './parsers/hero47.js';
import cards43Parser from './parsers/cards43.js';
import accordion49Parser from './parsers/accordion49.js';
import columns31Parser from './parsers/columns31.js';
import cards51Parser from './parsers/cards51.js';
import columns50Parser from './parsers/columns50.js';
import cards52Parser from './parsers/cards52.js';
import hero53Parser from './parsers/hero53.js';
import embedVideo54Parser from './parsers/embedVideo54.js';
import columns55Parser from './parsers/columns55.js';
import columns56Parser from './parsers/columns56.js';
import cards1Parser from './parsers/cards1.js';
import hero58Parser from './parsers/hero58.js';
import columns34Parser from './parsers/columns34.js';
import cards57Parser from './parsers/cards57.js';
import cardsNoImages59Parser from './parsers/cardsNoImages59.js';
import accordion63Parser from './parsers/accordion63.js';
import columns62Parser from './parsers/columns62.js';
import carousel64Parser from './parsers/carousel64.js';
import columns65Parser from './parsers/columns65.js';
import columns17Parser from './parsers/columns17.js';
import columns22Parser from './parsers/columns22.js';
import hero66Parser from './parsers/hero66.js';
import columns14Parser from './parsers/columns14.js';
import cards46Parser from './parsers/cards46.js';
import hero4Parser from './parsers/hero4.js';
import cards60Parser from './parsers/cards60.js';
import cards67Parser from './parsers/cards67.js';
import columns48Parser from './parsers/columns48.js';
import headerParser from './parsers/header.js';
import metadataParser from './parsers/metadata.js';
import cleanupTransformer from './transformers/cleanup.js';
import imageTransformer from './transformers/images.js';
import linkTransformer from './transformers/links.js';
import sectionsTransformer from './transformers/sections.js';
import { TransformHook } from './transformers/transform.js';
import { customParsers, customTransformers, customElements } from './import.custom.js';
import {
  generateDocumentPath,
  handleOnLoad,
  mergeInventory,
} from './import.utils.js';

const parsers = {
  metadata: metadataParser,
  columns5: columns5Parser,
  cards9: cards9Parser,
  cards7: cards7Parser,
  hero2: hero2Parser,
  columns13: columns13Parser,
  hero10: hero10Parser,
  columns12: columns12Parser,
  hero8: hero8Parser,
  hero11: hero11Parser,
  accordion15: accordion15Parser,
  columns16: columns16Parser,
  cards18: cards18Parser,
  hero21: hero21Parser,
  hero19: hero19Parser,
  hero25: hero25Parser,
  columns26: columns26Parser,
  columns3: columns3Parser,
  accordion24: accordion24Parser,
  cards28: cards28Parser,
  cards27: cards27Parser,
  hero6: hero6Parser,
  hero30: hero30Parser,
  cards29: cards29Parser,
  cards33: cards33Parser,
  columns32: columns32Parser,
  accordion36: accordion36Parser,
  carousel35: carousel35Parser,
  accordion37: accordion37Parser,
  hero38: hero38Parser,
  columns41: columns41Parser,
  embedVideo39: embedVideo39Parser,
  hero40: hero40Parser,
  columns42: columns42Parser,
  hero44: hero44Parser,
  hero45: hero45Parser,
  hero47: hero47Parser,
  cards43: cards43Parser,
  accordion49: accordion49Parser,
  columns31: columns31Parser,
  cards51: cards51Parser,
  columns50: columns50Parser,
  cards52: cards52Parser,
  hero53: hero53Parser,
  embedVideo54: embedVideo54Parser,
  columns55: columns55Parser,
  columns56: columns56Parser,
  cards1: cards1Parser,
  hero58: hero58Parser,
  columns34: columns34Parser,
  cards57: cards57Parser,
  cardsNoImages59: cardsNoImages59Parser,
  accordion63: accordion63Parser,
  columns62: columns62Parser,
  carousel64: carousel64Parser,
  columns65: columns65Parser,
  columns17: columns17Parser,
  columns22: columns22Parser,
  hero66: hero66Parser,
  columns14: columns14Parser,
  cards46: cards46Parser,
  hero4: hero4Parser,
  cards60: cards60Parser,
  cards67: cards67Parser,
  columns48: columns48Parser,
  ...customParsers,
};

const transformers = {
  cleanup: cleanupTransformer,
  images: imageTransformer,
  links: linkTransformer,
  sections: sectionsTransformer,
  ...customTransformers,
};

// Additional page elements to parse that are not included in the inventory
const pageElements = [{ name: 'metadata' }, ...customElements];

WebImporter.Import = {
  findSiteUrl: (instance, siteUrls) => (
    siteUrls.find(({ id }) => id === instance.urlHash)
  ),
  transform: (hookName, element, payload) => {
    // perform any additional transformations to the page
    Object.values(transformers).forEach((transformerFn) => (
      transformerFn.call(this, hookName, element, payload)
    ));
  },
  getParserName: ({ name, key }) => key || name,
  getElementByXPath: (document, xpath) => {
    const result = document.evaluate(
      xpath,
      document,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null,
    );
    return result.singleNodeValue;
  },
  getFragmentXPaths: (
    { urls = [], fragments = [] },
    sourceUrl = '',
  ) => (fragments.flatMap(({ instances = [] }) => instances)
    .filter((instance) => {
      // find url in urls array
      const siteUrl = WebImporter.Import.findSiteUrl(instance, urls);
      if (!siteUrl) {
        return false;
      }
      return siteUrl.url === sourceUrl;
    })
    .map(({ xpath }) => xpath)),
};

/**
* Page transformation function
*/
function transformPage(main, { inventory, ...source }) {
  const { urls = [], blocks: inventoryBlocks = [] } = inventory;
  const { document, params: { originalURL } } = source;

  // get fragment elements from the current page
  const fragmentElements = WebImporter.Import.getFragmentXPaths(inventory, originalURL)
    .map((xpath) => WebImporter.Import.getElementByXPath(document, xpath))
    .filter((el) => el);

  // get dom elements for each block on the current page
  const blockElements = inventoryBlocks
    .flatMap((block) => block.instances
      .filter((instance) => WebImporter.Import.findSiteUrl(instance, urls)?.url === originalURL)
      .map((instance) => ({
        ...block,
        uuid: instance.uuid,
        section: instance.section,
        element: WebImporter.Import.getElementByXPath(document, instance.xpath),
      })))
    .filter((block) => block.element);

  const defaultContentElements = inventory.outliers
    .filter((instance) => WebImporter.Import.findSiteUrl(instance, urls)?.url === originalURL)
    .map((instance) => ({
      ...instance,
      element: WebImporter.Import.getElementByXPath(document, instance.xpath),
    }));

  // remove fragment elements from the current page
  fragmentElements.forEach((element) => {
    if (element) {
      element.remove();
    }
  });

  // before page transform hook
  WebImporter.Import.transform(TransformHook.beforePageTransform, main, { ...source });

  // transform all elements using parsers
  [...defaultContentElements, ...blockElements, ...pageElements]
    // sort elements by order in the page
    .sort((a, b) => (a.uuid ? parseInt(a.uuid.split('-')[1], 10) - parseInt(b.uuid.split('-')[1], 10) : 999))
    // filter out fragment elements
    .filter((item) => !fragmentElements.includes(item.element))
    .forEach((item, idx, arr) => {
      const { element = main, ...pageBlock } = item;
      const parserName = WebImporter.Import.getParserName(pageBlock);
      const parserFn = parsers[parserName];
      try {
        let parserElement = element;
        if (typeof parserElement === 'string') {
          parserElement = main.querySelector(parserElement);
        }
        // before parse hook
        WebImporter.Import.transform(
          TransformHook.beforeParse,
          parserElement,
          {
            ...source,
            ...pageBlock,
            nextEl: arr[idx + 1],
          },
        );
        // parse the element
        if (parserFn) {
          parserFn.call(this, parserElement, { ...source });
        }
        // after parse hook
        WebImporter.Import.transform(
          TransformHook.afterParse,
          parserElement,
          {
            ...source,
            ...pageBlock,
          },
        );
      } catch (e) {
        console.warn(`Failed to parse block: ${parserName}`, e);
      }
    });
}

/**
* Fragment transformation function
*/
function transformFragment(main, { fragment, inventory, ...source }) {
  const { document, params: { originalURL } } = source;

  if (fragment.name === 'nav') {
    const navEl = document.createElement('div');

    // get number of blocks in the nav fragment
    const navBlocks = Math.floor(fragment.instances.length / fragment.instances.filter((ins) => ins.uuid.includes('-00-')).length);
    console.log('navBlocks', navBlocks);

    for (let i = 0; i < navBlocks; i += 1) {
      const { xpath } = fragment.instances[i];
      const el = WebImporter.Import.getElementByXPath(document, xpath);
      if (!el) {
        console.warn(`Failed to get element for xpath: ${xpath}`);
      } else {
        navEl.append(el);
      }
    }

    // body width
    const bodyWidthAttr = document.body.getAttribute('data-hlx-imp-body-width');
    const bodyWidth = bodyWidthAttr ? parseInt(bodyWidthAttr, 10) : 1000;

    try {
      const headerBlock = headerParser(navEl, {
        ...source, document, fragment, bodyWidth,
      });
      main.append(headerBlock);
    } catch (e) {
      console.warn('Failed to parse header block', e);
    }
  } else {
    (fragment.instances || [])
      .filter((instance) => {
        const siteUrl = WebImporter.Import.findSiteUrl(instance, inventory.urls);
        if (!siteUrl) {
          return false;
        }
        return `${siteUrl.url}#${fragment.name}` === originalURL;
      })
      .map(({ xpath }) => ({
        xpath,
        element: WebImporter.Import.getElementByXPath(document, xpath),
      }))
      .filter(({ element }) => element)
      .forEach(({ xpath, element }) => {
        main.append(element);

        const fragmentBlock = inventory.blocks
          .find(({ instances }) => instances.find((instance) => {
            const siteUrl = WebImporter.Import.findSiteUrl(instance, inventory.urls);
            return `${siteUrl.url}#${fragment.name}` === originalURL && instance.xpath === xpath;
          }));

        if (!fragmentBlock) return;
        const parserName = WebImporter.Import.getParserName(fragmentBlock);
        const parserFn = parsers[parserName];
        if (!parserFn) return;
        try {
          parserFn.call(this, element, source);
        } catch (e) {
          console.warn(`Failed to parse block: ${fragmentBlock.key}, with xpath: ${xpath}`, e);
        }
      });
  }
}

export default {
  onLoad: async (payload) => {
    await handleOnLoad(payload);
  },

  transform: async (source) => {
    const { document, params: { originalURL } } = source;

    /* eslint-disable-next-line prefer-const */
    let publishUrl = window.location.origin;
    // $$publishUrl = '{{{publishUrl}}}';

    let inventory = null;
    // $$inventory = {{{inventory}}};
    if (!inventory) {
      const siteUrlsUrl = new URL('/tools/importer/site-urls.json', publishUrl);
      const inventoryUrl = new URL('/tools/importer/inventory.json', publishUrl);
      try {
        // fetch and merge site-urls and inventory
        const siteUrlsResp = await fetch(siteUrlsUrl.href);
        const inventoryResp = await fetch(inventoryUrl.href);
        const siteUrls = await siteUrlsResp.json();
        inventory = await inventoryResp.json();
        inventory = mergeInventory(siteUrls, inventory, publishUrl);
      } catch (e) {
        console.error('Failed to merge site-urls and inventory');
      }
      if (!inventory) {
        return [];
      }
    }

    let main = document.body;

    // before transform hook
    WebImporter.Import.transform(TransformHook.beforeTransform, main, { ...source, inventory });

    // perform the transformation
    let path = null;
    const sourceUrl = new URL(originalURL);
    const fragName = sourceUrl.hash ? sourceUrl.hash.substring(1) : '';
    if (fragName) {
      // fragment transformation
      const fragment = inventory.fragments.find(({ name }) => name === fragName);
      if (!fragment) {
        return [];
      }
      main = document.createElement('div');
      transformFragment(main, { ...source, fragment, inventory });
      path = fragment.path;
    } else {
      // page transformation
      transformPage(main, { ...source, inventory });
      path = generateDocumentPath(source, inventory);
    }

    // after transform hook
    WebImporter.Import.transform(TransformHook.afterTransform, main, { ...source, inventory });

    return [{
      element: main,
      path,
    }];
  },
};
