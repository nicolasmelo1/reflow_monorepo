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
                                {strings('formularyToolbarShareButtonLabel')}
                            </Styled.ToolbarButtonText>
                        </Styled.ToolbarButton>
                    </Styled.ToolbarContainer>
                </Fragment>
            ) : ''}
            <Styled.FormularyWrapper>
                <Styled.FormularyContainer
                ref={props.formularyContainerRef}
                offset={props.formularyContainerOffset}
                >
                    {props.formulary?.sections.map(section => (
                        <FormularySection 
                        workspace={props.workspace}
                        key={section.uuid}
                        section={section}
                        retrieveFields={props.retrieveFields}
                        onUpdateFormulary={props.onUpdateFormulary}
                        />
                    ))}
                </Styled.FormularyContainer>
            </Styled.FormularyWrapper>
        </Styled.Container>
    )
}