"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle, FileText, AlertCircle } from "lucide-react";
import { extractTextFromPdf } from "@/lib/PdfUtils";

const DashboardContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [summary, setSummary] = useState("");
  const [isLoading, setIsloading] = useState(false);
  const [error, setError] = useState("");
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);

  useEffect(() => {
    const isPaymentSuccess = searchParams.get("payment") === "success";
    if (isPaymentSuccess) {
      setShowPaymentSuccess(true);

      const timer = setTimeout(() => {
        setShowPaymentSuccess(false);
        router.replace("/dashboard");
      }, 5000);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [searchParams, router]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError("");
    if (!e.target.files?.[0]) return null;
    setSelectedFile(e.target.files[0]);
  };

  const handleAnalyze = useCallback(async ()=>{
    if(!selectedFile){
      setError("Please select a PDF file to analyze.");
      return;
    }

    setIsloading(true);
    setError("");
    setSummary("");

    try{
      //extract text from the PDF file
      const text = await extractTextFromPdf(selectedFile);
      setSummary(text);
      // send the text to API for analysis
      // const response = ""

    } catch (err) {
      setError(err instanceof Error ? err.message : "File unable to analyze");
    } finally {
      setIsloading(false);
    }
  },[selectedFile])


  return (
    <div className="space-y-10 mt-24 max-w-4xl mx-auto">
      {showPaymentSuccess && (
        <div className="bg-green-500/20 max-w-4xl mx-auto my-8 p-4 rounded-xl text-green-400">
          <div className="flex items-center justify-center">
            <CheckCircle />
            <p>Payment successful! Your subscription is active!</p>
          </div>
        </div>
      )}

      <div className="p-10 space-y-8 rounded-2xl border border-purple-300/10 bg-black/30 shadow-[0_4px_20px_-10px] shadow-purple-200/30">
        {/* File input for PDF selection */}
        <div className="relative">
          <div className="my-2 ml-2 flex items-center text-xs text-gray-500">
            <FileText className="h-3.5 w-3.5 mr-1.5" />
            <span>Supported format: PDF</span>
          </div>
          <div className="border border-gray-700 rounded-xl p-1 bg-black/40 hover:border-purple-200/20 transition-colors">
            <input
              type="file"
              onChange={handleFileChange}
              accept=".pdf"
              className="block w-full text-gray-300 file:mr-4 file:py-3 file:px-6 
                    file:rounded-lg file:border-0 file:text-sm file:font-medium
                    file:bg-purple-200/20 file:text-purple-200 hover:file:bg-purple-200/20 transition-all
                    focus:outline-none cursor-pointer"
            />
          </div>
        </div>

        {/* Analyze button - disabled when no file selected or during loading */}
        <button
          onClick={handleAnalyze}
          disabled={!selectedFile || isLoading}
          className="group relative inline-flex items-center justify-center w-full gap-2 rounded-xl bg-black px-4 py-4
                                text-white transition-all hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span
            className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#FF1E56] via-[#FF00FF] to-[#00FFFF]
                                opacity-70 blur-sm transition-all group-hover:opacity-100 disabled:opacity-40"
          />
          <span className="absolute inset-0.5 rounded-xl bg-black/50" />
          <span className="relative font-medium">
            {isLoading ? "Processing..." : "Analyze Document"}
          </span>
        </button>
      </div>

      {/* Error message - only shown when there's an error */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl text-red-400">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 mr-2 mt-0.5" />
            <div>
              <p className="font-medium mb-1">Error analyzing document</p>
              <p>{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Summary results - only shown when there's a summary */}
      {summary && (
        <div className="bg-black/20 shadow-[0_4px_20px_-10px] shadow-purple-200/30 rounded-2xl p-8 border border-[#2A2A35]">
          {/* Summary header */}
          <div className="flex items-center mb-6">
            <div className="mr-3 p-2 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20">
              <FileText className="h-6 w-6 text-purple-400" />
            </div>
          </div>
          {/* Formatted summary content */}
          <div className="max-w-none px-6 py-5 rounded-xl bg-[#0f0f13] border border-[#2A2A35]">
            {/* {formatSummaryContent(summary)}  */}
            <p>{summary}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardContent;
