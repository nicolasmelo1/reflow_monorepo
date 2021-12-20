import React from 'react'
import { Text } from 'react-native'
import { sum } from '../../shared'
/**
 * {Description of your component, what does it do}
 * @param {Type} props - {go in detail about every prop it recieves}
 */
const Button = (props) => {
    const renderMobile = () => {
        return (
            <Text>
                Button
            </Text>
        )
    }

    const renderWeb = () => {
        return (
            <div>{sum(1, 2)}</div>
        )
    }

    return process.env['APP'] === 'web' ? renderWeb() : renderMobile()
}

export default Button