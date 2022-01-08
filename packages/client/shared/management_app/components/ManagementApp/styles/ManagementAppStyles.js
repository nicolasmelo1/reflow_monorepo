import styled from 'styled-components'

export const Layout = process.env['APP'] === 'web' ?
styled.div`
    height: 100%;
    width: 100%;
`
:
styled(View)``