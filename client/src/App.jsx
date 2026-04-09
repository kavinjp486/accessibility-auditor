import { useState } from 'react';
import { AlertCircle, CheckCircle2, ChevronRight, LayoutTemplate, Zap } from 'lucide-react';
import ReactDiffViewer from 'react-diff-viewer';

// 🛑 THE MOCK DATA (What Gemini WOULD have returned)
const MOCK_API_RESPONSE = {
  success: true,
  score: 68,
  // Using a placeholder, but during demo you can link to an actual image in your assets
  screenshot: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80", 
  violations: [
    {
      id: "color-contrast",
      description: "Elements must have sufficient color contrast",
      impact: "serious",
      html: "<button style=\"background-color: #cccccc; color: #ffffff;\">Sign Up</button>",
      aiSuggestion: {
        rule: "Contrast (Minimum)",
        issue: "White text (#ffffff) on light gray (#cccccc) has a contrast ratio of 1.6:1. WCAG AA requires at least 4.5:1.",
        fix: "<button style=\"background-color: #4f46e5; color: #ffffff;\">Sign Up</button>"
      }
    },
    {
      id: "image-alt",
      description: "Images must have alternate text",
      impact: "critical",
      html: "<img src=\"/hero-banner.jpg\" class=\"w-full\">",
      aiSuggestion: {
        rule: "Non-text Content",
        issue: "Screen readers cannot describe this image to visually impaired users without an alt attribute.",
        fix: "<img src=\"/hero-banner.jpg\" class=\"w-full\" alt=\"Team of developers working on a hackathon project\">"
      }
    }
  ]
};

export default function App() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [activeViolation, setActiveViolation] = useState(0);

  const startAudit = (e) => {
    e.preventDefault();
    if (!url) return;
    
    // Fake the API call delay
    setLoading(true);
    setResult(null);
    setTimeout(() => {
      setResult(MOCK_API_RESPONSE);
      setLoading(false);
    }, 2500); 
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-gray-100 font-sans">
      {/* HEADER & INPUT */}
      <header className="border-b border-gray-800 bg-[#12121a] p-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="bg-purple-600 p-2 rounded-lg"><Zap size={24} /></div>
            <h1 className="text-2xl font-bold tracking-tight">Access<span className="text-purple-500">Auditor</span></h1>
          </div>
          
          <form onSubmit={startAudit} className="flex w-full md:w-[500px] gap-2">
            <input 
              type="url"
              required
              className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500 transition-colors"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            <button 
              type="submit"
              disabled={loading}
              className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-2 rounded-lg font-semibold transition-all disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? (
                <span className="animate-pulse">Auditing...</span>
              ) : (
                <>Audit <ChevronRight size={18}/></>
              )}
            </button>
          </form>
        </div>
      </header>

      {/* RESULTS DASHBOARD */}
      <main className="max-w-6xl mx-auto p-6 mt-8">
        {!result && !loading && (
          <div className="text-center py-20 text-gray-500">
            <LayoutTemplate size={64} className="mx-auto mb-4 opacity-20" />
            <h2 className="text-xl">Enter a URL to generate an AI-powered accessibility report.</h2>
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-purple-400 animate-pulse text-lg">Playwright is crawling DOM & injecting Axe-Core...</p>
          </div>
        )}

        {result && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animation-fade-in">
            {/* SIDEBAR: SCORE & LIST */}
            <div className="lg:col-span-1 space-y-6">
              {/* Score Card */}
              <div className="bg-[#12121a] border border-gray-800 rounded-xl p-6 text-center">
                <h3 className="text-gray-400 font-medium mb-4">WCAG Health Score</h3>
                <div className="relative inline-flex items-center justify-center">
                  <svg className="w-32 h-32 transform -rotate-90">
                    <circle cx="64" cy="64" r="60" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-gray-800" />
                    <circle cx="64" cy="64" r="60" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray="377" strokeDashoffset={377 - (377 * result.score) / 100} className="text-purple-500 transition-all duration-1000 ease-out" />
                  </svg>
                  <span className="absolute text-4xl font-bold text-white">{result.score}</span>
                </div>
              </div>

              {/* Violation List */}
              <div className="space-y-3">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <AlertCircle className="text-red-500" /> 
                  Violations ({result.violations.length})
                </h3>
                {result.violations.map((v, idx) => (
                  <div 
                    key={v.id} 
                    onClick={() => setActiveViolation(idx)}
                    className={`p-4 rounded-xl cursor-pointer border transition-all ${activeViolation === idx ? 'bg-purple-900/20 border-purple-500' : 'bg-[#12121a] border-gray-800 hover:border-gray-600'}`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-medium text-red-400 capitalize">{v.impact}</span>
                      <span className="text-xs bg-gray-800 px-2 py-1 rounded text-gray-300">{v.aiSuggestion.rule}</span>
                    </div>
                    <p className="text-sm text-gray-300">{v.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* MAIN CONTENT: DIFF VIEWER */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-[#12121a] border border-gray-800 rounded-xl overflow-hidden">
                <div className="p-6 border-b border-gray-800 bg-gray-900/50">
                  <h2 className="text-xl font-bold flex items-center gap-2 mb-2">
                    <Zap className="text-yellow-500" /> AI Fix Generation
                  </h2>
                  <p className="text-gray-400 text-sm">
                    {result.violations[activeViolation].aiSuggestion.issue}
                  </p>
                </div>
                
                {/* The Code Diff */}
                <div className="p-1">
                  <ReactDiffViewer 
                    oldValue={result.violations[activeViolation].html} 
                    newValue={result.violations[activeViolation].aiSuggestion.fix} 
                    splitView={true}
                    useDarkTheme={true}
                    leftTitle="Broken HTML"
                    rightTitle="WCAG Compliant Fix"
                    styles={{
                      variables: {
                        dark: {
                          diffViewerBackground: '#12121a',
                          diffViewerColor: '#fff',
                          addedBackground: '#064e3b',
                          removedBackground: '#7f1d1d',
                        }
                      }
                    }}
                  />
                </div>
                <div className="p-4 bg-gray-900/50 border-t border-gray-800 flex justify-end">
                    <button className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2">
                        <CheckCircle2 size={18}/> Copy Fix
                    </button>
                </div>
              </div>
              
              {/* Optional: Add Screenshot context here later */}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}