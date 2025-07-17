import { top_bar } from "./bar.js"

/**
 * @param {{ body: string, title : string }} data
 * @param {{ top_bar?: true | string }} options
 * @returns {string}
 */
export function template_html5(data, options = {}) {
    return `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="/index.css">
    <link rel="stylesheet" href="/github-markdown-css/github-markdown.css">
    <title>${data.title}</title>
</head>
<body>
<div>${options.top_bar == true ? top_bar() : (top_bar ?? '')}</div>
<article class="markdown-body">
${data.body}
</article>
</body>
</html>`
}

export function get_title(h5) {
    let it = h5.match(/\<h1\>([^<]*)\<\/h1\>/i)[0]
    return it ? it.slice(4, -5).trim() : null
}
