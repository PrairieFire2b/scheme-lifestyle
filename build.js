/**
 * @import {Handle} from 'micromark-extension-directive'
 * @import {CompileContext} from 'micromark-util-types'
 */
import fs from 'node:fs/promises'
import { micromark } from 'micromark'
import { gfm, gfmHtml } from 'micromark-extension-gfm'
import { directive, directiveHtml } from 'micromark-extension-directive'
import { frontmatter, frontmatterHtml } from 'micromark-extension-frontmatter';
import { template_h5 } from './tools/html.js';

const homepage = await fs.readFile('src/index.md')

await fs.rm('dist', { recursive: true, force: true })

await fs.mkdir('dist')

await fs.mkdir('dist/index')

const index = await fs.readdir('index')

const links = index.map(value => `/index/${value.slice(0, -3)}.html`)

/**
 * @this {CompileContext}
 * @type {Handle}
 * @returns {false | undefined}
 */
function contents(d) {

  this.tag('<ul')
  this.tag('>')
  while(!links);
  for (const [i, link] of links.entries()) {
    this.tag('<li>');
    this.tag(`<a href="${link}">${index[i]}</a>`);
    this.tag('</li>');
  }
  this.tag('</ul>')
}

let extensions = { extensions: [gfm(), directive(), frontmatter()], htmlExtensions: [gfmHtml(), directiveHtml({contents}), frontmatterHtml()]}

await fs.writeFile('dist/index.html', template_h5.replace('{body}', micromark(homepage, extensions), {
    'flag': 'w+'
}).replace('{title}', 'Scheme Lifestyle'))

for (let content of index) {
    let html = micromark(await fs.readFile(`index/${content}`), extensions)
    // TODO: proper title (metadata)
    await fs.writeFile(`dist/index/${content.slice(0, -3)}.html`, template_h5.replace('{body}', html).replace('{title}', content.slice(0, -3)))
}
