import { useState } from 'react';
import { ContractsTable } from '@widgets/contracts-table';
import { AddContractModal } from '@widgets/contracts-table/AddContractModal';
import { Icon } from '@shared/ui/Icon';
import type { ConsumerType } from '@shared/types';
import s from './styles.module.scss';

const CONSUMER_TYPES: ConsumerType[] = [
  'Юридическое лицо',
  'Индивидуальный предприниматель',
  'Физическое лицо',
  'Частный бытовой сектор',
];

export const ContractsPage = () => {
  const [showTypeMenu, setShowTypeMenu] = useState(false);
  const [selectedType, setSelectedType] = useState<ConsumerType | null>(null);

  return (
    <main className={s.page}>
      <div className={s.header}>
        <h1 className={s.title}>Договора</h1>
        <div className={s.btnWrap}>
          <button className={s.btnNew} onClick={() => setShowTypeMenu(v => !v)}>
            <Icon name="plus" size={15} />
            Новый договор
            <Icon name="chevronDown" size={13} />
          </button>
          {showTypeMenu && (
            <div className={s.typeMenu}>
              {CONSUMER_TYPES.map(type => (
                <button
                  key={type}
                  className={s.typeMenuItem}
                  onClick={() => { setSelectedType(type); setShowTypeMenu(false); }}
                >
                  {type}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      <ContractsTable />
      {selectedType && (
        <AddContractModal
          consumerType={selectedType}
          onClose={() => setSelectedType(null)}
        />
      )}
    </main>
  );
};
