import { createBrowserRouter, Outlet } from "react-router";
import { Navbar } from "./components/Navbar";
import { HomePage } from "./pages/HomePage";
import { TopicPage } from "./pages/TopicPage";
import { TopicsPage } from "./pages/TopicsPage";

function Root() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t border-gray-200 bg-white py-5">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">
          <span className="font-bold text-gray-900 text-sm">FLISH</span>
          <p className="text-gray-400 text-xs">© 2026 · Học từ vựng tiếng Anh qua Flash Card</p>
        </div>
      </footer>
    </div>
  );
}

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: HomePage },
      { path: "topics", Component: TopicsPage },
      { path: "topic/:id", Component: TopicPage },
    ],
  },
]);
