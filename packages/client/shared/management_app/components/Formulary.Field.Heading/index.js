import useHeadingField from '../../hooks/useHeadingField'
import Layout from './layouts'

export function HeadingDropdownMenuOptions(props) {
    /**
     * This function is called when the user clicks the button rename the heading.
     */
    function onClickToRename() {
        props.onToggleRenaming()
    }

    return (
        <Layout.DropdownMenu
        renameButtonRef={props.renameButtonRef}
        onClickToRename={onClickToRename}
        />
    )
}
// ---------------------------------------------------------------------------------------------------------------------
export default function FormularyFieldHeading(props) {
    const validHeadingTypes = ['heading1', 'heading2', 'heading3']
    const isValidHeadingType = typeof props.headingType === 'string' && validHeadingTypes.includes(props.headingType)
    const headingType = isValidHeadingType ? props.headingType : 'heading1'
    const isNewField = typeof props.isNewField === 'boolean' ? props.isNewField : false

    const {
        inputRef,
        isRenaming,
        onToggleRenaming,
        onChangeHeadingName
    } = useHeadingField(
        props.field,
        props.onChangeField, 
        props.onToggleEditFieldMenu, 
        props.registerComponentForFieldSpecificOptionsForDropdownMenu,
        isNewField
    )

    return (
        <Layout.Field
        inputRef={inputRef}
        headingType={headingType}
        onToggleRenaming={onToggleRenaming}
        onChangeHeadingName={onChangeHeadingName}
        isRenaming={isRenaming}
        field={props.field}
        />
    )
}