// src/app/(root)/service/create/page.tsx - Updated messaging
import ServiceForm from "../../../../components/ServiceForm";
import { auth } from "../../../../../auth";
import { redirect } from "next/navigation";

const Page = async () => {
  const session = await auth();

  if (!session) redirect("/");

  return (
    <>
      <section className="pink_container pattern !min-h-[230px]">
        <h1 className="heading">List Your Service</h1>
        <p className="sub-heading">
          Share your expertise with the Jeffreys Bay community. 
          Connect with locals who need your services.
        </p>
      </section>

      <section className="section_container">
        <div className="max-w-4xl mx-auto mb-8">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-18-semibold text-blue-800 mb-2">
              Tips for a great service listing:
            </h3>
            <ul className="text-blue-700 space-y-1 text-sm">
              <li>• Use clear, descriptive titles</li>
              <li>• Include high-quality images</li>
              <li>• Be specific about what's included</li>
              <li>• Set realistic pricing</li>
              <li>• Provide accurate contact information</li>
            </ul>
          </div>
        </div>
        
        <ServiceForm />
      </section>
    </>
  );
};

export default Page;