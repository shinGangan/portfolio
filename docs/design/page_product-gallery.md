# Product Gallery Page

## Requirement

本ページは以下の目的で作成したい。

- 今まで作成したプロダクト一覧をギャラリー的に表示したい
- 今まで執筆・登壇した内容も合わせてギャラリー的に表示したい

## Design

NuxtHub templates の中にある **Nuxt Image Gallery** を流用して実装する。

- https://image-gallery.nuxt.dev/

本ページで満たすべき要件は以下のとおりである。

1. Product などを画像一覧として表示する
   - 各カードを押下すると詳細の表示に遷移する
   - カード追加は本人のみが行える
2. GitHub、X などの個人情報へアクセスできる
   - 既存の `<BottomMenu />` を流用する

## Note

- 詳細ページについては別のところにまとめる予定
