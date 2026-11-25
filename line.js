// 讓 LINE 用外部瀏覽器開啟：網址一律帶 openExternalBrowser=1
(function () {
  try {
    var u = new URL(location.href);
    if (u.protocol === 'file:' || u.searchParams.get('openExternalBrowser') === '1') return;
    u.searchParams.set('openExternalBrowser', '1');
    if (/\bLine\//i.test(navigator.userAgent)) location.replace(u.href);
    else history.replaceState(null, '', u.href); // 從網址列複製出去的也會帶參數
  } catch (e) { /* 舊瀏覽器略過 */ }
})();
