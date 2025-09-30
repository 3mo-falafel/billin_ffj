"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { createClient } from "@/lib/supabase/client"
import { Plus, Edit, Trash2, Save, X, Eye, EyeOff } from "lucide-react"

interface NewsTickerItem {
  id: string
  text_en: string
  text_ar: string
  is_active: boolean
  order_index: number
  created_at: string
}

export function NewsTickerAdmin() {
  const [items, setItems] = useState<NewsTickerItem[]>([])
  const [loading, setLoading] = useState(true)
  const [editingItem, setEditingItem] = useState<NewsTickerItem | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    text_en: "",
    text_ar: "",
    is_active: true,
    order_index: 0
  })

  useEffect(() => {
    loadItems()
  }, [])

  async function loadItems() {
    try {
      setLoading(true)
      const supabase = createClient()
      const { data, error } = await supabase
        .from("news_ticker")
        .select("*")
        .order("order_index", { ascending: true })
      
      if (error) throw error
      setItems(data || [])
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to load news items",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  async function saveItem() {
    try {
      const supabase = createClient()
      
      if (editingItem) {
        // Update existing item
        const { error } = await supabase
          .from("news_ticker")
          .update({
            text_en: formData.text_en,
            text_ar: formData.text_ar,
            is_active: formData.is_active,
            order_index: formData.order_index
          })
          .eq("id", editingItem.id)
        
        if (error) throw error
        
        toast({
          title: "Success",
          description: "News item updated successfully"
        })
      } else {
        // Create new item
        const { error } = await supabase
          .from("news_ticker")
          .insert([{
            text_en: formData.text_en,
            text_ar: formData.text_ar,
            is_active: formData.is_active,
            order_index: formData.order_index || items.length
          }])
        
        if (error) throw error
        
        toast({
          title: "Success",
          description: "News item created successfully"
        })
      }
      
      resetForm()
      loadItems()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save news item",
        variant: "destructive"
      })
    }
  }

  async function deleteItem(id: string) {
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from("news_ticker")
        .delete()
        .eq("id", id)
      
      if (error) throw error
      
      toast({
        title: "Success",
        description: "News item deleted successfully"
      })
      
      loadItems()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete news item",
        variant: "destructive"
      })
    }
  }

  async function toggleActive(id: string, currentState: boolean) {
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from("news_ticker")
        .update({ is_active: !currentState })
        .eq("id", id)
      
      if (error) throw error
      loadItems()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update status",
        variant: "destructive"
      })
    }
  }

  function editItem(item: NewsTickerItem) {
    setEditingItem(item)
    setFormData({
      text_en: item.text_en,
      text_ar: item.text_ar,
      is_active: item.is_active,
      order_index: item.order_index
    })
    setIsCreating(true)
  }

  function resetForm() {
    setEditingItem(null)
    setIsCreating(false)
    setFormData({
      text_en: "",
      text_ar: "",
      is_active: true,
      order_index: 0
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading news ticker items...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">News Ticker Management</h2>
          <p className="text-muted-foreground">Manage the scrolling news ticker that appears at the top of all pages</p>
        </div>
        <Button onClick={() => setIsCreating(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          Add News Item
        </Button>
      </div>

      {/* Create/Edit Form */}
      {isCreating && (
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              {editingItem ? "Edit News Item" : "Create New News Item"}
              <Button variant="ghost" size="sm" onClick={resetForm}>
                <X className="w-4 h-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="text_en">English Text</Label>
                <Textarea
                  id="text_en"
                  placeholder="Enter news text in English..."
                  value={formData.text_en}
                  onChange={(e) => setFormData({ ...formData, text_en: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="text_ar">Arabic Text</Label>
                <Textarea
                  id="text_ar"
                  placeholder="أدخل نص الخبر باللغة العربية..."
                  value={formData.text_ar}
                  onChange={(e) => setFormData({ ...formData, text_ar: e.target.value })}
                  className="text-right arabic-text"
                  rows={3}
                />
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
                <Label htmlFor="is_active">Active</Label>
              </div>
              
              <div className="flex items-center gap-2">
                <Label htmlFor="order_index">Order:</Label>
                <Input
                  id="order_index"
                  type="number"
                  value={formData.order_index}
                  onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) || 0 })}
                  className="w-20"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={saveItem} className="gap-2">
                <Save className="w-4 h-4" />
                {editingItem ? "Update" : "Create"}
              </Button>
              <Button variant="outline" onClick={resetForm}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* News Items List */}
      <div className="space-y-4">
        {items.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">No news ticker items found.</p>
              <Button onClick={() => setIsCreating(true)} className="mt-4 gap-2">
                <Plus className="w-4 h-4" />
                Create First Item
              </Button>
            </CardContent>
          </Card>
        ) : (
          items.map((item) => (
            <Card key={item.id} className={item.is_active ? "border-green-200" : "border-gray-200"}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant={item.is_active ? "default" : "secondary"}>
                        {item.is_active ? "Active" : "Inactive"}
                      </Badge>
                      <Badge variant="outline">Order: {item.order_index}</Badge>
                    </div>
                    <div className="space-y-1">
                      <p className="font-medium">English: {item.text_en}</p>
                      <p className="text-right arabic-text text-muted-foreground">Arabic: {item.text_ar}</p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Created: {new Date(item.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleActive(item.id, item.is_active)}
                      title={item.is_active ? "Deactivate" : "Activate"}
                    >
                      {item.is_active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => editItem(item)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteItem(item.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
