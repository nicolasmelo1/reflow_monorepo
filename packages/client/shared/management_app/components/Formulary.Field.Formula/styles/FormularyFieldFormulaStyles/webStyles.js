import styled from 'styled-components'

export const Container = styled.div`
    display: flex;
    flex-direction: column;
    padding: 0 10px 0 10px;
    width: calc(100% - 20px);
    border-radius: 5px;
    margin-bottom: 500px;
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

export const EditFormulaButton = styled.button`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    border: none;
    background-color: ${props => props.theme.clearGray};
    border-radius: 5px;
    padding: 10px;
    width: auto;
    cursor: pointer;

    &:hover {
        background-color: ${props => props.theme.clearGray}90;
    }
`

export const EditFormulaButtonLabel = styled.p`
    text-align: left;
    margin: 0;
    user-select: none;
    color: ${props => props.theme.green_REFLOW};
` 

export const Description = styled.small`
    text-align: left;
    user-select: none;
    color: ${props => props.theme.green_REFLOW};
`