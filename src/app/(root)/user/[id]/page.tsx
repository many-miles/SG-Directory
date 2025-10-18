// src/app/(root)/user/[id]/page.tsx
import { auth } from "../../../../../auth";
import { client } from "@/sanity/lib/client";
import { AUTHOR_BY_ID_QUERY } from "@/sanity/lib/queries";
import { notFound } from "next/navigation";
import Image from "next/image";
import UserServices from "@/components/UserServices";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export const experimental_ppr = true;

const EnhancedServiceCardSkeleton = () => (
  <div className="service-card">
    <div className="flex flex-col gap-4 p-6">
      <div className="flex justify-between items-start">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-16" />
      </div>
      <Skeleton className="h-40 w-full rounded-lg" />
      <div className="space-y-2">
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-4 w-20" />
        </div>
        <Skeleton className="h-8 w-20" />
      </div>
    </div>
  </div>
);

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const id = (await params).id;
  const session = await auth();

  const user = await client.fetch(AUTHOR_BY_ID_QUERY, { id });
  if (!user) return notFound();

  return (
    <section className="profile_container flex flex-col md:flex-row items-start gap-8 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="profile_card flex-shrink-0 w-full md:w-80 lg:w-96 max-w-xs md:max-w-sm lg:max-w-md">
        <div className="profile_title">
          <h3 className="text-24-black uppercase text-center line-clamp-1">{user.name}</h3>
        </div>

        <Image
          src={user.image || "/default-avatar.png"}
          alt={user.name || "User"}
          width={220}
          height={220}
          className="profile_image mx-auto"
        />

        <p className="text-30-bold mt-7 text-center">@{user?.username}</p>
        <p className="mt-1 text-center text-14-normal">{user?.bio}</p>
      </div>

      <div className="flex-1 w-full min-w-0">
        <p className="text-30-bold mb-4">
          {session?.user?.id === id ? "Your" : "All"} Services
        </p>

        <div className="w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <Suspense
              fallback={
                <>
                  {Array.from({ length: 6 }).map((_, i) => (
                    <EnhancedServiceCardSkeleton key={i} />
                  ))}
                </>
              }
            >
              <UserServices id={id} />
            </Suspense>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Page;