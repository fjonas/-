import {menu, notifier, extract, tabs} from '../libs/bg';
import {dict, appInfo} from "../libs/cm";

const translate = function ({selectionText}) {
    dict.search(selectionText)
        .then((results) => {
            notifier.basic({
                iconUrl: "../imgs/yohane_q.png",
                title: selectionText,
                message: results.join("\n")
            });
        });
};

const putExtract = function ({selectionText, pageUrl}) {
    fetch(pageUrl)
        .then(res => res.blob())
        .then(blob => {
            let fr = new FileReader();
            fr.onload = function () {
                let reg = /<title>(.*)<\/title>/;
                let title = fr.result.match(reg)[1];
                extract.put(pageUrl, title, selectionText);
            };
            fr.readAsText(blob);
        });
};

const collect = function () {
    tabs.stGet()
        .then(state => {
            tabs.getCurWindow()
                .then(cur => {
                    cur = cur.map(each => {
                        let {favIconUrl, url, title} = each;
                        return {favIconUrl, url, title}
                    });
                    let hash = Date.now();
                    state[hash] = {
                        name: `新建收纳${new Date().toLocaleString()}`,
                        tabs: cur
                    };
                    tabs.stSet(state);
                })
        })
};

const bookmarkManage = function () {
    let id = appInfo.id;
    tabs.create({
        url: `chrome-extension://${id}/bmm.html`
    })
}

const displayOnNewTab = function () {
    let id = appInfo.id;
    tabs.create({
        url: `chrome-extension://${id}/popup.html`
    })
}

menu.removeAll();

menu.create({
    type: "normal",
    title: "翻译",
    contexts: ["selection"],
    onclick: translate
});
// menu.create({
//     type: "normal",
//     title: "摘录",
//     contexts: ["selection"],
//     onclick: putExtract
// });
menu.create({
    type: "normal",
    title: "收集tab",
    contexts: ["page"],
    onclick: collect
});
menu.create({
    type: "normal",
    title: "管理书签",
    contexts: ["browser_action"],
    onclick: bookmarkManage
});
menu.create({
    type: "normal",
    title: "显示yosoro",
    contexts: ["browser_action"],
    onclick: displayOnNewTab
});