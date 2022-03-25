import { APP } from '../../../../conf'
import styled from 'styled-components'
import { View, TextInput } from 'react-native'

function getHeadingTypeFontSize(headingType) {
    switch (headingType) {
        case 'heading1':
            return '2em'
        case 'heading2':
            return '1.5em'
        case 'heading3':
            return '1.17em'
    }
}

export const Heading = APP === 'web' ? 
styled.h3`
    margin: 0;
    font-size: ${props => getHeadingTypeFontSize(props.headingType)};
`
:
styled(View)``

export const HeadingInput = APP === 'web' ?
styled.input`
    font-family: Roboto;
    padding: 5px;
    font-weight: bold;
    font-size: ${props => getHeadingTypeFontSize(props.headingType)};
    border-radius: 5px;
    border: 0 !important;
    width: calc(100% - 40px);
    outline: none;

    &:focus {
        background-color: ${props => props.theme.green_REFLOW}20;
        outline: none;
        border: 0;
    }

    &:active {
        background-color: ${props => props.theme.green_REFLOW}20;
        outline: none;
        border: 0;
    }

    &::selection {
        background: ${props => props.theme.green_REFLOW}50;
    }
`
:
styled(TextInput)``
