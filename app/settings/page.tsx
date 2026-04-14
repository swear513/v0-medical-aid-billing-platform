"use client"

import { useStore } from "@/lib/store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Settings, 
  Building2, 
  Bell,
  Shield,
  Database,
  RefreshCcw,
  Download,
  Upload,
  Trash2,
  Info,
  CheckCircle
} from "lucide-react"
import { useState } from "react"

export default function SettingsPage() {
  const { currentRole, resetStore } = useStore()
  const [saved, setSaved] = useState(false)

  const canManage = ["administrator"].includes(currentRole)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  if (!canManage) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <Shield className="h-12 w-12 text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold">Access Restricted</h2>
        <p className="text-muted-foreground">Only administrators can access system settings</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Configure system preferences and manage data
          </p>
        </div>
        {saved && (
          <Alert className="w-auto border-emerald-500/50 bg-emerald-500/10">
            <CheckCircle className="h-4 w-4 text-emerald-500" />
            <AlertDescription className="text-emerald-500">
              Settings saved successfully
            </AlertDescription>
          </Alert>
        )}
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="notifications">Alerts</TabsTrigger>
          <TabsTrigger value="data">Data</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Practice Information
              </CardTitle>
              <CardDescription>
                Configure your practice details for claim submissions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="practice-name">Practice Name</Label>
                  <Input id="practice-name" defaultValue="SA Medical Practice" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="practice-number">Practice Number</Label>
                  <Input id="practice-number" defaultValue="PR12345678" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hpcsa">HPCSA Number</Label>
                  <Input id="hpcsa" defaultValue="MP1234567" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vat">VAT Number</Label>
                  <Input id="vat" defaultValue="4123456789" />
                </div>
              </div>
              <Separator />
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="email">Contact Email</Label>
                  <Input id="email" type="email" defaultValue="billing@practice.co.za" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Contact Phone</Label>
                  <Input id="phone" defaultValue="+27 11 123 4567" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Physical Address</Label>
                <Input id="address" defaultValue="123 Medical Centre, Sandton, Johannesburg, 2196" />
              </div>
              <Button onClick={handleSave}>Save Changes</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Display Preferences</CardTitle>
              <CardDescription>Customize the interface</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Compact Tables</Label>
                  <p className="text-sm text-muted-foreground">Use smaller row heights in data tables</p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Show Claim Thumbnails</Label>
                  <p className="text-sm text-muted-foreground">Display document previews in claim lists</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Auto-refresh Dashboard</Label>
                  <p className="text-sm text-muted-foreground">Automatically update statistics every 5 minutes</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Billing Defaults</CardTitle>
              <CardDescription>Default values for new claims</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Default Currency</Label>
                  <Select defaultValue="ZAR">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ZAR">South African Rand (ZAR)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>VAT Rate (%)</Label>
                  <Input type="number" defaultValue="15" />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Auto-calculate VAT</Label>
                  <p className="text-sm text-muted-foreground">Automatically add VAT to applicable line items</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Require ICD-10 Codes</Label>
                  <p className="text-sm text-muted-foreground">Enforce ICD-10 coding for all claims</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Submission Settings</CardTitle>
              <CardDescription>Configure claim submission behavior</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Auto-validate Before Submission</Label>
                  <p className="text-sm text-muted-foreground">Run validation rules before submitting claims</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Batch Submissions</Label>
                  <p className="text-sm text-muted-foreground">Allow multiple claims to be submitted together</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="space-y-2">
                <Label>Submission Timeout (seconds)</Label>
                <Input type="number" defaultValue="30" className="max-w-32" />
              </div>
              <Button onClick={handleSave}>Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Preferences
              </CardTitle>
              <CardDescription>
                Configure when and how you receive alerts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Claim Status Updates</Label>
                  <p className="text-sm text-muted-foreground">Get notified when claim status changes</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Payment Received</Label>
                  <p className="text-sm text-muted-foreground">Alert when remittance advice is received</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Validation Errors</Label>
                  <p className="text-sm text-muted-foreground">Immediate alerts for failed validations</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Rule Changes</Label>
                  <p className="text-sm text-muted-foreground">Notify when billing rules are updated</p>
                </div>
                <Switch />
              </div>
              <Separator />
              <div className="space-y-2">
                <Label>Email for Notifications</Label>
                <Input type="email" defaultValue="alerts@practice.co.za" />
              </div>
              <Button onClick={handleSave}>Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="data" className="space-y-6">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              This demo uses in-memory storage with localStorage persistence. Data is stored locally in your browser.
            </AlertDescription>
          </Alert>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Data Management
              </CardTitle>
              <CardDescription>
                Export, import, or reset your data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <Label>Export All Data</Label>
                  <p className="text-sm text-muted-foreground">Download all claims, rules, and settings as JSON</p>
                </div>
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <Label>Import Data</Label>
                  <p className="text-sm text-muted-foreground">Restore from a previously exported file</p>
                </div>
                <Button variant="outline">
                  <Upload className="mr-2 h-4 w-4" />
                  Import
                </Button>
              </div>
              <Separator />
              <div className="flex items-center justify-between p-4 border border-destructive/50 rounded-lg bg-destructive/5">
                <div>
                  <Label className="text-destructive">Reset to Demo Data</Label>
                  <p className="text-sm text-muted-foreground">Clear all changes and restore demo scenarios</p>
                </div>
                <Button 
                  variant="destructive" 
                  onClick={() => {
                    if (confirm("Are you sure? This will reset all data to the initial demo state.")) {
                      resetStore()
                      window.location.reload()
                    }
                  }}
                >
                  <RefreshCcw className="mr-2 h-4 w-4" />
                  Reset
                </Button>
              </div>
              <div className="flex items-center justify-between p-4 border border-destructive/50 rounded-lg bg-destructive/5">
                <div>
                  <Label className="text-destructive">Clear All Data</Label>
                  <p className="text-sm text-muted-foreground">Permanently delete all data from local storage</p>
                </div>
                <Button 
                  variant="destructive"
                  onClick={() => {
                    if (confirm("Are you sure? This will permanently delete all data.")) {
                      localStorage.clear()
                      window.location.reload()
                    }
                  }}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Clear
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Storage Status</CardTitle>
              <CardDescription>Current data storage usage</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-4">
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <p className="text-2xl font-bold">11</p>
                  <p className="text-sm text-muted-foreground">Demo Claims</p>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <p className="text-2xl font-bold">9</p>
                  <p className="text-sm text-muted-foreground">Active Rules</p>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <p className="text-2xl font-bold">5</p>
                  <p className="text-sm text-muted-foreground">Medical Schemes</p>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <p className="text-2xl font-bold">3</p>
                  <p className="text-sm text-muted-foreground">Decision Bundles</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
