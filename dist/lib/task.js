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
exports.end = exports.run = exports.getList = exports.get = exports.lastId = exports.list = void 0;
exports.list = {};
exports.lastId = 0;
function get(tid) {
    if (exports.list[tid] === undefined) {
        return null;
    }
    return {
        'customTheme': exports.list[tid].customTheme,
        'localName': exports.list[tid].local.name,
        'formCount': Object.keys(exports.list[tid].forms).length,
        'safe': exports.list[tid].safe
    };
}
exports.get = get;
function getList() {
    let list = {};
    for (let tid in clickgo.task.list) {
        let item = clickgo.task.list[tid];
        list[tid] = {
            'customTheme': item.customTheme,
            'localName': item.local.name,
            'formCount': Object.keys(item.forms).length,
            'safe': item.safe
        };
    }
    return list;
}
exports.getList = getList;
function run(url, opt = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!opt.runtime) {
            opt.runtime = {};
        }
        let safe = false;
        if (url.startsWith('/clickgo/')) {
            safe = true;
        }
        let appPkg = yield clickgo.core.fetchApp(url, safe);
        if (!appPkg) {
            return -1;
        }
        let files = {};
        for (let fpath in appPkg.files) {
            files[fpath] = appPkg.files[fpath];
        }
        for (let fpath in opt.runtime) {
            files['/runtime' + fpath] = opt.runtime[fpath];
        }
        let taskId = ++exports.lastId;
        exports.list[taskId] = {
            'id': taskId,
            'appPkg': appPkg,
            'customTheme': false,
            'local': Vue.reactive({
                'name': '',
                'data': {}
            }),
            'safe': appPkg.safe,
            'permission': {},
            'controlPkgs': {},
            'themePkgs': {},
            'files': files,
            'forms': {},
            'objectURLs': {},
            'initControls': {}
        };
        let task = exports.list[taskId];
        let clickgoFileList = [];
        for (let path of appPkg.config.controls) {
            path += '.cgc';
            if (path.startsWith('/clickgo/')) {
                clickgoFileList.push(path.slice(8));
            }
            else if (task.files[path]) {
                let pkg = yield clickgo.control.read(task.files[path], appPkg.safe);
                if (pkg) {
                    task.controlPkgs[path] = pkg;
                }
            }
        }
        if (appPkg.config.themes) {
            for (let path of appPkg.config.themes) {
                path += '.cgt';
                if (path.startsWith('/clickgo/')) {
                    clickgoFileList.push(path.slice(8));
                }
                else if (task.files[path]) {
                    let pkg = yield clickgo.theme.read(task.files[path]);
                    if (pkg) {
                        task.themePkgs[path] = pkg;
                    }
                }
            }
        }
        if (clickgoFileList.length > 0) {
            try {
                yield new Promise(function (resolve, reject) {
                    let count = 0;
                    for (let file of clickgoFileList) {
                        clickgo.core.fetchClickGoFile(file).then(function (blob) {
                            if (blob === null) {
                                reject();
                                return;
                            }
                            ++count;
                            if (count === clickgoFileList.length) {
                                resolve();
                            }
                        }).catch(function () {
                            reject();
                        });
                    }
                });
            }
            catch (_a) {
                return -2;
            }
        }
        clickgo.dom.createToStyleList(task.id);
        let form = yield clickgo.form.create(task.id, {
            'file': appPkg.config.main
        });
        if (typeof form === 'number') {
            for (let name in task.controlPkgs) {
                clickgo.control.revokeObjectURL(task.controlPkgs[name]);
            }
            for (let name in task.themePkgs) {
                clickgo.theme.revokeObjectURL(task.themePkgs[name]);
            }
            delete (exports.list[task.id]);
            clickgo.dom.removeFromStyleList(task.id);
            return form - 100;
        }
        if (appPkg.config.style && appPkg.files[appPkg.config.style + '.css']) {
            let style = appPkg.files[appPkg.config.style + '.css'];
            let r = clickgo.tool.stylePrepend(style, 'cg-task' + task.id + '_');
            clickgo.dom.pushStyle(task.id, yield clickgo.tool.styleUrl2ObjectOrDataUrl(appPkg.config.style, r.style, task));
        }
        if (appPkg.config.themes) {
            task.customTheme = true;
            for (let theme of appPkg.config.themes) {
                yield clickgo.theme.load(task.id, theme + '.cgt');
            }
        }
        else {
            if (clickgo.theme.global) {
                yield clickgo.theme.load(task.id);
            }
        }
        clickgo.core.trigger('taskStarted', task.id);
        return task.id;
    });
}
exports.run = run;
function end(taskId) {
    let task = exports.list[taskId];
    if (!task) {
        return true;
    }
    for (let fid in task.forms) {
        let form = task.forms[fid];
        clickgo.core.trigger('formRemoved', taskId, form.id, form.vroot.$refs.form.title, form.vroot.$refs.form.iconData);
        form.vapp.unmount();
        form.vapp._container.remove();
    }
    clickgo.dom.removeFromStyleList(taskId);
    for (let path in task.objectURLs) {
        let url = task.objectURLs[path];
        clickgo.tool.revokeObjectURL(url);
    }
    for (let name in task.controlPkgs) {
        clickgo.control.revokeObjectURL(task.controlPkgs[name]);
    }
    delete (exports.list[taskId]);
    clickgo.core.trigger('taskEnded', taskId);
    let fid = clickgo.form.getMaxZIndexFormID();
    if (fid) {
        clickgo.form.changeFocus(fid);
    }
    return true;
}
exports.end = end;
