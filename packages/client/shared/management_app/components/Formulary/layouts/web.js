import { Fragment } from 'react'
import FormularyField from '../../Formulary.Field'
import FormularyAddField from '../../Formulary.AddField'
import Styled from '../styles'
import { strings } from '../../../../core/utils/constants'
import { 
    faShareAlt
} from '@fortawesome/free-solid-svg-icons'

export default function FormularyWebLayout(props) {
    const isAppDefined = ![null, undefined].includes(props.app)
    const formularyFields = Array.isArray(props.formulary?.fields) ? props.formulary.fields : []

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
                    <FormularyAddField
                    fieldTypes={props.fieldTypes}
                    onAddField={(fieldData) => props.onAddField(fieldData, 0)}
                    />
                    {formularyFields.map((field, index) => (
                        <Fragment
                        key={field.uuid}
                        >
                            <FormularyField
                            retrieveFieldsCallbacksRef={props.retrieveFieldsCallbacksRef}
                            field={field}
                            isNewField={props.newFieldUUID === field.uuid}
                            onUpdateFormulary={props.onUpdateFormulary}
                            onRemoveField={props.onRemoveField}
                            onDuplicateField={props.onDuplicateField}
                            retrieveFields={props.retrieveFields}
                            />
                            <FormularyAddField
                            fieldTypes={props.fieldTypes}
                            onAddField={(fieldData) => props.onAddField(fieldData, index + 1)}
                            />
                        </Fragment>
                    ))}
                </Styled.FormularyContainer>
            </Styled.FormularyWrapper>
        </Styled.Container>
    )
}