import Contact from "@/components/contact/Contact";
import Navbar from "@/components/navbar/Navbar";
import About from "@/components/about/About";
import Profile from "@/components/profile/Profile";
import { sanityFetch } from "@/sanity/lib/live";
import { ToastContainer } from "react-toastify";
import {  PROFILE_QUERY, ABOUT_QUERY, } from "@/sanity/lib/queries";

export default async function page() {
  const { data: profile } = await sanityFetch({ query: PROFILE_QUERY });

  const { data: about } = await sanityFetch({ query: ABOUT_QUERY });
  

  return (
    <div className="bg-black ">
      {profile && <Navbar cvUrl={profile.cvUrl} />}
      <Profile profile={profile} />
      <About about={about}/>
      <Contact/>
      <ToastContainer />
    </div>
  );
}
