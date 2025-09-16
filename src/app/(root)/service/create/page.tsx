import StartupForm from "../../../../components/ServiceForm";
import { auth } from "../../../../../auth";
import { redirect } from "next/navigation";

const Page = async () => {
  const session = await auth();

  if (!session) redirect("/");

  return (
    <>
      <section className="pink_container !min-h-[230px]">
        <h1 className="heading">List Your Service</h1>
        <p className="sub-heading">Share your expertise with potential clients</p>
      </section>

      <ServiceForm/>
    </>
  );
};

export default Page;