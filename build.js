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

let metadata = {}

/**
 * @this {CompileContext}
 * @type {Handle}
 * @note Sequential execution: it must be evaluated after the for loop after
 */
function contents(d) {

  this.tag('<ul')
  this.tag('>')
  for (const [i, link] of links.entries()) {
    this.tag('<li>');
    this.tag(`<a href="${link}">${metadata[index[i]].title}</a>`);
    this.tag('</li>');
  }
  this.tag('</ul>')
}

let extensions = { extensions: [gfm(), directive(), frontmatter()], htmlExtensions: [gfmHtml(), directiveHtml({contents}), frontmatterHtml()]}

for (let content of index) {
    let html = micromark(await fs.readFile(`index/${content}`), extensions)
    // TODO: proper title (metadata)
    let first_h1 = html.match(/\<h1\>([^<]*)\<\/h1\>/i)[0]
    let title = first_h1 ? first_h1.slice(4, -5).trim() : content.slice(0, -3)
    metadata[index] = { title };
    await fs.writeFile(`dist/index/${content.slice(0, -3)}.html`, template_h5.replace('{body}', html).replace('{title}', title))
}

/**
 * NOTE: @see {contents}
 */
await fs.writeFile('dist/index.html', template_h5.replace('{body}', micromark(homepage, extensions), {
  'flag': 'w+'
}).replace('{title}', 'Scheme Lifestyle'))
