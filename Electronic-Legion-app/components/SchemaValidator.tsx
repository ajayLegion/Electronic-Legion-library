import React, { useState } from 'react';
import { SAMPLE_SCHEMA } from '../constants';
import { FileCheck, AlertTriangle, CheckCircle } from 'lucide-react';

const SchemaValidator: React.FC = () => {
  const [yamlInput, setYamlInput] = useState('');
  const [status, setStatus] = useState<'idle' | 'valid' | 'invalid'>('idle');
  const [message, setMessage] = useState('');

  const validate = () => {
    // This is a naive validation for demonstration purposes
    // A real app would use a library like 'ajv' and a YAML parser
    setStatus('idle');
    setMessage('');
    
    if (!yamlInput.trim()) {
        setStatus('invalid');
        setMessage("Input cannot be empty.");
        return;
    }

    // Mock validation logic based on strings
    const hasName = yamlInput.includes('name:');
    const hasDesignator = yamlInput.includes('designator:');
    
    setTimeout(() => {
        if (hasName && hasDesignator) {
            setStatus('valid');
            setMessage("Validation Successful: Structure conforms to 'component.schema.json'.");
        } else {
            setStatus('invalid');
            setMessage("Validation Failed: Missing required fields 'name' or 'designator'.");
        }
    }, 600);
  };

  return (
    <div className="h-full flex gap-6">
        <div className="flex-1 flex flex-col gap-4">
             <div className="bg-circuit-panel p-4 rounded-xl border border-slate-700 flex-1 flex flex-col">
                <h3 className="text-slate-200 font-semibold mb-3 flex items-center gap-2">
                    <Code className="w-4 h-4 text-purple-400" />
                    Input YAML
                </h3>
                <textarea 
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-lg p-4 font-mono text-sm text-slate-300 focus:outline-none focus:border-circuit-accent resize-none"
                    placeholder="Paste component definition here..."
                    value={yamlInput}
                    onChange={(e) => setYamlInput(e.target.value)}
                />
             </div>
             <button 
                onClick={validate}
                className="w-full bg-circuit-accent text-slate-900 font-bold py-3 rounded-xl hover:bg-white transition-colors flex items-center justify-center gap-2"
            >
                <FileCheck className="w-5 h-5" />
                Validate Against Schema
             </button>
        </div>

        <div className="w-1/3 flex flex-col gap-4">
            {/* Status Card */}
            <div className={`p-6 rounded-xl border flex flex-col items-center justify-center text-center h-48 transition-colors ${
                status === 'idle' ? 'bg-circuit-panel border-slate-700' :
                status === 'valid' ? 'bg-emerald-900/20 border-emerald-500/50' :
                'bg-red-900/20 border-red-500/50'
            }`}>
                 {status === 'idle' && (
                    <>
                        <FileCheck className="w-10 h-10 text-slate-600 mb-3" />
                        <p className="text-slate-400">Ready to validate</p>
                    </>
                 )}
                 {status === 'valid' && (
                    <>
                        <CheckCircle className="w-10 h-10 text-emerald-500 mb-3" />
                        <h4 className="text-emerald-400 font-bold text-lg">Valid</h4>
                        <p className="text-emerald-200/70 text-sm mt-1">{message}</p>
                    </>
                 )}
                 {status === 'invalid' && (
                    <>
                        <AlertTriangle className="w-10 h-10 text-red-500 mb-3" />
                        <h4 className="text-red-400 font-bold text-lg">Invalid</h4>
                        <p className="text-red-200/70 text-sm mt-1">{message}</p>
                    </>
                 )}
            </div>

            {/* Schema Reference */}
            <div className="flex-1 bg-slate-950 p-4 rounded-xl border border-slate-800 overflow-hidden flex flex-col">
                 <h3 className="text-slate-400 text-xs font-mono uppercase mb-3">Active Schema Reference</h3>
                 <pre className="flex-1 overflow-auto text-[10px] text-slate-500 font-mono">
                    {SAMPLE_SCHEMA}
                 </pre>
            </div>
        </div>
    </div>
  );
};

import { Code } from 'lucide-react';
export default SchemaValidator;
