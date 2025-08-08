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
import hero1Parser from './parsers/hero1.js';
import hero8Parser from './parsers/hero8.js';
import cards4Parser from './parsers/cards4.js';
import hero6Parser from './parsers/hero6.js';
import columns5Parser from './parsers/columns5.js';
import cards10Parser from './parsers/cards10.js';
import cards17Parser from './parsers/cards17.js';
import cardsNoImages18Parser from './parsers/cardsNoImages18.js';
import columns16Parser from './parsers/columns16.js';
import accordion19Parser from './parsers/accordion19.js';
import hero9Parser from './parsers/hero9.js';
import columns7Parser from './parsers/columns7.js';
import hero22Parser from './parsers/hero22.js';
import hero20Parser from './parsers/hero20.js';
import hero11Parser from './parsers/hero11.js';
import hero24Parser from './parsers/hero24.js';
import embedVideo23Parser from './parsers/embedVideo23.js';
import hero28Parser from './parsers/hero28.js';
import columns26Parser from './parsers/columns26.js';
import hero12Parser from './parsers/hero12.js';
import hero31Parser from './parsers/hero31.js';
import cards27Parser from './parsers/cards27.js';
import accordion30Parser from './parsers/accordion30.js';
import hero15Parser from './parsers/hero15.js';
import accordion33Parser from './parsers/accordion33.js';
import hero25Parser from './parsers/hero25.js';
import columns35Parser from './parsers/columns35.js';
import hero37Parser from './parsers/hero37.js';
import accordion36Parser from './parsers/accordion36.js';
import carousel34Parser from './parsers/carousel34.js';
import hero42Parser from './parsers/hero42.js';
import hero44Parser from './parsers/hero44.js';
import columns43Parser from './parsers/columns43.js';
import hero45Parser from './parsers/hero45.js';
import cards48Parser from './parsers/cards48.js';
import cards49Parser from './parsers/cards49.js';
import accordion50Parser from './parsers/accordion50.js';
import columns41Parser from './parsers/columns41.js';
import hero51Parser from './parsers/hero51.js';
import hero52Parser from './parsers/hero52.js';
import hero54Parser from './parsers/hero54.js';
import columns53Parser from './parsers/columns53.js';
import hero55Parser from './parsers/hero55.js';
import columns56Parser from './parsers/columns56.js';
import cardsNoImages57Parser from './parsers/cardsNoImages57.js';
import cards59Parser from './parsers/cards59.js';
import columns60Parser from './parsers/columns60.js';
import accordion61Parser from './parsers/accordion61.js';
import columns29Parser from './parsers/columns29.js';
import columns46Parser from './parsers/columns46.js';
import columns38Parser from './parsers/columns38.js';
import carousel32Parser from './parsers/carousel32.js';
import columns63Parser from './parsers/columns63.js';
import cards40Parser from './parsers/cards40.js';
import carousel62Parser from './parsers/carousel62.js';
import cards2Parser from './parsers/cards2.js';
import columns58Parser from './parsers/columns58.js';
import cards14Parser from './parsers/cards14.js';
import cards64Parser from './parsers/cards64.js';
import columns13Parser from './parsers/columns13.js';
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
  hero1: hero1Parser,
  hero8: hero8Parser,
  cards4: cards4Parser,
  hero6: hero6Parser,
  columns5: columns5Parser,
  cards10: cards10Parser,
  cards17: cards17Parser,
  cardsNoImages18: cardsNoImages18Parser,
  columns16: columns16Parser,
  accordion19: accordion19Parser,
  hero9: hero9Parser,
  columns7: columns7Parser,
  hero22: hero22Parser,
  hero20: hero20Parser,
  hero11: hero11Parser,
  hero24: hero24Parser,
  embedVideo23: embedVideo23Parser,
  hero28: hero28Parser,
  columns26: columns26Parser,
  hero12: hero12Parser,
  hero31: hero31Parser,
  cards27: cards27Parser,
  accordion30: accordion30Parser,
  hero15: hero15Parser,
  accordion33: accordion33Parser,
  hero25: hero25Parser,
  columns35: columns35Parser,
  hero37: hero37Parser,
  accordion36: accordion36Parser,
  carousel34: carousel34Parser,
  hero42: hero42Parser,
  hero44: hero44Parser,
  columns43: columns43Parser,
  hero45: hero45Parser,
  cards48: cards48Parser,
  cards49: cards49Parser,
  accordion50: accordion50Parser,
  columns41: columns41Parser,
  hero51: hero51Parser,
  hero52: hero52Parser,
  hero54: hero54Parser,
  columns53: columns53Parser,
  hero55: hero55Parser,
  columns56: columns56Parser,
  cardsNoImages57: cardsNoImages57Parser,
  cards59: cards59Parser,
  columns60: columns60Parser,
  accordion61: accordion61Parser,
  columns29: columns29Parser,
  columns46: columns46Parser,
  columns38: columns38Parser,
  carousel32: carousel32Parser,
  columns63: columns63Parser,
  cards40: cards40Parser,
  carousel62: carousel62Parser,
  cards2: cards2Parser,
  columns58: columns58Parser,
  cards14: cards14Parser,
  cards64: cards64Parser,
  columns13: columns13Parser,
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
