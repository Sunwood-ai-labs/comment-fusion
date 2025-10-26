import React, { useState, useMemo } from 'react';
import { CommentEntry } from './types';

// Styled Components (using functions for Tailwind classes)
const Card = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-white border border-slate-200 rounded-lg p-6 ${className}`}>
    {children}
  </div>
);

const Label = ({ children, htmlFor }: { children: React.ReactNode; htmlFor: string }) => (
  <label htmlFor={htmlFor} className="text-sm font-medium text-slate-700 mb-1 block">
    {children}
  </label>
);

const Textarea = (props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <textarea
    {...props}
    className="w-full h-48 bg-white border border-slate-300 rounded-md p-3 text-sm font-mono placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 transition-shadow"
  />
);

const Button = ({ children, onClick, variant = 'primary', disabled = false, icon: Icon }: { children: React.ReactNode; onClick: () => void; variant?: 'primary' | 'secondary' | 'danger'; disabled?: boolean; icon?: React.ElementType }) => {
  const baseClasses = "px-4 py-2 rounded-md font-semibold text-sm inline-flex items-center justify-center gap-2 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";
  const variantClasses = {
    primary: 'bg-slate-900 text-white hover:bg-slate-700 focus:ring-slate-500',
    secondary: 'bg-white text-slate-900 border border-slate-300 hover:bg-slate-100 focus:ring-slate-400',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
  };
  const disabledClasses = "disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <button onClick={onClick} className={`${baseClasses} ${variantClasses[variant]} ${disabledClasses}`} disabled={disabled}>
      {Icon && <Icon className="w-4 h-4" />}
      {children}
    </button>
  );
};

const MergeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-git-merge"><circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><path d="M6 21V9a9 9 0 0 1 9 9"/></svg>
);

const CopyIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-copy"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
);

const TrashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash-2"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
);


const App: React.FC = () => {
  const [inputs, setInputs] = useState<string[]>(Array(6).fill(''));
  const [mergedJson, setMergedJson] = useState<string>('');
  const [stats, setStats] = useState<{
    processedCount: number;
    totalBefore: number;
    totalAfter: number;
    breakdown: number[];
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState<string>('');

  const handleInputChange = (index: number, value: string) => {
    const newInputs = [...inputs];
    newInputs[index] = value;
    setInputs(newInputs);
  };

  const handleMergeAndSort = () => {
    setError(null);
    setMergedJson('');
    setStats(null);

    let allComments: CommentEntry[] = [];
    const breakdown: number[] = Array(6).fill(0);
    let processedCount = 0;
    let totalBefore = 0;

    try {
      inputs.forEach((jsonString, index) => {
        if (jsonString.trim() === '') {
          return;
        }

        processedCount++;
        const parsed: CommentEntry[] = JSON.parse(jsonString);
        if (!Array.isArray(parsed)) {
          throw new Error(`入力 ${index + 1} は配列ではありません。`);
        }
        
        // Basic validation for each entry
        parsed.forEach(item => {
            if (typeof item.time !== 'string' || typeof item.comment !== 'string' || typeof item.command !== 'string') {
                throw new Error(`入力 ${index + 1} のデータ形式が正しくありません。(time, command, commentが必要です)`);
            }
        });

        allComments.push(...parsed);
        breakdown[index] = parsed.length;
        totalBefore += parsed.length;
      });

      // Sort by time
      allComments.sort((a, b) => {
        const timeA = a.time.replace('.', ':');
        const timeB = b.time.replace('.', ':');
        return timeA.localeCompare(timeB);
      });

      const resultJson = JSON.stringify(allComments, null, 2);
      setMergedJson(resultJson);
      setStats({
        processedCount,
        totalBefore,
        totalAfter: allComments.length,
        breakdown,
      });

    } catch (e) {
      if (e instanceof Error) {
        setError(`エラー: ${e.message}`);
      } else {
        setError('予期せぬエラーが発生しました。');
      }
    }
  };
  
  const handleCopy = () => {
    if (mergedJson) {
      navigator.clipboard.writeText(mergedJson).then(() => {
        setCopySuccess('コピーしました！');
        setTimeout(() => setCopySuccess(''), 2000);
      }, () => {
        setCopySuccess('コピーに失敗しました。');
      });
    }
  };

  const handleClear = () => {
    setInputs(Array(6).fill(''));
    setMergedJson('');
    setStats(null);
    setError(null);
    setCopySuccess('');
  };

  const hasContent = useMemo(() => inputs.some(input => input.trim() !== ''), [inputs]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900">投コメがったい</h1>
          <p className="text-slate-600 mt-2">
            複数の投コメJSONを時間順に賢くマージします。
          </p>
        </header>

        <main className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {inputs.map((value, index) => (
              <div key={index}>
                <Label htmlFor={`json-input-${index}`}>
                  投コメJSON {index + 1}
                </Label>
                <Textarea
                  id={`json-input-${index}`}
                  value={value}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  placeholder={`[{"time": "00:00.50", ...}]`}
                />
              </div>
            ))}
          </div>
          
          {error && (
             <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
                <p className="font-bold">エラー</p>
                <p>{error}</p>
            </div>
          )}

          <div className="flex flex-wrap justify-center items-center gap-4">
            <Button onClick={handleMergeAndSort} disabled={!hasContent} variant="primary" icon={MergeIcon}>
              がったい！
            </Button>
            <Button onClick={handleCopy} disabled={!mergedJson} variant="secondary" icon={CopyIcon}>
              {copySuccess || '結果をコピー'}
            </Button>
            <Button onClick={handleClear} variant="danger" icon={TrashIcon}>
              すべてクリア
            </Button>
          </div>

          {(stats || mergedJson) && (
             <section className="space-y-6">
                <Card>
                    <h2 className="text-lg font-semibold text-slate-900 mb-3">がったい結果</h2>
                    {stats && (
                        <div className="text-slate-700 space-y-1">
                        <p>
                            <strong className="font-semibold text-slate-800">{stats.processedCount}</strong>つの入力から、合計
                            <strong className="font-semibold text-slate-800">{stats.totalBefore}</strong>個のコメントを処理しました。
                        </p>
                        <p>
                            がったい後のコメント数: <strong className="font-semibold text-blue-600">{stats.totalAfter}</strong>個
                        </p>
                        <p className="text-sm text-slate-500">
                            各入力のコメント数: [ {stats.breakdown.join(', ')} ]
                        </p>
                        </div>
                    )}
                </Card>
                <Card>
                    <Label htmlFor="merged-output">がったい＆ソート済みJSON</Label>
                     <Textarea
                        id="merged-output"
                        value={mergedJson}
                        readOnly
                        className="h-96" // Make output taller
                    />
                </Card>
             </section>
          )}

        </main>
      </div>
    </div>
  );
};

export default App;