import { Fragment } from 'react'
import FormularySection from '../../Formulary.Section'
import Styled from '../styles'
import { strings } from '../../../../core/utils/constants'
import { 
    faShareAlt
} from '@fortawesome/free-solid-svg-icons'

export default function FormularyWebLayout(props) {
    const isAppDefined = ![null, undefined].includes(props.app)

    return (
        <Styled.Container>
            {isAppDefined ? (
                <Fragment>
                    <Styled.ToolbarContainer>
                        <Styled.FormularyTitle>
                            {props.app.labelName}
                        </Styled.FormularyTitle>
                        <Styled.ToolbarButton
                        onClick={() => {}/*props.onShareApp*/} 
                        >
                            <Styled.ToolbarButtonIcon 
                            icon={faShareAlt}
                            />
                            <Styled.ToolbarButtonText>
                                {strings('pt-BR', 'formularyToolbarShareButtonLabel')}
                            </Styled.ToolbarButtonText>
                        </Styled.ToolbarButton>
                    </Styled.ToolbarContainer>
                </Fragment>
            ) : ''}
            <Styled.FormularyContainer
            ref={props.formularyContainerRef}
            >
                {props.formulary?.sections.map(section => (
                    <FormularySection 
                    formularyContainerRef={props.formularyContainerRef}
                    key={section.uuid}
                    section={section}
                    onUpdateFormulary={props.onUpdateFormulary}
                    />
                ))}
            </Styled.FormularyContainer>
        </Styled.Container>
    )
}