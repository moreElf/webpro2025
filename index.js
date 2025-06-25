// node: から始まるのは、Node.jsに標準で組み込まれているモジュールを読み込むときの作法じゃ
import http from "node:http";
import { URL } from "node:url";

// サーバーが待ち受けるポート番号を指定する。
// process.env.PORTは環境変数という仕組みで、外部からポート番号を指定するために使う。
// もし指定がなければ、8888番ポートを使うようにしておる。
const PORT = process.env.PORT || 8888;

const server = http.createServer((req, res) => {
  // リクエストの情報をパースして、URLオブジェクトを生成する
  // これで、パス名やクエリパラメータを簡単に取得できるんじゃ
  const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
  const pathname = parsedUrl.pathname;

  console.log(`Request for ${pathname} received.`);

  // レスポンスのヘッダーに文字コードをUTF-8に指定する。これで日本語が文字化けせんのじゃ。
  res.setHeader("Content-Type", "text/plain; charset=utf-8");

  // URLのパスによって処理を分けるぞ
  if (pathname === "/") {
    // ルートパスにアクセスされた場合
    console.log("ルートパスへのアクセスじゃな");
    res.writeHead(200); // ステータスコード 200 (OK) を返す
    res.end("こんにちは！");
  } else if (pathname === "/ask") {
    // /ask パスにアクセスされた場合
    console.log("/ask へのアクセスじゃな");
    const question = parsedUrl.searchParams.get("q"); // 'q' というクエリパラメータを取得
    res.writeHead(200);
    res.end(`Your question is '${question}'`);
  } else {
    // それ以外のパスにアクセスされた場合
    console.log("見つからないパスへのアクセスじゃな");
    res.writeHead(404); // ステータスコード 404 (Not Found) を返す
    res.end("ページが見つかりません");
  }
});

server.listen(PORT, () => {
  console.log(
    `サーバーがポート ${PORT} で起動しましたぞい。 http://localhost:${PORT}/`
  );
});
