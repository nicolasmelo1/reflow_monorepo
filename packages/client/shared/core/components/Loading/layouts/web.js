import Styled from '../styles'

export default function LoadingWebLayout(props) {
    return (
        <Styled.Container 
        title="1"
        >
            <svg 
            version="1.1" 
            xmlns="http://www.w3.org/2000/svg" 
            x="0px" 
            y="0px"
            width="100%" 
            height="100%" 
            viewBox="0 0 50 50" 
            style={{
                enableBackground: 'new 0 0 50 50'
            }}
            >
            <path 
            fill={props.color} 
            d="M25.251,6.461c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615V6.461z">
                <animateTransform 
                attributeType="xml"
                attributeName="transform"
                type="rotate"
                from="0 25 25"
                to="360 25 25"
                dur="1s"
                repeatCount="indefinite"/>
                </path>
            </svg>
        </Styled.Container>
    )
}