import express from "express";
// 生成した Prisma Client をインポート
import { PrismaClient } from "./generated/prisma/client";

const prisma = new PrismaClient({
  // クエリが実行されたときに実際に実行したクエリをログに表示する設定
  log: ["query"],
});
const app = express();

// 環境変数が設定されていれば、そこからポート番号を取得する。なければ 8888 を使用する。
const PORT = process.env.PORT || 8888;

// EJS を「お店の飾り付け役（テンプレートエンジン）」として設定するんじゃ
app.set("view engine", "ejs");
app.set("views", "./views"); // EJSのファイルは 'views' フォルダに置くぞ、という設定

// フォームから送られてきたデータを、Expressが読めるようにするための設定
app.use(express.urlencoded({ extended: true }));

// --- ここからがお客様への対応（ルーティング）じゃ ---

// お店の入り口 (ルートパス '/') にアクセスが来たときの対応
app.get("/", async (req, res) => {
  // データベースからすべてのユーザー情報を取得する
  const users = await prisma.user.findMany();
  // 'index' という名前のEJSファイルに、ユーザー情報を渡して表示させる
  res.render("index", { users });
});

// 新しいユーザーを登録するフォームが送られてきた ('/users') ときの対応
app.post("/users", async (req, res) => {
  const name = req.body.name; // フォームから送信された名前を取得
  const age = Number(req.body.age); // フォームから送信された年齢を取得し、数値に変換

  if (name) {
    // ユーザーを作成するときに、年齢(age)も一緒に保存する
    const newUser = await prisma.user.create({
      data: { name, age: isNaN(age) ? null : age },
    });
    console.log("新しいユーザーを追加しました:", newUser);
  }
  res.redirect("/"); // ユーザー追加後、一覧ページにリダイレクト
});

// --- お客様への対応はここまで ---

// サーバーを指定したポートで起動し、お客様を待ち続ける
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
