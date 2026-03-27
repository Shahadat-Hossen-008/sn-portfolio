import Contact from "@/components/contact/Contact";
import Navbar from "@/components/navbar/Navbar";
import Profile from "@/components/profile/Profile";
import { sanityFetch } from "@/sanity/lib/live";
import { PROFILE_QUERY } from "@/sanity/lib/queries";
import { ToastContainer } from "react-toastify";

export default async function page() {
  const { data: profile } = await sanityFetch({ query: PROFILE_QUERY });

  return (
    <div className="bg-black ">
      {profile && <Navbar cvUrl={profile.cvUrl} />}
      <Profile profile={profile} />
      <Contact/>
      <ToastContainer />
    </div>
  );
}
