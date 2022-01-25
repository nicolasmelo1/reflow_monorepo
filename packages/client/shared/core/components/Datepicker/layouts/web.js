export default function DatepickerWebLayout(props) {
    return (
        <div>
            <input 
            ref={props.dateInputRef}
            value={props.dateValue}
            onChange={(e) => props.onChangeText(e.target.value)}    
            onClick={props.onClick}
            type={'text'}
            />
        </div>
    )
}