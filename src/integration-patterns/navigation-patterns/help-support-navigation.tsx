import { useRouter } from 'expo-router';

export const useHelpSupportNavigation = () => {
  const router = useRouter();

  const navigateToHelpSupport = () => {
    router.push('/help-support-page' as any);
  };

  const navigateToDocuments = () => {
    router.push('/documents-page' as any);
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
    navigateToHelpSupport,
    navigateToDocuments,
    navigateToBooking,
    navigateToProfile,
    navigateBack,
  };
};

export default useHelpSupportNavigation;