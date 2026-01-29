import { APP_NAME, APP_TAGLINE } from '@/lib/constants';

function App() {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-green-400 mb-2">{APP_NAME}</h1>
        <p className="text-slate-400 mb-8">{APP_TAGLINE}</p>
        <div className="bg-slate-800 rounded-lg p-6 max-w-md mx-auto">
          <h2 className="text-xl font-semibold text-white mb-4">
            Project Setup Complete
          </h2>
          <ul className="text-left text-slate-300 space-y-2 text-sm">
            <li>React 19 + TypeScript</li>
            <li>Vite build tool</li>
            <li>Path aliases configured (@/)</li>
            <li>Type definitions ready</li>
            <li>Utility functions ready</li>
            <li>Folder structure (Atomic Design)</li>
          </ul>
          <p className="mt-4 text-xs text-slate-500">
            Next: Tailwind CSS + shadcn/ui
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
