import type React from "react";
import { PageHeader } from "@/components/page-header";
import { ProfileSidebar } from "@/components/profile-sidebar";
import Footer from "@/components/footer";
import Navbar from "@/components/navbar";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <Navbar />
      <PageHeader
        title="My Profile"
        description="Lorem ipsum dolor sit amet consectetur. At in pretium semper vitae eu eu mus."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "My Profile" }]}
      />

      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-8">
            <ProfileSidebar />
            <div className="flex-1">{children}</div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
