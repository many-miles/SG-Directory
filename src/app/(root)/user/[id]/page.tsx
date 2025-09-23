import { auth } from "../../../../../auth";
import { client } from "@/sanity/lib/client";
import { AUTHOR_BY_ID_QUERY } from "@/sanity/lib/queries";
import { notFound } from "next/navigation";
import Image from "next/image";
import UserServices from "@/components/UserServices";
import { Suspense } from "react";
import { ServiceCardSkeleton } from "@/components/ServiceCard";


export const experimental_ppr = true;

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const id = (await params).id;
  const session = await auth();

  const user = await client.fetch(AUTHOR_BY_ID_QUERY, { id });
  if (!user) return notFound();

  return (
    <>
      <section className="profile_container flex flex-col lg:flex-row gap-10 lg:gap-16">
        <div className="profile_card">
          <div className="profile_title">
            <h3 className="text-24-black uppercase text-center line-clamp-1">
              {user.name}
            </h3>
          </div>

          <Image
            src={user.image || "/default-avatar.png"}
            alt={user.name || "User"}
            width={220}
            height={220}
            className="profile_image"
          />

          <p className="text-30-bold mt-7 text-center">
            @{user?.username}
          </p>
          <p className="mt-1 text-center text-24-black">{user?.bio}</p>
        </div>

        <div className="flex-1 flex flex-col">
          <p className="text-30-bold mb-4">
            {session?.user?.id === id ? "Your" : "All"} Services
          </p>
          <ul className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            <Suspense fallback={<ServiceCardSkeleton />}>
              <UserServices id={id} />
            </Suspense>
          </ul>
        </div>
      </section>
    </>
  );
};

export default Page;