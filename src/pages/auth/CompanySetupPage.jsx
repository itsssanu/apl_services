import PageCard from "../../components/common/PageCard";
import CompanyForm from "../../components/settings/CompanyForm";

export default function CompanySetupPage() {
  return (
    <PageCard
      title="Company Profile"
      subtitle="Manage your company information."
    >
      <CompanyForm />
    </PageCard>
  );
}