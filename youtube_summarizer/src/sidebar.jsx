export function Sidebar({history, onSelect, onDelete}){
    return(
        <ul>
            {history.map(item =>(
                    <li key = {item.created_at}>
                        <button  onClick={()=>onSelect(item)}>{item.Title}</button>
                        <button onClick={() => onDelete(item._id)}>Delete</button>
                    </li>
                )
            )}
        </ul>
    )
}

export default Sidebar