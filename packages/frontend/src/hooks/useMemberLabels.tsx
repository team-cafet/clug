
import { memberLabelService } from '../services/memberlabel.service';
import { useEffect, useState } from 'react';
import { IMemberLabel } from '../libs/interfaces/memberLabel.interface';

export const useMemberLabels = () => {
  const [memberLabels, setMemberLabels] = useState<IMemberLabel[]>([]);

  useEffect(() => {
    const getAllMemberLabel = async () => {
      const memberLabels = await memberLabelService.getAll();
      if (memberLabels) {
        setMemberLabels(memberLabels.data);
      }
    };

    getAllMemberLabel();
  }, []);

  return memberLabels
}