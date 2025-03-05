"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Code, ExternalLink, Eye, Flag, ImageIcon, Trash2 } from "lucide-react"

interface ContentItem {
  shortId: string
  type: "code" | "link" | "img"
  createdAt: string
  views: number
  flagged?: boolean
}

interface AdminContentListProps {
  type: "all" | "code" | "link" | "img"
}

export function AdminContentList({ type }: AdminContentListProps) {
  const [items, setItems] = useState<ContentItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/admin/content?type=${type}`)
        if (!response.ok) throw new Error('Failed to fetch data')
        const data = await response.json()
        setItems(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [type])

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "code":
        return <Code className="h-4 w-4" />
      case "link":
        return <ExternalLink className="h-4 w-4" />
      case "img":
        return <ImageIcon className="h-4 w-4" />
      default:
        return null
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "code":
        return "Code"
      case "link":
        return "Link"
      case "img":
        return "Image"
      default:
        return type
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  const handleFlagItem = async (shortId: string) => {
    try {
      const response = await fetch(`/api/admin/content/${shortId}/flag`, {
        method: 'PATCH'
      })

      if (!response.ok) throw new Error('Failed to update flag status')

      setItems(prevItems =>
        prevItems.map(item =>
          item.shortId === shortId ? { ...item, flagged: !item.flagged } : item
        )
      )
    } catch (err) {
      console.error('Error updating flag status:', err)
    }
  }

  const handleDeleteClick = (shortId: string) => {
    setItemToDelete(shortId)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return

    try {
      const response = await fetch(`/api/admin/content/${itemToDelete}`, {
        method: 'DELETE'
      })

      if (!response.ok) throw new Error('Failed to delete item')

      setItems(prevItems => prevItems.filter(item => item.shortId !== itemToDelete))
      setItemToDelete(null)
      setDeleteDialogOpen(false)
    } catch (err) {
      console.error('Error deleting content:', err)
    }
  }

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 w-full rounded bg-muted"></div>
        <div className="h-8 w-full rounded bg-muted"></div>
        <div className="h-8 w-full rounded bg-muted"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-md border p-4 text-destructive">
        Error loading content: {error}
      </div>
    )
  }


  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Short ID</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Views</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  No content found
                </TableCell>
              </TableRow>
            ) : (
              items.map((item) => (
                <TableRow key={item.shortId}>
                  <TableCell className="font-mono">{item.shortId}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="flex w-20 items-center justify-center space-x-1">
                      {getTypeIcon(item.type)}
                      <span>{getTypeLabel(item.type)}</span>
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(item.createdAt)}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Eye className="h-4 w-4 text-muted-foreground" />
                      <span>{item.views}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {item.flagged ? (
                      <Badge variant="destructive">Flagged</Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                      >
                        Active
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleFlagItem(item.shortId)}
                        className={item.flagged ? "text-destructive" : ""}
                      >
                        <Flag className="h-4 w-4" />
                        <span className="sr-only">{item.flagged ? "Unflag" : "Flag"}</span>
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(item.shortId)}>
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this content and remove it from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

