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
exports.fetchApp = exports.readApp = exports.fetchClickGoFile = exports.trigger = exports.globalEvents = exports.clickgoFiles = exports.config = void 0;
exports.config = Vue.reactive({
    'local': 'en-us'
});
exports.clickgoFiles = {};
exports.globalEvents = {
    errorHandler: null,
    screenResizeHandler: null,
    formCreatedHandler: null,
    formRemovedHandler: null,
    formTitleChangedHandler: null,
    formIconChangedHandler: null,
    formStateMinChangedHandler: null,
    formStateMaxChangedHandler: null,
    formShowChangedHandler: null,
    formFocusedHandler: null,
    formBlurredHandler: null,
    formFlashHandler: null,
    taskStartedHandler: null,
    taskEndedHandler: null
};
function trigger(name, taskId = 0, formId = 0, param1 = '', param2 = '') {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y;
    switch (name) {
        case 'screenResize': {
            (_a = exports.globalEvents.screenResizeHandler) === null || _a === void 0 ? void 0 : _a.call(exports.globalEvents, taskId, formId);
            for (let tid in clickgo.task.list) {
                let task = clickgo.task.list[tid];
                for (let fid in task.forms) {
                    (_c = (_b = task.forms[fid].events)[name]) === null || _c === void 0 ? void 0 : _c.call(_b, taskId, formId);
                }
            }
            break;
        }
        case 'formCreated':
        case 'formRemoved': {
            (_e = (_d = exports.globalEvents)[name + 'Handler']) === null || _e === void 0 ? void 0 : _e.call(_d, taskId, formId, param1, param2);
            for (let tid in clickgo.task.list) {
                let task = clickgo.task.list[tid];
                for (let fid in task.forms) {
                    (_g = (_f = task.forms[fid].events)[name]) === null || _g === void 0 ? void 0 : _g.call(_f, taskId, formId, param1, param2);
                }
            }
            break;
        }
        case 'formTitleChanged':
        case 'formIconChanged': {
            (_j = (_h = exports.globalEvents)[name + 'Handler']) === null || _j === void 0 ? void 0 : _j.call(_h, taskId, formId, param1);
            for (let tid in clickgo.task.list) {
                let task = clickgo.task.list[tid];
                for (let fid in task.forms) {
                    (_l = (_k = task.forms[fid].events)[name]) === null || _l === void 0 ? void 0 : _l.call(_k, taskId, formId, param1);
                }
            }
            break;
        }
        case 'formStateMinChanged':
        case 'formStateMaxChanged':
        case 'formShowChanged': {
            (_o = (_m = exports.globalEvents)[name + 'Handler']) === null || _o === void 0 ? void 0 : _o.call(_m, taskId, formId, param1);
            for (let tid in clickgo.task.list) {
                let task = clickgo.task.list[tid];
                for (let fid in task.forms) {
                    (_q = (_p = task.forms[fid].events)[name]) === null || _q === void 0 ? void 0 : _q.call(_p, taskId, formId, param1);
                }
            }
            break;
        }
        case 'formFocused':
        case 'formBlurred':
        case 'formFlash': {
            (_s = (_r = exports.globalEvents)[name + 'Handler']) === null || _s === void 0 ? void 0 : _s.call(_r, taskId, formId);
            for (let tid in clickgo.task.list) {
                let task = clickgo.task.list[tid];
                for (let fid in task.forms) {
                    (_u = (_t = task.forms[fid].events)[name]) === null || _u === void 0 ? void 0 : _u.call(_t, taskId, formId);
                }
            }
            break;
        }
        case 'taskStarted':
        case 'taskEnded': {
            (_w = (_v = exports.globalEvents)[name + 'Handler']) === null || _w === void 0 ? void 0 : _w.call(_v, taskId, formId);
            for (let tid in clickgo.task.list) {
                let task = clickgo.task.list[tid];
                for (let fid in task.forms) {
                    (_y = (_x = task.forms[fid].events)[name]) === null || _y === void 0 ? void 0 : _y.call(_x, taskId);
                }
            }
            break;
        }
    }
}
exports.trigger = trigger;
function fetchClickGoFile(path) {
    return __awaiter(this, void 0, void 0, function* () {
        if (exports.clickgoFiles[path]) {
            return exports.clickgoFiles[path];
        }
        try {
            let blob = yield (yield fetch(clickgo.cgRootPath + path.slice(1) + '?' + Math.random())).blob();
            let lio = path.lastIndexOf('.');
            let ext = lio === -1 ? '' : path.slice(lio + 1).toLowerCase();
            switch (ext) {
                case 'cgc': {
                    let pkg = yield clickgo.control.read(blob, true);
                    if (!pkg) {
                        return null;
                    }
                    clickgo.control.clickgoControlPkgs[path] = pkg;
                    break;
                }
                case 'cgt': {
                    let theme = yield clickgo.theme.read(blob);
                    if (!theme) {
                        return null;
                    }
                    clickgo.theme.clickgoThemePkgs[path] = theme;
                    break;
                }
            }
            exports.clickgoFiles[path] = blob;
            return exports.clickgoFiles[path];
        }
        catch (_a) {
            return null;
        }
    });
}
exports.fetchClickGoFile = fetchClickGoFile;
function readApp(blob, salf) {
    return __awaiter(this, void 0, void 0, function* () {
        let zip = yield clickgo.zip.get(blob);
        if (!zip) {
            return false;
        }
        let files = {};
        let configContent = yield zip.getContent('/config.json');
        if (!configContent) {
            return false;
        }
        let config = JSON.parse(configContent);
        for (let file of config.files) {
            let mime = clickgo.tool.getMimeByPath(file);
            if (['txt', 'json', 'js', 'css', 'xml', 'html'].includes(mime.ext)) {
                let fab = yield zip.getContent(file, 'string');
                if (!fab) {
                    continue;
                }
                files[file] = fab;
            }
            else {
                let fab = yield zip.getContent(file, 'arraybuffer');
                if (!fab) {
                    continue;
                }
                files[file] = new Blob([fab], {
                    'type': mime.mime
                });
            }
        }
        if (!config) {
            return false;
        }
        return {
            'type': 'app',
            'safe': salf,
            'config': config,
            'files': files
        };
    });
}
exports.readApp = readApp;
function fetchApp(url, safe) {
    return __awaiter(this, void 0, void 0, function* () {
        let isCga = false;
        if (!url.endsWith('/')) {
            let lio = url.lastIndexOf('.');
            let ext = lio === -1 ? '' : url.slice(lio + 1).toLowerCase();
            if (ext !== 'cga') {
                return null;
            }
            isCga = true;
        }
        let realUrl;
        if (url.startsWith('/clickgo/')) {
            realUrl = loader.urlResolve(clickgo.cgRootPath, url.slice(9));
        }
        else {
            realUrl = loader.urlResolve(clickgo.rootPath, url);
        }
        if (isCga) {
            try {
                let blob = yield (yield fetch(realUrl + '?' + Math.random())).blob();
                return (yield readApp(blob, safe)) || null;
            }
            catch (_a) {
                return null;
            }
        }
        let config;
        let files = {};
        try {
            config = yield (yield fetch(realUrl + 'config.json?' + Math.random())).json();
            let random = Math.random().toString();
            files = yield loader.fetchFiles(config.files, {
                'dir': '/',
                'before': realUrl.slice(0, -1),
                'after': '?' + random
            });
        }
        catch (_b) {
            return null;
        }
        return {
            'type': 'app',
            'safe': safe,
            'config': config,
            'files': files
        };
    });
}
exports.fetchApp = fetchApp;
