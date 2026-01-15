import { useAppSelector } from './useAppSelector';

export const useCustomizer = () => {
  const customizer = useAppSelector((state) => state.customizer);
  
  return {
    title: customizer.title,
    theme: customizer.theme,
    background: customizer.background,
    font: customizer.font,
    loading: customizer.loading,
    error: customizer.error,
  };
};
