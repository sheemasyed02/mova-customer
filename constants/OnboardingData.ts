export interface OnboardingSlide {
  id: number;
  title: string;
  description: string;
  image: any;
  backgroundColor: string;
}

export const onboardingData: OnboardingSlide[] = [
  {
    id: 1,
    title: "Choose From Thousands of Cars",
    description: "Hatchbacks to luxury SUVs - find the perfect ride for every occasion",
    image: require('@/assets/images/Mova.png'), // We'll use placeholder for now
    backgroundColor: '#2D9B8E',
  },
  {
    id: 2,
    title: "Book in Minutes",
    description: "Quick search, instant booking, and hassle-free pickup",
    image: require('@/assets/images/movawheel.png'), // We'll use placeholder for now
    backgroundColor: '#3FA5B8',
  },
  {
    id: 3,
    title: "Safe & Verified",
    description: "All vehicles inspected, verified owners, and 24/7 support",
    image: require('@/assets/images/Mova.png'), // We'll use placeholder for now
    backgroundColor: '#238276',
  },
];