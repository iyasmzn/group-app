import StatusCard from '@/components/status-card'

export default function FinancePage() {
  return (
    <div className="max-w-4xl mx-auto">
      <StatusCard
        title="Coming Soon"
        description="Saat ini fitur finance sedang dalam masa pengembangan. Mohon bersabar 🙏"
        variant="soon"
        actionLabel="Kembali"
        actionHref="dashboard"
        shineBorder
      />
    </div>
  )
}
