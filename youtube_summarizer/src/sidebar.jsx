export function Sidebar({history, onSelect, handleDelete}){
    return(
        <ul>
            {history.map(item =>(
                    <li>
                        <button key = {item.created_at} onClick={()=>onSelect(item)}>{item.Title}</button>
                        <button onClick={() => handleDelete(item._id)}>Delete {item.Title}</button>
                    </li>
                )
            )}
        </ul>
    )
}

export default Sidebar