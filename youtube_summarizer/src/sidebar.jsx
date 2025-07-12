export function Sidebar({history, onSelect, onDelete}){
    return(
        <ul className="sidebarList">
            {history.map(item =>(
                    <li key = {item._id}>
                        <button  className="itemBtn" onClick={()=>onSelect(item)}>{item.Title}</button>
                        <button className="deleteBtn" onClick={() => onDelete(item._id)}>Delete</button>
                    </li>
                )
            )}
        </ul>
    )
}

export default Sidebar