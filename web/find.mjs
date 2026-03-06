import fs from 'fs';
import { parse } from 'node-html-parser';

try {
    const html = fs.readFileSync('ml_dump.html', 'utf8');
    const root = parse(html);
    const scriptNode = root.querySelector('#__NORDIC_RENDERING_CTX__');

    if (!scriptNode) {
        console.log('No script node found');
        process.exit(1);
    }

    const scriptText = scriptNode.textContent;
    const func = new Function("var _n={ctx:{}}; " + scriptText + " return _n.ctx.r;");
    const obj = func();

    function findPoly(o, path, depth = 0) {
        if (depth > 12) return;
        if (!o) return;
        if (Array.isArray(o)) {
            if (o.length > 0 && o[0] && o[0].id === 'POLYCARD') {
                console.log('✅ FOUND POLYCARD AT:', path);
            } else {
                for (let i = 0; i < Math.min(o.length, 3); i++) {
                    findPoly(o[i], path + '[' + i + ']', depth + 1);
                }
            }
        } else if (typeof o === 'object') {
            for (const k of Object.keys(o)) {
                findPoly(o[k], path + '.' + k, depth + 1);
            }
        }
    }

    findPoly(obj, 'root');
} catch (e) {
    console.log('Error:', e.message);
}
