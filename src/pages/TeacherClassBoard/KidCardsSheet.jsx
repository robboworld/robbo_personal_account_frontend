import React from 'react'
import PropTypes from 'prop-types'
import { createGlobalStyle } from 'styled-components'
import { FormattedMessage } from 'react-intl'

import { KidAvatar, KidPicture } from '@/components/KidPictures'
import QrCode from '@/components/QrCode'

// Printed sign-in cards, eight on an A4 sheet. While the sheet is on screen, printing shows
// it alone: the rest of the ЛК is hidden by the print style below.

const PrintOnlySheet = createGlobalStyle`
  @media print {
    @page { size: A4; margin: 10mm; }
    body * { visibility: hidden !important; }
    .kid-cards-sheet, .kid-cards-sheet * { visibility: visible !important; }
    .kid-cards-sheet { position: absolute; left: 0; top: 0; width: 100%; }
  }
`

const card = {
  boxSizing: 'border-box',
  height: '64mm',
  padding: '4mm',
  border: '1px dashed #999',
  borderRadius: 8,
  display: 'grid',
  gridTemplateColumns: '1fr auto',
  gridTemplateRows: 'auto auto',
  alignContent: 'space-between',
  gap: '2mm',
  breakInside: 'avoid',
  pageBreakInside: 'avoid',
  background: '#fff',
  color: '#000',
}

const KidCardsSheet = ({ className, cards }) => (
  <div className='kid-cards-sheet'>
    <PrintOnlySheet />
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4mm' }}>
      {cards.map(c => (
        <div key={c.userId} style={card}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '2mm', minWidth: 0 }}>
            <KidAvatar index={c.avatar} size={48} />
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 18, fontWeight: 700, overflowWrap: 'anywhere' }}>
                {c.name}
              </div>
              <div style={{ fontSize: 11, color: '#555' }}>{className}</div>
            </div>
          </div>
          <div style={{ textAlign: 'center', fontSize: 10, color: '#555', width: '26mm' }}>
            <QrCode text={c.url} size={92} title={c.name} />
            <div>
              <FormattedMessage id='kid_login.card_scan' />
            </div>
          </div>
          {/* The secret across the whole card: five pictures, numbered in order. */}
          <div
            style={{
              gridColumn: '1 / -1',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
            }}>
            {c.pictures.map((p, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 12, fontWeight: 700 }}>{i + 1}</div>
                <KidPicture index={p} size={46} />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
)

KidCardsSheet.propTypes = {
  className: PropTypes.string,
  cards: PropTypes.arrayOf(
    PropTypes.shape({
      userId: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      avatar: PropTypes.number.isRequired,
      pictures: PropTypes.arrayOf(PropTypes.number).isRequired,
      url: PropTypes.string.isRequired,
    }),
  ).isRequired,
}

export default KidCardsSheet
