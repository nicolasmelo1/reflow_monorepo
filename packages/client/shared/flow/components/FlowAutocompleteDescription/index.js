import Layout from './layouts'

export default function FlowAutocompleteDescription(props) {
    return <Layout
    description={props.description}
    parameters={props.parameters}
    examples={props.examples}
    label={props.label}
    getFlowContext={props.getFlowContext}
    />
}