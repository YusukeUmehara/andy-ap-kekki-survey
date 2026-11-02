/**
 * ＆Y 11月 AP決起アンケート — 回答受け取り用（Google Apps Script）
 * script.google.com の「新しいプロジェクト」に貼り付け → setup を1回実行 → ウェブアプリとしてデプロイ。
 * 回答スプレッドシートは setup() が自動で作ります（シート「AP回答」「専属回答」）。
 */
const SS_TITLE = '【回答】＆Y 11月 AP決起アンケート';
const AP_SHEET = 'AP回答';
const LEAD_SHEET = '専属回答';
const AP_HEADERS = ['送信日時', 'チーム', '名前', 'センターピンのKPI', 'センターピンのKDI', '今月はどんな1ヶ月にしますか？', 'アップへのお願いごと', '回答ID', '端末'];
const LEAD_HEADERS = ['送信日時', 'チーム', '名前', 'チームのための宣言', '回答ID', '端末'];
const AP_TEAMS = ['チームうめ', 'チームあかり', 'チームれお', 'チームけいた', 'チームこうたろう', 'チームはやと', 'チームあゆう', 'チームみき'];
const LEAD_TEAMS = AP_TEAMS.concat(['チームまなと']);

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(15000);
  try {
    const d = JSON.parse(e.postData.contents);
    const isAP = d.role === 'AP';
    const sh = sheet_(isAP ? AP_SHEET : LEAD_SHEET, isAP ? AP_HEADERS : LEAD_HEADERS);
    const idCol = isAP ? 8 : 5;

    const id = str_(d.id, 100);
    const last = sh.getLastRow();
    if (id && last > 1) {
      const ids = sh.getRange(2, idCol, last - 1, 1).getValues().flat();
      if (ids.indexOf(id) !== -1) return json_({ ok: true, duplicate: true });
    }

    const name = str_(d.name, 40);
    const team = (isAP ? AP_TEAMS : LEAD_TEAMS).indexOf(d.team) !== -1 ? d.team : '';
    if (!name || !team) return json_({ ok: false, error: 'missing required fields' });

    if (isAP) {
      sh.appendRow([new Date(), team, safe_(name), safe_(str_(d.kpi, 100)), safe_(str_(d.kdi, 100)),
        safe_(str_(d.hope, 1000)), safe_(str_(d.request, 1000)), id, str_(d.ua, 200)]);
    } else {
      sh.appendRow([new Date(), team, safe_(name), safe_(str_(d.declaration, 1000)), id, str_(d.ua, 200)]);
    }
    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function doGet() { return json_({ ok: true, service: 'andy-ap-kekki-survey-2026-11' }); }

/** 初回だけ手動で実行：回答スプレッドシートを作り、見出しを整えます（承認画面が出たら許可） */
function setup() {
  const ss = ss_();
  ss.setSpreadsheetTimeZone('Asia/Tokyo');
  style_(sheet_(AP_SHEET, AP_HEADERS), AP_HEADERS.length, [4, 5, 6, 7]);
  style_(sheet_(LEAD_SHEET, LEAD_HEADERS), LEAD_HEADERS.length, [4]);
  const first = ss.getSheets()[0];
  if (first.getName() !== AP_SHEET && first.getName() !== LEAD_SHEET && first.getLastRow() === 0) ss.deleteSheet(first);
  Logger.log('回答スプレッドシート: ' + ss.getUrl());
}

function ss_() {
  const props = PropertiesService.getScriptProperties();
  const id = props.getProperty('SS_ID');
  if (id) return SpreadsheetApp.openById(id);
  const ss = SpreadsheetApp.create(SS_TITLE);
  props.setProperty('SS_ID', ss.getId());
  return ss;
}
function sheet_(name, headers) {
  const ss = ss_();
  let sh = ss.getSheetByName(name);
  if (!sh) sh = ss.insertSheet(name);
  if (sh.getLastRow() === 0) sh.appendRow(headers);
  return sh;
}
function style_(sh, n, wide) {
  sh.getRange(1, 1, 1, n).setFontWeight('bold').setBackground('#E60012').setFontColor('#FFFFFF');
  sh.setFrozenRows(1);
  sh.setColumnWidth(1, 140);
  wide.forEach(c => sh.setColumnWidth(c, 320));
  sh.getRange('A:A').setNumberFormat('yyyy/mm/dd HH:mm');
  sh.getRange(1, 2, sh.getMaxRows(), n - 1).setWrap(true).setVerticalAlignment('top');
}
function str_(v, max) { return (v == null ? '' : String(v)).trim().slice(0, max); }
function safe_(s) { return /^[=+\-@]/.test(s) ? "'" + s : s; }
function json_(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }
