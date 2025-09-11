import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  /* change to ul, li */
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    moveInstrumentation(row, li);
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) div.className = 'cards-card-image';
      else {
        div.className = 'cards-card-body';
        // Convert links to buttons with Sky.com styling
        const links = div.querySelectorAll('a');
        if (links.length > 0) {
          // Group buttons together in a container
          const buttonGroup = document.createElement('div');
          buttonGroup.className = 'button-group';
          
          links.forEach((link, index) => {
            link.classList.add('button');
            if (index === 0) {
              link.classList.add('primary');
            } else {
              link.classList.add('secondary');
            }
            buttonGroup.appendChild(link);
          });
          
          // Add button group to the card body
          div.appendChild(buttonGroup);
        }
      }
    });
    ul.append(li);
  });
  ul.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
  block.textContent = '';
  block.append(ul);
}
