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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var Tool = require("./lib/Tool");
var formListElement = document.createElement("div");
if (window.devicePixelRatio < 2) {
    ClickGo.zoom = 1 / window.devicePixelRatio;
    ClickGo.rzoom = 1 / ClickGo.zoom;
    formListElement.style.zoom = ClickGo.zoom.toString();
}
formListElement.classList.add("cg-form-list");
document.getElementsByTagName("body")[0].appendChild(formListElement);
window.addEventListener("resize", function () {
    return __awaiter(this, void 0, void 0, function () {
        var i, el, taskId, formId, $vm;
        return __generator(this, function (_a) {
            for (i = 0; i < formListElement.children.length; ++i) {
                el = formListElement.children.item(i);
                if (el.className.indexOf("cg-state-max") === -1) {
                    continue;
                }
                taskId = parseInt(el.getAttribute("data-task-id"));
                formId = parseInt(el.getAttribute("data-form-id"));
                if (!ClickGo.taskList[taskId]) {
                    continue;
                }
                $vm = ClickGo.taskList[taskId].formList[formId].vue;
                $vm.$children[0].setPropData("width", ClickGo.getWidth() * ClickGo.rzoom);
                $vm.$children[0].setPropData("height", ClickGo.getHeight() * ClickGo.rzoom);
            }
            trigger("screenResize");
            return [2];
        });
    });
});
var lostFocusEvent = function (e) {
    var target = e.target;
    if (!target) {
        return;
    }
    var element = target;
    while (element) {
        element = element.parentElement;
        if (!element) {
            break;
        }
        var cla = element.getAttribute("class");
        if (!cla) {
            continue;
        }
        if (cla.indexOf("cg-form-list") !== -1) {
            return;
        }
    }
    Tool.changeFormFocus();
};
if ("ontouchstart" in document.documentElement) {
    window.addEventListener("touchstart", lostFocusEvent);
}
else {
    window.addEventListener("mousedown", lostFocusEvent);
}
var circularElement = document.createElement("div");
circularElement.style.zoom = ClickGo.zoom.toString();
circularElement.classList.add("cg-circular");
document.getElementsByTagName("body")[0].appendChild(circularElement);
function showCircular(x, y) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    circularElement.style.transition = "none";
                    circularElement.style.width = "6px";
                    circularElement.style.height = "6px";
                    circularElement.style.left = x - 3 + "px";
                    circularElement.style.top = y - 3 + "px";
                    circularElement.style.opacity = "1";
                    return [4, new Promise(function (resove) {
                            setTimeout(function () {
                                resove();
                            }, 10);
                        })];
                case 1:
                    _a.sent();
                    circularElement.style.transition = "all .3s ease-out";
                    circularElement.style.width = "60px";
                    circularElement.style.height = "60px";
                    circularElement.style.left = x - 30 + "px";
                    circularElement.style.top = y - 30 + "px";
                    circularElement.style.opacity = "0";
                    return [2];
            }
        });
    });
}
exports.showCircular = showCircular;
var rectangleElement = document.createElement("div");
rectangleElement.style.zoom = ClickGo.zoom.toString();
rectangleElement.setAttribute("data-pos", "");
rectangleElement.classList.add("cg-rectangle");
document.getElementsByTagName("body")[0].appendChild(rectangleElement);
function showRectangle(x, y, pos) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    rectangleElement.style.transition = "none";
                    rectangleElement.style.width = "20px";
                    rectangleElement.style.height = "20px";
                    rectangleElement.style.left = x - 10 + "px";
                    rectangleElement.style.top = y - 10 + "px";
                    rectangleElement.style.opacity = "1";
                    rectangleElement.setAttribute("data-ready", "0");
                    rectangleElement.setAttribute("data-dir", "");
                    return [4, new Promise(function (resove) {
                            setTimeout(function () {
                                resove();
                            }, 10);
                        })];
                case 1:
                    _a.sent();
                    rectangleElement.style.transition = "all .2s ease-out";
                    rectangleElement.setAttribute("data-ready", "1");
                    moveRectangle(pos);
                    return [2];
            }
        });
    });
}
exports.showRectangle = showRectangle;
function moveRectangle(dir) {
    var _a, _b, _c, _d;
    var dataReady = (_a = rectangleElement.getAttribute("data-ready")) !== null && _a !== void 0 ? _a : "0";
    if (dataReady === "0") {
        return;
    }
    var dataDir = (_b = rectangleElement.getAttribute("data-dir")) !== null && _b !== void 0 ? _b : "";
    var setDataDir = typeof dir === "string" ? dir : "o-" + dir.left + "-" + ((_c = dir.top) !== null && _c !== void 0 ? _c : "n") + "-" + dir.width + "-" + ((_d = dir.height) !== null && _d !== void 0 ? _d : "n");
    if (dataDir === setDataDir) {
        return;
    }
    rectangleElement.setAttribute("data-dir", setDataDir);
    var pos = getPositionByBorderDir(dir);
    var width = pos.width - 20;
    var height = pos.height - 20;
    var left = pos.left + 10;
    var top = pos.top + 10;
    if (width !== undefined && height !== undefined && left !== undefined && top !== undefined) {
        rectangleElement.style.width = width + "px";
        rectangleElement.style.height = height + "px";
        rectangleElement.style.left = left + "px";
        rectangleElement.style.top = top + "px";
    }
}
exports.moveRectangle = moveRectangle;
function hideRectangle() {
    rectangleElement.style.opacity = "0";
}
exports.hideRectangle = hideRectangle;
function getPositionByBorderDir(dir) {
    var _a, _b;
    var width, height, left, top;
    if (typeof dir === "string") {
        switch (dir) {
            case "lt": {
                width = ClickGo.getWidth() / 2;
                height = ClickGo.getHeight() / 2;
                left = ClickGo.getLeft();
                top = ClickGo.getTop();
                break;
            }
            case "t": {
                width = ClickGo.getWidth();
                height = ClickGo.getHeight();
                left = ClickGo.getLeft();
                top = ClickGo.getTop();
                break;
            }
            case "tr": {
                width = ClickGo.getWidth() / 2;
                height = ClickGo.getHeight() / 2;
                left = ClickGo.getLeft() + ClickGo.getWidth() / 2;
                top = ClickGo.getTop();
                break;
            }
            case "r": {
                width = ClickGo.getWidth() / 2;
                height = ClickGo.getHeight();
                left = ClickGo.getLeft() + ClickGo.getWidth() / 2;
                top = ClickGo.getTop();
                break;
            }
            case "rb": {
                width = ClickGo.getWidth() / 2;
                height = ClickGo.getHeight() / 2;
                left = ClickGo.getLeft() + ClickGo.getWidth() / 2;
                top = ClickGo.getTop() + ClickGo.getHeight() / 2;
                break;
            }
            case "b": {
                width = ClickGo.getWidth();
                height = ClickGo.getHeight() / 2;
                left = ClickGo.getLeft();
                top = ClickGo.getTop() + ClickGo.getHeight() / 2;
                break;
            }
            case "bl": {
                width = ClickGo.getWidth() / 2;
                height = ClickGo.getHeight() / 2;
                left = ClickGo.getLeft();
                top = ClickGo.getTop() + ClickGo.getHeight() / 2;
                break;
            }
            case "l": {
                width = ClickGo.getWidth() / 2;
                height = ClickGo.getHeight();
                left = ClickGo.getLeft();
                top = ClickGo.getTop();
                break;
            }
        }
    }
    else {
        width = dir.width;
        height = (_a = dir.height) !== null && _a !== void 0 ? _a : ClickGo.getHeight();
        left = dir.left;
        top = (_b = dir.top) !== null && _b !== void 0 ? _b : ClickGo.getTop();
    }
    return {
        "width": width,
        "height": height,
        "left": left,
        "top": top
    };
}
exports.getPositionByBorderDir = getPositionByBorderDir;
function setTheme(file) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, Tool.setGlobalTheme(file)];
                case 1:
                    _a.sent();
                    return [2];
            }
        });
    });
}
exports.setTheme = setTheme;
function clearTheme() {
    Tool.clearGlobalTheme();
}
exports.clearTheme = clearTheme;
var clickgoFiles = {};
function trigger(name, taskId, formId, opt) {
    if (taskId === void 0) { taskId = 0; }
    if (formId === void 0) { formId = 0; }
    if (opt === void 0) { opt = {}; }
    switch (name) {
        case "screenResize": {
            if (ClickGo[name + "Handler"]) {
                ClickGo[name + "Handler"]();
            }
            for (var tTaskId in ClickGo.taskList) {
                for (var tFormId in ClickGo.taskList[tTaskId].formList) {
                    if (ClickGo.taskList[tTaskId].formList[tFormId].vue.eventList[name]) {
                        ClickGo.taskList[tTaskId].formList[tFormId].vue.eventList[name]();
                    }
                }
            }
            break;
        }
        case "formCreated":
        case "formRemoved": {
            if (ClickGo[name + "Handler"]) {
                ClickGo[name + "Handler"](taskId, formId, opt.title, opt.icon);
            }
            for (var tTaskId in ClickGo.taskList) {
                for (var tFormId in ClickGo.taskList[tTaskId].formList) {
                    if (ClickGo.taskList[tTaskId].formList[tFormId].vue.eventList[name]) {
                        ClickGo.taskList[tTaskId].formList[tFormId].vue.eventList[name](taskId, formId, opt.title, opt.icon);
                    }
                }
            }
            break;
        }
        case "formTitleChanged": {
            if (ClickGo[name + "Handler"]) {
                ClickGo[name + "Handler"](taskId, formId, opt.title);
            }
            for (var tTaskId in ClickGo.taskList) {
                for (var tFormId in ClickGo.taskList[tTaskId].formList) {
                    if (ClickGo.taskList[tTaskId].formList[tFormId].vue.eventList[name]) {
                        ClickGo.taskList[tTaskId].formList[tFormId].vue.eventList[name](taskId, formId, opt.title);
                    }
                }
            }
            break;
        }
        case "formIconChanged": {
            if (ClickGo[name + "Handler"]) {
                ClickGo[name + "Handler"](taskId, formId, opt.icon);
            }
            for (var tTaskId in ClickGo.taskList) {
                for (var tFormId in ClickGo.taskList[tTaskId].formList) {
                    if (ClickGo.taskList[tTaskId].formList[tFormId].vue.eventList[name]) {
                        ClickGo.taskList[tTaskId].formList[tFormId].vue.eventList[name](taskId, formId, opt.icon);
                    }
                }
            }
            break;
        }
        case "formStateMinChanged":
        case "formStateMaxChanged": {
            if (ClickGo[name + "Handler"]) {
                ClickGo[name + "Handler"](taskId, formId, opt.state);
            }
            for (var tTaskId in ClickGo.taskList) {
                for (var tFormId in ClickGo.taskList[tTaskId].formList) {
                    if (ClickGo.taskList[tTaskId].formList[tFormId].vue.eventList[name]) {
                        ClickGo.taskList[tTaskId].formList[tFormId].vue.eventList[name](taskId, formId, opt.state);
                    }
                }
            }
            break;
        }
        case "formFocused":
        case "formBlurred": {
            if (ClickGo[name + "Handler"]) {
                ClickGo[name + "Handler"](taskId, formId);
            }
            for (var tTaskId in ClickGo.taskList) {
                for (var tFormId in ClickGo.taskList[tTaskId].formList) {
                    if (ClickGo.taskList[tTaskId].formList[tFormId].vue.eventList[name]) {
                        ClickGo.taskList[tTaskId].formList[tFormId].vue.eventList[name](taskId, formId);
                    }
                }
            }
            break;
        }
        case "taskStarted":
        case "taskEnded": {
            if (ClickGo[name + "Handler"]) {
                ClickGo[name + "Handler"](taskId);
            }
            for (var tTaskId in ClickGo.taskList) {
                for (var tFormId in ClickGo.taskList[tTaskId].formList) {
                    if (ClickGo.taskList[tTaskId].formList[tFormId].vue.eventList[name]) {
                        ClickGo.taskList[tTaskId].formList[tFormId].vue.eventList[name](taskId);
                    }
                }
            }
            break;
        }
    }
}
exports.trigger = trigger;
function fetchClickGoFile(path) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    if (path.slice(0, 9) !== "/clickgo/") {
                        return [2, null];
                    }
                    path = path.slice(8);
                    if (clickgoFiles[path]) {
                        return [2, clickgoFiles[path]];
                    }
                    _d.label = 1;
                case 1:
                    _d.trys.push([1, 4, , 5]);
                    _a = clickgoFiles;
                    _b = path;
                    return [4, fetch(ClickGo.cgRootPath + path.slice(1) + "?" + Math.random())];
                case 2: return [4, (_d.sent()).blob()];
                case 3:
                    _a[_b] = _d.sent();
                    return [2, clickgoFiles[path]];
                case 4:
                    _c = _d.sent();
                    return [2, null];
                case 5: return [2];
            }
        });
    });
}
exports.fetchClickGoFile = fetchClickGoFile;
function fetchApp(path) {
    return __awaiter(this, void 0, void 0, function () {
        var realPath, config, files, _i, _a, file, blob, resp, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    if (path.slice(-1) !== "/") {
                        return [2, null];
                    }
                    realPath = Tool.parsePath(path);
                    files = {};
                    _e.label = 1;
                case 1:
                    _e.trys.push([1, 11, , 12]);
                    return [4, fetch(realPath + "config.json?" + Math.random())];
                case 2: return [4, (_e.sent()).json()];
                case 3:
                    config = _e.sent();
                    _i = 0, _a = config.files;
                    _e.label = 4;
                case 4:
                    if (!(_i < _a.length)) return [3, 10];
                    file = _a[_i];
                    if (!(file.slice(0, 9) === "/clickgo/")) return [3, 6];
                    return [4, fetchClickGoFile(file)];
                case 5:
                    blob = _e.sent();
                    if (!blob) {
                        return [2, null];
                    }
                    files[file] = blob;
                    return [3, 9];
                case 6: return [4, fetch(realPath + file + "?" + Math.random())];
                case 7:
                    resp = _e.sent();
                    _b = files;
                    _c = file;
                    return [4, resp.blob()];
                case 8:
                    _b[_c] = _e.sent();
                    _e.label = 9;
                case 9:
                    _i++;
                    return [3, 4];
                case 10: return [3, 12];
                case 11:
                    _d = _e.sent();
                    return [2, null];
                case 12: return [2, {
                        "type": "app",
                        "config": config,
                        "files": files
                    }];
            }
        });
    });
}
exports.fetchApp = fetchApp;
function runApp(path, opt) {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var appPkg, files, fpath, fpath, taskId, task, form, style, r, _b, _c, _i, _d, theme, blob;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    opt = opt !== null && opt !== void 0 ? opt : {};
                    opt.runtime = (_a = opt.runtime) !== null && _a !== void 0 ? _a : {};
                    if (!(typeof path === "string")) return [3, 2];
                    return [4, fetchApp(path)];
                case 1:
                    if (!(appPkg = _e.sent())) {
                        return [2, false];
                    }
                    return [3, 3];
                case 2:
                    appPkg = path;
                    _e.label = 3;
                case 3:
                    files = {};
                    for (fpath in appPkg.files) {
                        files[fpath] = appPkg.files[fpath];
                    }
                    for (fpath in opt.runtime) {
                        files["/runtime" + fpath] = opt.runtime[fpath];
                    }
                    appPkg.files = files;
                    taskId = ++ClickGo.taskId;
                    ClickGo.taskList[taskId] = {
                        "taskId": taskId,
                        "appPkg": appPkg,
                        "formList": {}
                    };
                    task = ClickGo.taskList[taskId];
                    return [4, createForm({
                            "file": appPkg.config.mainLayout,
                            "taskId": task.taskId
                        })];
                case 4:
                    form = _e.sent();
                    if (!form) {
                        delete (ClickGo.taskList[taskId]);
                        return [2, false];
                    }
                    if (!(appPkg.config.styleGlobal && appPkg.files[appPkg.config.styleGlobal + ".css"])) return [3, 7];
                    return [4, Tool.blob2Text(appPkg.files[appPkg.config.styleGlobal + ".css"])];
                case 5:
                    style = _e.sent();
                    r = Tool.stylePrepend(style, "cg-task" + task.taskId + "_");
                    _c = (_b = Tool).pushStyle;
                    return [4, Tool.styleUrl2DataUrl(appPkg.config.styleGlobal, r.style, files)];
                case 6:
                    _c.apply(_b, [_e.sent(), task.taskId]);
                    _e.label = 7;
                case 7:
                    if (!appPkg.config.theme) return [3, 11];
                    _i = 0, _d = appPkg.config.theme;
                    _e.label = 8;
                case 8:
                    if (!(_i < _d.length)) return [3, 11];
                    theme = _d[_i];
                    blob = appPkg.files[theme];
                    if (!blob) {
                        return [3, 10];
                    }
                    return [4, Tool.loadTaskTheme(blob, task.taskId)];
                case 9:
                    _e.sent();
                    _e.label = 10;
                case 10:
                    _i++;
                    return [3, 8];
                case 11: return [2, task.taskId];
            }
        });
    });
}
exports.runApp = runApp;
function createForm(opt) {
    var _a, _b, _c;
    return __awaiter(this, void 0, void 0, function () {
        var appPkg, formId, formStyle, components, _i, _d, controlPath, controlBlob, controlPkg, _loop_1, _e, _f, _g, name_1, state_1, style, layout, layoutBlob, styleBlob, data, methods, computed, watch, mounted, expo, rand, r_1, randList, r, el, $vm, getFocusEvent, form;
        return __generator(this, function (_h) {
            switch (_h.label) {
                case 0:
                    appPkg = ClickGo.taskList[opt.taskId].appPkg;
                    formId = ++ClickGo.formId;
                    formStyle = "";
                    components = {};
                    _i = 0, _d = appPkg.config.controls;
                    _h.label = 1;
                case 1:
                    if (!(_i < _d.length)) return [3, 7];
                    controlPath = _d[_i];
                    controlBlob = appPkg.files[controlPath + ".cgc"];
                    if (!controlBlob) {
                        return [2, false];
                    }
                    return [4, Tool.controlBlob2Pkg(controlBlob)];
                case 2:
                    controlPkg = _h.sent();
                    if (!controlPkg) {
                        return [2, false];
                    }
                    _loop_1 = function (name_1) {
                        var item, props, data_1, methods_1, computed_1, watch_1, mounted_1, expo, rand_1, styleBlob, r_2, _a, _b, _c, layoutBlob, randList_1, r_3, _d, _e, layout_1;
                        return __generator(this, function (_f) {
                            switch (_f.label) {
                                case 0:
                                    item = controlPkg[name_1];
                                    props = {};
                                    data_1 = {};
                                    methods_1 = {};
                                    computed_1 = {};
                                    watch_1 = {};
                                    mounted_1 = null;
                                    if (!item.files[item.config.code + ".js"]) return [3, 2];
                                    return [4, loader.requireMemory(item.config.code, item.files, {
                                            "after": "?" + Math.random()
                                        })];
                                case 1:
                                    expo = ((_a = _f.sent()) !== null && _a !== void 0 ? _a : [])[0];
                                    if (expo) {
                                        props = expo.props || {};
                                        data_1 = expo.data || {};
                                        methods_1 = expo.methods || {};
                                        computed_1 = expo.computed || {};
                                        watch_1 = expo.watch || {};
                                        mounted_1 = expo.mounted || null;
                                    }
                                    _f.label = 2;
                                case 2:
                                    rand_1 = "";
                                    styleBlob = item.files[item.config.style + ".css"];
                                    if (!styleBlob) return [3, 5];
                                    _b = (_a = Tool).stylePrepend;
                                    return [4, Tool.blob2Text(styleBlob)];
                                case 3:
                                    r_2 = _b.apply(_a, [_f.sent()]);
                                    rand_1 = r_2.rand;
                                    _c = formStyle;
                                    return [4, Tool.styleUrl2DataUrl(item.config.style, r_2.style, item.files)];
                                case 4:
                                    formStyle = _c + _f.sent();
                                    _f.label = 5;
                                case 5:
                                    layoutBlob = item.files[item.config.layout + ".html"];
                                    if (!layoutBlob) {
                                        return [2, { value: false }];
                                    }
                                    randList_1 = [
                                        "cg-task" + opt.taskId + "_",
                                        "cg-theme-global-" + name_1 + "_",
                                        "cg-theme-task" + opt.taskId + "-" + name_1 + "_"
                                    ];
                                    if (rand_1 !== "") {
                                        randList_1.push(rand_1);
                                    }
                                    _e = (_d = Tool).layoutClassPrepend;
                                    return [4, Tool.blob2Text(layoutBlob)];
                                case 6:
                                    r_3 = _e.apply(_d, [_f.sent(), randList_1]);
                                    layout_1 = Tool.purify(r_3.layout);
                                    methods_1.down = function (e) {
                                        if (e instanceof MouseEvent && ClickGo.hasTouch) {
                                            e.preventDefault();
                                            return;
                                        }
                                        e.stopPropagation();
                                        Tool.changeFormFocus(formId);
                                        this.$emit("down", event);
                                    };
                                    methods_1.tap = function (e) {
                                        e.stopPropagation();
                                        if (this.disabled === true) {
                                            return;
                                        }
                                        this.$emit("tap");
                                    };
                                    methods_1.getBlob = function (file) {
                                        var _a;
                                        return (_a = ClickGo.taskList[this.taskId].appPkg.files[file]) !== null && _a !== void 0 ? _a : null;
                                    };
                                    methods_1.getDataUrl = function (file) {
                                        return __awaiter(this, void 0, void 0, function () {
                                            var f, _a;
                                            return __generator(this, function (_b) {
                                                switch (_b.label) {
                                                    case 0:
                                                        f = ClickGo.taskList[this.taskId].appPkg.files[file];
                                                        if (!f) return [3, 2];
                                                        return [4, Tool.blob2DataUrl(f)];
                                                    case 1:
                                                        _a = _b.sent();
                                                        return [3, 3];
                                                    case 2:
                                                        _a = null;
                                                        _b.label = 3;
                                                    case 3: return [2, _a];
                                                }
                                            });
                                        });
                                    };
                                    components["cg-" + name_1] = {
                                        "template": layout_1,
                                        "props": props,
                                        "data": function () {
                                            data_1.taskId = opt.taskId;
                                            data_1.formId = formId;
                                            data_1.scope = data_1.scope || rand_1;
                                            return data_1;
                                        },
                                        "methods": methods_1,
                                        "computed": computed_1,
                                        "watch": watch_1,
                                        "mounted": function () {
                                            this.$nextTick(function () {
                                                if (mounted_1) {
                                                    mounted_1.call(this);
                                                }
                                            });
                                        }
                                    };
                                    return [2];
                            }
                        });
                    };
                    _e = [];
                    for (_f in controlPkg)
                        _e.push(_f);
                    _g = 0;
                    _h.label = 3;
                case 3:
                    if (!(_g < _e.length)) return [3, 6];
                    name_1 = _e[_g];
                    return [5, _loop_1(name_1)];
                case 4:
                    state_1 = _h.sent();
                    if (typeof state_1 === "object")
                        return [2, state_1.value];
                    _h.label = 5;
                case 5:
                    _g++;
                    return [3, 3];
                case 6:
                    _i++;
                    return [3, 1];
                case 7:
                    style = opt.style;
                    layout = opt.layout;
                    if (!opt.file) return [3, 11];
                    layoutBlob = appPkg.files[opt.file + ".xml"];
                    if (!layoutBlob) return [3, 9];
                    return [4, Tool.blob2Text(layoutBlob)];
                case 8:
                    layout = _h.sent();
                    _h.label = 9;
                case 9:
                    styleBlob = appPkg.files[opt.file + ".css"];
                    if (!styleBlob) return [3, 11];
                    return [4, Tool.blob2Text(styleBlob)];
                case 10:
                    style = _h.sent();
                    _h.label = 11;
                case 11:
                    if (!layout) {
                        return [2, false];
                    }
                    data = {};
                    methods = {};
                    computed = {};
                    watch = {};
                    mounted = null;
                    if (!appPkg.files[opt.file + ".js"]) return [3, 13];
                    return [4, loader.requireMemory((_b = opt.file) !== null && _b !== void 0 ? _b : "", appPkg.files, {
                            "after": "?" + Math.random()
                        })];
                case 12:
                    expo = ((_c = _h.sent()) !== null && _c !== void 0 ? _c : [])[0];
                    if (expo) {
                        data = expo.data || {};
                        methods = expo.methods || {};
                        computed = expo.computed || {};
                        watch = expo.watch || {};
                        mounted = expo.mounted || null;
                    }
                    _h.label = 13;
                case 13:
                    rand = "";
                    if (!style) return [3, 15];
                    r_1 = Tool.stylePrepend(style);
                    rand = r_1.rand;
                    return [4, Tool.styleUrl2DataUrl("/", r_1.style, appPkg.files)];
                case 14:
                    style = _h.sent();
                    _h.label = 15;
                case 15:
                    layout = Tool.purify(layout.replace(/<(\/{0,1})(.+?)>/g, function (t, t1, t2) {
                        if (t2 === "template") {
                            return t;
                        }
                        else {
                            return "<" + t1 + "cg-" + t2 + ">";
                        }
                    }));
                    randList = ["cg-task" + opt.taskId + "_"];
                    if (rand !== "") {
                        randList.push(rand);
                    }
                    r = Tool.layoutClassPrepend(layout, randList);
                    formListElement.insertAdjacentHTML("beforeend", r.layout);
                    el = formListElement.children.item(formListElement.children.length - 1);
                    el.classList.add("cg-form-wrap");
                    el.setAttribute("data-form-id", formId.toString());
                    el.setAttribute("data-task-id", opt.taskId.toString());
                    data.taskId = opt.taskId;
                    data.formId = formId;
                    data.scope = data.scope || rand;
                    data.focus = false;
                    data.customZIndex = false;
                    methods.createForm = function (paramOpt) {
                        return __awaiter(this, void 0, void 0, function () {
                            var inOpt;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        inOpt = {
                                            "taskId": opt.taskId
                                        };
                                        if (typeof paramOpt === "string") {
                                            inOpt.file = paramOpt;
                                        }
                                        else {
                                            if (paramOpt.code) {
                                                inOpt.code = paramOpt.code;
                                            }
                                            if (paramOpt.layout) {
                                                inOpt.layout = paramOpt.layout;
                                            }
                                            if (paramOpt.style) {
                                                inOpt.style = paramOpt.style;
                                            }
                                        }
                                        return [4, createForm(inOpt)];
                                    case 1:
                                        _a.sent();
                                        return [2];
                                }
                            });
                        });
                    };
                    methods.closeForm = function () {
                        removeForm(this.formId);
                    };
                    methods.bindMove = function (e) {
                        this.$children[0].moveMethod(e);
                    };
                    methods.setSystemEventListener = function (name, func) {
                        this.eventList[name] = func;
                    };
                    methods.removeSystemEventListener = function (name) {
                        delete (this.eventList[name]);
                    };
                    methods.getBlob = function (file) {
                        var _a;
                        return (_a = ClickGo.taskList[this.taskId].appPkg.files[file]) !== null && _a !== void 0 ? _a : null;
                    };
                    methods.getDataUrl = function (file) {
                        return __awaiter(this, void 0, void 0, function () {
                            var f, _a;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        f = ClickGo.taskList[this.taskId].appPkg.files[file];
                                        if (!f) return [3, 2];
                                        return [4, Tool.blob2DataUrl(f)];
                                    case 1:
                                        _a = _b.sent();
                                        return [3, 3];
                                    case 2:
                                        _a = null;
                                        _b.label = 3;
                                    case 3: return [2, _a];
                                }
                            });
                        });
                    };
                    methods.loadTheme = function (path) {
                        return __awaiter(this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4, Tool.loadTaskTheme(path, this.taskId)];
                                    case 1:
                                        _a.sent();
                                        return [2];
                                }
                            });
                        });
                    };
                    methods.clearTheme = function () {
                        Tool.clearTaskTheme(this.taskId);
                    };
                    methods.setTheme = function (path) {
                        return __awaiter(this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        Tool.clearTaskTheme(this.taskId);
                                        return [4, Tool.loadTaskTheme(path, this.taskId)];
                                    case 1:
                                        _a.sent();
                                        return [2];
                                }
                            });
                        });
                    };
                    return [4, new Promise(function (resolve) {
                            new Vue({
                                "el": el,
                                "data": data,
                                "methods": methods,
                                "computed": computed,
                                "watch": watch,
                                "components": components,
                                "mounted": function () {
                                    this.$nextTick(function () {
                                        if (this.$el.getAttribute !== undefined) {
                                            resolve(this);
                                        }
                                        else {
                                            if (this.$el.parentNode) {
                                                formListElement.removeChild(this.$el);
                                            }
                                            resolve(false);
                                        }
                                    });
                                }
                            });
                        })];
                case 16:
                    $vm = _h.sent();
                    if (!$vm) {
                        return [2, false];
                    }
                    $vm.eventList = {};
                    if (formStyle !== "") {
                        Tool.pushStyle(formStyle, opt.taskId, formId);
                    }
                    if (style) {
                        Tool.pushStyle(style, opt.taskId, formId);
                    }
                    if (!$vm.$children[0].stateMaxData) {
                        if ($vm.$children[0].left === -1) {
                            $vm.$children[0].setPropData("left", (ClickGo.getWidth() - $vm.$el.offsetWidth) / 2);
                        }
                        if ($vm.$children[0].top === -1) {
                            $vm.$children[0].setPropData("top", (ClickGo.getHeight() - $vm.$el.offsetHeight) / 2);
                        }
                    }
                    if ($vm.$children[0].zIndex !== -1) {
                        $vm.customZIndex = true;
                    }
                    if (mounted) {
                        try {
                            mounted.call($vm);
                        }
                        catch (err) {
                            formListElement.removeChild($vm.$el);
                            Tool.removeStyle($vm.taskId, $vm.formId);
                            if (ClickGo.errorHandler) {
                                ClickGo.errorHandler($vm.taskId, $vm.formId, err, "Create form mounted error.");
                            }
                            else {
                                console.log(err);
                            }
                            return [2, false];
                        }
                    }
                    Tool.changeFormFocus(formId, $vm);
                    getFocusEvent = function () {
                        Tool.changeFormFocus(formId);
                    };
                    if ("ontouchstart" in document.documentElement) {
                        $vm.$el.addEventListener("touchstart", getFocusEvent);
                    }
                    else {
                        $vm.$el.addEventListener("mousedown", getFocusEvent);
                    }
                    form = {
                        "formId": formId,
                        "vue": $vm
                    };
                    ClickGo.taskList[opt.taskId].formList[formId] = form;
                    trigger("formCreated", opt.taskId, formId, { "title": $vm.$children[0].title, "icon": $vm.$children[0].iconData });
                    return [2, form];
            }
        });
    });
}
exports.createForm = createForm;
function removeForm(formId) {
    var formElement = formListElement.querySelector("[data-form-id=\"" + formId + "\"]");
    if (!formElement) {
        return false;
    }
    var taskIdAttr = formElement.getAttribute("data-task-id");
    if (!taskIdAttr) {
        return false;
    }
    var taskId = parseInt(taskIdAttr);
    if (Object.keys(ClickGo.taskList[taskId].formList).length === 1) {
        return endTask(taskId);
    }
    var title = "";
    for (var oFormId in ClickGo.taskList[taskId].formList) {
        if (parseInt(oFormId) !== formId) {
            continue;
        }
        title = ClickGo.taskList[taskId].formList[oFormId].vue.$children[0].title;
        delete (ClickGo.taskList[taskId].formList[oFormId]);
        break;
    }
    Tool.removeStyle(taskId, formId);
    formListElement.removeChild(formElement);
    trigger("formRemoved", taskId, formId, { "title": title });
    return true;
}
exports.removeForm = removeForm;
function endTask(taskId) {
    var _a, _b;
    if (!ClickGo.taskList[taskId]) {
        return true;
    }
    for (var i = 0; i < formListElement.children.length; ++i) {
        var el = formListElement.children.item(i);
        var dataTaskId = parseInt((_a = el.getAttribute("data-task-id")) !== null && _a !== void 0 ? _a : "0");
        if (dataTaskId !== taskId) {
            continue;
        }
        var formId = parseInt((_b = el.getAttribute("data-form-id")) !== null && _b !== void 0 ? _b : "0");
        formListElement.removeChild(el);
        --i;
        if (ClickGo.taskList[taskId].formList[formId]) {
            var title = ClickGo.taskList[taskId].formList[formId].vue.$children[0].title;
            ClickGo.trigger("formRemoved", taskId, formId, { "title": title });
        }
    }
    Tool.removeStyle(taskId);
    delete (ClickGo.taskList[taskId]);
    trigger("taskEnded", taskId);
    return true;
}
exports.endTask = endTask;
function bindMove(e, opt) {
    setGlobalCursor(getComputedStyle(e.target).cursor);
    var tx, ty;
    if (e instanceof MouseEvent) {
        tx = e.clientX * ClickGo.rzoom;
        ty = e.clientY * ClickGo.rzoom;
    }
    else {
        tx = e.touches[0].clientX * ClickGo.rzoom;
        ty = e.touches[0].clientY * ClickGo.rzoom;
    }
    var left, top, right, bottom;
    if (opt.offsetObject) {
        left = opt.offsetObject.offsetLeft + opt.offsetObject.clientLeft;
        top = opt.offsetObject.offsetTop + opt.offsetObject.clientTop;
        right = opt.offsetObject.offsetLeft + opt.offsetObject.offsetWidth;
        bottom = opt.offsetObject.offsetTop + opt.offsetObject.offsetHeight;
    }
    else {
        left = ClickGo.getLeft();
        top = ClickGo.getTop();
        right = ClickGo.getWidth();
        bottom = ClickGo.getHeight();
    }
    if (opt.left && opt.left > left) {
        left = opt.left;
    }
    if (opt.top && opt.top > top) {
        top = opt.top;
    }
    if (opt.right && opt.right < right) {
        right = opt.right;
    }
    if (opt.bottom && opt.bottom < bottom) {
        bottom = opt.bottom;
    }
    if (opt.offsetLeft) {
        left += opt.offsetLeft;
    }
    if (opt.offsetTop) {
        top += opt.offsetTop;
    }
    if (opt.offsetRight) {
        right += opt.offsetRight;
    }
    if (opt.offsetBottom) {
        bottom += opt.offsetBottom;
    }
    var isBorder = false;
    var isStart = false;
    var objectLeft, objectTop, objectWidth, objectHeight;
    var offsetLeft = 0;
    var offsetTop = 0;
    var offsetRight = 0;
    var offsetBottom = 0;
    var end;
    var move = function (e) {
        var _a, _b, _c, _d;
        return __awaiter(this, void 0, void 0, function () {
            var x, y, rtn, inBorderTop, inBorderRight, inBorderBottom, inBorderLeft, xol, xor, rs1, yot, yob, bs1, border;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        x = (e instanceof MouseEvent ? e.clientX : e.touches[0].clientX) * ClickGo.rzoom;
                        y = (e instanceof MouseEvent ? e.clientY : e.touches[0].clientY) * ClickGo.rzoom;
                        if (x === tx && y === ty) {
                            return [2];
                        }
                        if (!!isStart) return [3, 3];
                        isStart = true;
                        if (!opt.start) return [3, 2];
                        return [4, opt.start(tx, ty)];
                    case 1:
                        rtn = _e.sent();
                        if (rtn === false) {
                            setGlobalCursor();
                            if (e instanceof MouseEvent) {
                                window.removeEventListener("mousemove", move);
                                window.removeEventListener("mouseup", end);
                            }
                            else {
                                window.removeEventListener("touchmove", move);
                                window.removeEventListener("touchend", end);
                            }
                            return [2];
                        }
                        _e.label = 2;
                    case 2:
                        if (opt.object) {
                            objectLeft = opt.object.offsetLeft;
                            objectTop = opt.object.offsetTop;
                            objectWidth = opt.object.offsetWidth;
                            objectHeight = opt.object.offsetHeight;
                        }
                        else {
                            objectLeft = (_a = opt.objectLeft) !== null && _a !== void 0 ? _a : 0;
                            objectTop = (_b = opt.objectTop) !== null && _b !== void 0 ? _b : 0;
                            objectWidth = (_c = opt.objectWidth) !== null && _c !== void 0 ? _c : 0;
                            objectHeight = (_d = opt.objectHeight) !== null && _d !== void 0 ? _d : 0;
                        }
                        if (objectWidth > 0) {
                            offsetLeft = tx - objectLeft;
                        }
                        if (objectHeight > 0) {
                            offsetTop = ty - objectTop;
                        }
                        offsetRight = objectWidth - offsetLeft;
                        offsetBottom = objectHeight - offsetTop;
                        _e.label = 3;
                    case 3:
                        inBorderTop = false, inBorderRight = false, inBorderBottom = false, inBorderLeft = false;
                        xol = x - offsetLeft;
                        xor = x + offsetRight;
                        if (xol <= left) {
                            if (xol < left && x < tx) {
                                if (tx - offsetLeft > left) {
                                    x = left + offsetLeft;
                                }
                                else {
                                    x = tx;
                                }
                            }
                            inBorderLeft = true;
                        }
                        else if (offsetRight > 0) {
                            if (xor >= right) {
                                if (xor > right && x > tx) {
                                    if (tx + offsetRight < right) {
                                        x = right - offsetRight;
                                    }
                                    else {
                                        x = tx;
                                    }
                                }
                                inBorderRight = true;
                            }
                        }
                        else if (offsetRight === 0) {
                            rs1 = right - 1;
                            if (x >= rs1) {
                                if (x > rs1 && x > tx) {
                                    if (tx < rs1) {
                                        x = rs1;
                                    }
                                    else {
                                        x = tx;
                                    }
                                }
                                inBorderRight = true;
                            }
                        }
                        yot = y - offsetTop;
                        yob = y + offsetBottom;
                        if (yot <= top) {
                            if (yot < top && y < ty) {
                                if (ty - offsetTop > top) {
                                    y = top + offsetTop;
                                }
                                else {
                                    y = ty;
                                }
                            }
                            inBorderTop = true;
                        }
                        else if (offsetBottom > 0) {
                            if (yob >= bottom) {
                                if (yob > bottom && y > ty) {
                                    if (ty + offsetBottom < bottom) {
                                        y = bottom - offsetBottom;
                                    }
                                    else {
                                        y = ty;
                                    }
                                }
                                inBorderBottom = true;
                            }
                        }
                        else if (offsetBottom === 0) {
                            bs1 = bottom - 1;
                            if (y >= bs1) {
                                if (y > bs1 && y > ty) {
                                    if (ty < bs1) {
                                        y = bs1;
                                    }
                                    else {
                                        y = ty;
                                    }
                                }
                                inBorderBottom = true;
                            }
                        }
                        border = "";
                        if (inBorderTop || inBorderRight || inBorderBottom || inBorderLeft) {
                            if (inBorderTop) {
                                if (x - left <= 20) {
                                    border = "lt";
                                }
                                else if (right - x <= 20) {
                                    border = "tr";
                                }
                                else {
                                    border = "t";
                                }
                            }
                            else if (inBorderRight) {
                                if (y - top <= 20) {
                                    border = "tr";
                                }
                                else if (bottom - y <= 20) {
                                    border = "rb";
                                }
                                else {
                                    border = "r";
                                }
                            }
                            else if (inBorderBottom) {
                                if (right - x <= 20) {
                                    border = "rb";
                                }
                                else if (x - left <= 20) {
                                    border = "bl";
                                }
                                else {
                                    border = "b";
                                }
                            }
                            else if (inBorderLeft) {
                                if (y - top <= 20) {
                                    border = "lt";
                                }
                                else if (bottom - y <= 20) {
                                    border = "bl";
                                }
                                else {
                                    border = "l";
                                }
                            }
                            if (!isBorder) {
                                isBorder = true;
                                opt.borderIn && opt.borderIn(x, y, border);
                            }
                        }
                        else {
                            if (isBorder) {
                                isBorder = false;
                                opt.borderOut && opt.borderOut();
                            }
                        }
                        opt.move && opt.move(x - tx, y - ty, x, y, border);
                        tx = x;
                        ty = y;
                        return [2];
                }
            });
        });
    };
    if (e instanceof MouseEvent) {
        end = function (e) {
            setGlobalCursor();
            window.removeEventListener("mousemove", move);
            window.removeEventListener("mouseup", end);
            if (isStart) {
                opt.end && opt.end();
            }
        };
        window.addEventListener("mousemove", move);
        window.addEventListener("mouseup", end);
    }
    else {
        end = function (e) {
            setGlobalCursor();
            window.removeEventListener("touchmove", move);
            window.removeEventListener("touchend", end);
            if (isStart) {
                opt.end && opt.end();
            }
        };
        window.addEventListener("touchmove", move);
        window.addEventListener("touchend", end);
    }
}
exports.bindMove = bindMove;
function bindResize(e, opt) {
    var _a, _b;
    opt.minWidth = (_a = opt.minWidth) !== null && _a !== void 0 ? _a : 0;
    opt.minHeight = (_b = opt.minHeight) !== null && _b !== void 0 ? _b : 0;
    var x = (e instanceof MouseEvent ? e.clientX : e.touches[0].clientX) * ClickGo.rzoom;
    var y = (e instanceof MouseEvent ? e.clientY : e.touches[0].clientY) * ClickGo.rzoom;
    var offsetLeft, offsetTop, offsetRight, offsetBottom;
    var left, top, right, bottom;
    if (opt.dir === "tr" || opt.dir === "r" || opt.dir === "rb") {
        left = opt.left + opt.minWidth;
        offsetLeft = x - (opt.left + opt.width);
        offsetRight = offsetLeft;
    }
    else if (opt.dir === "bl" || opt.dir === "l" || opt.dir === "lt") {
        right = opt.left + opt.width - opt.minWidth;
        offsetLeft = x - opt.left;
        offsetRight = offsetLeft;
    }
    if (opt.dir === "rb" || opt.dir === "b" || opt.dir === "bl") {
        top = opt.top + opt.minHeight;
        offsetTop = y - (opt.top + opt.height);
        offsetBottom = offsetTop;
    }
    else if (opt.dir === "lt" || opt.dir === "t" || opt.dir === "tr") {
        bottom = opt.top + opt.height - opt.minHeight;
        offsetTop = y - opt.top;
        offsetBottom = offsetTop;
    }
    bindMove(e, {
        "left": left,
        "top": top,
        "right": right,
        "bottom": bottom,
        "offsetLeft": offsetLeft,
        "offsetTop": offsetTop,
        "offsetRight": offsetRight,
        "offsetBottom": offsetBottom,
        "start": opt.start,
        "move": function (ox, oy, x, y, border) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    if (opt.dir === "tr" || opt.dir === "r" || opt.dir === "rb") {
                        opt.width += ox;
                    }
                    else if (opt.dir === "bl" || opt.dir === "l" || opt.dir === "lt") {
                        opt.width -= ox;
                        opt.left += ox;
                    }
                    if (opt.dir === "rb" || opt.dir === "b" || opt.dir === "bl") {
                        opt.height += oy;
                    }
                    else if (opt.dir === "lt" || opt.dir === "t" || opt.dir === "tr") {
                        opt.height -= oy;
                        opt.top += oy;
                    }
                    opt.move && opt.move(opt.left, opt.top, opt.width, opt.height, x, y, border);
                    return [2];
                });
            });
        },
        "end": opt.end
    });
}
exports.bindResize = bindResize;
var globalCursorStyle;
function setGlobalCursor(type) {
    if (!globalCursorStyle) {
        globalCursorStyle = document.getElementById("cg-global-cursor");
    }
    if (type) {
        globalCursorStyle.innerHTML = "* {cursor: " + type + " !important;}";
    }
    else {
        globalCursorStyle.innerHTML = "";
    }
}
exports.setGlobalCursor = setGlobalCursor;
