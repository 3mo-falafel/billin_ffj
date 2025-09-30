"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { createClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { Search, Eye, Trash2, Users, Clock, CheckCircle, XCircle, Phone, Mail, Globe, User, FileText } from "lucide-react"

interface InvolvementRequest {
  id: string
  name: string
  nationality: string
  email: string
  phone_number: string
  involvement_type: string
  details?: string
  status: "pending" | "contacted" | "accepted" | "rejected"
  created_at: string
  updated_at: string
}

export function InvolvementRequestsAdmin() {
  const [requests, setRequests] = useState<InvolvementRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedRequest, setSelectedRequest] = useState<InvolvementRequest | null>(null)
  const { toast } = useToast()

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
    contacted: "bg-blue-100 text-blue-800 border-blue-200",
    accepted: "bg-green-100 text-green-800 border-green-200",
    rejected: "bg-red-100 text-red-800 border-red-200"
  }

  const statusIcons = {
    pending: Clock,
    contacted: Phone,
    accepted: CheckCircle,
    rejected: XCircle
  }

  const involvementTypeLabels: Record<string, string> = {
    volunteering: "Volunteering",
    education: "Educational Programs",
    advocacy: "Advocacy & Awareness",
    media: "Media & Documentation",
    arts: "Arts & Culture",
    community: "Community Organizing"
  }

  useEffect(() => {
    fetchRequests()
  }, [])

  const fetchRequests = async () => {
    setLoading(true)
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("involvement_requests")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) throw error
      setRequests(data || [])
    } catch (error: any) {
      console.error("Error fetching requests:", error)
      
      // Handle table not existing yet
      if (error.message?.includes("Could not find the table")) {
        toast({
          variant: "destructive",
          title: "Table Not Found",
          description: "The involvement_requests table hasn't been created yet. Please run the SQL script: scripts/006_create_involvement_requests_table.sql"
        })
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load involvement requests"
        })
      }
    } finally {
      setLoading(false)
    }
  }

  const updateRequestStatus = async (id: string, status: string) => {
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from("involvement_requests")
        .update({ status })
        .eq("id", id)

      if (error) throw error

      setRequests(prev => 
        prev.map(req => req.id === id ? { ...req, status: status as any } : req)
      )

      toast({
        title: "Success",
        description: `Request status updated to ${status}`
      })
    } catch (error: any) {
      console.error("Error updating status:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update request status"
      })
    }
  }

  const deleteRequest = async (id: string) => {
    if (!confirm("Are you sure you want to delete this request?")) return

    try {
      const supabase = createClient()
      const { error } = await supabase
        .from("involvement_requests")
        .delete()
        .eq("id", id)

      if (error) throw error

      setRequests(prev => prev.filter(req => req.id !== id))
      toast({
        title: "Success",
        description: "Request deleted successfully"
      })
    } catch (error: any) {
      console.error("Error deleting request:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete request"
      })
    }
  }

  const filteredRequests = requests.filter(request => {
    const matchesSearch = request.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.nationality.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || request.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusCounts = () => {
    return {
      total: requests.length,
      pending: requests.filter(r => r.status === "pending").length,
      contacted: requests.filter(r => r.status === "contacted").length,
      accepted: requests.filter(r => r.status === "accepted").length,
      rejected: requests.filter(r => r.status === "rejected").length
    }
  }

  const statusCounts = getStatusCounts()

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading involvement requests...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Involvement Requests</h1>
          <p className="text-muted-foreground">Manage community involvement applications</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{statusCounts.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold">{statusCounts.pending}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Phone className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Contacted</p>
                <p className="text-2xl font-bold">{statusCounts.contacted}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Accepted</p>
                <p className="text-2xl font-bold">{statusCounts.accepted}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-600" />
              <div>
                <p className="text-sm text-muted-foreground">Rejected</p>
                <p className="text-2xl font-bold">{statusCounts.rejected}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-4 items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search requests..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="contacted">Contacted</SelectItem>
            <SelectItem value="accepted">Accepted</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Requests Table */}
      <Card>
        <CardHeader>
          <CardTitle>Requests ({filteredRequests.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredRequests.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No involvement requests found</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Nationality</TableHead>
                  <TableHead>Involvement Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRequests.map((request) => {
                  const StatusIcon = statusIcons[request.status]
                  return (
                    <TableRow key={request.id}>
                      <TableCell className="font-medium">{request.name}</TableCell>
                      <TableCell>{request.email}</TableCell>
                      <TableCell>{request.nationality}</TableCell>
                      <TableCell>{involvementTypeLabels[request.involvement_type] || request.involvement_type}</TableCell>
                      <TableCell>
                        <Badge className={statusColors[request.status]}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(request.created_at).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedRequest(request)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Request Details</DialogTitle>
                                <DialogDescription>
                                  View and manage involvement request
                                </DialogDescription>
                              </DialogHeader>
                              {selectedRequest && (
                                <div className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                      <div className="flex items-center gap-2">
                                        <User className="h-4 w-4 text-muted-foreground" />
                                        <span className="font-medium">Name:</span>
                                      </div>
                                      <p>{selectedRequest.name}</p>
                                    </div>
                                    <div className="space-y-2">
                                      <div className="flex items-center gap-2">
                                        <Globe className="h-4 w-4 text-muted-foreground" />
                                        <span className="font-medium">Nationality:</span>
                                      </div>
                                      <p>{selectedRequest.nationality}</p>
                                    </div>
                                    <div className="space-y-2">
                                      <div className="flex items-center gap-2">
                                        <Mail className="h-4 w-4 text-muted-foreground" />
                                        <span className="font-medium">Email:</span>
                                      </div>
                                      <p>{selectedRequest.email}</p>
                                    </div>
                                    <div className="space-y-2">
                                      <div className="flex items-center gap-2">
                                        <Phone className="h-4 w-4 text-muted-foreground" />
                                        <span className="font-medium">Phone:</span>
                                      </div>
                                      <p>{selectedRequest.phone_number}</p>
                                    </div>
                                  </div>
                                  <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                      <Users className="h-4 w-4 text-muted-foreground" />
                                      <span className="font-medium">Involvement Type:</span>
                                    </div>
                                    <p>{involvementTypeLabels[selectedRequest.involvement_type] || selectedRequest.involvement_type}</p>
                                  </div>
                                  {selectedRequest.details && (
                                    <div className="space-y-2">
                                      <div className="flex items-center gap-2">
                                        <FileText className="h-4 w-4 text-muted-foreground" />
                                        <span className="font-medium">Additional Details:</span>
                                      </div>
                                      <p className="text-sm bg-muted p-3 rounded-md">{selectedRequest.details}</p>
                                    </div>
                                  )}
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium">Current Status:</span>
                                    <Badge className={statusColors[selectedRequest.status]}>
                                      {selectedRequest.status.charAt(0).toUpperCase() + selectedRequest.status.slice(1)}
                                    </Badge>
                                  </div>
                                  <div className="flex gap-2 pt-4">
                                    <Select
                                      value={selectedRequest.status}
                                      onValueChange={(status) => updateRequestStatus(selectedRequest.id, status)}
                                    >
                                      <SelectTrigger className="flex-1">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="pending">Pending</SelectItem>
                                        <SelectItem value="contacted">Contacted</SelectItem>
                                        <SelectItem value="accepted">Accepted</SelectItem>
                                        <SelectItem value="rejected">Rejected</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => deleteRequest(request.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
