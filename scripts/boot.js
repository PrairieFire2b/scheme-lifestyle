import { Scheme, repr } from './reflect.js'

async function load() {
    return await Scheme.load_main('/scripts/hoot-eval.wasm', {
    user_imports: {},
    reflect_wasm_dir: "/scripts"
    })
}

let [hoot_eval_proc, environment] = await load()

window.eval_scheme_code = (s) => {
    return hoot_eval_proc.call(s)
}

window.repr = repr

/**
 * @param {HTMLElement} elem 
 */
function click_to_eval(elem) {
    let result = eval_scheme_code('(begin ' + elem.previousElementSibling.textContent + ')')
    if(elem.parentElement.nextElementSibling?.classList.contains('eval-result')) {
        elem.parentElement.nextElementSibling.textContent = result
    } else {
        elem.parentElement.insertAdjacentHTML("afterend", `<pre class="eval-result">${result}</pre>`)
    }
}

window.click_to_eval = click_to_eval
