/**
 * @import {Handle} from 'micromark-extension-directive'
 * @import {CompileContext} from 'micromark-util-types'
 */

let hoot_enabled = false;

/**
 * @this {CompileContext}
 * @type {Handle}
 */
export function enable_hoot(d) {
    if (hoot_enabled) return;
    this.tag(`<script type="module" src="/scripts/boot.js"></script>`)
    hoot_enabled = true;
}

/**
 * @this {CompileContext}
 * @type {Handle}
 */
export function hoot_eval(d) {
    if (!hoot_enabled) throw Error("Guile Hoot was not enabled.")
    if (d.type != 'containerDirective') return;
    this.tag(`<div class="hoot-eval">`)
    let onclick = "click_to_eval(this)"
    this.tag(`${d.content}`.replace('</pre>', `<button class="eval-scheme-code" onclick="${onclick}">求值</button>`))
    this.tag(`</div>`)
}
