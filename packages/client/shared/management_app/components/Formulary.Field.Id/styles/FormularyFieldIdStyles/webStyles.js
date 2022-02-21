import styled from 'styled-components'

export const Container = styled.div`
    display: flex;
    flex-direction: column;
    padding: 0 10px 0 10px;
    width: calc(100% - 20px);
    border-radius: 5px;
    cursor: ${props => props.hasTooltip ? 'help' : 'not-allowed'};
`

export const TooltipWrapper = styled.div`
    display: flex;
    width: 100%;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start
`

export const Value = styled.p`
    margin: 0;
    color: ${props => props.theme.gray_REFLOW};
`

export const Description = styled.small`
    user-select: none;
    color: ${props => props.theme.green_REFLOW};
`