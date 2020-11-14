import { useEffect, useState, useCallback } from 'react';
import { APIResource } from '../services/api.service';

export function useGetAllFromService<T>(props: {
  service: APIResource;
}): [T[], () => void] {
  const [data, setData] = useState<T[]>([]);

  const getAll = useCallback(async () => {
    const result = await props.service.getAll();
    if (result) {
      setData(result.data);
    }
  }, [props.service]);

  useEffect(() => {
    getAll();
  }, [getAll]);

  return [data, getAll];
}
