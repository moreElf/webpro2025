// 生成された Prisma Client を、指定の場所からインポートする
import { PrismaClient } from "./generated/prisma/client";

// Prisma Client のインスタンスを作成する
const prisma = new PrismaClient({
  // この設定で、実行されたSQLクエリがコンソールに表示されるようになるぞ
  log: ["query"],
});

// データベース操作は非同期で行うのが基本じゃ。async/await を使うぞ。
async function main() {
  try {
    console.log("Prisma Client を初期化しました。");

    // まずは今のユーザー一覧を取得してみる
    let users = await prisma.user.findMany();
    console.log("Before ユーザー一覧:", users);

    // 新しいユーザーを一人追加する
    const newUser = await prisma.user.create({
      data: {
        name: `新しいユーザー ${new Date().toISOString()}`,
      },
    });
    console.log("新しいユーザーを追加しました:", newUser);

    // 追加後にもう一度ユーザー一覧を取得してみる
    users = await prisma.user.findMany();
    console.log("After ユーザー一覧:", users);
  } catch (e) {
    // もしエラーが起きたら、内容を表示する
    console.error(e);
    process.exit(1);
  } finally {
    // 最後に、データベースとの接続を必ず切断する
    await prisma.$disconnect();
    console.log("Prisma Client を切断しました。");
  }
}

// main 関数を実行するんじゃ
main();
