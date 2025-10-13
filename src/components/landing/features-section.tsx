import { cn } from "@/lib/utils";
import {
  Users,
  CalendarCheck,
  Wallet,
  Boxes,
  Handshake,
  Bell,
  ShieldCheck,
  BarChart3,
} from "lucide-react"
import Reveal from "../animations/Reveal";

export default function FeaturesSection() {
  const features = [
  {
    title: "Group Management",
    description:
      "Kelola anggota, peran, dan aktivitas grup dengan mudah dalam satu tempat.",
    icon: <Users />,
  },
  {
    title: "Event & Schedule",
    description:
      "Buat, atur, dan ingatkan jadwal acara grup dengan kalender interaktif.",
    icon: <CalendarCheck />,
  },
  {
    title: "Finance Tracking",
    description:
      "Catat iuran, pengeluaran, dan laporan keuangan grup secara transparan.",
    icon: <Wallet />,
  },
  {
    title: "Asset Management",
    description:
      "Kelola inventaris dan aset bersama dengan pencatatan yang rapi.",
    icon: <Boxes />,
  },
  {
    title: "Cooperative Features",
    description:
      "Dukung koperasi internal dengan simpan pinjam dan pembagian hasil.",
    icon: <Handshake />,
  },
  {
    title: "Notifications",
    description:
      "Dapatkan notifikasi real-time untuk update acara, pesan, dan keuangan.",
    icon: <Bell />,
  },
  {
    title: "Privacy & Security",
    description:
      "Data grup terlindungi dengan enkripsi end-to-end dan kontrol akses.",
    icon: <ShieldCheck />,
  },
  {
    title: "Analytics & Insights",
    description:
      "Pantau aktivitas grup dengan statistik dan laporan visual yang jelas.",
    icon: <BarChart3 />,
  },
]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4  relative z-10 py-10 max-w-7xl mx-auto">
      {features.map((feature, index) => (
        <Reveal key={feature.title} delay={index * 0.2}>
          <Feature key={feature.title} {...feature} index={index} />
        </Reveal>
      ))}
    </div>
  );
}

const Feature = ({
  title,
  description,
  icon,
  index,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  index: number;
}) => {
  return (
    <div
      className={cn(
        "flex flex-col lg:border-r  py-10 relative group/feature dark:border-neutral-800",
        (index === 0 || index === 4) && "lg:border-l dark:border-neutral-800",
        index < 4 && "lg:border-b dark:border-neutral-800"
      )}
    >
      {index < 4 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-t from-neutral-100 dark:from-neutral-800 to-transparent pointer-events-none" />
      )}
      {index >= 4 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-b from-neutral-100 dark:from-neutral-800 to-transparent pointer-events-none" />
      )}
      <div className="mb-4 relative z-10 px-10 text-neutral-600 dark:text-neutral-400">
        {icon}
      </div>
      <div className="text-lg font-bold mb-2 relative z-10 px-10">
        <div className="absolute left-0 inset-y-0 h-6 group-hover/feature:h-8 w-1 rounded-tr-full rounded-br-full bg-neutral-300 dark:bg-neutral-700 group-hover/feature:bg-blue-500 transition-all duration-200 origin-center" />
        <span className="group-hover/feature:translate-x-2 transition duration-200 inline-block text-neutral-800 dark:text-neutral-100">
          {title}
        </span>
      </div>
      <p className="text-sm text-neutral-600 dark:text-neutral-300 max-w-xs relative z-10 px-10">
        {description}
      </p>
    </div>
  );
};


