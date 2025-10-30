"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { UserPlus, Search, MoreVertical, Trash2, Eye, Ban } from "lucide-react"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"
import { InviteUserModal } from "@/components/dashboard/invite-user-modal"

const staffMembers = [
  { id: 1, name: "David Wilson", email: "david@example.com", role: "Admin", status: "Active", joinDate: "2024-01-15" },
  { id: 2, name: "Lisa Anderson", email: "lisa@example.com", role: "Viewer", status: "Active", joinDate: "2024-02-20" },
  { id: 3, name: "James Taylor", email: "james@example.com", role: "Editor", status: "Active", joinDate: "2024-01-10" },
  {
    id: 4,
    name: "Maria Garcia",
    email: "maria@example.com",
    role: "Viewer",
    status: "Inactive",
    joinDate: "2024-03-05",
  },
  {
    id: 5,
    name: "Robert Martinez",
    email: "robert@example.com",
    role: "Editor",
    status: "Active",
    joinDate: "2024-02-28",
  },
  {
    id: 6,
    name: "Jennifer Lee",
    email: "jennifer@example.com",
    role: "Admin",
    status: "Active",
    joinDate: "2024-03-12",
  },
  {
    id: 7,
    name: "Christopher Brown",
    email: "chris@example.com",
    role: "Editor",
    status: "Active",
    joinDate: "2024-03-18",
  },
  {
    id: 8,
    name: "Amanda White",
    email: "amanda@example.com",
    role: "Viewer",
    status: "Active",
    joinDate: "2024-03-20",
  },
  {
    id: 9,
    name: "Daniel Harris",
    email: "daniel@example.com",
    role: "Admin",
    status: "Active",
    joinDate: "2024-03-22",
  },
  {
    id: 10,
    name: "Michelle Clark",
    email: "michelle@example.com",
    role: "Editor",
    status: "Inactive",
    joinDate: "2024-03-25",
  },
]

const ITEMS_PER_PAGE = 5

export default function StaffMembersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")
  const [currentPage, setCurrentPage] = useState(1)
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false)
  const [selectedMember, setSelectedMember] = useState<(typeof staffMembers)[0] | null>(null)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const { toast } = useToast()

  const filteredMembers = staffMembers.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "All" || member.status === statusFilter
    return matchesSearch && matchesStatus
  })

  // Calculate pagination
  const totalPages = Math.ceil(filteredMembers.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const paginatedMembers = filteredMembers.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  // Reset to page 1 when filters change
  const handleSearch = (value: string) => {
    setSearchTerm(value)
    setCurrentPage(1)
  }

  const handleStatusFilter = (value: string) => {
    setStatusFilter(value)
    setCurrentPage(1)
  }

  const handleInviteUser = () => {
    setIsInviteModalOpen(true)
  }

  const handleView = (member: (typeof staffMembers)[0]) => {
    toast({
      title: "View Member",
      description: `Viewing details for ${member.name}`,
    })
  }

  const handleSuspend = (member: (typeof staffMembers)[0]) => {
    toast({
      title: "Member Suspended",
      description: `${member.name} has been suspended`,
    })
  }

  const handleDelete = (member: (typeof staffMembers)[0]) => {
    setSelectedMember(member)
    setDeleteConfirmOpen(true)
  }

  const confirmDelete = () => {
    if (selectedMember) {
      toast({
        title: "Member Deleted",
        description: `${selectedMember.name} has been removed from the team`,
      })
      setDeleteConfirmOpen(false)
      setSelectedMember(null)
    }
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold">Staff Members</h1>
            <p className="text-muted-foreground mt-1">Manage your staff members and their roles</p>
          </div>
          <Button onClick={handleInviteUser} className="bg-primary text-white hover:bg-ring gap-2">
            <UserPlus className="w-4 h-4" />
            Invite User
          </Button>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card className="glass-panel border-border">
          <CardHeader>
            <CardTitle>All Staff Members</CardTitle>
            <CardDescription>Total: {filteredMembers.length} members</CardDescription>
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
                  aria-label="Search staff members"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => handleStatusFilter(e.target.value)}
                className="px-3 py-2 rounded-md border border-border/50 bg-input/50 text-foreground"
              >
                <option>All</option>
                <option>Active</option>
                <option>Inactive</option>
              </select>
            </div>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-muted">
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Join Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedMembers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        {filteredMembers.length === 0 && (searchTerm || statusFilter !== "All")
                          ? "No staff members match your filters."
                          : "No staff members available."}
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedMembers.map((member, idx) => (
                      <motion.tr
                        key={member.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="border-border hover:bg-muted transition-colors"
                      >
                        <TableCell className="font-medium">#{member.id}</TableCell>
                        <TableCell>{member.name}</TableCell>
                        <TableCell>{member.email}</TableCell>
                        <TableCell>
                          <span className="px-2 py-1 rounded-full text-xs font-semibold bg-muted text-muted-foreground">
                            {member.role}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              member.status === "Active" ? "bg-accent/20 text-accent" : "bg-secondary/20 text-secondary"
                            }`}
                          >
                            {member.status}
                          </span>
                        </TableCell>
                        <TableCell>{member.joinDate}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="hover:bg-muted">
                                <MoreVertical className="w-4 h-4 text-muted-foreground" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="glass-panel">
                              <DropdownMenuItem onClick={() => handleView(member)} className="cursor-pointer">
                                <Eye className="w-4 h-4 mr-2" />
                                View
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleSuspend(member)} className="cursor-pointer">
                                <Ban className="w-4 h-4 mr-2" />
                                Suspend
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDelete(member)}
                                className="cursor-pointer text-destructive focus:text-destructive"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
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

      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent className="glass-panel">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Staff Member</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedMember?.name}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-3 justify-end">
            <AlertDialogCancel className="glass-panel">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      <InviteUserModal open={isInviteModalOpen} onOpenChange={setIsInviteModalOpen} />
    </div>
  )
}
