import styled from 'styled-components'

export const Container = styled.div`
    width: calc(100% - 20px);
`

export const TextArea = styled.textarea`
    width: 100%;
    font-family: Roboto;
    border-radius: 4px;
    font-size: 15px;
    padding: 10px;
    background-color: ${props => props.theme.moreClearGray};
    border: 0;

    &:focus {
        background-color: ${props => props.theme.green_REFLOW}20;
        outline: none;
    }

    &::selection {
        background: ${props => props.theme.green_REFLOW}50;
    }
`