import * as fs from "fs";
import * as mime from "@litert/mime";

/**
 * --- 去除 html 的空白符、换行 ---
 * @param text 要纯净的字符串
 */
function purify(text: string): string {
    text = ">" + text + "<";
    text = text.replace(/>([\s\S]*?)</g, function(t: string, t1: string) {
        return ">" + t1.replace(/\t|\r\n| {2}/g, "").replace(/\n|\r/g, "") + "<";
    });
    return text.slice(1, -1);
}

async function getSingleControlBlob(base: string): Promise<Buffer> {
    // --- 读取 config 文件 ---
    let config = await fs.promises.readFile(base + "/config.json", {
        "encoding": "utf-8"
    });
    /** --- config 对象 --- */
    let configJson = JSON.parse(config);
    let configBuffer = Buffer.from(config);
    // --- 单控件主体 ---
    let m = mime.getMime("json");
    let mb = Buffer.from(m);
    let controlBufferArray: Uint8Array[] = [Uint8Array.from([12]), Buffer.from("/config.json"), Uint8Array.from([mb.byteLength]), mb, Buffer.from(Uint32Array.from([configBuffer.byteLength]).buffer), configBuffer];

    for (let fpath of configJson.files) {
        let content = await fs.promises.readFile(base + fpath);
        let nameBuffer = Buffer.from(fpath);

        let m = mime.getData(fpath);
        let mb = Buffer.from(m.mime);
        if (m.extension === "html") {
            content = Buffer.from(purify(content.toString()));
        }

        controlBufferArray.push(
            Uint8Array.from([nameBuffer.byteLength]),
            nameBuffer,
            Uint8Array.from([mb.byteLength]),
            mb,
            Buffer.from(Uint32Array.from([content.byteLength]).buffer),
            content
        );
    }
    let controlBuffer = Buffer.concat(controlBufferArray);

    let nameBuffer = Buffer.from(configJson.name);
    controlBuffer = Buffer.concat([
        Uint8Array.from([nameBuffer.byteLength]),
        nameBuffer,
        Buffer.from(Uint32Array.from([controlBuffer.byteLength]).buffer),
        controlBuffer
    ]);
    return controlBuffer;
}

async function run(): Promise<void> {
    // --- control to cgc ---
    let list = await fs.promises.readdir("dist/sources/control/", {
        "withFileTypes": true
    });
    for (let item of list) {
        if (item.isFile()) {
            continue;
        }
        if (["menu-item", "menu-pop", "menu-pop-item", "menu-pop-split", "greatview", "select", "tab-panel", "tab-nav"].includes(item.name)) {
            continue;
        }
        let base = "dist/sources/control/" + item.name;

        let controlBuffer = await getSingleControlBlob(base);
        if (item.name === "menu") {
            controlBuffer = Buffer.concat([
                controlBuffer,
                await getSingleControlBlob("dist/sources/control/menu-item"),
                await getSingleControlBlob("dist/sources/control/menu-pop"),
                await getSingleControlBlob("dist/sources/control/menu-pop-item"),
                await getSingleControlBlob("dist/sources/control/menu-pop-split")
            ]);
        } else if (item.name === "view") {
            controlBuffer = Buffer.concat([
                controlBuffer,
                await getSingleControlBlob("dist/sources/control/greatview"),
                await getSingleControlBlob("dist/sources/control/select")
            ]);
        } else if (item.name === "tab") {
            controlBuffer = Buffer.concat([
                controlBuffer,
                await getSingleControlBlob("dist/sources/control/tab-panel"),
                await getSingleControlBlob("dist/sources/control/tab-nav")
            ]);
        }

        // --- 组成 cgc 文件 ---
        let fileBuffer = Buffer.concat([
            Uint8Array.from([192, 1]),
            controlBuffer
        ]);
        await fs.promises.writeFile("dist/control/" + item.name + ".cgc", fileBuffer);
    }
    // --- theme to cgt ---
    list = await fs.promises.readdir("dist/sources/theme/", {
        "withFileTypes": true
    });
    for (let item of list) {
        if (item.isFile()) {
            continue;
        }
        let base = "dist/sources/theme/" + item.name;

        // --- 读取 config 文件 ---
        let config = await fs.promises.readFile(base + "/config.json", {
            "encoding": "utf-8"
        });
        /** --- config 对象 --- */
        let configJson = JSON.parse(config);
        let configBuffer = Buffer.from(config);

        let fileBufferArray: Uint8Array[] = [
            Uint8Array.from([192, 2]),
            Uint8Array.from([12]),
            Buffer.from("/config.json"),
            Buffer.from(Uint32Array.from([configBuffer.byteLength]).buffer),
            configBuffer
        ];
        for (let fpath of configJson.files) {
            let content = await fs.promises.readFile(base + fpath);
            let nameBuffer = Buffer.from(fpath);
            fileBufferArray.push(
                Uint8Array.from([nameBuffer.byteLength]),
                nameBuffer,
                Buffer.from(Uint32Array.from([content.byteLength]).buffer),
                content
            );
        }

        // --- 组成 cgt 文件 ---
        await fs.promises.writeFile("dist/theme/" + configJson.name + ".cgt", Buffer.concat(fileBufferArray));
    }
}
run().catch(function(e) {
    console.log(e);
});

