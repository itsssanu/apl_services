import PageCard from "../../components/common/PageCard";
import ProfileForm from "./ProfileForm";


export default function ProfilePage() {
  return (
    <PageCard
      title="My Profile"
      subtitle="Manage your personal information."
    >
      <ProfileForm />
    </PageCard>
  );
}