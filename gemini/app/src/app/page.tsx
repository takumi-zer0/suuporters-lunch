import Image from "next/image";

export default function Home() {
  return (
    <main className="bg-white text-gray-800">
      {/* Header Section */}
      <header className="text-center py-16 md:py-24 bg-gray-50">
        <div className="container">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
            AIコードアシスタント比較
          </h1>
          <p className="mt-4 text-lg md:text-xl text-gray-600">
            Claude Code vs. OpenAI Codex vs. Gemini CLI
          </p>
        </div>
      </header>

      {/* Introduction Section */}
      <section className="container text-center">
        <p className="text-lg text-gray-700 max-w-3xl mx-auto">
          ソフトウェア開発ワークフローを強化するために設計された、最新のAI搭載ツールの概要。各ツールは、コード生成、理解、支援に対して独自のアプローチを提供します。
        </p>
      </section>

      {/* Claude Code Section */}
      <section id="claude" className="bg-gray-50">
        <div className="container grid md:grid-cols-2 gap-12 items-center">
          <div className="prose prose-lg">
            <h2 className="text-3xl font-bold text-gray-900">Claude Code</h2>
            <p>
              Anthropicによるエージェント的なコーディングアシスタントで、ターミナル内で動作します。コードベース全体を理解し、自然言語コマンドを通じて開発タスクを支援するように設計されています。
            </p>
            <ul className="list-disc pl-5">
              <li><strong>あなたの環境で動作:</strong> VS CodeなどのIDEやコマンドラインと直接統合し、コンテキストの切り替えを回避します。</li>
              <li><strong>コードベースの認識:</strong> 複数のファイルにまたがってコンテキストを意識した変更を分析し、行うことができます。</li>
              <li><strong>エージェント機能:</strong> ファイルの編集、コマンドの実行、コミットの作成などのアクションを自律的に実行します。</li>
              <li><strong>幅広い開発タスク:</strong> 機能の構築、デバッグ、リファクタリング、Git操作を支援します。</li>
              <li><strong>ユーザー管理:</strong> ユーザーの明示的な承認なしにファイルを変更しません。</li>
            </ul>
          </div>
          <div className="text-center">
            {/* Placeholder for an image or icon */}
            <Image src="/file.svg" alt="Claude Code Icon" width={150} height={150} className="mx-auto opacity-70" />
          </div>
        </div>
      </section>

      {/* Parallax Section 1 */}
      <div className="parallax"></div>

      {/* OpenAI Codex Section */}
      <section id="codex">
        <div className="container grid md:grid-cols-2 gap-12 items-center">
          <div className="text-center md:order-2">
            {/* Placeholder for an image or icon */}
            <Image src="/window.svg" alt="OpenAI Codex Icon" width={150} height={150} className="mx-auto opacity-70" />
          </div>
          <div className="prose prose-lg md:order-1">
            <h2 className="text-3xl font-bold text-gray-900">OpenAI Codex</h2>
            <p>
              OpenAIのAI搭載コーディングアシスタントで、自然言語をコードに変換します。GitHub Copilotの基盤モデルです。
            </p>
            <ul className="list-disc pl-5">
              <li><strong>自然言語からコードへ:</strong> 平易な英語の指示からコードを生成します。</li>
              <li><strong>コード補完:</strong> 現在のコンテキストに基づいて次のコード行を提案します。</li>
              <li><strong>多言語サポート:</strong> Python, JavaScript, TypeScriptを含む幅広い言語で動作します。</li>
              <li><strong>デバッグとレビュー:</strong> エラーを特定し、コード改善の提案を行うことができます。</li>
              <li><strong>クラウドサンドボックス:</strong> 安全で隔離されたクラウド環境で動作します。</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Parallax Section 2 */}
      <div className="parallax" style={{ backgroundImage: "url('/vercel.svg')" }}></div>

      {/* Gemini CLI Section */}
      <section id="gemini" className="bg-gray-50">
        <div className="container grid md:grid-cols-2 gap-12 items-center">
          <div className="prose prose-lg">
            <h2 className="text-3xl font-bold text-gray-900">Gemini CLI</h2>
            <p>
              ターミナルでGoogleのGeminiモデルに直接アクセスできるオープンソースのコマンドラインインターフェース。
            </p>
            <ul className="list-disc pl-5">
              <li><strong>ターミナルへの直接アクセス:</strong> コマンドラインを離れることなくGeminiモデルと対話します。</li>
              <li><strong>Google検索連携:</strong> ウェブからリアルタイムの情報を取得し、より最新の応答を提供します。</li>
              <li><strong>ファイルシステムとの連携:</strong> ローカルファイルを読み込んでプロジェクトのコンテキストを理解できます。</li>
              <li><strong>カスタマイズ可能:</strong> カスタムスラッシュコマンドを作成してワークフローを自動化できます。</li>
              <li><strong>マルチモーダル機能:</strong> テキストだけでなく、さまざまなコンテンツタイプを処理および生成できます。</li>
            </ul>
          </div>
          <div className="text-center">
            {/* Placeholder for an image or icon */}
            <Image src="/next.svg" alt="Gemini CLI Icon" width={200} height={150} className="mx-auto opacity-70 dark:invert" />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-8 border-t border-gray-200">
        <div className="container">
          <p className="text-gray-600">
            Gemini CLIによって生成されました。
          </p>
        </div>
      </footer>
    </main>
  );
}
