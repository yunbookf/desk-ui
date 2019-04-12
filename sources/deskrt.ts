/**
 * Copyright 2019 Han Guoshuai <zohegs@gmail.com>
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/** --- DeskRT 核心版本 --- */
export const version: string = "2.0.0";

// --- 内部用的变量 ---
let bodyElement = document.getElementsByTagName("body")[0];
let headElement = document.getElementsByTagName("head")[0];
let mainElement: HTMLMainElement;
let userConfig: any;
let vuex: Vuex.Store;
let highlightjs: highlightjs;
let frameVue: any;

// --- 加载资源相关变量 ---
bodyElement.insertAdjacentHTML("beforeend", `<div id="el-resource"></div>`);
let resourceElement = <HTMLDivElement>document.getElementById("el-resource");
let resourceLoaded: string[] = [];
/**
 * --- 加载 CSS 和图片资源 ---
 * @param paths 要加载的列表
 */
export async function loadResource(paths: any[]) {
    return new Promise(function(resolve, reject) {
        let needPaths: any[] = [];
        for (let item of paths) {
            if (typeof item === "string") {
                if (resourceLoaded.indexOf(item) === -1) {
                    needPaths.push(item);
                }
            } else {
                if (resourceLoaded.indexOf(item.path) === -1) {
                    needPaths.push(item);
                }
            }
        }
        let pathsLength = needPaths.length;
        if (pathsLength <= 0) {
            resolve();
            return;
        }
        let loaded = 0;
        for (let item of needPaths) {
            let name = "";
            let path = "";
            if (typeof item === "string") {
                path = item;
            } else {
                name = item.name;
                path = item.path;
            }

            let pathLio = path.lastIndexOf("?");
            if (pathLio !== -1) {
                path = path.slice(0, pathLio);
            }
            let ext = path.slice(path.lastIndexOf(".") + 1).toLowerCase();
            if (ext === "css") {
                let link = document.createElement("link");
                link.rel = "stylesheet";
                if (name !== "") {
                    link.setAttribute("name", name);
                }
                link.addEventListener("load", function() {
                    ++loaded;
                    resourceLoaded.push(path);
                    if (loaded === pathsLength) {
                        resolve();
                    }
                });
                link.addEventListener("error", function(e) {
                    reject(e);
                });
                link.href = path;
                headElement.appendChild(link);
            } else {
                let img = document.createElement("img");
                if (name !== "") {
                    img.setAttribute("name", name);
                }
                img.addEventListener("load", function() {
                    ++loaded;
                    resourceLoaded.push(path);
                    if (loaded === pathsLength) {
                        resolve();
                    }
                });
                img.addEventListener("error", function(e) {
                    reject(e);
                });
                img.src = path;
                resourceElement.appendChild(img);
            }
        }
    });
}

/**
 * --- 顺序加载 js ---
 * @param paths 要加载文件的路径数组
 */
export function loadScript(paths: string[]): Promise<void> {
    return new Promise(async (resolve, reject) => {
        try {
            if (paths.length > 0) {
                for (let path of paths) {
                    let pathLio = path.lastIndexOf("?");
                    if (pathLio !== -1) {
                        path = path.slice(0, pathLio);
                    }
                    if (resourceLoaded.indexOf(path) !== -1) {
                        continue;
                    }
                    resourceLoaded.push(path);
                    await __loadScript(path + "?" + userConfig.end);
                }
            }
            resolve();
        } catch (e) {
            reject(e);
        }
    });
}
/**
 * 加载 script 标签并等待返回成功（无视是否已经加载过）
 */
function __loadScript(path: string): Promise<void> {
    return new Promise(async (resolve, reject) => {
        let script = document.createElement("script");
        script.addEventListener("load", () => {
            resolve();
        });
        script.addEventListener("error", (e) => {
            reject(e);
        });
        script.src = path;
        headElement.appendChild(script);
    });
}

/**
 * --- 设置模板 ---
 * @param theme 模板名或者其他 css 文件路径
 */
export async function setTheme(theme: string): Promise<void> {
    if (userConfig.theme === theme) {
        return;
    }
    let oldLink = headElement.querySelector("[name='deskrt-theme']");
    if (theme === "") {
        if (oldLink) {
            oldLink.remove();
        }
        userConfig.theme = "";
        return;
    }
    let path = theme;
    if (theme.indexOf("/") === -1) {
        path = ROOT_PATH + "theme/" + theme + "/index.css";
    }
    showMask(true);
    await loadResource([{
        name: "deskrt-theme",
        path: path
    }]);
    if (oldLink) {
        oldLink.remove();
    }
    userConfig.theme = theme;
    hideMask();
}

// --- 语言包相关 ---
/** --- 已加载的数据包标签列表 --- */
let localeLoaded: string[] = ["zh-CN.element"];
/** --- 已加载的语言包数据 --- */
let localeData: any = {
    "en": {}
};

/**
 * --- 切换当前语言（如果语言不存在会被自动加载，会自动触发 callback 和 mask 相关操作） ---
 * @param loc 目标语言值
 */
export async function setLocale(loc: string) {
    if (vuex.state.locale === loc) {
        return;
    }
    if (userConfig.locales.indexOf(loc) === -1) {
        alert(`[Error] Locale "${loc}" definition not found in "locales".`);
        return;
    }
    // --- 检测当前开启页面的 pkg ---
    let nowPage = mainElement.querySelector(".el-page.el--show");
    if (!nowPage) {
        alert(`[Error] Page not opened.`);
        return;
    }
    let pkg = nowPage.getAttribute("locale-pkg") || "";
    await __loadLocale(loc, pkg, () => {
        showMask(true);
    }, () => {
        hideMask();
    });
    vuex.commit("setLocale", loc);
    localStorage.setItem("locale", loc);
}

/**
 * --- !内部方法，请勿使用! 根据当前设定语言加载语言包 ---
 * @param locale 要加载的目标语言
 * @param pkg 包名，为空自动填充为 default
 * @param before 如果需要加载，则在加载前会被执行
 * @param after 如果需要加载，则在加载完毕后会被执行
 */
export function __loadLocale(locale: string, pkg: string = "", before: () => any = function() {}, after: () => any = function() {}): Promise<void> {
    return new Promise(async (resolve, reject) => {
        if (pkg === "") {
            pkg = "default";
        }
        let isBefore = false;   // --- 是否需要加载额外语言包 ---
        // --- 先检测 Element UI 的语言包是否加载 ---
        if (localeLoaded.indexOf(locale + ".element") === -1) {
            isBefore = true;
            before();
            // --- 加载 Element UI 的官方语言包 ---
            try {
                let loc = await System.import(`https://cdn.jsdelivr.net/npm/element-ui@2.7.0/lib/locale/lang/${locale}.min`);
                if (!localeData[locale]) {
                    localeData[locale] = {};
                }
                localeData[locale].el = loc.default.el;
                localeLoaded.push(locale + ".element");
            } catch (e) {
                reject(e);
            }
        }
        // --- 再检测 default 语言包是否加载了（无论如何 default 语言包必须加载） ---
        if (localeLoaded.indexOf(locale + ".default") === -1) {
            if (isBefore === false) {
                isBefore = true;
                before();
            }
            try {
                let loc = await System.import(`${userConfig.pre}${userConfig.localePath}${locale}`);
                if (!localeData[locale]) {
                    localeData[locale] = {};
                }
                for (let k in loc.default) {
                    localeData[locale][k] = loc.default[k];
                }
                localeLoaded.push(locale + ".default");
            } catch {
                reject(`Load locale file "${locale}.js" error.`);
            }
        }
        // --- 最后检测当前 pkg 是否存在（如果当前 pkg 是 default，则自动会被跳过，因为已经存在于 localePkg 里了） ---
        if (localeLoaded.indexOf(locale + "." + pkg) === -1) {
            if (isBefore === false) {
                isBefore = true;
                before();
            }
            try {
                let loc = await System.import(`${userConfig.pre}${userConfig.localePath}${locale}${pkg !== "default" ? "." + pkg : ""}`);
                if (!localeData[locale]) {
                    localeData[locale] = {};
                }
                for (let k in loc.default) {
                    localeData[locale][k] = loc.default[k];
                }
                localeLoaded.push(locale + "." + pkg);
            } catch {
                reject(`Load locale file "${locale}${pkg !== "default" ? "." + pkg : ""}.js" error.`);
            }
        }
        // --- 结束 ---
        if (isBefore) {
            after();
        }
        resolve();
    });
}

/**
 * --- 获取语言值（语言不存在会出错，不会自动加载） ---
 * @param key 读的值，如 message.ok
 */
export function __readLocale(key: string): string {
    try {
        return key.split(".").reduce((p, k) => p[k], localeData[vuex.state.locale]);
    } catch (e) {
        console.log(e);
        return "LocaleError";
    }
}

 /**
 * --- 数组去重 ---
 * @param arr 要去重的数组
 */
export function arrayUnique(arr: any[]): any[] {
    let res = [];
    let json: any = {};
    for (let val of arr) {
        if (!json[val]) {
            res.push(val);
            json[val] = 1;
        }
    }
    return res;
}

/**
 * --- 将一段字符串中的 HTML 代码转义 ---
 * @param html HTML 代码
 */
export function html2escape(html: string): string {
    return html.replace(/[<>&"]/g, (c: string) => {
        return (<any>{"<": "&lt;", ">": "&gt;", "&": "&amp;", "\"": "&quot;"})[c];
    });
}

/**
 * --- 手动传入 code 值并高亮 code 代码块 ---
 * @param dom Element 对象
 * @param code code 值
 */
export function highlight(dom: HTMLElement, code: string): void {
    if (highlightjs === undefined) {
        alert(`[Error] "highlight.js" not loaded.`);
        return;
    }
    dom.innerText = code;
    highlightjs.highlightBlock(dom);
}

 /**
 * --- 去除 html 的空白符、换行（pre 里的不去除） ---
 * @param text 要纯净的字符串
 */
export function purify(text: string): string {
    if (text.toLowerCase().indexOf("<pre") !== -1) {
        // --- 有代码块，代码块之间的代码不做处理 ---
        text = text.replace(/^\s+|\s+$/g, "").replace(/([\s\S]*?)<pre([\s\S]*?)>([\s\S]*?)<\/pre>/ig, (t: string, $1: string, $2: string, $3: string): string => {
            return purifyOut($1) + "<pre" + $2 + ">" + purifyPre($3) + "</pre>";
        });
        let lio = text.toLowerCase().lastIndexOf("</pre>");
        return text.slice(0, lio) + purifyOut(text.slice(lio));
    } else {
        return purifyOut(text.replace(/^\s+|\s+$/g, ""));
    }
}
// --- 去除标签之外的部分 ---
function purifyOut(text: string): string {
    text = ">" + text + "<";
    text = text.replace(/>([\s\S]*?)</g, (t: string, $1: string) => {
        return ">" + purifyTxt($1) + "<";
    });
    return text.slice(1, -1);
}
function purifyTxt(text: string): string {
    return text.replace(/\t|\r\n|  /g, "").replace(/\n|\r/g, "");
}
function purifyPre(text: string): string {
    text = text.trim();
    if (text.toLowerCase().indexOf("<code") !== -1) {
        text = text.replace(/<code(.*?)>(\s*)/gi, (t: string, $1: string, $2: string) => {
            return "<code" + $1 + ">";
        }).replace(/(\s*?)<\/code/gi, (t: string, $1: string) => {
            return "</code";
        });
    }
    return text;
}

/**
 * --- 休眠一段时间 ---
 * @param timeout 休眠时间
 */
export async function sleep(timeout: number): Promise<void> {
    return new Promise(async (resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, timeout);
    });
}

/**
 * --- 完整的克隆一份数组/对象 ---
 * @param obj 要克隆的对象
 */
export function clone(obj: any) {
    let newObj: any = {};
    if (obj instanceof Array) {
        newObj = [];
    }
    for (let key in obj) {
        let val = obj[key];
        newObj[key] = typeof val === "object" ? clone(val) : val;
    }
    return newObj;
}

// --- 遮罩 ---

/**
 * 显示全局遮罩
 */
export function showMask(top: boolean = false): void {
    let elMask = (<HTMLDivElement>document.getElementById("el-mask"));
    elMask.classList.add("el--show");
    if (top) {
        elMask.classList.add("el--top");
    } else {
        elMask.classList.remove("el--top");
    }
}

/**
 * 隐藏全局遮罩
 */
export function hideMask(): void {
    (<HTMLDivElement>document.getElementById("el-mask")).classList.remove("el--show");
}

/**
 * --- 显示最高层优先级带文字的遮罩 ---
 * @param text 要显示的文字
 */
export function showTextMask(text: string): void {
    let $mask =  (<HTMLDivElement>document.getElementById("el-text-mask"));
    $mask.innerHTML = text;
    $mask.classList.add("el--show");
}

/**
 * --- 隐藏最高层优先级带文字的遮罩 ---
 */
export function hideTextMask() {
    (<HTMLDivElement>document.getElementById("el-text-mask")).classList.remove("el--show");
}

// --- 窗体类 ---

/**
 * --- 显示 alert 窗体 ---
 * @param text 文本
 */
export async function alert(text: string): Promise<boolean> {
    await frameVue.$alert(text, undefined, {
        showClose: false,
        type: "warning"
    });
    return true;
}

/**
 * --- 显示确认窗体 ---
 * @param text 文本
 */
export async function confirm(text: string): Promise<boolean> {
    try {
        await frameVue.$confirm(text, undefined, {
            showClose: false,
            type: "info"
        });
        return true;
    } catch {
        return false;
    }
}

/** --- 跳转并执行完 onOpen 后是否要再执行的函数 --- */
export let goCallback: (vm?: any) => any = function () {};
/**
 * --- !内部方法，请勿使用! 用以设置回调函数变量 ---
 * @param callback 回调函数
 */
export function __setGoCallback(callback: (vm?: any) => any = function() {}) {
    goCallback = callback;
}
/**
 * --- 跳转页面到一个新页面 ---
 * @param path 要跳转的页面
 * @param callback 跳转成功后要执行的 methods 以及一个传参
 */
export function go(path: string, callback: (vm?: any) => any = function() {}): void {
    goCallback = callback;
    window.location.hash = "#" + path;
}

/**
 * --- 返回上级页面（基于原生） ---
 */
export function goBack(): void {
    history.back();
}

// --- 网络访问 ---

/**
 * --- 发起 get 请求 ---
 * @param url 要请求的 URL 地址
 */
export async function get(url: string): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            let res = await fetch(url, {
                method: "GET",
                credentials: "include"
            });
            let text;
            let ct = res.headers.get("Content-Type") || "";
            if (ct.indexOf("json") !== -1) {
                text = await res.json();
            } else {
                text = await res.text();
            }
            resolve(text);
        } catch (e) {
            reject(e);
        }
    });
}

/**
 * --- 发起 post 请求 ---
 * @param url 要请求的 URL 地址
 * @param data 发送的数据
 */
export async function post(url: string, data: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            let header = new Headers();
            let body = new FormData();
            for (let k in data) {
                if (data[k] !== undefined) {
                    body.append(k, data[k]);
                }
            }
            let res = await fetch(url, {
                method: "POST",
                headers: header,
                credentials: "include",
                body: body
            });
            let text;
            let ct = res.headers.get("Content-Type") || "";
            if (ct.indexOf("json") !== -1) {
                text = await res.json();
            } else {
                text = await res.text();
            }
            resolve(text);
        } catch (e) {
            reject(e);
        }
    });
}

/**
 * --- !内部方法，请勿使用! 获取用户 config ---
 * @param config 用户配置对象
 */
export async function __getConfig(config: any) {
    userConfig = config;
}

export async function __getVuex(vx: Vuex.Store) {
    vuex = vx;
}

export async function __getMainElement(me: HTMLMainElement) {
    mainElement = me;
}

export async function __getHighlightjs(hjs: highlightjs) {
    highlightjs = hjs;
}

export async function __getFrameVue(fv: Vue) {
    frameVue = fv;
}

