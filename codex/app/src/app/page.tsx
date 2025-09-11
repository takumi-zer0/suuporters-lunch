import Hero from "../components/Hero";

export default function Home() {
  return (
    <>
      <Hero />

      {/* 概要カード */}
      <section id="overview" className="mx-auto max-w-6xl px-4 sm:px-6 pb-4">
        <h2 className="text-2xl font-semibold tracking-tight">概要</h2>
        <p className="mt-2 max-w-2xl text-neutral-600">各ツールの位置づけと得意分野を手短にまとめました。</p>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Claude Code */}
          <article className="group rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm transition hover:shadow-md">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-blue-400 text-white grid place-items-center font-bold">
              C
            </div>
            <h3 className="mt-4 text-lg font-semibold">Claude Code</h3>
            <p className="mt-1 text-sm text-neutral-600">深いコードベース理解と反復的な開発を支援する、コード特化のAIアシスタント。開発環境に密接に統合。</p>
            <ul className="mt-4 space-y-1 text-sm text-neutral-700">
              <li>• ファイル横断のリポジトリ認識推論</li>
              <li>• 計画立案・実装・リファクタまでを支援</li>
              <li>• テストやデバッグのワークフローも支援</li>
              <li>• 複雑な変更を会話で誘導</li>
            </ul>
          </article>

          {/* Codex */}
          <article className="group rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm transition hover:shadow-md">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-neutral-900 to-neutral-700 text-white grid place-items-center font-bold">
              X
            </div>
            <h3 className="mt-4 text-lg font-semibold">Codex (CLI)</h3>
            <p className="mt-1 text-sm text-neutral-600">ローカルリポジトリ上でのエージェント的なコーディングに特化したターミナル・ネイティブなオープンインターフェース。明確な計画と安全な編集が特長。</p>
            <ul className="mt-4 space-y-1 text-sm text-neutral-700">
              <li>• 段階的な計画と進捗の提示</li>
              <li>• 対象を絞ったファイルパッチ適用</li>
              <li>• 承認付きでシェルコマンド実行</li>
              <li>• 手元のコードベースに直接適用</li>
            </ul>
          </article>

          {/* Gemini CLI */}
          <article className="group rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm transition hover:shadow-md">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-cyan-500 to-sky-400 text-white grid place-items-center font-bold">
              G
            </div>
            <h3 className="mt-4 text-lg font-semibold">Gemini CLI</h3>
            <p className="mt-1 text-sm text-neutral-600">Geminiモデルを軽量なCLIから利用。素早いタスク、試作、スクリプト用途に適する。</p>
            <ul className="mt-4 space-y-1 text-sm text-neutral-700">
              <li>• コード/テキストへの迅速なプロンプト</li>
              <li>• シェルのパイプラインやスクリプトに馴染む</li>
              <li>• ツール連携向けの構造化出力</li>
              <li>• アドホックな実験が容易</li>
            </ul>
          </article>
        </div>
      </section>

      {/* 主な特徴 */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-12">
        <h2 className="text-2xl font-semibold tracking-tight">主な特徴</h2>
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <div className="rounded-2xl border border-neutral-200 bg-white p-6">
            <h3 className="text-base font-semibold">Claude Code</h3>
            <ul className="mt-3 space-y-2 text-sm text-neutral-700">
              <li>• 大規模リポジトリでも深い文脈把握</li>
              <li>• 段階的推論と丁寧な説明</li>
              <li>• リファクタやテストを伴う作業を誘導</li>
              <li>• 自然言語ベースの強力なコード支援</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-neutral-200 bg-white p-6">
            <h3 className="text-base font-semibold">Codex (CLI)</h3>
            <ul className="mt-3 space-y-2 text-sm text-neutral-700">
              <li>• 手順を明確化し段階的に追跡</li>
              <li>• パッチによるピンポイントな編集</li>
              <li>• 安全機構付きのシェル統合</li>
              <li>• 簡潔で開発者フレンドリーなUX</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-neutral-200 bg-white p-6">
            <h3 className="text-base font-semibold">Gemini CLI</h3>
            <ul className="mt-3 space-y-2 text-sm text-neutral-700">
              <li>• 素早いプロンプトとコード変換</li>
              <li>• パイプラインや定期実行に適合</li>
              <li>• JSON等の構造化出力に対応</li>
              <li>• 最小構成で試せる</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 比較テーブル */}
      <section id="compare" className="mx-auto max-w-6xl px-4 sm:px-6 pb-20">
        <h2 className="text-2xl font-semibold tracking-tight">比較</h2>
        <div className="mt-6 overflow-hidden rounded-2xl border border-neutral-200">
          <div className="grid grid-cols-4 bg-neutral-50/60 text-sm font-medium">
            <div className="px-4 py-3">観点</div>
            <div className="px-4 py-3">Claude Code</div>
            <div className="px-4 py-3">Codex (CLI)</div>
            <div className="px-4 py-3">Gemini CLI</div>
          </div>
          {[
            {
              aspect: "主な形態",
              claude: "IDE/開発環境アシスタント",
              codex: "ターミナル主体のコーディングエージェント",
              gemini: "CLI経由でLLM利用",
            },
            {
              aspect: "強み",
              claude: "リポジトリ横断の推論",
              codex: "安全で焦点の定まった編集",
              gemini: "素早いアドホック作業",
            },
            {
              aspect: "適した用途",
              claude: "複雑なコード変更",
              codex: "ローカルリポジトリでの作業",
              gemini: "プロトタイピング・スクリプト",
            },
            {
              aspect: "ワークフローの型",
              claude: "会話型ガイダンス",
              codex: "計画 → パッチ適用 → 検証",
              gemini: "プロンプト → 出力",
            },
          ].map((row, i) => (
            <div key={row.aspect} className={`grid grid-cols-4 text-sm ${i % 2 ? "bg-white" : "bg-neutral-50/40"}`}>
              <div className="px-4 py-3 font-medium text-neutral-900">{row.aspect}</div>
              <div className="px-4 py-3 text-neutral-700">{row.claude}</div>
              <div className="px-4 py-3 text-neutral-700">{row.codex}</div>
              <div className="px-4 py-3 text-neutral-700">{row.gemini}</div>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-neutral-200/80 py-10">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 text-sm text-neutral-600">
          Next.js と Tailwind で構築。テーマ: ライト。
        </div>
      </footer>
    </>
  );
}
