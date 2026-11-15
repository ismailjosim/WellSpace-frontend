import HeroSection from "@/components/modules/Home/HeroSection";
import SpecialistsSection from "@/components/modules/Home/SpecialistSection";
import TopDoctorsSection from "@/components/modules/Home/TopDoctorsSection";
import ReviewsSection from "@/components/modules/Home/ReviewsSection";
import HowItWorksSection from "@/components/modules/Home/HowItWorksSection";
import WhyChooseSection from "@/components/modules/Home/WhyChooseSection";
import StatsCounterSection from "@/components/modules/Home/StatsCounterSection";
import EmergencyUrgentCareBanner from "@/components/modules/Home/EmergencyUrgentCareBanner";

// Revalidate home page every 5 minutes (ISR)
export const revalidate = 300;

const fetchHomeData = async (endpoint: string) => {
  const apiUrl = process.env.BACKEND_API_URL;
  if (!apiUrl) {
    throw new Error("BACKEND_API_URL is not configured");
  }

  const response = await fetch(`${apiUrl}${endpoint}`, {
    next: { revalidate },
  });
  if (!response.ok) {
    throw new Error(`Failed to load homepage data from ${endpoint}`);
  }
  return response.json();
};

export default async function HomePage() {
  // Fetch real specialties and top doctors from backend
  const [specialtiesRes, doctorsRes] = await Promise.all([
    fetchHomeData("/specialties").catch(() => ({ data: [] })),
    fetchHomeData("/doctor?limit=8&sortBy=averageRating&orderBy=desc").catch(
      () => ({ data: [] }),
    ),
  ]);

  const specialties = Array.isArray(specialtiesRes?.data)
    ? specialtiesRes.data
    : [];
  const doctors = Array.isArray(doctorsRes?.data) ? doctorsRes.data : [];

  return (
    <div className="space-y-0">
      <HeroSection />
      <SpecialistsSection specialties={specialties} />
      <HowItWorksSection />
      <TopDoctorsSection doctors={doctors} />
      <StatsCounterSection />
      <WhyChooseSection />
      <EmergencyUrgentCareBanner />
      <ReviewsSection />
    </div>
  );
}
