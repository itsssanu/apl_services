import CompanyForm from "../../components/settings/CompanyForm";

export default function FirstCompanySetupPage() {
  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-lg p-10">

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-navy-900">
            Welcome to VelVit 👋
          </h1>

          <p className="text-gray-500 mt-2">
            Let's create your business profile.
          </p>
        </div>

        <CompanyForm isFirstSetup />

      </div>
    </div>
  );
}