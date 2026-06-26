import React from 'react'
import { useIntl } from 'react-intl'

import { GreenFlagControl, PlayerControls, StopAllControl } from './styles'

function GreenFlagGraphic() {
    return (
        <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16.63 17.5'
aria-hidden>
            <path
                fill='#4cbf56'
                stroke='#45993d'
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M.75,2A6.44,6.44,0,0,1,8.44,2h0a6.44,6.44,0,0,0,7.69,0V12.4a6.44,6.44,0,0,1-7.69,0h0a6.44,6.44,0,0,0-7.69,0'
            />
            <line
                x1='0.75'
                y1='16.75'
                x2='0.75'
                y2='0.75'
                fill='#4cbf56'
                stroke='#45993d'
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='1.5'
            />
        </svg>
    )
}

function StopAllGraphic() {
    return (
        <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 14 14'
aria-hidden>
            <polygon
                fill='#EC5959'
                stroke='#B84848'
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeMiterlimit='10'
                points='4.3,0.5 9.7,0.5 13.5,4.3 13.5,9.7 9.7,13.5 4.3,13.5 0.5,9.7 0.5,4.3'
            />
        </svg>
    )
}

export default function PlayerScratchControls({ running, onGreenFlag, onStopAll }) {
    const intl = useIntl()
    const greenFlagLabel = intl.formatMessage({ id: 'project_page.green_flag' })
    const stopLabel = intl.formatMessage({ id: 'project_page.stop_all' })

    return (
        <PlayerControls>
            <GreenFlagControl
                type='button'
                $active={running}
                title={greenFlagLabel}
                aria-label={greenFlagLabel}
                onClick={onGreenFlag}
            >
                <GreenFlagGraphic />
            </GreenFlagControl>
            <StopAllControl
                type='button'
                $active={running}
                title={stopLabel}
                aria-label={stopLabel}
                onClick={onStopAll}
            >
                <StopAllGraphic />
            </StopAllControl>
        </PlayerControls>
    )
}
