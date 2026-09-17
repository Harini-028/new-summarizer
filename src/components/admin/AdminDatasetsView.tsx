import React, { useState } from 'react';
import { Database, Upload, Download, Trash2, CheckCircle2, AlertTriangle, FileText, Eye, Check } from 'lucide-react';

export interface DatasetItem {
  id: string;
  name: string;
  fileName: string;
  recordsCount: number;
  columnsCount: number;
  purpose: string;
  version: string;
  lastUpdated: string;
  trainingStatus: 'Ready' | 'In Training' | 'Validating' | 'Needs Update';
}

interface AdminDatasetsViewProps {
  onToast: (msg: string) => void;
}

export const AdminDatasetsView: React.FC<AdminDatasetsViewProps> = ({ onToast }) => {
  const [datasets, setDatasets] = useState<DatasetItem[]>([
    { id: 'ds_1', name: 'Articles Main Corpus', fileName: 'articles.csv', recordsCount: 144, columnsCount: 18, purpose: 'Primary News Search & Recs', version: 'v2.4', lastUpdated: new Date().toISOString(), trainingStatus: 'Ready' },
    { id: 'ds_2', name: 'Fake News Evaluation Corpus', fileName: 'fake_news.csv', recordsCount: 144, columnsCount: 12, purpose: 'Misinformation Audit Training', version: 'v1.8', lastUpdated: new Date().toISOString(), trainingStatus: 'Ready' },
    { id: 'ds_3', name: 'News Classification Dataset', fileName: 'news_classification.csv', recordsCount: 144, columnsCount: 10, purpose: '7-Category Topic Classifier', version: 'v2.0', lastUpdated: new Date().toISOString(), trainingStatus: 'Ready' },
    { id: 'ds_4', name: 'Sentiment Polarity Dataset', fileName: 'sentiment.csv', recordsCount: 144, columnsCount: 8, purpose: 'Tone & Polarity Analysis', version: 'v1.4', lastUpdated: new Date().toISOString(), trainingStatus: 'Ready' },
    { id: 'ds_5', name: 'Summarization Evaluation Set', fileName: 'summarization.csv', recordsCount: 144, columnsCount: 11, purpose: 'ROUGE Benchmark Evaluation', version: 'v3.1', lastUpdated: new Date().toISOString(), trainingStatus: 'Ready' },
    { id: 'ds_6', name: 'Recommendation Telemetry Set', fileName: 'recommendation.csv', recordsCount: 144, columnsCount: 9, purpose: 'FAISS Vector Similarity', version: 'v2.2', lastUpdated: new Date().toISOString(), trainingStatus: 'Ready' }
  ]);

  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [validationResult, setValidationResult] = useState<{ total: number; valid: number; invalid: number; duplicates: number } | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadFile(file);
      // Simulate CSV parse validation
      setValidationResult({
        total: 144,
        valid: 144,
        invalid: 0,
        duplicates: 0
      });
    }
  };

  const handleConfirmUpload = () => {
    if (!uploadFile) return;
    const newDs: DatasetItem = {
      id: `ds_${Date.now()}`,
      name: uploadFile.name.replace('.csv', '').replace(/_/g, ' ').toUpperCase(),
      fileName: uploadFile.name,
      recordsCount: validationResult?.valid || 100,
      columnsCount: 12,
      purpose: 'Custom User Uploaded Dataset',
      version: 'v1.0',
      lastUpdated: new Date().toISOString(),
      trainingStatus: 'Ready'
    };
    setDatasets(prev => [newDs, ...prev]);
    setUploadModalOpen(false);
    setUploadFile(null);
    setValidationResult(null);
    onToast(`Dataset "${uploadFile.name}" validated and uploaded successfully!`);
  };

  const handleDelete = (id: string, name: string) => {
    if (!window.confirm(`Permanently remove dataset "${name}"?`)) return;
    setDatasets(prev => prev.filter(d => d.id !== id));
    onToast(`Dataset "${name}" deleted.`);
  };

  const handleExport = (name: string, format: 'csv' | 'json') => {
    onToast(`Exporting ${name} in ${format.toUpperCase()} format...`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 rounded-3xl bg-slate-950 border border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/15 text-cyan-400 flex items-center justify-center border border-cyan-500/20">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-white">Dataset Management Workspace</h2>
              <p className="text-xs text-slate-400">Validate, upload, and export training/evaluation datasets for JASP and ML models</p>
            </div>
          </div>
        </div>

        <button
          onClick={() => setUploadModalOpen(true)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-lg shadow-indigo-950/50 cursor-pointer shrink-0"
        >
          <Upload className="w-4 h-4" /> Upload CSV Dataset
        </button>
      </div>

      {/* Dataset Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {datasets.map(ds => (
          <div key={ds.id} className="p-5 rounded-3xl bg-slate-950 border border-slate-800 space-y-4 hover:border-slate-700 transition-all flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold bg-slate-900 text-slate-300 border border-slate-800">
                  {ds.fileName}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  {ds.trainingStatus}
                </span>
              </div>

              <h3 className="text-sm font-bold text-white leading-tight">{ds.name}</h3>
              <p className="text-[11px] text-slate-400 font-mono">{ds.purpose}</p>

              <div className="grid grid-cols-2 gap-2 pt-2 text-center font-mono text-[11px]">
                <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="font-extrabold text-indigo-400">{ds.recordsCount}</div>
                  <div className="text-[9px] text-slate-500 uppercase">Records</div>
                </div>
                <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="font-extrabold text-cyan-400">{ds.columnsCount}</div>
                  <div className="text-[9px] text-slate-500 uppercase">Columns</div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-900 text-xs">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleExport(ds.name, 'csv')}
                  className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 hover:border-indigo-500 text-slate-300 font-bold text-[10px] cursor-pointer"
                >
                  Export CSV
                </button>
                <button
                  onClick={() => handleExport(ds.name, 'json')}
                  className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 hover:border-purple-500 text-slate-300 font-bold text-[10px] cursor-pointer"
                >
                  JSON
                </button>
              </div>

              <button
                onClick={() => handleDelete(ds.id, ds.name)}
                className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-rose-500 text-slate-500 hover:text-rose-400 cursor-pointer"
                title="Delete Dataset"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* CSV Upload Modal */}
      {uploadModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-xl rounded-3xl bg-slate-950 border border-slate-800 p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Upload className="w-5 h-5 text-indigo-400" /> Upload & Validate CSV Dataset
            </h3>

            <div className="p-6 rounded-2xl border-2 border-dashed border-slate-800 bg-slate-900/50 text-center space-y-3">
              <input type="file" accept=".csv" onChange={handleFileSelect} className="hidden" id="csv-upload-input" />
              <label htmlFor="csv-upload-input" className="cursor-pointer space-y-2 block">
                <FileText className="w-8 h-8 text-indigo-400 mx-auto" />
                <div className="text-xs font-bold text-slate-200">
                  {uploadFile ? uploadFile.name : 'Click to select CSV file'}
                </div>
                <div className="text-[10px] text-slate-500 font-mono">Accepts .CSV UTF-8 format</div>
              </label>
            </div>

            {validationResult && (
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 font-mono text-xs">
                <div className="text-emerald-400 font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> CSV Validation Passed
                </div>
                <div className="grid grid-cols-4 gap-2 text-center text-[10px] pt-1">
                  <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                    <div className="font-bold text-slate-100">{validationResult.total}</div>
                    <div className="text-slate-500">Total Rows</div>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                    <div className="font-bold text-emerald-400">{validationResult.valid}</div>
                    <div className="text-slate-500">Valid Rows</div>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                    <div className="font-bold text-rose-400">{validationResult.invalid}</div>
                    <div className="text-slate-500">Invalid</div>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                    <div className="font-bold text-amber-400">{validationResult.duplicates}</div>
                    <div className="text-slate-500">Duplicates</div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setUploadModalOpen(false)} className="px-4 py-2 rounded-xl bg-slate-900 text-slate-300 text-xs font-bold">
                Cancel
              </button>
              <button
                onClick={handleConfirmUpload}
                disabled={!uploadFile}
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold disabled:opacity-40"
              >
                Confirm Import
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
