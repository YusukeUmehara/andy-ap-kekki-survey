# ＆Y 11月 AP決起アンケート

## 🔗 公開済み（2026-11-02）
| もの | URL |
|---|---|
| **回答ページ（これを配る）** | https://yusukeumehara.github.io/andy-ap-kekki-survey/ |
| 回答スプレッドシート | https://docs.google.com/spreadsheets/d/16hxjRVQ6cIp4v5Azy-U2idolH9sna0wzNDo0bWTn-mY/edit |
| 送信の受け口（GAS ウェブアプリ） | https://script.google.com/macros/s/AKfycbzisAEGsfPmKqHwgph6TupyaFyroPKiMZuUq4xay6MDkZX8DBp6StmgB1qIyO2V1a3U/exec |
| GASプロジェクト（名前は「無題のプロジェクト」のまま） | https://script.google.com/home/projects/1t_Mgz0AiDIAv43YD7uRVeEs_W1tTXytZFdI12dJ4pvpsrOF6kdzpMAgL/edit |
| GitHubリポジトリ | https://github.com/YusukeUmehara/andy-ap-kekki-survey |

- 動作確認：AP・専属それぞれテスト送信 → スプレッドシートに記録を確認 → テスト行は削除済み

AP決起集会（2026-11-02）のセミナー後アンケート。GitHub Pages で公開し、回答は Google Apps Script 経由でスプレッドシートに貯まる。

- `index.html` … アンケート本体（名前 → AP／専属で分岐 → 送信 → それぞれのメッセージ）
- `config.js` … 送信先（GAS ウェブアプリURL）。空のあいだはテストモード
- `gas/Code.gs` … 受け取り用スクリプト。`setup()` で回答スプレッドシート（シート「AP回答」「専属回答」）を自動作成
- `assets/` … アンディくん画像・ファビコン

## GAS の準備（初回のみ）
1. https://script.google.com →「新しいプロジェクト」→ `gas/Code.gs` を貼り付けて保存
2. 関数 `setup` を選んで「実行」→ 承認（詳細 → 移動 → 許可）。ログに回答スプレッドシートのURLが出る
3. 「デプロイ」→「新しいデプロイ」→ 種類「ウェブアプリ」／実行ユーザー：自分／アクセス：全員 → デプロイ
4. 表示された `/exec` のURLを `config.js` の `endpoint` に入れて push
