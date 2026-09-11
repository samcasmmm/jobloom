import { Hero } from "@/components";
import { constructMetadata } from "@/lib/seo";

export const metadata = constructMetadata({
  title: "Next-Gen AI Career Discovery & Local-First Application Tracker",
  description:
    "Track job applications, interview stages, and follow-ups with local IndexedDB storage, neural skill matching, and full JSON portability.",
});

export default function Home() {
  return (
    <div className="min-h-screen w-full bg-[#0a0a0f]">
      <Hero />
    </div>
  );
}
