"use client"
// import { JobsTable } from "@/components/dashboard/jobs/jobs-table";
// import { JobSummaryCards } from "@/components/dashboard/jobs/job-summary-cards";
import { DashboardDateFilter } from "@/components/shared/dashboard-date-filter"
export default function OverviewPage() {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            Home
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            View and analyze you financial reports.
          </p>
        </div>
        <div className="flex flex-col justify-between gap-3 xl:flex-row xl:items-start">
          <DashboardDateFilter />
        </div>
      </div>

      {/* Summary cards */}
      {/* <JobSummaryCards /> */}

      {/* Jobs Table*/}
      {/* <JobsTable /> */}
    </div>
  )
}
