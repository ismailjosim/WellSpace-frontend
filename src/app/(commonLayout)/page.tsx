import HeroSection from '@/components/modules/Home/HeroSection'
import SpecialistsSection from '@/components/modules/Home/SpecialistSection'
import TopDoctorsSection from '@/components/modules/Home/TopDoctorsSection'
import ReviewsSection from '@/components/modules/Home/ReviewsSection'

const HomePage = () => {
	return (
		<div>
			<HeroSection />
			<SpecialistsSection />
			<TopDoctorsSection />
			<ReviewsSection />
		</div>
	)
}

export default HomePage
