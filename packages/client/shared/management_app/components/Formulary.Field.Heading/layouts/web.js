import { strings } from '../../../../core'
import Styled from '../styles'

export function FormularyFieldHeadingDropdownMenuWebLayout(props) {
    return (
        <Styled.DropdownMenuInputContainer>
            <Styled.RenameFieldButton
            ref={props.renameButtonRef}
            onClick={() => props.onClickToRename()}
            >
                {strings('formularyFieldEditRenameLabel')}
            </Styled.RenameFieldButton>
        </Styled.DropdownMenuInputContainer>
    )
}
// ---------------------------------------------------------------------------------------------------------------------
export default function FormularyFieldHeadingWebLayout(props) {
    return (
        <div>
            {props.isRenaming === true ? (
                <Styled.HeadingInput
                headingType={props.headingType}
                ref={props.inputRef}
                type={'text'}
                autoFocus={true}
                autoComplete={'off'}
                onFocus={(e) => props.isNewField ? e.target.select() : null}
                onBlur={() => props.onToggleRenaming(false)}
                onKeyPress={(e) => e.key === 'Enter' ? props.onToggleRenaming(false) : null}
                value={props.field.label.name}
                onChange={(e) => props.onChangeHeadingName(e.target.value)}
                />
            ) : (
                <Styled.Heading
                headingType={props.headingType}
                >
                    {props.field.label.name}
                </Styled.Heading>
            )}
        </div>
    )
}