import React from 'react';
import { Card, Skeleton, SimpleGrid, Stack } from '@mantine/core';

interface RecipeSkeletonGridProps {
  count?: number;
}

export const RecipeSkeletonGrid: React.FC<RecipeSkeletonGridProps> = ({ count = 6 }) => {
  return (
    <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
      {Array.from({ length: count }).map((_, index) => (
        <Card key={index} shadow="xs" padding="lg" radius="md" withBorder>
          <Skeleton height={200} radius="sm" mb="md" />
          <Stack gap="xs">
            <Skeleton height={20} width="40%" radius="xl" />
            <Skeleton height={26} width="80%" radius="sm" />
            <Skeleton height={16} width="60%" radius="sm" />
            <Skeleton height={36} mt="md" radius="md" />
          </Stack>
        </Card>
      ))}
    </SimpleGrid>
  );
};
