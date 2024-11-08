import SignInCard from "../features/Sign-in-card";
import Navbar from "../main/Navbar";

function Homepage() {
  return (
    <div className="w-full h-screen space-y-20">
      <Navbar />

      <div className="flex items-center p-4 justify-center">
        <SignInCard />
      </div>
    </div>
  );
}

export default Homepage;
