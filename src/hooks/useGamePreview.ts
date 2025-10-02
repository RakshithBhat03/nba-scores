import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { espnApi } from '@/services/api';

export const useGamePreview = () => {
  const [selectedGameId, setSelectedGameId] = useState<string | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const {
    data: boxScore,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['boxScore', selectedGameId],
    queryFn: () => selectedGameId ? espnApi.getBoxScore(selectedGameId) : null,
    enabled: !!selectedGameId && isPreviewOpen,
    staleTime: 30000, // 30 seconds
  });

  const openPreview = (gameId: string) => {
    setSelectedGameId(gameId);
    setIsPreviewOpen(true);
  };

  const closePreview = () => {
    setIsPreviewOpen(false);
    setSelectedGameId(null);
  };

  return {
    selectedGameId,
    boxScore,
    isLoading,
    error,
    isPreviewOpen,
    openPreview,
    closePreview,
    refetch
  };
};