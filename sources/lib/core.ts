/**
 * Copyright 2021 Han Guoshuai <zohegs@gmail.com>
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

/**
 * /clickgo/, /runtime/, /storage/, /mounted/
 */

export let config = Vue.reactive({
    'local': 'en-us'
});

/** --- clickgo 已经加载的文件列表 --- */
export let clickgoFiles: Record<string, Blob | string> = {};

/** --- 全局响应事件 --- */
export let globalEvents: ICGGlobalEvents = {
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

/**
 * --- 主动触发系统级事件 ---
 */
export function trigger(name: TCGGlobalEvent, taskId: number = 0, formId: number = 0, param1: boolean | string = '', param2: string = ''): void {
    switch (name) {
        case 'screenResize': {
            globalEvents.screenResizeHandler?.(taskId, formId) as void;
            for (let tid in clickgo.task.list) {
                let task = clickgo.task.list[tid];
                for (let fid in task.forms) {
                    task.forms[fid].events[name]?.(taskId, formId) as void;
                }
            }
            break;
        }
        case 'formCreated':
        case 'formRemoved': {
            (globalEvents as any)[name + 'Handler']?.(taskId, formId, param1, param2);
            for (let tid in clickgo.task.list) {
                let task = clickgo.task.list[tid];
                for (let fid in task.forms) {
                    task.forms[fid].events[name]?.(taskId, formId, param1, param2) as void;
                }
            }
            break;
        }
        case 'formTitleChanged':
        case 'formIconChanged': {
            (globalEvents as any)[name + 'Handler']?.(taskId, formId, param1);
            for (let tid in clickgo.task.list) {
                let task = clickgo.task.list[tid];
                for (let fid in task.forms) {
                    task.forms[fid].events[name]?.(taskId, formId, param1) as void;
                }
            }
            break;
        }
        case 'formStateMinChanged':
        case 'formStateMaxChanged':
        case 'formShowChanged': {
            (globalEvents as any)[name + 'Handler']?.(taskId, formId, param1);
            for (let tid in clickgo.task.list) {
                let task = clickgo.task.list[tid];
                for (let fid in task.forms) {
                    task.forms[fid].events[name]?.(taskId, formId, param1) as void;
                }
            }
            break;
        }
        case 'formFocused':
        case 'formBlurred':
        case 'formFlash': {
            (globalEvents as any)[name + 'Handler']?.(taskId, formId);
            for (let tid in clickgo.task.list) {
                let task = clickgo.task.list[tid];
                for (let fid in task.forms) {
                    task.forms[fid].events[name]?.(taskId, formId) as void;
                }
            }
            break;
        }
        case 'taskStarted':
        case 'taskEnded': {
            (globalEvents as any)[name + 'Handler']?.(taskId, formId);
            for (let tid in clickgo.task.list) {
                let task = clickgo.task.list[tid];
                for (let fid in task.forms) {
                    task.forms[fid].events[name]?.(taskId) as void;
                }
            }
            break;
        }
    }
}

/**
 * --- 从 cg 目录加载文件（若是已经加载的文件不会再次加载） ---
 * @param path clickgo 文件路径
 */
export async function fetchClickGoFile(path: string): Promise<Blob | string | null> {
    // --- 判断是否加载过 ---
    if (clickgoFiles[path]) {
        return clickgoFiles[path];
    }
    // --- 加载 clickgo 文件 ---
    try {
        let blob = await (await fetch(clickgo.cgRootPath + path.slice(1) + '?' + Math.random())).blob();
        let lio = path.lastIndexOf('.');
        let ext = lio === -1 ? '' : path.slice(lio + 1).toLowerCase();
        switch (ext) {
            case 'cgc': {
                // --- 控件文件 ---
                let pkg = await clickgo.control.read(blob, true);
                if (!pkg) {
                    return null;
                }
                clickgo.control.clickgoControlPkgs[path] = pkg;
                break;
            }
            case 'cgt': {
                // --- 主题文件 ---
                let theme = await clickgo.theme.read(blob);
                if (!theme) {
                    return null;
                }
                clickgo.theme.clickgoThemePkgs[path] = theme;
                break;
            }
        }
        clickgoFiles[path] = blob;
        return clickgoFiles[path];
    }
    catch {
        return null;
    }
}

/**
 * --- cga 文件 blob 转 IAppPkg 对象 ---
 * @param blob blob 对象
 * @param salf 是否是安全的
 */
export async function readApp(blob: Blob, salf: boolean): Promise<false | ICGAppPkg> {
    let zip = await clickgo.zip.get(blob);
    if (!zip) {
        return false;
    }
    // --- 开始读取文件 ---
    let files: Record<string, Blob | string> = {};
    /** --- 配置文件 --- */
    let configContent = await zip.getContent('/config.json');
    if (!configContent) {
        return false;
    }
    let config: ICGAppConfig = JSON.parse(configContent);
    for (let file of config.files) {
        let mime = clickgo.tool.getMimeByPath(file);
        if (['txt', 'json', 'js', 'css', 'xml', 'html'].includes(mime.ext)) {
            let fab = await zip.getContent(file, 'string');
            if (!fab) {
                continue;
            }
            files[file] = fab;
        }
        else {
            let fab = await zip.getContent(file, 'arraybuffer');
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
}

/**
 * --- 从网址下载应用 ---
 * @param url 相对、绝对或 cg 路径，以 / 结尾的目录 ---
 * @param safe 是否安全
 */
export async function fetchApp(url: string, safe: boolean): Promise<null | ICGAppPkg> {
    // --- 判断是通过目录加载，还是 cga 文件 ---
    let isCga: boolean = false;
    if (!url.endsWith('/')) {
        let lio = url.lastIndexOf('.');
        let ext = lio === -1 ? '' : url.slice(lio + 1).toLowerCase();
        if (ext !== 'cga') {
            return null;
        }
        isCga = true;
    }

    // --- 获取绝对路径 ---
    let realUrl: string;
    if (url.startsWith('/clickgo/')) {
        realUrl = loader.urlResolve(clickgo.cgRootPath, url.slice(9));
    }
    else {
        realUrl = loader.urlResolve(clickgo.rootPath, url);
    }

    // --- 如果是 cga 文件，直接下载并交给 readApp 函数处理 ---
    if (isCga) {
        try {
            let blob = await (await fetch(realUrl + '?' + Math.random())).blob();
            return await readApp(blob, safe) || null;
        }
        catch {
            return null;
        }
    }
    // --- 加载目录 ---
    // --- 加载 json 文件，并创建 control 信息对象 ---
    let config: ICGAppConfig;
    // --- 已加载的 files ---
    let files: Record<string, Blob | string> = {};
    try {
        config = await (await fetch(realUrl + 'config.json?' + Math.random())).json();
        let random = Math.random().toString();
        files = await loader.fetchFiles(config.files, {
            'dir': '/',
            'before': realUrl.slice(0, -1),
            'after': '?' + random
        });
    }
    catch {
        return null;
    }
    return {
        'type': 'app',
        'safe': safe,
        'config': config,
        'files': files
    };
}
