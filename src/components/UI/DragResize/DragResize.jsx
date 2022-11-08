import React, { useEffect, useState } from 'react'
import usePortal from 'react-useportal'
import Draggable from 'react-draggable'
import { PropTypes } from 'prop-types'

import { ModalContent, ModalWindow, CloseModalButton } from './components'

import Flex from '@/components/Flex'

const DragResize = ({
    open,
    setOpen,
    content,
}) => {

    const { Portal } = usePortal({ bindTo: document.getElementById('portal') })

    const [currentPosition, setCurrentPosition] = useState({
        xRate: 150,
        yRate: 150,
    })

    const onDrag = (event, data) => {
        setCurrentPosition({ xRate: data.lastX, yRate: data.lastY })
    }

    const [isDraggerDisabled, setIsDraggerDisabled] = useState(false)

    useEffect(() => {
        setIsDraggerDisabled(true)
        const draggerTimeout = setTimeout(() => {
            setIsDraggerDisabled(false)
        }, 500)

        return () => {
            clearTimeout(draggerTimeout)
        }
    }, [])

    return (
        open &&
        <Portal>
            <Draggable
                defaultPosition={{ x: 50, y: 50 }}
                position={{
                    x: currentPosition.xRate,
                    y: currentPosition.yRate,
                }}
                disabled={isDraggerDisabled}
                onDrag={onDrag}
            >
                <ModalWindow open={open}>

                    <ModalContent>
                        <Flex
                            direction='column' width='100%'
                            justify='center' align='flex-end'
                            height='15%'
                        >
                            <CloseModalButton onClick={() => setOpen(false)}>×</CloseModalButton>
                        </Flex>
                        <Flex height='70%' width='100%'>
                            {
                                content()
                            }
                        </Flex>
                    </ModalContent>

                </ModalWindow>
            </Draggable>
        </Portal >
    )
}

DragResize.propTypes = {
    open: PropTypes.bool,
    setOpen: PropTypes.func,
    content: PropTypes.func,
}

export default DragResize