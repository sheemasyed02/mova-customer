import { useRouter } from 'expo-router';

export const useRewardsNavigation = () => {
  const router = useRouter();

  const navigateToRewards = () => {
    router.push('/rewards-page' as any);
  };

  const navigateToReferral = () => {
    router.push('/referral-page' as any);
  };

  const navigateToBooking = () => {
    router.push('/(main)' as any);
  };

  const navigateToProfile = () => {
    router.push('/edit-profile-page' as any);
  };

  const navigateBack = () => {
    router.back();
  };

  return {
    navigateToRewards,
    navigateToReferral,
    navigateToBooking,
    navigateToProfile,
    navigateBack,
  };
};

export default useRewardsNavigation;