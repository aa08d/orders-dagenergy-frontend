import type { Contract } from '@shared/types';

// Генерирует PDF-заявление в формате бумажной формы (фото)
// Использует только браузерный print API — никаких зависимостей
export function printContractPDF(contract: Contract, deptName: string, deptCode: string) {
  const isCorpType = contract.consumerType === 'Юридическое лицо' || contract.consumerType === 'Индивидуальный предприниматель';
  const isPrivType = contract.consumerType === 'Физическое лицо'  || contract.consumerType === 'Частный бытовой сектор';

  const line = (val?: string | null) => `<span class="underline">${val || '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'}</span>`;
  const lineWide = (val?: string | null) => `<span class="underline wide">${val || '&nbsp;'.repeat(60)}</span>`;

  const html = `<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<title>Заявление №${contract.id}</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: 'Times New Roman', Times, serif;
    font-size: 11pt;
    color: #000;
    padding: 15mm 20mm 15mm 25mm;
    line-height: 1.4;
  }
  .header-block {
    display: flex;
    justify-content: space-between;
    margin-bottom: 4mm;
  }
  .header-left { width: 30%; }
  .header-center { width: 40%; text-align: center; font-size: 10pt; }
  .header-right { width: 25%; text-align: right; font-size: 10pt; }
  .org-name { font-size: 12pt; font-weight: bold; text-align: center; }
  .underline {
    display: inline-block;
    border-bottom: 1px solid #000;
    min-width: 120px;
    vertical-align: bottom;
  }
  .underline.wide { min-width: 100%; display: block; }
  .field-row {
    display: flex;
    align-items: flex-end;
    margin-bottom: 3mm;
    gap: 4mm;
  }
  .field-label {
    font-weight: bold;
    white-space: nowrap;
    min-width: 90px;
  }
  .field-label.wide { min-width: 60px; }
  .field-value {
    flex: 1;
    border-bottom: 1px solid #000;
    min-height: 5mm;
    padding-bottom: 1mm;
  }
  .field-hint {
    font-size: 8pt;
    text-align: center;
    color: #333;
    margin-top: 1mm;
    margin-bottom: 2mm;
  }
  .two-col {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 6mm;
    margin-bottom: 3mm;
  }
  .three-col {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 4mm;
    margin-bottom: 3mm;
  }
  .section-title { font-weight: bold; margin-bottom: 2mm; }
  .divider { border: none; border-top: 1px solid #000; margin: 4mm 0; }
  .application-title {
    text-align: center;
    font-size: 14pt;
    font-weight: bold;
    margin: 6mm 0 4mm;
  }
  .application-subtitle {
    text-align: center;
    font-size: 11pt;
    font-weight: bold;
    margin-bottom: 4mm;
  }
  .checkbox-item {
    display: flex;
    align-items: flex-start;
    gap: 3mm;
    margin-bottom: 4mm;
  }
  .checkbox {
    width: 4mm;
    height: 4mm;
    border: 1px solid #000;
    flex-shrink: 0;
    margin-top: 1mm;
  }
  .checkbox-text { font-size: 10pt; text-align: justify; }
  .signature-block {
    display: flex;
    justify-content: space-between;
    margin-top: 8mm;
  }
  .sig-col { width: 45%; }
  .sig-line { border-bottom: 1px solid #000; margin-bottom: 1mm; height: 8mm; }
  .sig-hint { font-size: 8pt; text-align: center; }
  .note-right {
    font-size: 9pt;
    font-style: italic;
    text-align: right;
    margin-left: 4mm;
  }
  .dept-row {
    display: flex;
    gap: 4mm;
    margin-bottom: 2mm;
    font-size: 9pt;
  }
  .dept-box {
    flex: 1;
    border-bottom: 1px solid #000;
    min-height: 5mm;
    padding-bottom: 1mm;
    font-size: 11pt;
  }
  @media print {
    body { padding: 10mm 15mm 10mm 20mm; }
    @page { margin: 0; size: A4 portrait; }
  }
</style>
</head>
<body>

<!-- Шапка: В / отделение -->
<div class="header-block">
  <div class="header-left">
    <div style="font-weight:bold;font-size:13pt;margin-bottom:1mm;">В</div>
  </div>
  <div class="header-center">
    <div class="dept-row">
      <div class="dept-box">${deptName}</div>
      <div style="white-space:nowrap;font-size:9pt;">(наименование отд.)</div>
      <div class="dept-box" style="max-width:60px;">${deptCode}</div>
      <div style="white-space:nowrap;font-size:9pt;">(код отд.)</div>
    </div>
    <div class="org-name">независимой энергосбытовой компании</div>
    <div class="org-name">ООО «ЭЛЕКТРОН ЭНЕРГОСБЫТ»</div>
  </div>
</div>

<hr class="divider">

<!-- От абонента -->
<div class="field-row">
  <div class="field-label">От<br>абонента</div>
  <div class="field-value" style="display:flex;align-items:flex-end;gap:4mm;">
    <span style="flex:1;border-bottom:1px solid #000;padding-bottom:1mm;">${contract.name}</span>
    <span class="note-right">– нужное подчеркнуть</span>
  </div>
</div>
<div class="field-hint">(Юридическое лицо / ФИО ИП / ФИО ФЛ / ФИО ЧБП)</div>

<!-- В лице -->
<div class="field-row">
  <div class="field-label" style="font-size:10pt;min-width:60px;">&nbsp;</div>
  <div class="field-value">${contract.representativeName || ''}</div>
  <div style="font-size:9pt;white-space:nowrap;">(должность руководителя)</div>
  <div class="field-value"></div>
  <div style="font-size:9pt;white-space:nowrap;">(основание права подписи)</div>
</div>
<div class="field-row">
  <div class="field-label">В лице</div>
  <div class="field-value">${contract.representativeName || ''}</div>
</div>
<div class="field-hint">(ФИО уполномоченного подписанта)</div>
<div class="field-row">
  <div style="font-size:10pt;white-space:nowrap;">телефон руководителя</div>
  <div class="field-value">${contract.representativePhone ? '+7 ' + contract.representativePhone.replace(/^\+?7/, '') : '+7'}</div>
</div>

<!-- Адрес -->
<div class="field-row">
  <div class="field-label">Адрес</div>
  <div class="field-value">${contract.address}</div>
</div>
<div class="field-hint">(фактический адрес Юр. лица / ИП, адрес прописки Физ. лица)</div>

<!-- ИНН / КПП / Паспорт -->
<div class="two-col" style="margin-bottom:2mm;">
  <div>
    <div class="field-row">
      <div class="field-label wide"><b>ИНН</b><br><span style="font-size:9pt;font-weight:normal;">(Юр. лица/ИП)</span></div>
      <div class="field-value">${isCorpType ? (contract.inn || '') : ''}</div>
    </div>
    <div class="field-row">
      <div class="field-label wide"><b>КПП</b><br><span style="font-size:9pt;font-weight:normal;">(Юр. лица/ИП)</span></div>
      <div class="field-value">${isCorpType ? (contract.kpp || '') : ''}</div>
    </div>
  </div>
  <div>
    <div class="field-row">
      <div class="field-label wide"><b>Паспорт</b><br><span style="font-size:9pt;font-weight:normal;">(Физ. лица)</span></div>
      <div class="field-value">${isPrivType ? (contract.passportSeries || '') : ''}</div>
      <div style="font-size:9pt;white-space:nowrap;">(серия)</div>
      <div class="field-value">${isPrivType ? (contract.passportNumber || '') : ''}</div>
      <div style="font-size:9pt;white-space:nowrap;">(номер)</div>
    </div>
    <div class="field-row">
      <div class="field-label wide"><b>Выдан</b><br><span style="font-size:9pt;font-weight:normal;">(Физ. лица)</span></div>
      <div class="field-value">${isPrivType ? (contract.passportIssuedBy || '') : ''}</div>
      <div class="field-value">${isPrivType ? (contract.passportIssuedDate || '') : ''}</div>
      <div style="font-size:9pt;white-space:nowrap;">(дата выдачи)</div>
    </div>
  </div>
</div>

<!-- Банк -->
<div class="field-row">
  <div class="field-label"><b>Банк</b><br><span style="font-size:9pt;font-weight:normal;">(Юр. лица/ИП)</span></div>
  <div class="field-value">${isCorpType ? (contract.bankAccount || '') : ''}</div>
  <div style="font-size:9pt;white-space:nowrap;">(расчетный счет)</div>
  <div class="field-value">${isCorpType ? (contract.bankBik || '') : ''}</div>
  <div style="font-size:9pt;white-space:nowrap;">(БИК)</div>
  <div class="field-value"></div>
  <div style="font-size:9pt;white-space:nowrap;">(корр. счет)</div>
</div>
<div class="field-row">
  <div style="min-width:90px;">&nbsp;</div>
  <div class="field-value">${isCorpType ? (contract.bankName || '') : ''}</div>
  <div style="font-size:9pt;white-space:nowrap;">наименование банка</div>
</div>

<!-- Контакты -->
<div class="field-row">
  <div class="field-label"><b>Контакты</b></div>
  <div>
    <div class="field-row" style="margin-bottom:2mm;">
      <div style="font-size:9pt;min-width:140px;">e-mail</div>
      <div class="field-value"></div>
    </div>
    <div class="field-row" style="margin-bottom:2mm;">
      <div style="font-size:9pt;min-width:140px;">телефон для СМС уведомлений</div>
      <div class="field-value">${contract.smsPhone ? '+7 ' + contract.smsPhone.replace(/^\+?7/, '') : '+7'}</div>
    </div>
    <div class="field-row">
      <div style="font-size:9pt;min-width:140px;">контактный телефон</div>
      <div class="field-value">${contract.contactPhone ? '+7 ' + contract.contactPhone.replace(/^\+?7/, '') : '+7'}</div>
    </div>
  </div>
</div>

<!-- Категория -->
<div class="field-row">
  <div class="field-label"><b>Категория</b></div>
  <div class="field-value" style="display:flex;align-items:flex-end;gap:4mm;">
    <span style="flex:1;border-bottom:1px solid #000;padding-bottom:1mm;">${contract.consumerCategory}</span>
    <span class="note-right">– нужное подчеркнуть</span>
  </div>
</div>
<div class="field-hint">(Прочие потребители / население городское / население сельское / приравненные к городскому населению / приравненные к сельскому населению)</div>

<!-- Прочее -->
<div class="field-row">
  <div class="field-label"><b>Прочее</b></div>
  <div style="flex:1;">
    <div class="field-row" style="margin-bottom:2mm;">
      <div style="font-size:9pt;min-width:200px;">ФИО главного бухгалтера</div>
      <div class="field-value">${contract.chiefAccountant || ''}</div>
    </div>
    <div class="field-row" style="margin-bottom:2mm;">
      <div style="font-size:9pt;min-width:200px;">телефон главного бухгалтера</div>
      <div class="field-value">${contract.chiefAccountantPhone ? '+7 ' + contract.chiefAccountantPhone.replace(/^\+?7/, '') : '+7'}</div>
    </div>
    <div class="field-row" style="margin-bottom:2mm;">
      <div style="font-size:9pt;min-width:200px;">ФИО ответственного за состояние ЭПУ</div>
      <div class="field-value">${contract.responsibleEpu || ''}</div>
    </div>
    <div class="field-row">
      <div style="font-size:9pt;min-width:200px;">телефон ответственного за состояние ЭПУ</div>
      <div class="field-value">${contract.responsibleEpuPhone ? '+7 ' + contract.responsibleEpuPhone.replace(/^\+?7/, '') : '+7'}</div>
    </div>
  </div>
</div>

<hr class="divider">

<!-- Заявление -->
<div class="application-title">ЗАЯВЛЕНИЕ №${contract.id}</div>
<div class="application-subtitle">
  Прошу заключить договор энергоснабжения с ООО «Электрон Энергосбыт»<br>
  в отношении принадлежащих мне энергопринимающих устройств:
</div>

<div class="checkbox-item">
  <div class="checkbox"></div>
  <div class="checkbox-text">
    Прошу оказать содействие в <b>переоформлении / восстановлении</b> ранее утраченного Акта
    об осуществлении технологического присоединения к электрическим сетям сетевой
    организации в отношении принадлежащих мне энергопринимающих устройств.
  </div>
</div>
<div class="checkbox-item">
  <div class="checkbox"></div>
  <div class="checkbox-text">
    Прошу оказать содействие в <b>оформлении</b> Акта допуска прибора учета / Акта технической
    проверки средств учета электроэнергии с сетевой организацией в отношении
    принадлежащих мне энергопринимающих устройств.
  </div>
</div>
<div class="checkbox-item">
  <div class="checkbox"></div>
  <div class="checkbox-text">
    Прошу оказать содействие в <b>оформлении</b> Акта об осуществлении технологического
    присоединения / Акта разграничения балансовой принадлежности / Акт разграничения
    эксплуатационной ответственности / Технических условий к договору технологического
    присоединения.
  </div>
</div>

<!-- Подписи -->
<div class="signature-block">
  <div class="sig-col">
    <div class="sig-line"></div>
    <div class="sig-hint">подпись</div>
  </div>
  <div class="sig-col">
    <div class="sig-line"></div>
    <div class="sig-hint">расшифровка подписи</div>
  </div>
</div>
<div style="text-align:right;margin-top:4mm;font-size:10pt;">
  Дата: ${contract.date}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
</div>

</body>
</html>`;

  const win = window.open('', '_blank');
  if (!win) { alert('Разрешите всплывающие окна для печати'); return; }
  win.document.write(html);
  win.document.close();
  win.focus();
  setTimeout(() => { win.print(); }, 500);
}
