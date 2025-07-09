export function Sidebar({history, onSelect}){
    return(
        <ul>
            {history.map(item =>(
                    <li>
                        <button onClick={()=>onSelect(item)}>{item.title}</button>
                    </li>
                )
            )}
        </ul>
    )
}

export default Sidebar