'use strict';

let toc;
let currentUrl = window.location.href;

function isArticlePage() {
    return window.location.href.match(/^https:\/\/xiaobot\.net\/post\/.+/);
}

function generateTOC() {
    // 如果不是文章页面，不生成目录
    if (!isArticlePage()) {
        return;
    }

    // 如果已存在目录，先移除
    if (toc) {
        toc.remove();
    }

    toc = document.createElement('div');
    toc.id = 'table-of-contents';
    toc.className = 'xiaobot-toc';

    const tocTitle = document.createElement('h2');
    tocTitle.innerText = '目录';
    tocTitle.className = 'xiaobot-toc-title';
    toc.appendChild(tocTitle);

    const tocList = document.createElement('ul');
    tocList.className = 'xiaobot-toc-list';
    toc.appendChild(tocList);

    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    headings.forEach((heading, index) => {
        const anchor = document.createElement('a');
        const anchorName = `toc-${index}`;
        anchor.name = anchorName;
        heading.insertAdjacentElement('beforebegin', anchor);

        const tocItem = document.createElement('li');
        tocItem.style.marginLeft = `${(parseInt(heading.tagName[1]) - 1) * 20}px`;
        const tocLink = document.createElement('a');
        tocLink.href = `#${anchorName}`;
        tocLink.innerText = heading.innerText;
        tocLink.className = `xiaobot-toc-link heading-${heading.tagName.toLowerCase()}`;
        
        tocItem.appendChild(tocLink);
        tocList.appendChild(tocItem);
    });

    const sharePaper = document.querySelector('.share-paper');
    if (sharePaper) {
        sharePaper.style.position = 'relative';
        sharePaper.parentNode.insertBefore(toc, sharePaper.nextSibling);
    }
}

function addRankingLink() {
    const header = document.querySelector('header');
    if (!header) return;

    const headerDiv = header.querySelector('div');
    if (!headerDiv) return;

    // 检查是否已经存在排行榜链接
    if (headerDiv.querySelector('a[href="https://xiaobot.osguider.com/"]')) return;

    // 获取原有链接的样式
    const existingLink = headerDiv.querySelector('a');
    if (!existingLink) return;

    // 创建新的排行榜链接
    const rankingLink = document.createElement('a');
    rankingLink.href = 'https://xiaobot.osguider.com/';
    rankingLink.textContent = '排行榜';
    rankingLink.setAttribute('data-v-00d306ea', '');
    rankingLink.target = '_blank';
    rankingLink.style.cssText = existingLink.style.cssText;
    rankingLink.className = existingLink.className;

    // 在最后一个链接后插入排行榜链接
    headerDiv.appendChild(rankingLink);
}

function checkUrlAndRegenerate() {
    const newUrl = window.location.href;
    if (newUrl !== currentUrl) {
        currentUrl = newUrl;
        if (isArticlePage()) {
            setTimeout(initTOC, 500); // 给页面内容加载一些时间
        } else if (toc) {
            // 如果不是文章页面但存在目录，移除目录
            toc.remove();
        }
    }
}

function initTOC() {
    // 添加排行榜链接
    addRankingLink();

    // 如果不是文章页面，不初始化目录
    if (!isArticlePage()) {
        return;
    }

    const sharePaper = document.querySelector('.share-paper');
    if (sharePaper) {
        generateTOC();
    } else {
        setTimeout(initTOC, 500);
    }
}

// 监听 URL 变化
setInterval(checkUrlAndRegenerate, 1000);

// 初始化
document.addEventListener('DOMContentLoaded', initTOC);
window.addEventListener('load', initTOC);
