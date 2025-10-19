import { useRouter } from 'expo-router';

export const useOffersNavigation = () => {
  const router = useRouter();

  const navigateToOffers = () => {
    router.push('/offers-page' as any);
  };

  const navigateToBooking = (appliedCoupon?: string) => {
    if (appliedCoupon) {
      router.push({
        pathname: '/(main)' as any,
        params: { appliedCoupon }
      });
    } else {
      router.push('/(main)' as any);
    }
  };

  const navigateToReferral = () => {
    router.push('/referral-page' as any);
  };

  const navigateToProfile = () => {
    router.push('/edit-profile-page' as any);
  };

  const navigateBack = () => {
    router.back();
  };

  return {
    navigateToOffers,
    navigateToBooking,
    navigateToReferral,
    navigateToProfile,
    navigateBack,
  };
};

export default useOffersNavigation;