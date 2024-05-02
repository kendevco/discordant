"use client";
import * as React from "react";
import { Download, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function DbImportExport() {
  const [isImporting, setIsImporting] = React.useState(false);
  const [isExporting, setIsExporting] = React.useState(false);

  const handleImport = async () => {
    setIsImporting(true);
    try {
      if (window.confirm("Are you sure you want to import data? This action cannot be undone.")) {
        const response = await fetch('/api/db/import', { method: 'POST' });
        const data = await response.json();

        if (response.ok) {
          alert(data.message);
        } else {
          alert(data.error);
        }
      }
    } catch (error) {
      console.error("Error importing data:", error);
      alert("An error occurred while importing data.");
    } finally {
      setIsImporting(false);
    }
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      if (window.confirm("Are you sure you want to export data?")) {
        const response = await fetch('/api/db/export', { method: 'POST' });
        const data = await response.json();

        if (response.ok) {
          alert(data.message);
        } else {
          alert(data.error);
        }
      }
    } catch (error) {
      console.error("Error exporting data:", error);
      alert("An error occurred while exporting data.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="bg-transparent border-0" variant="outline" size="icon">
          <Download className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Import/Export Data</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleImport} disabled={isImporting}>
          <Upload className="h-[1.2rem] w-[1.2rem]" />
          {isImporting ? "Importing..." : "Import Data"}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleExport} disabled={isExporting}>
          <Download className="h-[1.2rem] w-[1.2rem]" />
          {isExporting ? "Exporting..." : "Export Data"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}