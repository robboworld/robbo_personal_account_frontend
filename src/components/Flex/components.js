import styled from 'styled-components'

export const Flex = styled.div`
    display : flex;
    flex-direction: ${({ direction }) => direction || 'row'};
    align-items: ${({ align }) => align || 'stretch'};
    justify-content: ${({ justify }) => justify || 'stretch'};
    margin: ${({ margin }) => margin || '0'};
    padding: ${({ padding }) => padding || '0'};
    width: ${({ width }) => width || 'auto'};
    height: ${({ height }) => height || 'auto'};
`