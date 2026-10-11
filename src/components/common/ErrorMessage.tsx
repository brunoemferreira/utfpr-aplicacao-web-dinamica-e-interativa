import React from 'react';
import { Alert, Button, Group } from '@mantine/core';
import { IconAlertCircle, IconRefresh } from '@tabler/icons-react';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry }) => {
  return (
    <Alert
      icon={<IconAlertCircle size={20} />}
      title="Atenção"
      color="red"
      radius="md"
      my="md"
    >
      <Group justify="space-between" align="center" mt="xs">
        <span>{message}</span>
        {onRetry && (
          <Button
            size="xs"
            color="red"
            variant="light"
            leftSection={<IconRefresh size={14} />}
            onClick={onRetry}
          >
            Tentar novamente
          </Button>
        )}
      </Group>
    </Alert>
  );
};
