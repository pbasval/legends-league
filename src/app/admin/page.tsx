import CreateLeagueForm from "@/components/admin/CreateLeagueForm";
import LeagueList from "@/components/admin/LeagueList";

export default function AdminPage() {
  return (
    <div className="container p-4 mx-auto sm:p-6 md:p-8">
      <h1 className="mb-4 text-2xl font-bold">SuperAdmin Dashboard</h1>
      <CreateLeagueForm />
      <LeagueList />
    </div>
  );
}
