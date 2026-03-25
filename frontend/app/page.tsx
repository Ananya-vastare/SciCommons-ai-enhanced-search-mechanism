"use client";

import React, { useState, FormEvent } from 'react';
import './globals.css';

interface PaperResult {
  title: string;
  authors: string[];
  summary: string;
  published: string;
  arxiv_id: string;
}

interface ApiResponse {
  status: string;
  saved_id: number;
  paper: PaperResult;
  query_embeddings: number[];
  summary_embeddings_shape: number[];
}

export default function Page() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [result, setResult] = useState<ApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSubmitting(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch(
        `http://localhost:8000/api/search/?query=${encodeURIComponent(searchQuery)}`
      );

      const data = await response.json();

      if (response.ok) {
        setResult(data);
        setSearchQuery("");
      } else {
        setError(data.error || "Something went wrong.");
      }
    } catch (error) {
      setError("Could not connect to the server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="container">
      <div className="upload-card">
        <h1 className="title">AI enhanced Search query</h1>

        <form onSubmit={handleSubmit} className="search-wrapper">
          <input
            type="text"
            placeholder="Type your query here..."
            className="search-input-unique"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            type="submit"
            className="submit-btn-unique"
            disabled={isSubmitting}
          >
            {isSubmitting ? "..." : "Search"}
          </button>
        </form>

        {error && <p style={{ color: "red" }}>{error}</p>}

        {result && (
          <div>
            <h2>{result.paper.title}</h2>
            <p>{result.paper.authors.join(", ")}</p>
            <p>{result.paper.summary}</p>
            <p>Published: {result.paper.published}</p>
            <p>arXiv ID: {result.paper.arxiv_id}</p>
          </div>
        )}
      </div>
    </main>
  );
}