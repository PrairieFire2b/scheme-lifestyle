/**
 * @import {Handle} from 'micromark-extension-directive'
 * @import {CompileContext} from 'micromark-util-types'
 */
import fs from 'node:fs/promises'
import { micromark } from 'micromark'
import { gfm, gfmHtml } from 'micromark-extension-gfm'
import { directive, directiveHtml } from 'micromark-extension-directive'
import { frontmatter, frontmatterHtml } from 'micromark-extension-frontmatter';
import { get_title, template_html5 } from './tools/html.js';

const homepage = await fs.readFile('src/index.md')

await fs.rm('dist', { recursive: true, force: true })

await fs.mkdir('dist')

await fs.mkdir('dist/index')

await fs.cp('node_modules/github-markdown-css', 'dist/github-markdown-css')

const index = await fs.readdir('index')

const links = index.filter(value => value.endsWith('.md')).map(value => `/index/${value.slice(0, -3)}.html`)

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

let extensions = { extensions: [gfm(), directive(), frontmatter()], htmlExtensions: [gfmHtml(), directiveHtml({ contents }), frontmatterHtml()] }

for (let content of index) {
  let html = micromark(await fs.readFile(`index/${content}`), extensions)
  // TODO: proper metadata
  let title = get_title(html) ?? content.slice(0, -3)
  metadata[index] = { title };
  await fs.writeFile(`dist/index/${content.slice(0, -3)}.html`, template_html5({ body: html, title }, { top_bar: true }))
}

/**
 * NOTE: @see {contents}
 */
await fs.writeFile('dist/index.html', template_html5({ body: micromark(homepage, extensions), title: 'Scheme Lifestyle' }, { top_bar: true }))

for (let file of (await fs.readdir('src'))) {
  if (file == 'index.md') continue;
  if (file.endsWith('.css'))  await fs.copyFile(`src/${file}`, `dist/${file}`)
  if (file.endsWith('.md')) {
    let html = micromark(await fs.readFile(`src/${file}`), extensions)
    let title = get_title(html) ?? file.slice(0, -3)
    await fs.writeFile(`dist/${file.slice(0, -3)}.html`, template_html5({ body: html, title }, { top_bar: true }))
  }
}
