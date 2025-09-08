import RecentPages from "@/components/RecentPages";

export default function Home() {
  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">最近のページ</h2>
      <RecentPages />
    </div>
  );
}
