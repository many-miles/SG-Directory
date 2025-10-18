import Link from "next/link";
import Image from "next/image";
import { auth, signOut, signIn } from "../../auth";
import { BadgePlus, LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";

const Navbar = async () => {
  const session = await auth();

  return (
    <header className="bg-white shadow-sm font-work-sans">
      <div className="px-2 sm:px-12">
        <nav className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/">
            <Image src="/logo.png" alt="logo" width={144} height={30} />
          </Link>

          {/* right group: explicit right padding and correct items-center */}
          <div className="flex items-center gap-4 sm:gap-6 text-black pr-2 sm:pr-4">
            {session && session?.user ? (
              <>
                <Link href="/service/create" className="flex items-center">
                  <span className="hidden sm:inline">Add Service</span>
                  <BadgePlus className="size-6 sm:hidden" />
                </Link>

                <form
                  action={async () => {
                    "use server";
                    await signOut({ redirectTo: "/" });
                  }}
                >
                  {/* fixed typo: items-center (was item-center) */}
                  <button type="submit" className="flex items-center">
                    <span className="hidden sm:inline">Logout</span>
                    <LogOut className="size-6 sm:hidden text-red-500" />
                  </button>
                </form>

                <Link href={`/user/${session?.id}`} className="ml-2">
                  <Avatar className="size-10">
                    <AvatarImage
                      src={session?.user?.image || ""}
                      alt={session?.user?.name || ""}
                    />
                    <AvatarFallback>XX</AvatarFallback>
                  </Avatar>
                </Link>
              </>
            ) : (
              <form
                action={async () => {
                  "use server";
                  await signIn("google");
                }}
              >
                <button type="submit" className="login">Login</button>
              </form>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
