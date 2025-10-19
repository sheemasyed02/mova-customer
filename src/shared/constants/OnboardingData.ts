export interface OnboardingSlide {
  id: number;
  title: string;
  description: string;
  image: any;
  backgroundColor: string;
  accentColor: string;
  icon: any;
}

export const onboardingData: OnboardingSlide[] = [
  {
    id: 1,
    title: "Choose From Thousands of Cars",
    description: "Hatchbacks to luxury SUVs - find the perfect ride for every occasion",
    image: require('@/assets/illustrations/Diverse car collection illustration.png'),
    backgroundColor: '#2D9B8E',
    accentColor: '#4DBFAF',
    icon: require('@/assets/images/movawheel.png'),
  },
  {
    id: 2,
    title: "Book in Minutes",
    description: "Quick search, instant booking, and hassle-free pickup",
    image: require('@/assets/illustrations/Mobile booking illustration.png'),
    backgroundColor: '#3FA5B8',
    accentColor: '#5DCDCB',
    icon: require('@/assets/images/Mova1.jpg'),
  },
  {
    id: 3,
    title: "Safe & Verified",
    description: "All vehicles inspected, verified owners, and 24/7 support",
    image: require('@/assets/illustrations/Securityshield illustration.png'),
    backgroundColor: '#238276',
    accentColor: '#2ECC71',
    icon: require('@/assets/images/movawheel.png'),
  },
];
