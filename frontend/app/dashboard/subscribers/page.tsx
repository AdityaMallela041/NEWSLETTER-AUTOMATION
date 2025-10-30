"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mail, Search } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useState } from "react"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

const subscribers = [
  {
    id: 1,
    name: "Alice Brown",
    email: "alice@example.com",
    subscriptionDate: "2024-01-15",
    status: "Active",
    source: "Website",
    tags: ["Tech", "News"],
  },
  {
    id: 2,
    name: "Bob Wilson",
    email: "bob@example.com",
    subscriptionDate: "2024-02-20",
    status: "Active",
    source: "Email Campaign",
    tags: ["Business"],
  },
  {
    id: 3,
    name: "Carol Davis",
    email: "carol@example.com",
    subscriptionDate: "2024-01-10",
    status: "Unsubscribed",
    source: "Website",
    tags: ["Design"],
  },
  {
    id: 4,
    name: "David Miller",
    email: "david@example.com",
    subscriptionDate: "2024-03-05",
    status: "Active",
    source: "Referral",
    tags: ["Tech", "Business"],
  },
  {
    id: 5,
    name: "Emma Taylor",
    email: "emma@example.com",
    subscriptionDate: "2024-02-28",
    status: "Active",
    source: "Website",
    tags: ["Marketing"],
  },
  {
    id: 6,
    name: "Frank Anderson",
    email: "frank@example.com",
    subscriptionDate: "2024-03-12",
    status: "Active",
    source: "Email Campaign",
    tags: ["Tech"],
  },
  {
    id: 7,
    name: "Grace Lee",
    email: "grace@example.com",
    subscriptionDate: "2024-03-18",
    status: "Active",
    source: "Website",
    tags: ["News", "Tech"],
  },
  {
    id: 8,
    name: "Henry Martinez",
    email: "henry@example.com",
    subscriptionDate: "2024-03-20",
    status: "Active",
    source: "Referral",
    tags: ["Business"],
  },
  {
    id: 9,
    name: "Iris Johnson",
    email: "iris@example.com",
    subscriptionDate: "2024-03-22",
    status: "Unsubscribed",
    source: "Email Campaign",
    tags: ["Design", "Tech"],
  },
  {
    id: 10,
    name: "Jack Thompson",
    email: "jack@example.com",
    subscriptionDate: "2024-03-25",
    status: "Active",
    source: "Website",
    tags: ["Marketing"],
  },
  {
    id: 11,
    name: "Karen White",
    email: "karen@example.com",
    subscriptionDate: "2024-03-27",
    status: "Active",
    source: "Referral",
    tags: ["Tech", "News"],
  },
  {
    id: 12,
    name: "Leo Garcia",
    email: "leo@example.com",
    subscriptionDate: "2024-03-29",
    status: "Active",
    source: "Website",
    tags: ["Business"],
  },
]

const ITEMS_PER_PAGE = 8

export default function SubscribersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")
  const [currentPage, setCurrentPage] = useState(1)

  const filteredSubscribers = subscribers.filter((sub) => {
    const matchesSearch =
      sub.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "All" || sub.status === statusFilter
    return matchesSearch && matchesStatus
  })

  // Calculate pagination
  const totalPages = Math.ceil(filteredSubscribers.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const paginatedSubscribers = filteredSubscribers.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  // Reset to page 1 when filters change
  const handleSearch = (value: string) => {
    setSearchTerm(value)
    setCurrentPage(1)
  }

  const handleStatusFilter = (value: string) => {
    setStatusFilter(value)
    setCurrentPage(1)
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <div>
          <h1 className="text-3xl font-bold">Subscribers</h1>
          <p className="text-muted-foreground mt-1">Manage and view all your newsletter subscribers</p>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card className="glass-panel border-border">
          <CardHeader>
            <CardTitle>All Subscribers</CardTitle>
            <CardDescription>Total: {filteredSubscribers.length} subscribers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-6 flex gap-3 flex-col md:flex-row">
              <div className="flex-1 flex items-center gap-3 bg-input/50 rounded-lg px-4 py-3 border border-border/50">
                <Search className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                <Input
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="bg-transparent border-0 text-base placeholder-muted-foreground focus:outline-none flex-1"
                  aria-label="Search subscribers"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => handleStatusFilter(e.target.value)}
                className="px-3 py-2 rounded-md border border-border/50 bg-input/50 text-foreground"
              >
                <option>All</option>
                <option>Active</option>
                <option>Unsubscribed</option>
              </select>
            </div>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-muted">
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Subscription Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Tags</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedSubscribers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                        {filteredSubscribers.length === 0 && (searchTerm || statusFilter !== "All")
                          ? "No subscribers match your filters."
                          : "No subscribers available."}
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedSubscribers.map((sub, idx) => (
                      <motion.tr
                        key={sub.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="border-border hover:bg-muted transition-colors"
                      >
                        <TableCell className="font-medium">#{sub.id}</TableCell>
                        <TableCell>{sub.name}</TableCell>
                        <TableCell>{sub.email}</TableCell>
                        <TableCell>{sub.subscriptionDate}</TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              sub.status === "Active" ? "bg-accent/20 text-accent" : "bg-secondary/20 text-secondary"
                            }`}
                          >
                            {sub.status}
                          </span>
                        </TableCell>
                        <TableCell>{sub.source}</TableCell>
                        <TableCell>
                          <div className="flex gap-1 flex-wrap">
                            {sub.tags.map((tag) => (
                              <span key={tag} className="px-2 py-1 rounded-full text-xs bg-muted text-muted-foreground">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" className="hover:bg-muted">
                            <Mail className="w-4 h-4 text-primary" />
                          </Button>
                        </TableCell>
                      </motion.tr>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {totalPages > 1 && (
              <div className="mt-6 pt-6 border-t border-border">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                          e.preventDefault()
                          if (currentPage > 1) setCurrentPage(currentPage - 1)
                        }}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          href="#"
                          isActive={page === currentPage}
                          onClick={(e) => {
                            e.preventDefault()
                            setCurrentPage(page)
                          }}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    ))}

                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={(e) => {
                          e.preventDefault()
                          if (currentPage < totalPages) setCurrentPage(currentPage + 1)
                        }}
                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
