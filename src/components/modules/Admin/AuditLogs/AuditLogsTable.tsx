"use client";

import { useState } from "react";
import { IAuditLog } from "@/services/admin/audit.service";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Download, Search, ShieldCheck, Eye } from "lucide-react";
import { toast } from "sonner";

interface AuditLogsTableProps {
  logs: IAuditLog[];
  meta: {
    page: number;
    limit: number;
    total: number;
  };
}

export default function AuditLogsTable({ logs, meta }: AuditLogsTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("ALL");
  const [selectedLog, setSelectedLog] = useState<IAuditLog | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      !searchTerm ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.userEmail &&
        log.userEmail.toLowerCase().includes(searchTerm.toLowerCase())) ||
      log.resourceType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.resourceId.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole =
      selectedRole === "ALL" || log.userRole?.toUpperCase() === selectedRole;

    return matchesSearch && matchesRole;
  });

  const handleExportCsv = async () => {
    try {
      setIsExporting(true);
      const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;
      const res = await fetch(
        `${BACKEND_API_URL}/admin/audit-logs/export-csv`,
        {
          credentials: "include",
        },
      );
      if (!res.ok) {
        throw new Error("Export failed");
      }
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `audit-logs-${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success("Audit logs exported to CSV successfully");
    } catch {
      toast.error("Failed to export audit logs");
    } finally {
      setIsExporting(false);
    }
  };

  const getActionBadgeVariant = (action: string) => {
    if (action.includes("CREATE") || action.includes("ACTIVE")) {
      return "default";
    }
    if (
      action.includes("DELETE") ||
      action.includes("BLOCK") ||
      action.includes("CANCEL")
    ) {
      return "destructive";
    }
    return "secondary";
  };

  return (
    <div className="space-y-4">
      {/* Controls Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-card p-4 rounded-xl border">
        <div className="flex flex-1 items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search action, email, resource..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 bg-background"
            />
          </div>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="h-9 px-3 rounded-md border border-input bg-background text-sm font-medium"
          >
            <option value="ALL">All Roles</option>
            <option value="ADMIN">ADMIN</option>
            <option value="SUPER_ADMIN">SUPER_ADMIN</option>
            <option value="DOCTOR">DOCTOR</option>
            <option value="PATIENT">PATIENT</option>
            <option value="SYSTEM">SYSTEM</option>
          </select>
        </div>

        <Button
          onClick={handleExportCsv}
          disabled={isExporting}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          {isExporting ? "Exporting..." : "Export CSV"}
        </Button>
      </div>

      {/* Audit Log Table */}
      <div className="rounded-xl border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Timestamp</TableHead>
              <TableHead>Actor</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Resource</TableHead>
              <TableHead>IP / Origin</TableHead>
              <TableHead className="text-right">Inspection</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLogs.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-8 text-muted-foreground"
                >
                  No audit trail records found.
                </TableCell>
              </TableRow>
            ) : (
              filteredLogs.map((log) => (
                <TableRow key={log.id} className="hover:bg-muted/30">
                  <TableCell className="text-xs font-mono text-muted-foreground whitespace-nowrap">
                    {new Date(log.createdAt).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium text-xs">
                        {log.userEmail || "System Automation"}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        {log.userRole || "SYSTEM"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={getActionBadgeVariant(log.action)}
                      className="text-[11px] font-mono"
                    >
                      {log.action}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col text-xs">
                      <span className="font-semibold">{log.resourceType}</span>
                      <span className="font-mono text-[10px] text-muted-foreground truncate max-w-[140px]">
                        {log.resourceId}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs font-mono text-muted-foreground">
                    {log.ipAddress || "Internal / CLI"}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setSelectedLog(log)}
                      className="h-8 w-8 p-0"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Total records footer */}
      <div className="flex justify-between items-center text-xs text-muted-foreground px-2">
        <span>
          Showing {filteredLogs.length} of {meta.total} audit events
        </span>
        <span className="flex items-center gap-1 font-medium">
          <ShieldCheck className="h-3.5 w-3.5 text-primary" /> Immutable
          Regulatory Log
        </span>
      </div>

      {/* Inspection Modal */}
      <Dialog open={!!selectedLog} onOpenChange={() => setSelectedLog(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              Audit Log Detail ({selectedLog?.action})
            </DialogTitle>
          </DialogHeader>

          {selectedLog && (
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-2 bg-muted p-3 rounded-lg font-mono">
                <div>
                  <span className="text-muted-foreground">Log ID: </span>
                  <span>{selectedLog.id}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Timestamp: </span>
                  <span>{new Date(selectedLog.createdAt).toISOString()}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Actor Email: </span>
                  <span>{selectedLog.userEmail || "System"}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Actor Role: </span>
                  <span>{selectedLog.userRole || "SYSTEM"}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">
                    Target Resource:{" "}
                  </span>
                  <span>
                    {selectedLog.resourceType} ({selectedLog.resourceId})
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">IP Address: </span>
                  <span>{selectedLog.ipAddress || "N/A"}</span>
                </div>
              </div>

              {selectedLog.oldData && (
                <div>
                  <h4 className="font-semibold text-muted-foreground mb-1">
                    Previous State (oldData):
                  </h4>
                  <pre className="bg-muted p-2 rounded text-[11px] overflow-x-auto">
                    {JSON.stringify(selectedLog.oldData, null, 2)}
                  </pre>
                </div>
              )}

              {selectedLog.newData && (
                <div>
                  <h4 className="font-semibold text-muted-foreground mb-1">
                    Updated State (newData):
                  </h4>
                  <pre className="bg-muted p-2 rounded text-[11px] overflow-x-auto">
                    {JSON.stringify(selectedLog.newData, null, 2)}
                  </pre>
                </div>
              )}

              {selectedLog.userAgent && (
                <div className="text-[11px] text-muted-foreground">
                  <span className="font-semibold">User Agent:</span>{" "}
                  {selectedLog.userAgent}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
