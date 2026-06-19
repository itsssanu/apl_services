import PageCard from "../../components/common/PageCard";
import SecuritySettings from "../../components/settings/SecuritySettings";

export default function SecurityPage() {
  return (
    <PageCard
      title="Security"
      subtitle="Update your account password."
    >
      <SecuritySettings />
    </PageCard>
  );
}