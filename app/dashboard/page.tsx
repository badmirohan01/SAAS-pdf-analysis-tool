import DashboardContent from "./_components/DashboardContent";
import RedirectComponent from "@/components/RedirectComponent";
import { checkAuthenticationAndSubscription } from "@/lib/checkAuthSubscription";

export default async function Dashboard() {
  try {
    const authCheck = await checkAuthenticationAndSubscription();

    if (authCheck?.redirectUrl) {
      return <RedirectComponent to={authCheck.redirectUrl} />;
    }
    return <DashboardContent />;
  } catch (error) {
    console.log("Error in dashboard page:", error);
    return <RedirectComponent to="/" />;
  }
}
