"use client"

import type { SearchResult } from "@/lib/search-engine"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"

interface SearchResultsProps {
  results: SearchResult[]
  onResultClick?: (result: SearchResult) => void
}

export function SearchResults({ results, onResultClick }: SearchResultsProps) {
  if (results.length === 0) {
    return <div className="p-4 text-center text-muted-foreground">No results found</div>
  }

  return (
    <div className="max-h-96 overflow-y-auto">
      {results.map((result, idx) => (
        <motion.button
          key={result.id}
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.05 }}
          onClick={() => onResultClick?.(result)}
          className="w-full text-left px-4 py-3 hover:bg-muted/50 border-b border-border/20 last:border-b-0 transition-colors"
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <div
                className="font-medium text-sm text-foreground truncate"
                dangerouslySetInnerHTML={{ __html: result.highlightedTitle }}
              />
              {result.description && (
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{result.description}</p>
              )}
            </div>
            <Badge variant="outline" className="text-xs flex-shrink-0">
              {result.type}
            </Badge>
          </div>
        </motion.button>
      ))}
    </div>
  )
}
