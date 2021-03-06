"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.replace = exports.includes = exports.escapeHTML = exports.getBoolean = exports.rand = exports.getObjectURLList = exports.revokeObjectURL = exports.createObjectURL = exports.getMimeByPath = exports.stylePrepend = exports.layoutClassPrepend = exports.layoutInsertAttr = exports.layoutAddTagClassAndReTagName = exports.styleUrl2ObjectOrDataUrl = exports.isAppPkg = exports.isControlPkg = exports.purify = exports.sleep = exports.clone = exports.blob2Text = exports.blob2ArrayBuffer = exports.file2ObjectUrl = exports.blob2DataUrl = void 0;
function blob2DataUrl(blob) {
    return new Promise(function (resove) {
        let fr = new FileReader();
        fr.addEventListener('load', function (e) {
            if (e.target) {
                resove(e.target.result);
            }
            else {
                resove('');
            }
        });
        fr.readAsDataURL(blob);
    });
}
exports.blob2DataUrl = blob2DataUrl;
function file2ObjectUrl(file, obj) {
    let ourl = obj.objectURLs[file];
    if (!ourl) {
        if (!obj.files[file]) {
            return null;
        }
        if (typeof obj.files[file] === 'string') {
            return null;
        }
        ourl = createObjectURL(obj.files[file]);
        obj.objectURLs[file] = ourl;
    }
    return ourl;
}
exports.file2ObjectUrl = file2ObjectUrl;
function blob2ArrayBuffer(blob) {
    return new Promise(function (resove) {
        let fr = new FileReader();
        fr.addEventListener('load', function () {
            resove(fr.result);
        });
        fr.readAsArrayBuffer(blob);
    });
}
exports.blob2ArrayBuffer = blob2ArrayBuffer;
function blob2Text(blob) {
    return new Promise(function (resove) {
        let fr = new FileReader();
        fr.addEventListener('load', function (e) {
            if (e.target) {
                resove(e.target.result);
            }
            else {
                resove('');
            }
        });
        fr.readAsText(blob);
    });
}
exports.blob2Text = blob2Text;
function clone(obj) {
    let newObj = {};
    if (obj instanceof Array) {
        newObj = [];
        for (let i = 0; i < obj.length; ++i) {
            newObj[i] = typeof obj[i] === 'object' ? clone(obj[i]) : obj[i];
        }
    }
    else {
        for (let key in obj) {
            newObj[key] = typeof obj[key] === 'object' ? clone(obj[key]) : obj[key];
        }
    }
    return newObj;
}
exports.clone = clone;
function sleep(ms = 0) {
    return new Promise(function (resolve) {
        setTimeout(function () {
            resolve();
        }, ms);
    });
}
exports.sleep = sleep;
function purify(text) {
    text = '>' + text + '<';
    text = text.replace(/<!--([\s\S]*?)-->/g, '').replace(/>([\s\S]*?)</g, function (t, t1) {
        return '>' + t1.replace(/\t|\r\n| {2}/g, '').replace(/\n|\r/g, '') + '<';
    });
    return text.slice(1, -1);
}
exports.purify = purify;
function isControlPkg(o) {
    if (typeof o !== 'object') {
        return false;
    }
    for (let k in o) {
        return o[k].type === 'control' ? true : false;
    }
    return false;
}
exports.isControlPkg = isControlPkg;
function isAppPkg(o) {
    if (typeof o !== 'object') {
        return false;
    }
    for (let k in o) {
        return o[k].type === 'control' ? true : false;
    }
    return false;
}
exports.isAppPkg = isAppPkg;
function styleUrl2ObjectOrDataUrl(path, style, obj, mode = 'object') {
    return __awaiter(this, void 0, void 0, function* () {
        let reg = /url\(["']{0,1}(.+?)["']{0,1}\)/ig;
        let match = null;
        while ((match = reg.exec(style))) {
            let realPath = loader.urlResolve(path, match[1]);
            if (!obj.files[realPath]) {
                continue;
            }
            if (mode === 'data') {
                if (typeof obj.files[realPath] !== 'string') {
                    style = style.replace(match[0], `url('${yield blob2DataUrl(obj.files[realPath])}')`);
                }
            }
            else {
                style = style.replace(match[0], `url('${file2ObjectUrl(realPath, obj)}')`);
            }
        }
        return style;
    });
}
exports.styleUrl2ObjectOrDataUrl = styleUrl2ObjectOrDataUrl;
function layoutAddTagClassAndReTagName(layout, retagname) {
    let list = [];
    layout = layout.replace(/(\S+)=(".+?"|'.+?')/g, function (t, t1) {
        if (t1 === 'class') {
            return t;
        }
        list.push(t);
        return '"CG-PLACEHOLDER"';
    });
    layout = layout.replace(/<(\/{0,1})([\w-]+)([\s\S]*?>)/g, function (t, t1, t2, t3) {
        if (['template', 'slot', 'teleport'].includes(t2)) {
            return t;
        }
        else {
            if (t1 === '/') {
                return retagname ? ('<' + t1 + 'cg-' + t2 + t3) : t;
            }
            if (t3.toLowerCase().includes(' class')) {
                t3 = t3.replace(/ class=(["']{0,1})/i, ' class=$1tag-' + t2 + ' ');
            }
            else {
                t2 = t2 + ` class="tag-${t2}"`;
            }
            return retagname ? ('<cg-' + t2 + t3) : ('<' + t2 + t3);
        }
    });
    let i = -1;
    return layout.replace(/"CG-PLACEHOLDER"/g, function () {
        return list[++i];
    });
}
exports.layoutAddTagClassAndReTagName = layoutAddTagClassAndReTagName;
function layoutInsertAttr(layout, insert, opt = {}) {
    return layout.replace(/<([\w-]+)[\s\S]*?>/g, function (t, t1) {
        if (opt.ignore) {
            for (let item of opt.ignore) {
                if (item.test(t1)) {
                    return t;
                }
            }
        }
        if (opt.include) {
            let found = false;
            for (let item of opt.include) {
                if (item.test(t1)) {
                    found = true;
                    break;
                }
            }
            if (!found) {
                return t;
            }
        }
        return t.replace(/<[\w-]+/, function (t) {
            return t + ' ' + insert;
        });
    });
}
exports.layoutInsertAttr = layoutInsertAttr;
function layoutClassPrependObject(object) {
    object = object.slice(1, -1).trim();
    return '{' + object.replace(/(.+?):(.+?)(,|$)/g, function (t, t1, t2, t3) {
        t1 = t1.trim();
        if (t1[0] === '[') {
            t1 = '[cgClassPrepend(' + t1.slice(1, -1) + ')]';
        }
        else {
            let sp = '';
            if (t1[0] === '\'' || t1[0] === '"') {
                sp = t1[0];
                t1 = t1.slice(1, -1);
            }
            t1 = `[cgClassPrepend(${sp}${t1}${sp})]`;
        }
        return t1 + ':' + t2 + t3;
    }) + '}';
}
function layoutClassPrepend(layout, preps) {
    return layout.replace(/ class=["'](.+?)["']/gi, function (t, t1) {
        t1 = t1.trim();
        let classList = t1.split(' ');
        let resultList = [];
        for (let item of classList) {
            for (let prep of preps) {
                resultList.push(prep + item);
            }
        }
        return ` class='${resultList.join(' ')}'`;
    }).replace(/ :class=(["']).+?>/gi, function (t, sp) {
        return t.replace(new RegExp(` :class=${sp}(.+?)${sp}`, 'gi'), function (t, t1) {
            t1 = t1.trim();
            if (t1.startsWith('[')) {
                t1 = t1.slice(1, -1);
                let t1a = t1.split(',');
                for (let i = 0; i < t1a.length; ++i) {
                    t1a[i] = t1a[i].trim();
                    if (t1a[i].startsWith('{')) {
                        t1a[i] = layoutClassPrependObject(t1a[i]);
                    }
                    else {
                        t1a[i] = 'cgClassPrepend(' + t1a[i] + ')';
                    }
                }
                t1 = '[' + t1a.join(',') + ']';
            }
            else {
                t1 = layoutClassPrependObject(t1);
            }
            return ` :class="${t1}"`;
        });
    });
}
exports.layoutClassPrepend = layoutClassPrepend;
function stylePrepend(style, prep = '') {
    if (prep === '') {
        prep = 'cg-scope' + Math.round(Math.random() * 1000000000000000) + '_';
    }
    style = style.replace(/([\s\S]+?){([\s\S]+?)}/g, function (t, t1, t2) {
        t1 = t1.replace(/(^|[ >,\r\n])([a-zA-Z-_])([a-zA-Z0-9-_]*)/g, function (t, t1, t2, t3) {
            return t1 + '.tag-' + t2 + t3;
        });
        t1 = t1.replace(/keyframes \.tag-([a-zA-Z0-9-_]+)/g, function (t, t1) {
            return 'keyframes ' + t1;
        });
        return t1.replace(/([.#])([a-zA-Z0-9-_]+)/g, function (t, t1, t2) {
            if (t2.startsWith('cg-')) {
                return t;
            }
            return t1 + prep + t2;
        }) + '{' + t2 + '}';
    });
    let fontList = [];
    style = style.replace(/(@font-face[\s\S]+?font-family\s*:\s*["']{0,1})(.+?)(["']{0,1}\s*[;\r\n }])/gi, function (t, t1, t2, t3) {
        fontList.push(t2);
        return t1 + prep + t2 + t3;
    });
    for (let font of fontList) {
        let reg = new RegExp(`(font.+?[: "'])(${font})`, 'gi');
        style = style.replace(reg, function (t, t1, t2) {
            return t1 + prep + t2;
        });
    }
    let keyframeList = [];
    style = style.replace(/([-@]keyframes *["']{0,1})([\w-]+)(["']{0,1}\s*?\{)/gi, function (t, t1, t2, t3) {
        if (!keyframeList.includes(t2)) {
            keyframeList.push(t2);
        }
        return t1 + prep + t2 + t3;
    });
    for (let keyframe of keyframeList) {
        let reg = new RegExp(`(animation[ :\\r\\n]+)(${keyframe})([ ;}\\r\\n])`, 'gi');
        style = style.replace(reg, function (t, t1, t2, t3) {
            return t1 + prep + t2 + t3;
        });
    }
    return {
        'prep': prep,
        'style': style
    };
}
exports.stylePrepend = stylePrepend;
function getMimeByPath(path) {
    var _a;
    let lio = path.lastIndexOf('.');
    let ext = (lio === -1 ? path : path.slice(lio + 1)).toLowerCase();
    let exts = {
        'eot': 'application/vnd.ms-fontobject',
        'woff': 'font/woff',
        'ttf': 'font/ttf',
        'svg': 'image/svg+xml',
        'jpg': 'image/jpeg',
        'jpeg': 'image/jpeg',
        'gif': 'image/gif',
        'png': 'image/png'
    };
    let mime = (_a = exts[ext]) !== null && _a !== void 0 ? _a : 'application/octet-stream';
    return {
        'mime': mime,
        'ext': ext
    };
}
exports.getMimeByPath = getMimeByPath;
let objectURLList = [];
function createObjectURL(object) {
    let url = URL.createObjectURL(object);
    objectURLList.push(url);
    return url;
}
exports.createObjectURL = createObjectURL;
function revokeObjectURL(url) {
    URL.revokeObjectURL(url);
}
exports.revokeObjectURL = revokeObjectURL;
function getObjectURLList() {
    return objectURLList;
}
exports.getObjectURLList = getObjectURLList;
function rand(min, max) {
    if (min > max) {
        [min, max] = [max, min];
    }
    return min + Math.round(Math.random() * (max - min));
}
exports.rand = rand;
function getBoolean(param) {
    let t = typeof param;
    if (t === 'boolean') {
        return param;
    }
    else if (t === 'string') {
        return param === 'false' ? false : true;
    }
    else {
        return param ? true : false;
    }
}
exports.getBoolean = getBoolean;
function escapeHTML(html) {
    return html.replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
exports.escapeHTML = escapeHTML;
function includes(str, search) {
    for (let item of search) {
        if (!str.includes(item)) {
            return false;
        }
    }
    return true;
}
exports.includes = includes;
function replace(text, search, replace) {
    let result = text.replace(search, replace);
    while (result !== text) {
        text = result;
        result = text.replace(search, replace);
    }
    return result;
}
exports.replace = replace;
