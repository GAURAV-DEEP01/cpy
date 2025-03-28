import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AdminContentList } from "@/components/admin-content-list"
import { AdminStats } from "@/components/admin-stats"

export default function AdminPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col space-y-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>

        <AdminStats />

        <Tabs defaultValue="all" className="w-full">
          <TabsList>
            <TabsTrigger value="all">All Content</TabsTrigger>
            <TabsTrigger value="code">Code</TabsTrigger>
            <TabsTrigger value="link">Links</TabsTrigger>
            <TabsTrigger value="img">Images</TabsTrigger>
          </TabsList>
          <TabsContent value="all">
            <Card>
              <CardHeader>
                <CardTitle>All Content</CardTitle>
                <CardDescription>Manage all shared content across the platform</CardDescription>
              </CardHeader>
              <CardContent>
                <AdminContentList type="all" />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="code">
            <Card>
              <CardHeader>
                <CardTitle>Code Snippets</CardTitle>
                <CardDescription>Manage shared code snippets</CardDescription>
              </CardHeader>
              <CardContent>
                <AdminContentList type="code" />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="link">
            <Card>
              <CardHeader>
                <CardTitle>Links</CardTitle>
                <CardDescription>Manage shared links</CardDescription>
              </CardHeader>
              <CardContent>
                <AdminContentList type="link" />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="img">
            <Card>
              <CardHeader>
                <CardTitle>Images</CardTitle>
                <CardDescription>Manage shared images</CardDescription>
              </CardHeader>
              <CardContent>
                <AdminContentList type="img" />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

