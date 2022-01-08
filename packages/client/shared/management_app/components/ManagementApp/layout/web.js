import Styled from '../styles'

export default function ManagementAppWebLayout(props) {
    return (
        <Styled.Layout>
            <div
            style={{
                height: '50px',
                width: '100%',
                display: 'flex',
                flexDirection: 'row',
                backgroundColor: '#EFEFEF'
            }}
            >
                <p>
                    Visualização
                </p>
                <p>
                    Cor
                </p>
                <p>
                    Organizar
                </p>
                <p>
                    Filtrar
                </p>
            </div>
        </Styled.Layout>
    )
}